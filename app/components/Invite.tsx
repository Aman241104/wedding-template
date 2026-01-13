'use client'

import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
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
                camera={{ position: [isMobile ? 0 : -3, 0, isMobile ? 16 : 13], fov: 25 }}
                gl={{ alpha: true, antialias: !isMobile }}
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
                {/* --- LIGHTING SETUP (Kept from Original) --- */}
                <ambientLight intensity={isMobile ? 0.4 : 0.25} color="#fff7ed" />
                <spotLight
                    position={[0, 3.5, 6]}
                    angle={0.35}
                    penumbra={0.8}
                    intensity={isMobile ? 3.2 : 2.2}
                    color="#fff1c1"
                    castShadow={!isMobile}
                />
                <directionalLight
                    castShadow={!isMobile}
                    position={[5, 8, 5]}
                    intensity={isMobile ? 2.2 : 1.8}
                    color="#ffb703"
                    shadow-mapSize={isMobile ? [512, 512] : [2048, 2048]}
                />
                <pointLight position={[-4, 3, 4]} intensity={isMobile ? 1.6 : 1.1} color="#fb8500" />
                <pointLight position={[1.5, 2.6, 2]} intensity={isMobile ? 1.8 : 1.2} color="#fff3c4" />

                <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 60 : 1 / 60}>
                    <Band isMobile={isMobile} />
                </Physics>

                <Environment background={false} blur={0.9}>
                    <Lightformer intensity={3} color="#ffd166" position={[0, 5, -10]} scale={[50, 10, 1]} />
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

/* ---------------- BAND (IMPROVED PHYSICS) ---------------- */

function Band({ maxSpeed = 50, minSpeed = 10, isMobile }: { maxSpeed?: number, minSpeed?: number, isMobile: boolean }) {
    const band = useRef<THREE.Mesh | null>(null)

    // Refs for Physics Bodies
    // We use 'any' here to allow the custom .lerped property without complex TS extending
    const fixed = useRef<any>(null!)
    const j1 = useRef<any>(null!)
    const j2 = useRef<any>(null!)
    const j3 = useRef<any>(null!)
    const card = useRef<any>(null!)

    const vec = new THREE.Vector3()
    const ang = new THREE.Vector3()
    const rot = new THREE.Vector3()
    const dir = new THREE.Vector3()

    // INCREASED DAMPING to 4 (matches reference code for stability)
    const segmentProps = {
        type: 'dynamic' as const,
        canSleep: true,
        colliders: false as const,
        angularDamping: 4,
        linearDamping: 4,
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
    const [hovered, hover] = useState(false)

    /* ROPE JOINTS */
    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]) // Adjusted Y offset slightly

    // Cursor Logic
    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab'
            return () => void (document.body.style.cursor = 'auto')
        }
    }, [hovered, dragged])

    useFrame((state, delta) => {
        if (dragged && card.current) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
            dir.copy(vec).sub(state.camera.position).normalize()
            vec.add(dir.multiplyScalar(state.camera.position.length()))

            // Wake up all bodies when dragging
            ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())

            card.current.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z,
            })
        }

        if (fixed.current) {
            // FIX: LERPING LOGIC (from Reference Code)
            // This smooths out the jitter in the intermediate joints
            ;[j1, j2].forEach((ref) => {
                if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())

                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))

                ref.current.lerped.lerp(
                    ref.current.translation(),
                    delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
                )
            })

            // Calculate Curve Points
            // Note: j3 (connected to card) uses raw translation for responsiveness
            // j1 & j2 use lerped values for smoothness
            curve.points[0].copy(j3.current.translation())
            curve.points[1].copy(j2.current.lerped)
            curve.points[2].copy(j1.current.lerped)
            curve.points[3].copy(fixed.current.translation())

            if (band.current) {
                (band.current.geometry as MeshLineGeometry).setPoints(
                    curve.getPoints(isMobile ? 12 : 32)
                )
            }

            // FIX: ROTATION STABILIZATION (from Reference Code)
            // Dampens the rotation so the card doesn't spin wildly
            if (card.current) {
                ang.copy(card.current.angvel())
                rot.copy(card.current.rotation())
                card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
            }
        }
    })

    // Set Curve type to chordal for smoother shape
    curve.curveType = 'chordal'
    cardTexture.wrapS = cardTexture.wrapT = THREE.RepeatWrapping

    const { size } = useThree()

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody ref={j1} position={[0.5, 0, 0]} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody ref={j2} position={[1, 0, 0]} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody ref={j3} position={[1.5, 0, 0]} {...segmentProps}>
                    <BallCollider args={[0.1]} />
                </RigidBody>

                <RigidBody
                    ref={card}
                    position={[2, 0, 0]}
                    {...segmentProps}
                    type={dragged ? 'kinematicPosition' : 'dynamic'}
                >
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />

                    {/* Visual Group */}
                    <group
                        scale={isMobile ? 2.8 : 3}
                        position={isMobile?[0,-1.8,0]:[0, -2, 0]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={(e) => {
                            // @ts-ignore
                            e.target.releasePointerCapture(e.pointerId)
                            drag(false)
                        }}
                        onPointerDown={(e) => {
                            // @ts-ignore
                            e.target.setPointerCapture(e.pointerId)
                            drag(
                                new THREE.Vector3()
                                    .copy(e.point)
                                    .sub(vec.copy(card.current!.translation()))
                            )
                        }}
                    >
                        <mesh geometry={nodes.card.geometry}>
                            <meshPhysicalMaterial
                                map={cardTexture}
                                clearcoat={1}
                                clearcoatRoughness={0.15}
                                roughness={0.3}
                                metalness={0.5}
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
                            lineWidth: isMobile ? 0.5: 0.95,
                            opacity: 0.95,
                            color: new THREE.Color('#ffd9a0'),
                            resolution: new THREE.Vector2(
                                size.width * (isMobile ? 1 : 1),
                                size.height * (isMobile ? 1 : 1)
                            ),
                        })
                    }
                />
            </mesh>
        </>
    )
}