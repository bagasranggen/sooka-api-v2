import { Product } from '@/libs/@types';

export const createSupaProductBase = ({
    item,
}: {
    item: any;
}): Pick<Product, 'url' | 'uri' | 'slug' | 'title' | 'bannerTitle' | 'description' | 'availability'> => {
    return {
        url: item?.url,
        uri: item?.uri,
        slug: item?.slug,
        title: item?.title,
        bannerTitle: item?.banner_title,
        description: item?.description,
        availability: item?.availability,
    };
};
