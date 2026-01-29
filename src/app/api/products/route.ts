import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryStatus, createSupaMeta, createSupaProductBase, createSupaProductInfo } from '@/libs/factory';
import { getSupaRelatedAddons, getSupaRelatedMarquee, sortArrayObject } from '@/libs/utils';

export async function GET(req: NextRequest) {
    const AVAILABLE_VALUE = 'available';
    const UNAVAILABLE_VALUE = 'unavailable';

    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');

    let productsData: any[] = [];

    if (slug) {
        const { data } = await supabase(await cookies())
            .from('products')
            .select()
            .eq('slug', slug)
            .order('_order', { ascending: true });

        if (data) productsData = data;
    }

    if (category) {
        await supabase(await cookies())
            .from('products')
            .select()
            .eq('category_id', category)
            .eq('availability', AVAILABLE_VALUE)
            .order('_order', { ascending: true })
            .then(async ({ data }) => {
                if (data) productsData = data;

                const { data: unavailableData } = await supabase(await cookies())
                    .from('products')
                    .select()
                    .eq('category_id', category)
                    .eq('availability', UNAVAILABLE_VALUE)
                    .order('_order', { ascending: true });

                if (unavailableData) productsData.push(...unavailableData);
            });
    }

    if (slug === null && category === null) {
        await supabase(await cookies())
            .from('products')
            .select()
            .eq('availability', AVAILABLE_VALUE)
            .order('_order', { ascending: true })
            .then(async ({ data }) => {
                if (data) productsData = data;

                const { data: unavailableData } = await supabase(await cookies())
                    .from('products')
                    .select()
                    .eq('availability', UNAVAILABLE_VALUE)
                    .order('_order', { ascending: true });

                if (unavailableData) productsData.push(...unavailableData);
            });
    }

    const data: any[] = [];

    if (productsData && productsData.length > 0) {
        await Promise.all(
            productsData.map(async (item, i: number) => {
                const { isLive } = createSupaEntryStatus(item);

                if (!isLive) return;

                const productId = item?.id;

                let flavour = null;
                if (item?.flavour_show_flavour) {
                    flavour = Object.assign(flavour ?? {}, { showFlavour: item?.flavour_show_flavour });
                }
                if (item?.flavour_fresh_creamy) {
                    flavour = Object.assign(flavour ?? {}, { freshCreamy: item?.flavour_fresh_creamy });
                }
                if (item?.flavour_custardy_spongy) {
                    flavour = Object.assign(flavour ?? {}, { custardySpongy: item?.flavour_custardy_spongy });
                }
                if (item?.flavour_tangy_sweet) {
                    flavour = Object.assign(flavour ?? {}, { tangySweet: item?.flavour_tangy_sweet });
                }

                data.push({
                    order: i,
                    meta: createSupaMeta({ item }),
                    ...(await createSupaProductBase({ item })),
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
                    flavour,
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
