export const createSupaProductBase = ({ item }: { item: any }) => {
    return {
        url: item?.url,
        uri: item?.uri,
        slug: item?.slug,
        title: item?.title,
        bannerTitle: item?.banner_title,
        description: item?.description,
    };
};
