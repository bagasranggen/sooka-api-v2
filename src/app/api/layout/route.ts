import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryLink, createSupaEntryStatus } from '@/libs/factory';
import { getSupaRelatedEntry } from '@/libs/utils';

export async function GET(req: NextRequest) {
    const { pages, products, categories } = await getSupaRelatedEntry();

    const { data: headerData } = await supabase(await cookies())
        .from('navigation_navigations')
        .select()
        .order('_order', { ascending: true });

    const navigations: any[] = [];

    if (headerData && headerData.length > 0) {
        headerData.forEach((item) => {
            const { isLive } = createSupaEntryStatus(item);

            if (!isLive) return;

            navigations.push({
                entryStatus: item?.entry_status,
                link: createSupaEntryLink({ item, products, categories, pages }),
            });
        });
    }

    const { data: footerData } = await supabase(await cookies())
        .from('footer')
        .select();

    const { data: footerSocialData } = await supabase(await cookies())
        .from('footer_social_media')
        .select()
        .order('_order', { ascending: true });

    const fd = footerData?.[0];

    let footerNavigation = null;

    if (fd?.address) {
        footerNavigation = Object.assign(footerNavigation ?? {}, {
            address: fd.address,
        });
    }

    if (fd?.business_hours) {
        footerNavigation = Object.assign(footerNavigation ?? {}, {
            businessHour: fd.business_hours,
        });
    }

    if (footerSocialData && footerSocialData.length > 0) {
        const tmp: any[] = [];

        footerSocialData.forEach((item) => {
            let icon = null;

            if (item?.icon_source) {
                icon = Object.assign({
                    source: item?.icon_source,
                    reactIcon: item?.icon_react_icon,
                });
            }

            tmp.push({
                icon,
                link: createSupaEntryLink({ item, products, categories, pages }),
            });
        });

        if (tmp.length > 0) {
            footerNavigation = Object.assign(footerNavigation ?? {}, { socialMedia: tmp });
        }
    }

    return NextResponse.json({
        headerNavigation: { navigations },
        footerNavigation,
    });
}
