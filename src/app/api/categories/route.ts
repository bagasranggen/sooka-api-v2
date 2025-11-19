import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryCategoriesItem } from '@/libs/factory';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    let categoriesData: any[] = [];

    if (slug) {
        const { data } = await supabase(await cookies())
            .from('categories')
            .select()
            .eq('slug', slug);

        if (data) categoriesData = data;
    }

    if (!slug) {
        const { data } = await supabase(await cookies())
            .from('categories')
            .select();

        if (data) categoriesData = data;
    }

    const data: any[] = [];

    if (categoriesData.length > 0) {
        categoriesData.forEach((item) => {
            data.push(createSupaEntryCategoriesItem({ item }));
        });
    }

    return NextResponse.json({ categories: { docs: data } });
}
