import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryStatus, createSupaProductBase, createSupaProductInfo } from '@/libs/factory';
import { getSupaRelatedAddons, getSupaRelatedMarquee, sortArrayObject } from '@/libs/utils';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');

    let productsData: any[] = [];

    if (slug) {
        const { data } = await supabase(await cookies())
            .from('products')
            .select()
            .eq('slug', slug)
            .order('slug', { ascending: true });

        if (data) productsData = data;
    }

    if (category) {
        const { data } = await supabase(await cookies())
            .from('products')
            .select()
            .eq('category_id', category)
            .order('slug', { ascending: true });

        if (data) productsData = data;
    }

    if (slug === null && category === null) {
        const { data } = await supabase(await cookies())
            .from('products')
            .select();

        if (data) productsData = data;
    }

    const data: any[] = [];

    if (productsData && productsData.length > 0) {
        await Promise.all(
            productsData.map(async (item, i: number) => {
                const { isLive } = createSupaEntryStatus(item);

                if (!isLive) return;

                const productId = item?.id;

                data.push({
                    order: i,
                    ...createSupaProductBase({ item }),
                    ...(await createSupaProductInfo({ item })),
                    addons: await getSupaRelatedAddons({ id: productId }),
                    marquee: await getSupaRelatedMarquee({
                        table: 'products_rels',
                        path: 'marquee',
                        field: 'media_product_id',
                        id: productId,
                        mediaTable: 'media_product',
                        volume: 'mediaProduct',
                        sizes: ['productMarquee', 'productMarqueeMobile'],
                    }),
                });
            })
        );
    }

    if (data.length > 0) {
        sortArrayObject({ items: data, key: 'order' });
    }

    return NextResponse.json({
        products: { docs: data },
    });
}
