import { useQuery } from "@tanstack/react-query";
import { getLogs, getLogLevels, GetLogsParams } from "../api/logsApi";

export const useLogs = (params?: GetLogsParams) => {
    return useQuery({
        queryKey: ['logs', params],
        queryFn: () => getLogs(params),
        refetchInterval: 5000, // Auto-refresh every 5 seconds
    });
};

export const useLogLevels = () => {
    return useQuery({
        queryKey: ['logLevels'],
        queryFn: getLogLevels,
    });
};
