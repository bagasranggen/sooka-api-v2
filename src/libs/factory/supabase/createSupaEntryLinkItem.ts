import { getSupaRelatedLink } from '../../utils/supabase/getSupaRelatedLink';

export type CreateSupaEntryLinkItemProps = {
    item?: any;
};

export const createSupaEntryLinkItem = async ({ item }: CreateSupaEntryLinkItemProps) => {
    let data: any | null = null;

    if (item) {
        data = {
            source: item?.link_source,
            target: item?.link_target,
            label: item?.link_label,
            custom: item?.link_custom,
            mail: item?.link_mail,
            whatsappNumber: item?.link_whatsapp_number,
            whatsappMessage: item?.link_whatsapp_message,
            product: await getSupaRelatedLink({ table: 'products', id: item?.link_product_id }),
            category: await getSupaRelatedLink({ table: 'categories', id: item?.link_category_id }),
            page: await getSupaRelatedLink({ table: 'pages', id: item?.link_page_id }),
        };
    }

    return data;
};
