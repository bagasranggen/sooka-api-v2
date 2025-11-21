import { supabase } from '@/libs/fetcher';
import { cookies } from 'next/headers';

import { createSupaProductBase, createSupaProductInfo } from '@/libs/factory';
import { sortArrayObject } from '@/libs/utils';

export const createSupaRelatedProducts = async ({ productIds }: { productIds?: number[] }) => {
    let data: any[] | null = null;

    if (productIds) {
        const { data: d } = await supabase(await cookies())
            .from('products')
            .select()
            .in('id', productIds)
            .order('slug', { ascending: true });

        if (d && d.length > 0) {
            data = [];

            await Promise.all(
                d.map(async (item) => {
                    if (data) {
                        data.push({
                            ...(await createSupaProductBase({ item })),
                            ...(await createSupaProductInfo({ item })),
                        });
                    }
                })
            );
        }

        // await Promise.all(
        //     productsData.map(async (item) => {
        //         tmpProducts.push({
        //             ...createSupaProductBase({ item }),
        //             ...(await createSupaProductInfo({ item })),
        //         });
        //     })
        // );
    }

    if (data && data.length > 0) sortArrayObject({ items: data, key: 'order' });

    return data;
};
