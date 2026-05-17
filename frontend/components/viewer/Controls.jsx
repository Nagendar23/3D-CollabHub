"use client";

import { forwardRef } from "react";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";

const Controls = forwardRef(function Controls(props, ref) {
    return (
        <DreiOrbitControls
            ref={ref}
            makeDefault
            enableDamping
            enableZoom
            dampingFactor={0.08}
            minDistance={1.5}
            maxDistance={20}
        />
    );
});

export default Controls;