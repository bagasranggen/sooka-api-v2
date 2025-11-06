import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryStatus } from '@/libs/factory';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const uri = searchParams.get('uri');

    const PAGES_TABLE_SELECT = 'entry_status,type_handle,uri';

    const pagesData: any[] = [];

    const createSupaEntry = ({ item }: { item: any }) => {
        const { isLive } = createSupaEntryStatus(item);

        let data = undefined;

        if (isLive && item?.type_handle) {
            data = {
                typeHandle: item?.type_handle,
                uri: item?.uri,
            };
        }

        return data;
    };

    if (uri) {
        const { data: homepageData } = await supabase(await cookies())
            .from('homepage')
            .select(PAGES_TABLE_SELECT)
            .eq('uri', uri);

        if (homepageData) pagesData.push(...homepageData);

        const { data: categoriesData } = await supabase(await cookies())
            .from('categories')
            .select(PAGES_TABLE_SELECT)
            .eq('uri', uri);

        if (categoriesData) pagesData.push(...categoriesData);

        const { data: productsData } = await supabase(await cookies())
            .from('products')
            .select(PAGES_TABLE_SELECT)
            .eq('uri', uri);

        if (productsData) pagesData.push(...productsData);
    }

    if (!uri) {
        const { data: homepageData } = await supabase(await cookies())
            .from('homepage')
            .select(PAGES_TABLE_SELECT);

        if (homepageData) pagesData.push(...homepageData);

        const { data: categoriesData } = await supabase(await cookies())
            .from('categories')
            .select(PAGES_TABLE_SELECT);

        if (categoriesData) pagesData.push(...categoriesData);

        const { data: productsData } = await supabase(await cookies())
            .from('products')
            .select(PAGES_TABLE_SELECT);

        if (productsData) pagesData.push(...productsData);
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
