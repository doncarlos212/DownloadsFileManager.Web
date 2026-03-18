import api from "./apiClient";
import { IRuleDto } from "./generated";

export const getRules = async (): Promise<IRuleDto[]> => {    
    const {data} = await api.get<IRuleDto[]>('/api/rules');
    return data;
}

export const getRule = async (id: string): Promise<IRuleDto> => {
    const {data} = await api.get<IRuleDto>(`/api/rules/${id}`);
    return data;
}

export const addRule = async (rule: IRuleDto): Promise<void> => {
    await api.post('/api/rules', rule);
}

export const updateRule = async (rule: IRuleDto): Promise<IRuleDto> => {
  const res = await api.put(`/api/rules/${rule.id}`, rule);
  if (res.status === 204 || res.data == null || res.data === "") {
    return rule;
  }
  return res.data as IRuleDto;
}

export const deleteRule = async (id: string): Promise<void> => {
    await api.delete(`/api/rules/${id}`);
}