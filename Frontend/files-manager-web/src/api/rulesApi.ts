import { routes } from "../routes";
import api from "./apiClient";
import { IRuleDto } from "./generated";

export const getRules = async (): Promise<IRuleDto[]> => {
    console.log("Fetching rules from API");
    const {data} = await api.get<IRuleDto[]>(`${routes.rules.path}`);
    return data;
}

export const getRule = async (id: string): Promise<IRuleDto> => {
    const {data} = await api.get<IRuleDto>(`${routes.rules.path}/${id}`);
    return data;
}

export const addRule = async (rule: IRuleDto): Promise<void> => {
    await api.post(routes.rules.path, rule);
}

export const updateRule = async (rule: IRuleDto): Promise<IRuleDto> => {
  const res = await api.put(`${routes.rules.path}/${rule.id}`, rule);
  if (res.status === 204 || res.data == null || res.data === "") {
    return rule;
  }
  return res.data as IRuleDto;
}