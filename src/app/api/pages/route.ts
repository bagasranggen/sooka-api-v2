import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryStatus } from '@/libs/factory';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const uri = searchParams.get('uri');

    const PAGES_TABLE_SELECT = 'entry_status,type_handle,uri';
    const PAGES_TABLE_COLLECTION = ['homepage', 'categories', 'products', 'pages'];

    const pagesData: any[] = [];

    const createSupaEntry = ({ item }: { item: any }) => {
        const { isLive } = createSupaEntryStatus(item);

        let data = null;

        if (isLive && item?.type_handle) {
            data = {
                typeHandle: item?.type_handle,
                uri: item?.uri,
            };
        }

        return data;
    };

    if (uri) {
        await Promise.all(
            PAGES_TABLE_COLLECTION.map(async (item) => {
                const { data } = await supabase(await cookies())
                    .from(item)
                    .select(PAGES_TABLE_SELECT)
                    .eq('uri', uri);

                if (data) pagesData.push(...data);
            })
        );
    }

    if (!uri) {
        await Promise.all(
            PAGES_TABLE_COLLECTION.map(async (item) => {
                const { data } = await supabase(await cookies())
                    .from(item)
                    .select(PAGES_TABLE_SELECT);

                if (data) pagesData.push(...data);
            })
        );
    }

    const data: any[] = [];

    if (pagesData.length > 0) {
        pagesData.forEach((item) => {
            const entry = createSupaEntry({ item });

            if (entry) data.push(entry);
        });
    }

    return NextResponse.json({ pages: { docs: data } });
}
