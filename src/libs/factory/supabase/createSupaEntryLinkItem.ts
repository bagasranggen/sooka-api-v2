import { createSupaRelatedEntryLink } from './createSupaRelatedEntryLink';

export type CreateSupaEntryLinkItemProps = {
    item?: any;
    products?: any[];
    categories?: any[];
    pages?: any[];
};

export const createSupaEntryLinkItem = ({ item, products, categories, pages }: CreateSupaEntryLinkItemProps) => {
    let data = null;

    if (item) {
        data = {
            source: item?.link_source,
            target: item?.link_target,
            label: item?.link_label,
            custom: item?.link_custom,
            mail: item?.link_mail,
            whatsappNumber: item?.link_whatsapp_number,
            whatsappMessage: item?.link_whatsapp_message,
            product: createSupaRelatedEntryLink({ items: products ?? [], id: item?.link_product_id }),
            category: createSupaRelatedEntryLink({ items: categories ?? [], id: item?.link_category_id }),
            page: createSupaRelatedEntryLink({ items: pages ?? [], id: item?.link_page_id }),
        };
    }

    return data;
};
