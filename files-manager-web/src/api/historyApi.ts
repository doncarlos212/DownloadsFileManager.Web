import api from "./apiClient";
import { HistoryRecordDto, HistoryStatsDto } from "./generated/models";

export interface GetHistoryParams {
    count?: number;
    since?: Date;
    actionType?: string;
}

export const getHistory = async (params?: GetHistoryParams): Promise<HistoryRecordDto[]> => {
    const queryParams = new URLSearchParams();
    
    if (params?.count !== undefined) {
        queryParams.append('count', params.count.toString());
    }
    
    if (params?.since) {
        queryParams.append('since', params.since.toISOString());
    }
    
    if (params?.actionType) {
        queryParams.append('actionType', params.actionType);
    }
    
    const url = `/api/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const { data } = await api.get<HistoryRecordDto[]>(url);
    return data;
};

export const getHistoryStats = async (): Promise<HistoryStatsDto> => {
    const { data } = await api.get<HistoryStatsDto>('/api/history/stats');
    return data;
};
