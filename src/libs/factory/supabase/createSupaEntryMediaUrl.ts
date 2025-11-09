export const createSupaEntryMediaUrl = ({ base, filename }: { base: string; filename: string }) => {
    let data = null;

    if (base && filename) data = base + filename;

    return data;
};
