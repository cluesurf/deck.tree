import { parseMark } from './mark';
import { toRegistryName } from './name';
const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
const CACHE_TTL_MS = 5 * 60 * 1000;
const metaCache = new Map();
export function makeDefaultFetchConfig() {
    return {
        registry: DEFAULT_REGISTRY,
        concurrency: 16,
        offline: false,
    };
}
export async function fetchPackageMeta(input) {
    if (input.config.offline) {
        throw new Error(`Cannot fetch ${input.name} in offline mode`);
    }
    const cached = metaCache.get(input.name);
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
        return cached.data;
    }
    const registryName = toRegistryName({ name: input.name });
    const url = `${input.config.registry}/${registryName}`;
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${input.name}: ${response.status} ${response.statusText}`);
    }
    const data = (await response.json());
    metaCache.set(input.name, { data, time: Date.now() });
    return data;
}
export async function fetchTarball(input) {
    if (input.config.offline) {
        throw new Error(`Cannot fetch tarball in offline mode: ${input.url}`);
    }
    const response = await fetch(input.url);
    if (!response.ok) {
        throw new Error(`Failed to fetch tarball: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}
export function getVersionList(input) {
    return Object.keys(input.meta.versions).map(v => parseMark(v));
}
export function getVersionMeta(input) {
    const entry = input.meta.versions[input.mark];
    if (!entry)
        return undefined;
    return {
        tarball: entry.dist.tarball,
        integrity: entry.dist.integrity,
        shasum: entry.dist.shasum,
        dependencies: entry.dependencies ?? {},
    };
}
export function clearMetaCache() {
    metaCache.clear();
}
//# sourceMappingURL=fetch.js.map