import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryStatus } from '@/libs/factory';
import { getSupaCategories, getSupaMedia, getSupaPrices, getSupaRelatedAddons } from '@/libs/utils';

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

    const MEDIA_ASSETS_HANDLES = [
        'bannerDesktop',
        'bannerTablet',
        'bannerMobile',
        'productDetailBanner',
        'productDetailSticky',
        'productDetailMobile',
        'productListingThumbnail',
        'productListingThumbnailMobile',
    ];

    const data: any[] = [];

    if (productsData && productsData.length > 0) {
        await Promise.all(
            productsData.map(async (item) => {
                const { isLive } = createSupaEntryStatus(item);

                if (!isLive) return;

                const productId = item?.id;

                data.push({
                    url: item?.url,
                    uri: item?.uri,
                    slug: item?.slug,
                    title: item?.title,
                    bannerTitle: item?.banner_title,
                    description: item?.description,
                    prices: await getSupaPrices({ table: 'products_prices', id: productId }),
                    category: await getSupaCategories({ id: item?.category_id }),
                    thumbnail: await getSupaMedia({
                        table: 'media_product',
                        id: item?.thumbnail_id,
                        volume: 'mediaProduct',
                        sizes: MEDIA_ASSETS_HANDLES,
                    }),
                    thumbnailHover: await getSupaMedia({
                        table: 'media_product',
                        id: item?.thumbnail_hover_id,
                        volume: 'mediaProduct',
                        sizes: MEDIA_ASSETS_HANDLES,
                    }),
                    addons: await getSupaRelatedAddons({ id: productId }),
                });
            })
        );
    }

    return NextResponse.json({
        products: { docs: data },
    });
}
