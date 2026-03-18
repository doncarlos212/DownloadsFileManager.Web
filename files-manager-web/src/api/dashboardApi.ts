import api from "./apiClient";
import { DashboardDto } from "./generated/models";


export const getDashboardData = async (): Promise<DashboardDto> => {
    const {data} = await api.get<DashboardDto>('/api/dashboard');
    return data;
}    