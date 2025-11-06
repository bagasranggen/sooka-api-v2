import { Category } from '@/libs/@types';

export type CreateSupaEntryCategoriesProps = {
    item: any[] | any;
    id?: string;
};

export const createSupaEntryCategories = ({ item, id }: CreateSupaEntryCategoriesProps) => {
    let data: Pick<Category, 'id' | 'title' | 'slug' | 'description' | 'uri'> | undefined = undefined;
    let tmp = undefined;

    if (id && item && Array.isArray(item) && item.length > 0) {
        const selectedItem = item.find((itm) => itm?.id === id);

        if (selectedItem) {
            tmp = selectedItem;
        }

        // if (selectedItem) {
        //     data = {
        //         id: selectedItem.id,
        //         title: selectedItem.title,
        //         slug: selectedItem.slug,
        //         description: selectedItem.description,
        //         uri: selectedItem.uri,
        //     };
        // }
    }

    if (item && !Array.isArray(item)) {
        tmp = item;
    }

    if (tmp) {
        data = {
            id: tmp.id,
            title: tmp.title,
            slug: tmp.slug,
            description: tmp.description,
            uri: tmp.uri,
        };
    }

    return data;
};
