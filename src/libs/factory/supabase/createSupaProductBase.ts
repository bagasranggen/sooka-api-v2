import { Product } from '@/libs/@types';
import { getSupaTags } from '@/libs/utils';

export const createSupaProductBase = async ({
    item,
}: {
    item: any;
}): Promise<
    Pick<
        Product,
        | 'url'
        | 'uri'
        | 'slug'
        | 'title'
        | 'bannerTitle'
        | 'description'
        | 'availability'
        | 'unavailableLabel'
        | 'unavailableCustomLabel'
    >
> => {
    return {
        url: item?.url,
        uri: item?.uri,
        slug: item?.slug,
        title: item?.title,
        bannerTitle: item?.banner_title,
        description: item?.description,
        availability: item?.availability,
        unavailableLabel: await getSupaTags({ id: item?.unavailable_label_id }),
        unavailableCustomLabel: item?.unavailable_custom_label,
    };
};
