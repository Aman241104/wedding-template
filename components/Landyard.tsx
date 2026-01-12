"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import { useTexture, Environment, Lightformer } from "@react-three/drei";
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

// Extend Three.js with MeshLine
extend({ MeshLineGeometry, MeshLineMaterial });

export default function Invite() {
    return (
        <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
            <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
                <ambientLight intensity={Math.PI / 2} />
                <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                    <Band />
                </Physics>
                <Environment background blur={0.75}>
                    <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
                </Environment>
            </Canvas>
        </div>
    );
}

function Band({ maxSpeed = 50, minSpeed = 10 }) {
    // References for the band and the joints
    const band = useRef();
    const fixed = useRef();
    const j1 = useRef();
    const j2 = useRef();
    const j3 = useRef();

    // Card reference
    const card = useRef();

    const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
    const [dragged, drag] = useState(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? "grabbing" : "grab";
            return () => void (document.body.style.cursor = "auto");
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (dragged) {
            // While dragging, move the card to the mouse position
            const { x, y, z } = state.pointer; // Mouse position
            // In a real app, you might want to unproject the mouse to 3D space accurately
            // simplified drag logic:
            card.current.setNextKinematicTranslation({ x: state.pointer.x * 5, y: state.pointer.y * 5, z: 0 });
        }

        if (fixed.current) {
            // Fix the top point
            // (Optional: add slight movement to the top point for realism)
            fixed.current.setNextKinematicTranslation({ x: 0, y: 0, z: 0 });
        }

        // Update the Catmull-Rom curve for the string
        if (band.current && fixed.current && j1.current && j2.current && j3.current && card.current) {
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.translation());
            curve.points[2].copy(j1.current.translation());
            curve.points[3].copy(fixed.current.translation());
            band.current.geometry.setPoints(curve.getPoints(32));
        }
    });

    return (
        <>
            <RigidBody ref={fixed} type="fixed" />
            <RigidBody position={[0.5, 0, 0]} ref={j1} linearDamping={2} angularDamping={2}>
                <BallCollider args={[0.1]} />
            </RigidBody>
            <RigidBody position={[1, 0, 0]} ref={j2} linearDamping={2} angularDamping={2}>
                <BallCollider args={[0.1]} />
            </RigidBody>
            <RigidBody position={[1.5, 0, 0]} ref={j3} linearDamping={2} angularDamping={2}>
                <BallCollider args={[0.1]} />
            </RigidBody>

            {/* The Card */}
            <RigidBody
                ref={card}
                type={dragged ? "kinematicPosition" : "dynamic"}
                colliders={false}
                linearDamping={0.75}
                angularDamping={0.75}
                onPointerOver={() => hover(true)}
                onPointerOut={() => hover(false)}
                onPointerDown={(e) => {
                    e.target.setPointerCapture(e.pointerId);
                    drag(new THREE.Vector3().copy(e.point).sub(card.current.translation()));
                }}
                onPointerUp={(e) => {
                    e.target.releasePointerCapture(e.pointerId);
                    drag(false);
                }}
            >
                <CuboidCollider args={[0.8, 1.125, 0.01]} />
                {/* Card Visuals */}
                <mesh>
                    <planeGeometry args={[0.8 * 2, 1.125 * 2]} />
                    <meshStandardMaterial
                        color="white"
                        side={THREE.DoubleSide}
                        roughness={0.15}
                        metalness={0.5}
                        /* Replace with useTexture if you have an image */
                        /* map={texture} */
                    />
                </mesh>
            </RigidBody>

            {/* The String/Rope */}
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial color="white" depthTest={false} resolution={[1000, 1000]} lineWidth={1} />
            </mesh>
        </>
    );
}