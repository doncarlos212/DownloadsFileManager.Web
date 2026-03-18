import { useQuery } from "@tanstack/react-query";
import { getHistory, getHistoryStats, GetHistoryParams } from "../api/historyApi";

export const useHistory = (params?: GetHistoryParams) => {
    return useQuery({
        queryKey: ['history', params],
        queryFn: () => getHistory(params),
        refetchInterval: 10000, // Auto-refresh every 10 seconds
    });
};

export const useHistoryStats = () => {
    return useQuery({
        queryKey: ['historyStats'],
        queryFn: getHistoryStats,
        refetchInterval: 10000, // Auto-refresh every 10 seconds
    });
};
