import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\p{N} .'-]{0,49}$/u;

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST');
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const origin = request.headers.origin;
    if (origin) {
        try {
            if (new URL(origin).host !== request.headers.host) {
                return response.status(403).json({ error: 'Invalid origin' });
            }
        } catch {
            return response.status(403).json({ error: 'Invalid origin' });
        }
    }

    const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
    if (!NAME_PATTERN.test(name)) {
        return response.status(400).json({ error: 'Enter a valid name with 1–50 characters.' });
    }

    const playerId = randomUUID();
    await put(
        `players/${Date.now()}-${playerId}.json`,
        JSON.stringify({ playerId, name, createdAt: new Date().toISOString() }),
        { access: 'private', addRandomSuffix: false, contentType: 'application/json' }
    );

    return response.status(201).json({ playerId, name });
}
