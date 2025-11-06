import { Price } from '@/libs/@types';

export type CreateSupaEntryPricesProps = {
    item: any[];
    id: string;
};

export const createSupaEntryPrices = ({ item, id }: CreateSupaEntryPricesProps) => {
    const data: { price: Price }[] = [];

    if (id && item && item.length > 0) {
        item.forEach((item: any) => {
            if (item?.['_parent_id'] !== id) return;

            data.push({
                price: {
                    normalPrice: item?.['price_normal_price'],
                    salePrice: item?.['price_sale_price'],
                    note: item?.['price_note'],
                    isFree: item?.['price_is_free'],
                },
            });
        });
    }

    return data;
};
