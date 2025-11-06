import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import {
    createSupaEntryCategories,
    createSupaEntryMedia,
    createSupaEntryPrices,
    createSupaEntryStatus,
} from '@/libs/factory';

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

    const { data: pricesData } = await supabase(await cookies())
        .from('products_prices')
        .select()
        .order('_order', { ascending: true });

    const { data: categoriesData } = await supabase(await cookies())
        .from('categories')
        .select();

    const { data: mediaData } = await supabase(await cookies())
        .from('media_product')
        .select();

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
        productsData.forEach((item) => {
            const { isLive } = createSupaEntryStatus(item);

            if (!isLive) return;

            const productId = item?.id;
            const productCategoryId = item?.category_id;

            data.push({
                url: item?.url,
                uri: item?.uri,
                slug: item?.slug,
                title: item?.title,
                bannerTitle: item?.banner_title,
                description: item?.description,
                prices: createSupaEntryPrices({ item: pricesData ?? [], id: productId }),
                category: createSupaEntryCategories({ item: categoriesData ?? [], id: productCategoryId }),
                thumbnail: createSupaEntryMedia({
                    items: mediaData ?? [],
                    id: item?.thumbnail_id,
                    sizes: MEDIA_ASSETS_HANDLES,
                }),
                thumbnailHover: createSupaEntryMedia({
                    items: mediaData ?? [],
                    id: item?.thumbnail_hover_id,
                    sizes: MEDIA_ASSETS_HANDLES,
                }),
            });
        });
    }

    return NextResponse.json({
        products: { docs: data },
    });
}
