"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";

import Controls from "./Controls";
import Lights from "./Lights";
import Scene from "./Scene";

export default function ModelViewer({ fileUrl, fileName, loading = false, onLoaded }) {
    const controlsRef = useRef(null);

    const zoomIn = () => {
        controlsRef.current?.dollyOut?.(1.2);
        controlsRef.current?.update?.();
    };

    const zoomOut = () => {
        controlsRef.current?.dollyIn?.(1.2);
        controlsRef.current?.update?.();
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-700" style={{ height: 600 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
                <Lights />
                <Scene fileUrl={fileUrl} fileName={fileName} onLoaded={onLoaded} />
                <Controls ref={controlsRef} />
            </Canvas>

            <div className="absolute right-4 top-4 z-20 flex flex-col gap-2 rounded-xl border border-slate-700 bg-slate-950/80 p-2 shadow-lg backdrop-blur">
                <button
                    type="button"
                    onClick={zoomIn}
                    className="h-10 w-10 rounded-lg bg-slate-800 text-lg font-semibold text-white transition hover:bg-slate-700"
                    aria-label="Zoom in"
                    title="Zoom in"
                >
                    +
                </button>
                <button
                    type="button"
                    onClick={zoomOut}
                    className="h-10 w-10 rounded-lg bg-slate-800 text-lg font-semibold text-white transition hover:bg-slate-700"
                    aria-label="Zoom out"
                    title="Zoom out"
                >
                    -
                </button>
            </div>

            {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                    <div className="text-white text-sm">Loading model...</div>
                </div>
            )}
        </div>
    );
}