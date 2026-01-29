import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { createSupaEntryLinkItem, createSupaEntryStatus } from '@/libs/factory';
import { sortArrayObject } from '@/libs/utils';

export async function GET() {
    const { data: headerData } = await supabase(await cookies())
        .from('navigation_navigations')
        .select()
        .order('_order', { ascending: true });

    const navigations: any[] = [];

    if (headerData && headerData.length > 0) {
        await Promise.all(
            headerData.map(async (item) => {
                const { isLive } = createSupaEntryStatus(item);

                if (!isLive) return;

                const { data: navigationChildrenData } = await supabase(await cookies())
                    .from('navigation_navigations_children')
                    .select()
                    .eq('_parent_id', item?.id)
                    .order('_order', { ascending: true });

                const children: any[] = [];

                if (navigationChildrenData && navigationChildrenData.length > 0) {
                    await Promise.all(
                        navigationChildrenData.map(async (itm) => {
                            const tmp = await createSupaEntryLinkItem({ item: itm });

                            if (tmp) {
                                children.push({
                                    order: itm?._order,
                                    entryStatus: itm?.entry_status,
                                    link: tmp,
                                });
                            }
                        })
                    );
                }

                navigations.push({
                    order: item?._order,
                    entryStatus: item?.entry_status,
                    link: await createSupaEntryLinkItem({ item }),
                    children: sortArrayObject({ items: children, key: 'order' }),
                });
            })
        );
    }

    if (navigations && navigations.length > 0) {
        sortArrayObject({ items: navigations, key: 'order' });
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
            businessHours: fd.business_hours,
        });
    }

    if (footerSocialData && footerSocialData.length > 0) {
        const tmp: any[] = [];

        await Promise.all(
            footerSocialData.map(async (item) => {
                let icon = null;

                if (item?.icon_source) {
                    icon = Object.assign({
                        source: item?.icon_source,
                        reactIcon: item?.icon_react_icon,
                    });
                }

                tmp.push({
                    icon,
                    link: await createSupaEntryLinkItem({ item }),
                });
            })
        );

        if (tmp.length > 0) {
            footerNavigation = Object.assign(footerNavigation ?? {}, { socialMedia: tmp });
        }
    }

    return NextResponse.json({
        headerNavigation: { navigations },
        footerNavigation,
    });
}
