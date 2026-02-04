import { getSupaCategories } from '../../utils/supabase/getSupaCategories';
import { getSupaMedia } from '../../utils/supabase/getSupaMedia';
import { getSupaPrices } from '../../utils/supabase/getSupaPrices';
import { getSupaTags } from '../../utils/supabase/getSupaTags';

export const createSupaProductInfo = async ({ item }: { item: any }) => {
    const MEDIA_ASSETS_HANDLES = [
        'bannerDesktop',
        'bannerTablet',
        'bannerMobile',
        'productDetailBanner',
        'productDetailSticky',
        'productDetailMobile',
        'productListingThumbnail',
        'productListingThumbnailMobile',
    ];

    return {
        prices: await getSupaPrices({ table: 'products_prices', id: item?.id }),
        badge: await getSupaTags({ id: item?.badge_id }),
        category: await getSupaCategories({ id: item?.category_id }),
        thumbnail: await getSupaMedia({
            table: 'media_product',
            id: item?.thumbnail_id,
            volume: 'mediaProduct',
            sizes: MEDIA_ASSETS_HANDLES,
        }),
        thumbnailHover: await getSupaMedia({
            table: 'media_product',
            id: item?.thumbnail_hover_id,
            volume: 'mediaProduct',
            sizes: MEDIA_ASSETS_HANDLES,
        }),
    };
};
