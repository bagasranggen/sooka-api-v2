import { cookies } from 'next/headers';

import { supabase } from '@/libs/fetcher';
import { getSupaMedia, GetSupaMediaProps } from './getSupaMedia';
import { sortArrayObject } from '../sortArrayObject';

export type GetSupaRelatedMarqueeProps = {
    table: string;
    path: string;
    field: string;
    id: number;
    mediaTable: GetSupaMediaProps['table'];
} & Pick<GetSupaMediaProps, 'volume' | 'sizes'>;

export const getSupaRelatedMarquee = async ({
    table,
    path,
    field,
    id,
    mediaTable,
    volume,
    sizes,
}: GetSupaRelatedMarqueeProps) => {
    let data: any[] | null = null;

    if (table && path && field && id) {
        const { data: relsData } = await supabase(await cookies())
            .from(table)
            .select(field)
            .eq('path', path)
            .eq('parent_id', id)
            .order('order', { ascending: true });

        const ids: number[] = [];
        if (relsData && relsData.length > 0) {
            relsData.forEach((item) => {
                const id = item?.[field as any] as unknown as number;

                if (id) ids.push(id);
            });
        }

        if (ids.length > 0) {
            data = [];

            await Promise.all(
                ids.map(async (item, i: number) => {
                    const media = await getSupaMedia({
                        table: mediaTable,
                        id: item,
                        volume,
                        sizes,
                    });

                    if (media && data) data.push({ order: i, ...media });
                })
            );
        }
    }

    if (data && data?.length > 0) {
        sortArrayObject({ items: data, key: 'order' });
    }

    return data;
};
