"use client";

import { Component, Suspense, useEffect, useRef } from "react";
import { Center, Html, useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

function getFileExtension(value = "") {
    const cleanValue = value.split("?")[0].split("#")[0];
    const lastSegment = cleanValue.split("/").pop() || "";
    const dotIndex = lastSegment.lastIndexOf(".");

    return dotIndex >= 0 ? lastSegment.slice(dotIndex + 1).toLowerCase() : "";
}

function GltfModel({ fileUrl, versionId, onLoaded }) {
    const gltf = useGLTF(fileUrl, undefined, (event) => {
        // Use versionId as cache key for Three.js loader
        return versionId;
    });
    const called = useRef(false);
    useEffect(()=>{
        if(gltf && !called.current){
            called.current = true;
            onLoaded?.();
        }
    },[gltf, onLoaded]);
    return <primitive object={gltf.scene} dispose={null} />;
}

function ObjModel({ fileUrl, versionId, onLoaded }) {
    // Use versionId as part of cache key to ensure unique loading per version
    const object = useLoader(OBJLoader, versionId ? `${fileUrl}?v=${versionId}` : fileUrl);
    const called = useRef(false);
    useEffect(()=>{
        if(object && !called.current){
            called.current = true;
            onLoaded?.();
        }
    },[object, onLoaded]);
    return <primitive object={object} dispose={null} />;
}

function StlModel({ fileUrl, versionId, onLoaded }) {
    // Use versionId as part of cache key to ensure unique loading per version
    const geometry = useLoader(STLLoader, versionId ? `${fileUrl}?v=${versionId}` : fileUrl);
    const called = useRef(false);
    useEffect(()=>{
        if(geometry && !called.current){
            called.current = true;
            onLoaded?.();
        }
    },[geometry, onLoaded]);
    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial color="#f97316" metalness={0.15} roughness={0.7} />
        </mesh>
    );
}

function UnsupportedModel({ fileName }) {
    return (
        <Html center>
            <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-lg">
                Unsupported 3D format for {fileName}
            </div>
        </Html>
    );
}

class ModelErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

function ModelAsset({ fileUrl, fileName, versionId, onLoaded }) {
    // Check fileName first (original filename with extension), then fallback to fileUrl
    const extension = getFileExtension(fileName) || getFileExtension(fileUrl);

    if (extension === "glb" || extension === "gltf") {
        return <GltfModel fileUrl={fileUrl} versionId={versionId} onLoaded={onLoaded} />;
    }

    if (extension === "obj") {
        return <ObjModel fileUrl={fileUrl} versionId={versionId} onLoaded={onLoaded} />;
    }

    if (extension === "stl") {
        return <StlModel fileUrl={fileUrl} versionId={versionId} onLoaded={onLoaded} />;
    }

    return <UnsupportedModel fileName={fileName} />;
}

export default function Scene({ fileUrl, fileName, versionId, onLoaded }) {
    return (
        <ModelErrorBoundary
            fallback={
                <Html center>
                    <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-lg">
                        Unable to load this model.
                    </div>
                </Html>
            }
        >
            <Suspense
                fallback={
                    <Html center>
                        <div className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 shadow-lg">
                            Loading 3D model...
                        </div>
                    </Html>
                }
            >
                <Center>
                    <ModelAsset fileUrl={fileUrl} fileName={fileName} versionId={versionId} onLoaded={onLoaded} />
                </Center>
            </Suspense>
        </ModelErrorBoundary>
    );
}