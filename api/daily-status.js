import { put, list } from '@vercel/blob';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function checkOrigin(request) {
    const origin = request.headers.origin;
    if (!origin) return true;
    try {
        return new URL(origin).host === request.headers.host;
    } catch {
        return false;
    }
}

export default async function handler(request, response) {
    if (!checkOrigin(request)) {
        return response.status(403).json({ error: 'Invalid origin' });
    }

    if (request.method === 'GET') {
        const playerId = typeof request.query.playerId === 'string' ? request.query.playerId : '';
        const date = typeof request.query.date === 'string' ? request.query.date : '';
        if (!UUID_PATTERN.test(playerId) || !DATE_PATTERN.test(date)) {
            return response.status(400).json({ error: 'Invalid playerId or date' });
        }

        try {
            const { blobs } = await list({ prefix: `daily-completions/${playerId}/${date}.json` });
            return response.status(200).json({ completed: blobs.length > 0 });
        } catch (error) {
            console.error('Failed to check daily completion:', error);
            return response.status(500).json({ error: 'Unable to check today’s status right now.' });
        }
    }

    if (request.method === 'POST') {
        const playerId = typeof request.body?.playerId === 'string' ? request.body.playerId.trim() : '';
        const date = typeof request.body?.date === 'string' ? request.body.date.trim() : '';
        if (!UUID_PATTERN.test(playerId) || !DATE_PATTERN.test(date)) {
            return response.status(400).json({ error: 'Invalid playerId or date' });
        }

        try {
            await put(
                `daily-completions/${playerId}/${date}.json`,
                JSON.stringify({ playerId, date, completedAt: new Date().toISOString() }),
                { access: 'private', addRandomSuffix: false, contentType: 'application/json' }
            );
        } catch (error) {
            console.error('Failed to record daily completion:', error);
            return response.status(500).json({ error: 'Unable to save your completion right now.' });
        }

        return response.status(201).json({ completed: true });
    }

    response.setHeader('Allow', 'GET, POST');
    return response.status(405).json({ error: 'Method not allowed' });
}
