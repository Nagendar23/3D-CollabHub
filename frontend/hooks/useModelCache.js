"use client";

// In-memory cache for loaded 3D models keyed by FileVersion._id
// This prevents reloading the same model when navigating between versions or revisiting files
const modelCache = new Map();
const MAX_CACHE_SIZE = 20; // Limit cache to prevent excessive memory usage

export function getCachedModel(versionId) {
    return modelCache.get(versionId);
}

export function setCachedModel(versionId, model) {
    // Simple LRU eviction: if cache exceeds max size, remove oldest entry
    if (modelCache.size >= MAX_CACHE_SIZE) {
        const firstKey = modelCache.keys().next().value;
        modelCache.delete(firstKey);
    }
    modelCache.set(versionId, model);
}

export function clearModelCache() {
    modelCache.clear();
}

export default function useModelCache(versionId) {
    const getCached = () => getCachedModel(versionId);
    const setCached = (model) => setCachedModel(versionId, model);

    return { getCached, setCached, isCached: () => modelCache.has(versionId) };
}
