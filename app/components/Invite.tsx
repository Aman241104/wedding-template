'use client'

import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    RapierRigidBody,
    useRopeJoint,
    useSphericalJoint,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

useGLTF.preload('/tag.glb')
useTexture.preload('/card.png')

export default function Invite() {
    const isMobile =
        typeof window !== 'undefined' &&
        window.matchMedia('(max-width: 768px)').matches

    return (
        <div className="relative w-full h-[100svh] overflow-hidden pointer-events-auto">
            <Canvas
                shadows={!isMobile}
                dpr={isMobile ? 1 : [1, 2]}
                // --------------------------------------------------------
                // CHANGE: Shifted Camera X to -3 on desktop
                // This moves the view left, creating space on the left side
                // --------------------------------------------------------
                camera={{ position: [isMobile ? 0 : -3, 0, isMobile ? 16 : 13], fov: 25 }}
                gl={{ alpha: true, antialias: !isMobile }}
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
                {/* MOBILE-BRIGHTER AMBIENT */}
                <ambientLight intensity={isMobile ? 0.4 : 0.25} color="#fff7ed" />

                {/* KEY LIGHT */}
                <spotLight
                    position={[0, 3.5, 6]}
                    angle={0.35}
                    penumbra={0.8}
                    intensity={isMobile ? 3.2 : 2.2}
                    color="#fff1c1"
                    castShadow={!isMobile}
                />

                {/* FILL */}
                <directionalLight
                    castShadow={!isMobile}
                    position={[5, 8, 5]}
                    intensity={isMobile ? 2.2 : 1.8}
                    color="#ffb703"
                    shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
                />

                {/* RIM */}
                <pointLight
                    position={[-4, 3, 4]}
                    intensity={isMobile ? 1.6 : 1.1}
                    color="#fb8500"
                />

                {/* ROPE HIGHLIGHT */}
                <pointLight
                    position={[1.5, 2.6, 2]}
                    intensity={isMobile ? 1.8 : 1.2}
                    color="#fff3c4"
                />

                <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 60 : 1 / 60}>
                    <Band isMobile={isMobile} />
                </Physics>

                <Environment background={false} blur={0.9}>
                    <Lightformer
                        intensity={3}
                        color="#ffd166"
                        position={[0, 5, -10]}
                        scale={[50, 10, 1]}
                    />
                    {!isMobile && (
                        <>
                            <Lightformer intensity={2} color="#fca311" position={[-5, -2, 5]} scale={[30, 5, 1]} />
                            <Lightformer intensity={2} color="#ffb703" position={[5, -2, 5]} scale={[30, 5, 1]} />
                        </>
                    )}
                </Environment>

                <MovingShadow isMobile={isMobile} />
            </Canvas>
        </div>
    )
}

/* ---------------- MOVING SHADOW ---------------- */

function MovingShadow({ isMobile }: { isMobile: boolean }) {
    const lightRef = useRef<THREE.SpotLight | null>(null)

    useFrame(({ clock }) => {
        if (!lightRef.current) return
        const t = clock.getElapsedTime()
        lightRef.current.position.x = Math.sin(t * 0.2) * 6
        lightRef.current.position.z = Math.cos(t * 0.15) * 6
    })

    return (
        <spotLight
            ref={lightRef}
            castShadow={!isMobile}
            position={[0, 10, 0]}
            angle={0.6}
            penumbra={1}
            intensity={isMobile ? 1.0 : 0.7}
            color="#ffdd99"
            shadow-mapSize={[1024, 1024]}
        />
    )
}

/* ---------------- BAND ---------------- */

function Band({ isMobile }: { isMobile: boolean }) {
    const band = useRef<THREE.Mesh | null>(null)

    const fixed = useRef<RapierRigidBody>(null!)
    const j1 = useRef<RapierRigidBody>(null!)
    const j2 = useRef<RapierRigidBody>(null!)
    const j3 = useRef<RapierRigidBody>(null!)
    const card = useRef<RapierRigidBody>(null!)

    const vec = new THREE.Vector3()
    const dir = new THREE.Vector3()

    const segmentProps = {
        type: 'dynamic' as const,
        canSleep: true,
        colliders: false as const,
        angularDamping: 2,
        linearDamping: 2,
    }

    const { nodes, materials } = useGLTF('/tag.glb') as any

    const cardTexture = useTexture('/card.png')
    cardTexture.colorSpace = THREE.SRGBColorSpace
    cardTexture.flipY = false

    const [curve] = useState(
        () =>
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3(),
            ])
    )

    const [dragged, drag] = useState<THREE.Vector3 | false>(false)

    /* ROPE */
    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])

    /* FIXED JOINT ANCHOR (NO CLIPPING) */
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 1.8, 0.03],
    ])

    useFrame((state) => {
        if (dragged && card.current) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
            dir.copy(vec).sub(state.camera.position).normalize()
            vec.add(dir.multiplyScalar(state.camera.position.length()))

            vec.x = THREE.MathUtils.clamp(vec.x, -5, 5)
            vec.y = THREE.MathUtils.clamp(vec.y, -6, 6)

            card.current.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z,
            })
        }

        if (band.current && fixed.current && j1.current && j2.current && j3.current) {
            curve.points[0].copy(j3.current.translation())
            curve.points[1].copy(j2.current.translation())
            curve.points[2].copy(j1.current.translation())
            curve.points[3].copy(fixed.current.translation())

            ;(band.current.geometry as MeshLineGeometry).setPoints(
                curve.getPoints(isMobile ? 12 : 32)
            )
        }
    })

    const { size } = useThree()

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody ref={j1} position={[0.5, 0.1, 0]} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody ref={j2} position={[1, 0.15, 0]} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody ref={j3} position={[1.5, 0.25, 0]} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>

                <RigidBody
                    ref={card}
                    position={[2, 0, 0]}
                    {...segmentProps}
                    type={dragged ? 'kinematicPosition' : 'dynamic'}
                >
                    {/* COLLIDER MATCHES VISUAL OFFSET */}
                    <CuboidCollider
                        args={[0.8, 1.125, 0.05]}
                        position={[0, -1.1, 0]}
                    />

                    <group scale={isMobile ? 2.75 : 2.4} position={[0, -1.1, 0]}>
                        <mesh
                            geometry={nodes.card.geometry}
                            onPointerDown={(e) => {
                                e.stopPropagation()
                                drag(
                                    new THREE.Vector3()
                                        .copy(e.point)
                                        .sub(vec.copy(card.current!.translation()))
                                )
                            }}
                            onPointerUp={() => drag(false)}
                        >
                            <meshPhysicalMaterial
                                map={cardTexture}
                                clearcoat={1}
                                clearcoatRoughness={0.05}
                                roughness={0.25}
                                metalness={0.35}
                                reflectivity={0.8}
                                envMapIntensity={1.6}
                            />
                        </mesh>

                        <mesh geometry={nodes.clip.geometry} material={materials.metal} />
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
                    </group>
                </RigidBody>
            </group>

            <mesh ref={band}>
                <primitive object={new MeshLineGeometry()} />
                <primitive
                    object={
                        new MeshLineMaterial({
                            map: cardTexture,
                            useMap: 1,
                            repeat: new THREE.Vector2(-4, 1),
                            lineWidth: isMobile ? 1.15 : 0.95,
                            // transparent: true,
                            opacity: 0.95,
                            color: new THREE.Color('#ffd9a0'),
                            resolution: new THREE.Vector2(
                                size.width * (isMobile ? 0.75 : 1),
                                size.height * (isMobile ? 0.75 : 1)
                            ),
                        })
                    }
                />

            </mesh>
        </>
    )
}