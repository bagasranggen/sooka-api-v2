export const createSupaCbSpacing = ({ item }: { item?: any }) => {
    let data = undefined;
    if (item?.cb_spacing_margin_top) {
        data = Object.assign(data ?? {}, { marginTop: `_${item?.cb_spacing_margin_top}` });
    }
    if (item?.cb_spacing_margin_bottom) {
        data = Object.assign(data ?? {}, { marginBottom: `_${item?.cb_spacing_margin_bottom}` });
    }

    return data;
};
