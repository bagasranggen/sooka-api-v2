import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { getSupaMedia, getSupaProducts, getSupaTags, sortArrayObject } from '@/libs/utils';
import {
    createSupaEntryLinkItem,
    createSupaEntryStatus,
    createSupaProductBase,
    createSupaProductInfo,
    createSupaRelatedProducts,
} from '@/libs/factory';

export async function GET() {
    const { data: homepageData } = await supabase(await cookies())
        .from('homepage')
        .select();

    const { data: homepageBannerData } = await supabase(await cookies())
        .from('homepage_banner_media')
        .select()
        .order('_order', { ascending: true });

    const { data: homepageOrderStepsData } = await supabase(await cookies())
        .from('homepage_order_steps')
        .select('title,description')
        .order('_order', { ascending: true });

    const { data: homepageHighlightsData } = await supabase(await cookies())
        .from('homepage_highlights')
        .select('tag_id')
        .order('_order', { ascending: true });

    const hd = homepageData?.[0];

    const bannerMedia: any[] = [];

    if (homepageBannerData && homepageBannerData.length > 0) {
        await Promise.all(
            homepageBannerData.map(async (item, i: number) => {
                const { isLive } = createSupaEntryStatus(item);

                if (!isLive) return;

                const product = await getSupaProducts({ id: item?.product_id });

                bannerMedia.push({
                    order: i,
                    entryStatus: item?.entry_status,
                    source: item?.source,
                    title: item?.title,
                    description: item?.description,
                    textAlign: item?.text_align,
                    productTarget: item?.product_target,
                    bannerOverlay: item?.banner_overlay,
                    tag: await getSupaTags({ id: item?.tag_id }),
                    media: await getSupaMedia({
                        table: 'media_global',
                        id: item?.media_id,
                        volume: 'mediaGlobal',
                        sizes: ['bannerDesktop', 'bannerTablet', 'bannerMobile'],
                    }),
                    product: {
                        ...createSupaProductBase({ item: product?.[0] }),
                        ...(await createSupaProductInfo({ item: product?.[0] })),
                    },
                    link: await createSupaEntryLinkItem({ item }),
                });
            })
        );
    }

    if (bannerMedia.length > 0) {
        sortArrayObject({ items: bannerMedia, key: 'order' });
    }

    const highlights: any[] = [];
    if (homepageHighlightsData && homepageHighlightsData.length > 0) {
        await Promise.all(
            homepageHighlightsData.map(async (item, i: number) => {
                const { data: productsRelsData } = await supabase(await cookies())
                    .from('homepage_rels')
                    .select('products_id')
                    .eq('path', `highlights.${i}.products`)
                    .order('order', { ascending: true });

                const productIds: any[] = [];
                if (productsRelsData && productsRelsData.length > 0) {
                    productsRelsData.forEach((item) => {
                        if (item?.products_id) productIds.push(item.products_id);
                    });
                }

                let tmp = null;

                const tag = await getSupaTags({ id: item?.tag_id });
                const products = await createSupaRelatedProducts({ productIds });

                if (tag) tmp = Object.assign(tmp ?? {}, { tag });

                if (products) tmp = Object.assign(tmp ?? {}, { products: products });

                if (tmp) highlights.push(tmp);
            })
        );
    }

    const STORY_MEDIA_SIZES = ['storyMediaDesktop', 'storyMediaMobile'];

    const orderSteps: any[] = [];
    if (homepageOrderStepsData && homepageOrderStepsData.length > 0) {
        homepageOrderStepsData.forEach((item) => {
            orderSteps.push({
                title: item.title,
                description: item.description,
            });
        });
    }

    return NextResponse.json({
        entry: {
            bannerMedia,
            highlights,
            storyDescription: hd?.story_description,
            storyMediaMain: await getSupaMedia({
                table: 'media_global',
                id: hd?.story_media_main_id,
                volume: 'mediaGlobal',
                sizes: STORY_MEDIA_SIZES,
            }),
            storyMediaSecondary: await getSupaMedia({
                table: 'media_global',
                id: hd?.story_media_secondary_id,
                volume: 'mediaGlobal',
                sizes: STORY_MEDIA_SIZES,
            }),
            imageDividerMedia: await getSupaMedia({
                table: 'media_global',
                id: hd?.image_divider_media_id,
                volume: 'mediaGlobal',
                sizes: ['bannerDesktop', 'mediaDividerTablet', 'mediaDividerMobile'],
            }),
            orderDescription: hd?.order_description,
            orderSteps,
        },
    });
}
