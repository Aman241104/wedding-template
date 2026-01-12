'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({ position = [0, 0, 30], gravity = [0, -40, 0], fov = 20, transparent = true }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile(); // Check on mount
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        // 1. Updated Background to Wedding Maroon
        <div className="relative z-0 w-full h-screen flex justify-center items-center bg-wedding-maroon">
            <Canvas
                camera={{ position, fov }}
                dpr={[1, isMobile ? 1.5 : 2]}
                gl={{ alpha: true }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0); // transparent background
                }}
            >
                <ambientLight intensity={Math.PI} />

                <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
                    <Band isMobile={isMobile} />
                </Physics>

                <Environment background={false} blur={0.75}>
                    <Lightformer intensity={2} position={[0, -1, 5]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} position={[-1, -1, 1]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={3} position={[1, 1, 1]} scale={[100, 0.1, 1]} />
                    <Lightformer intensity={10} position={[-10, 0, 14]} scale={[100, 10, 1]} />
                </Environment>
            </Canvas>

        </div>
    );
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
    const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
    const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();
    const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 };

    // 2. Load Assets from PUBLIC folder (using strings, not imports)
    const { nodes, materials } = useGLTF('/card.glb');
    const inviteTexture = useTexture('/invite.png');

    // Fix texture orientation if needed (sometimes GLB textures are flipped)
    inviteTexture.flipY = false;

    // 3. Generate "YOU ARE INVITED" Strap Texture
    const strapTexture = useMemo(() => {
        if (typeof document === 'undefined') return null; // Server-side safety
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 1024;
        const context = canvas.getContext("2d");

        // Gold Background
        context.fillStyle = "#F2E6BA";
        context.fillRect(0, 0, 1024, 1024);

        // Maroon Text
        context.font = "bold 150px serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#590d22";

        const text = "YOU ARE INVITED";
        context.save();
        context.translate(512, 512);
        context.rotate(-Math.PI / 2); // Rotate text to run along the vertical strap
        context.fillText(text.repeat(3), 0, 0);
        context.restore();

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }, []);

    const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
    const [dragged, drag] = useState(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => void (document.body.style.cursor = 'auto');
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (dragged) {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
            card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
        }
        if (fixed.current) {
            [j1, j2].forEach(ref => {
                if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
                ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
            });
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());
            band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
            ang.copy(card.current.angvel());
            rot.copy(card.current.rotation());
            card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
        }
    });

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type="fixed" />
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>

                <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={e => (e.target.releasePointerCapture(e.pointerId), drag(false))}
                        onPointerDown={e => (e.target.setPointerCapture(e.pointerId), drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))))}
                    >
                        {/* 4. Apply Custom Invite Image to the Card Mesh */}
                        <mesh geometry={nodes.card.geometry}>
                            <meshPhysicalMaterial
                                map={inviteTexture} // <--- YOUR IMAGE HERE
                                clearcoat={isMobile ? 0 : 1}
                                clearcoatRoughness={0.15}
                                roughness={0.3}
                                metalness={0.5}
                            />
                        </mesh>

                        {/* Clip and Clamp (Keep original materials) */}
                        <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
                        <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
                    </group>
                </RigidBody>
            </group>

            {/* 5. Apply Generated Text Texture to the Band */}
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    color="white"
                    depthTest={false}
                    resolution={isMobile ? [1000, 2000] : [1000, 1000]}
                    useMap={1}
                    map={strapTexture} // <--- YOUR TEXT TEXTURE HERE
                    repeat={[-4, 1]}
                    lineWidth={1.5} // Made slightly thicker for text readability
                />
            </mesh>
        </>
    );
}