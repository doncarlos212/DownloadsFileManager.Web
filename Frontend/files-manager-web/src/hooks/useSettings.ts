import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "../api/settingsApi";
import { LogLevel, ISettingDto } from "../api/generated";
import { useSnackBar } from "../contexts/SnackBarContext";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  const { showSnackBar } = useSnackBar();
  return useMutation({
    mutationFn: (s: ISettingDto) => updateSettings(s),
    onSuccess: (data) => {
      qc.setQueryData(["settings"], data);
      showSnackBar("Settings saved", "success");
    },
    onError: () => showSnackBar("Error saving settings", "error"),
  });
}

export function getLogLevelOptions(): string[] {
  const anyEnum = LogLevel as any; 
  return Object.keys(anyEnum).filter(k => isNaN(Number(k)));
}