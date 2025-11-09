import { Price } from '@/libs/@types';

export type CreateSupaEntryPricesItemProps = {
    item: any;
};

export const createSupaEntryPricesItem = ({ item }: CreateSupaEntryPricesItemProps) => {
    let data: { price: Price } | null = null;

    if (item) {
        data = Object.assign(data ?? {}, {
            price: {
                normalPrice: item?.['price_normal_price'],
                salePrice: item?.['price_sale_price'],
                note: item?.['price_note'],
                isFree: item?.['price_is_free'],
            },
        });
    }

    return data;
};
