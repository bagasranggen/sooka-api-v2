export type CreateSupaEntryMediaUrlProps = {
    base: string;
    filename: string;
};

export const createSupaEntryMediaUrl = ({ base, filename }: CreateSupaEntryMediaUrlProps) => {
    let data = null;

    if (base && filename) data = base + filename;

    return data;
};
