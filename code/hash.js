import { createHash } from 'crypto';
import { createReadStream } from 'fs';
const CHUNK_SIZE = 65536;
export async function hashFile(input) {
    const hash = createHash('sha512');
    const stream = createReadStream(input.path, {
        highWaterMark: CHUNK_SIZE,
    });
    for await (const chunk of stream) {
        hash.update(chunk);
    }
    return hash.digest('hex');
}
export async function hashBuffer(input) {
    const hash = createHash('sha512');
    hash.update(input.data);
    return hash.digest('hex');
}
export async function hashText(input) {
    const hash = createHash('sha512');
    hash.update(input.text, 'utf-8');
    return hash.digest('hex');
}
export function verifyHash(input) {
    const hash = createHash('sha512');
    hash.update(input.data);
    const actual = hash.digest('hex');
    return actual === input.expected;
}
//# sourceMappingURL=hash.js.map