import { routes } from "../routes";
import api from "./apiClient";
import { ISettingDto, SettingDto } from "./generated";

export async function getSettings(): Promise<ISettingDto> {
  const { data } = await api.get<SettingDto>(routes.settings.path);
  return data;
}

export async function updateSettings(payload: ISettingDto): Promise<SettingDto> {
  const { data } = await api.post<SettingDto>(routes.settings.path, payload);
  return data;
}