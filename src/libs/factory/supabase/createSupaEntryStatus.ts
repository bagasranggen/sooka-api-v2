export type CreateSupaEntryStatusProps = {
    entry_status: 'live' | 'disabled';
};

export const createSupaEntryStatus = (item?: CreateSupaEntryStatusProps) => {
    return {
        isLive: item?.entry_status === 'live',
    };
};
