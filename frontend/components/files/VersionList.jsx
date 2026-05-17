"use client";

import { memo, useCallback } from "react";

function VersionList({ versions = [], loading, onSelect, selectedId }) {
    const handleSelect = useCallback((version) => {
        onSelect(version);
    }, [onSelect]);

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                <div className="mb-2 text-sm text-slate-400">Versions</div>
                <div className="space-y-2">
                    <div className="h-8 bg-slate-700 animate-pulse rounded"></div>
                    <div className="h-8 bg-slate-700 animate-pulse rounded"></div>
                    <div className="h-8 bg-slate-700 animate-pulse rounded"></div>
                </div>
            </div>
        );
    }

    if (!versions || versions.length === 0) {
        return (
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-slate-400">No versions yet</div>
        );
    }

    return (
        <div className="space-y-2 max-h-96 overflow-y-auto">
            {versions.map((v) => (
                <button
                    key={v._id}
                    onClick={() => handleSelect(v)}
                    className={`w-full text-left p-3 rounded-md border ${v._id === selectedId ? 'border-blue-500 bg-slate-800' : 'border-slate-700 bg-slate-900'} hover:border-blue-400`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold">v{v.versionNumber}</div>
                            <div className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-xs text-slate-400">{Math.round((v.fileSize || 0) / 1024)} KB</div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default memo(VersionList);
