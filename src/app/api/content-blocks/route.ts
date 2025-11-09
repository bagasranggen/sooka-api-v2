import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import {
    createSupaCbDualPanel,
    createSupaCbMediaRels,
    createSupaCbRelateProducts,
    createSupaCbSpacing,
    createSupaEntryLinkItem,
} from '@/libs/factory';
import { sortArrayObject } from '@/libs/utils';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const uri = searchParams.get('uri');

    const { data: pagesData } = await supabase(await cookies())
        .from('pages')
        .select()
        .eq('entry_status', 'live')
        .eq('uri', uri);

    const pageId = pagesData?.[0]?.id;
    const TABLE_PARENT_ID = '_parent_id';

    const HANDLES = [
        { table: 'pages_blocks_callout', handle: 'callout' },
        { table: 'pages_blocks_dual_panel', handle: 'dualPanel' },
        { table: 'pages_blocks_gallery', handle: 'gallery' },
        { table: 'pages_blocks_heading', handle: 'heading' },
        { table: 'pages_blocks_marquee', handle: 'marquee' },
        { table: 'pages_blocks_related_products', handle: 'relatedProducts' },
    ];

    const cbData: any[] = [];

    await Promise.all(
        HANDLES.map(async (item) => {
            const { data } = await supabase(await cookies())
                .from(item.table)
                .select()
                .eq(TABLE_PARENT_ID, pageId);

            if (data && data.length > 0) {
                data.forEach((datum) => {
                    cbData.push({ blockType: item.handle, ...datum });
                });
            }
        })
    );

    const contentBlocks: any[] = [];

    if (cbData && cbData.length > 0) {
        await Promise.all(
            cbData.map(async ({ blockType, ...item }) => {
                let tmp = {
                    order: item?._order,
                    blockType,
                };

                const cbSpacing = createSupaCbSpacing({ item });

                if (cbSpacing) {
                    tmp = Object.assign(tmp, { cbSpacing });
                }

                switch (blockType) {
                    case 'gallery':
                        const galleryData = await createSupaCbMediaRels({
                            item,
                            table: 'media_gallery',
                            volume: 'mediaGallery',
                            idHandle: 'media_gallery_id',
                            sizes: ['collage1x1', 'collage4x3', 'collage3x4', 'collage3x2', 'collage2x3'],
                        });

                        if (galleryData) tmp = Object.assign(tmp, galleryData);
                        break;

                    case 'callout':
                        tmp = Object.assign(tmp, {
                            title: item?.title,
                            link: await createSupaEntryLinkItem({ item }),
                        });
                        break;

                    case 'dualPanel':
                        const dualPanelData = await createSupaCbDualPanel({ item });
                        tmp = Object.assign(tmp, dualPanelData);
                        break;

                    case 'heading':
                        tmp = Object.assign(tmp, {
                            title: item?.title,
                            description: item?.description,
                        });
                        break;

                    case 'marquee':
                        const marqueeData = await createSupaCbMediaRels({
                            item,
                            table: 'media_marquee',
                            volume: 'mediaMarquee',
                            idHandle: 'media_marquee_id',
                            sizes: ['marquee', 'marqueeMobile'],
                        });

                        if (marqueeData) tmp = Object.assign(tmp, marqueeData);
                        break;

                    case 'relatedProducts':
                        const productsData = await createSupaCbRelateProducts({ item });

                        if (productsData) tmp = Object.assign(tmp ?? {}, productsData);
                        break;
                }

                contentBlocks.push(tmp);
            })
        );
    }

    if (contentBlocks.length > 0) sortArrayObject({ items: contentBlocks, key: 'order' });

    return NextResponse.json({
        entries: {
            docs: [
                {
                    contentBlocks,
                },
            ],
        },
    });
}
