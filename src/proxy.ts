import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const REST_TOKEN = process.env.SUPABASE_REST_TOKEN;
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';

export default async function proxy() {
    const header = await headers();

    let token = header.get('authorization');
    if (token) token = token.replace('tokens API-Key ', '');

    // TODO: Replace with Supabase REST API token
    const isAuthorized = token === REST_TOKEN;

    if (!isAuthorized && !IS_DEVELOPMENT) {
        return NextResponse.json({ message: 'You are not authorized' }, { status: 401 });
    }
}
