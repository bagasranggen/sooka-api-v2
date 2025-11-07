import { Category } from '@/libs/@types';
import { createSupaEntryStatus } from '@/libs/factory';

export type CreateSupaEntryCategoriesItemProps = {
    item: any;
};

export const createSupaEntryCategoriesItem = ({ item }: CreateSupaEntryCategoriesItemProps) => {
    let data: Pick<Category, 'id' | 'title' | 'slug' | 'description' | 'uri'> | null = null;

    if (item) {
        const { isLive } = createSupaEntryStatus(item);

        if (!isLive) return;

        data = {
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            uri: item.uri,
        };
    }

    return data;
};
