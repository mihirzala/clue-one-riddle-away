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
    try {
        await put(
            `players/${Date.now()}-${playerId}.json`,
            JSON.stringify({ playerId, name, createdAt: new Date().toISOString() }),
            { access: 'private', addRandomSuffix: false, contentType: 'application/json' }
        );
    } catch (error) {
        console.error('Failed to store player record:', error);
        return response.status(500).json({ error: 'Unable to save your name right now. Please try again later.' });
    }

    // Mirror identity into cookies set via this HTTP response, not client-side
    // JavaScript. Browsers (notably iOS Safari's Intelligent Tracking
    // Prevention) can evict script-writable storage like localStorage after
    // a period of inactivity, but a first-party cookie set by the server is
    // not subject to that same eviction — so a returning player whose
    // localStorage was wiped can still be recognized (see js/player.js).
    const oneYearInSeconds = 60 * 60 * 24 * 365;
    response.setHeader('Set-Cookie', [
        `clue_player_id=${encodeURIComponent(playerId)}; Max-Age=${oneYearInSeconds}; Path=/; SameSite=Lax; Secure`,
        `clue_player_name=${encodeURIComponent(name)}; Max-Age=${oneYearInSeconds}; Path=/; SameSite=Lax; Secure`
    ]);

    return response.status(201).json({ playerId, name });
}
