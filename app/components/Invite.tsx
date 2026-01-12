'use client'

import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

useGLTF.preload('/tag.glb')
useTexture.preload('/card.png')

export default function Invite() {
    return (
        <div className="relative w-full h-screen pointer-events-auto">
            <Canvas
                shadows
                camera={{ position: [0, 0, 13], fov: 25 }}
                gl={{ alpha: true }}
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
                {/* 🌅 Warm ambient */}
                <ambientLight intensity={0.6} color="#ffedd5" />

                {/* 🌞 Key light */}
                <directionalLight
                    castShadow
                    position={[5, 8, 5]}
                    intensity={2.2}
                    color="#ffb703"
                    shadow-mapSize={[2048, 2048]}
                    raycast={() => null}
                />

                {/* 🪔 Fill light */}
                <pointLight
                    position={[-4, 3, 4]}
                    intensity={1.2}
                    color="#fb8500"
                    raycast={() => null}
                />

                <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
                    <Band />
                </Physics>

                <Environment background={false} blur={0.9}>
                    <Lightformer intensity={4} color="#ffd166" position={[0, 5, -10]} scale={[50, 10, 1]} />
                    <Lightformer intensity={2} color="#fca311" position={[-5, -2, 5]} scale={[30, 5, 1]} />
                    <Lightformer intensity={2} color="#ffb703" position={[5, -2, 5]} scale={[30, 5, 1]} />
                </Environment>

                <MovingShadow />
            </Canvas>
        </div>
    )
}

/* 🌿 MOVING TREE / LEAF SHADOW */
function MovingShadow() {
    const lightRef = useRef()

    useFrame(({ clock }) => {
        if (!lightRef.current) return
        const t = clock.getElapsedTime()
        lightRef.current.position.x = Math.sin(t * 0.2) * 6
        lightRef.current.position.z = Math.cos(t * 0.15) * 6
    })

    return (
        <spotLight
            ref={lightRef}
            castShadow
            position={[0, 10, 0]}
            angle={0.6}
            penumbra={1}
            intensity={0.8}
            color="#ffdd99"
            shadow-mapSize={[1024, 1024]}
            raycast={() => null}   // 🔑 DO NOT INTERCEPT POINTERS
        />
    )
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
    const band = useRef()
    const fixed = useRef()
    const j1 = useRef()
    const j2 = useRef()
    const j3 = useRef()
    const card = useRef()

    const vec = new THREE.Vector3()
    const ang = new THREE.Vector3()
    const rot = new THREE.Vector3()
    const dir = new THREE.Vector3()

    const segmentProps = {
        type: 'dynamic',
        canSleep: true,
        colliders: false,
        angularDamping: 2,
        linearDamping: 2,
    }

    const { nodes, materials } = useGLTF('/tag.glb')

    const cardTexture = useTexture('/card.png')
    cardTexture.colorSpace = THREE.SRGBColorSpace
    cardTexture.wrapS = cardTexture.wrapT = THREE.RepeatWrapping
    cardTexture.flipY = false

    const [curve] = useState(() =>
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
            new THREE.Vector3(),
        ])
    )

    const [dragged, drag] = useState(false)
    const [hovered, hover] = useState(false)

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab'
            return () => (document.body.style.cursor = 'auto')
        }
    }, [hovered, dragged])

    useFrame((state, delta) => {
        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
            dir.copy(vec).sub(state.camera.position).normalize()
            vec.add(dir.multiplyScalar(state.camera.position.length()))

            ;[card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp())
            card.current?.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z,
            })
        }

        if (fixed.current) {
            ;[j1, j2].forEach((r) => {
                if (!r.current.lerped)
                    r.current.lerped = new THREE.Vector3().copy(r.current.translation())

                const d = Math.max(
                    0.1,
                    Math.min(1, r.current.lerped.distanceTo(r.current.translation()))
                )

                r.current.lerped.lerp(
                    r.current.translation(),
                    delta * (minSpeed + d * (maxSpeed - minSpeed))
                )
            })

            curve.points[0].copy(j3.current.translation())
            curve.points[1].copy(j2.current.lerped)
            curve.points[2].copy(j1.current.lerped)
            curve.points[3].copy(fixed.current.translation())

            band.current.geometry.setPoints(curve.getPoints(32))

            ang.copy(card.current.angvel())
            rot.copy(card.current.rotation())
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
        }
    })

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody ref={j1} position={[0.5, 0, 0]} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
                <RigidBody ref={j2} position={[1, 0, 0]} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
                <RigidBody ref={j3} position={[1.5, 0, 0]} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

                <RigidBody
                    ref={card}
                    position={[2, 0, 0]}
                    {...segmentProps}
                    type={dragged ? 'kinematicPosition' : 'dynamic'}
                >
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />

                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                    >
                        <mesh
                            geometry={nodes.card.geometry}
                            castShadow
                            receiveShadow
                            onPointerDown={(e) => {
                                e.stopPropagation()
                                e.target.setPointerCapture(e.pointerId)
                                drag(
                                    new THREE.Vector3()
                                        .copy(e.point)
                                        .sub(vec.copy(card.current.translation()))
                                )
                            }}
                            onPointerUp={(e) => {
                                e.stopPropagation()
                                e.target.releasePointerCapture(e.pointerId)
                                drag(false)
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation()
                                hover(true)
                            }}
                            onPointerOut={(e) => {
                                e.stopPropagation()
                                hover(false)
                            }}
                        >
                            <meshPhysicalMaterial
                                map={cardTexture}
                                side={THREE.DoubleSide}
                                clearcoat={1}
                                clearcoatRoughness={0.15}
                                roughness={0.35}
                                metalness={0.2}
                            />
                        </mesh>

                        <mesh geometry={nodes.clip.geometry} material={materials.metal} />
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
                    </group>
                </RigidBody>
            </group>

            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    map={cardTexture}
                    useMap
                    repeat={[-4, 1]}
                    lineWidth={1.1}
                />
            </mesh>
        </>
    )
}
