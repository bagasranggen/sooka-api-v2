import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaCbGallery, createSupaCbSpacing } from '@/libs/factory';

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
        { table: 'pages_blocks_callout', handle: 'pages_blocks_callout' },
        { table: 'pages_blocks_gallery', handle: 'gallery' },
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
                let tmp = { blockType };

                const cbSpacing = createSupaCbSpacing({ item });

                if (cbSpacing) {
                    tmp = Object.assign(tmp, { cbSpacing });
                }

                switch (blockType) {
                    case 'gallery':
                        const data = await createSupaCbGallery({ item });
                        if (data) tmp = Object.assign(tmp, data);
                        break;
                }

                contentBlocks.push(tmp);
            })
        );
    }

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
