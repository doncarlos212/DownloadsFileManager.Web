import api from "./apiClient";
import { LogEntryDto } from "./generated/models";

export interface GetLogsParams {
    count?: number;
    level?: string;
    since?: Date;
}

export const getLogs = async (params?: GetLogsParams): Promise<LogEntryDto[]> => {
    const queryParams = new URLSearchParams();
    
    if (params?.count !== undefined) {
        queryParams.append('count', params.count.toString());
    }
    
    if (params?.level) {
        queryParams.append('level', params.level);
    }
    
    if (params?.since) {
        queryParams.append('since', params.since.toISOString());
    }
    
    const url = `/api/logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const { data } = await api.get<LogEntryDto[]>(url);
    return data;
};

export const getLogLevels = async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/api/logs/levels');
    return data;
};

export const clearLogs = async (): Promise<void> => {
    await api.delete('/api/logs');
};
