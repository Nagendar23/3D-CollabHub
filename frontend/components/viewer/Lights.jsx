"use client";

export default function Lights() {
    return (
        <>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 5, 4]} intensity={1.2} />
            <directionalLight position={[-4, -2, -3]} intensity={0.35} />
        </>
    );
}