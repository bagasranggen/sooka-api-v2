import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export default async function proxy() {
    const header = await headers();

    let token = header.get('authorization');
    if (token) token = token.replace('tokens API-Key ', '');

    // TODO: Replace with Supabase REST API token
    const isAuthorized = token === process.env.SUPABASE_REST_TOKEN;

    if (!isAuthorized) return NextResponse.json({ message: 'You are not authorized' }, { status: 401 });
}
