import React from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { ISettingDto, ConflictPolicyDto } from "../api/generated";
import { useSettings, useUpdateSettings, getLogLevelOptions } from "../hooks/useSettings";
import {
  API_BASE_URL_STORAGE_KEY,
  API_BASE_URL_DEFAULT,
  getApiBaseUrl,
} from "../api/apiClient";

function enumEntries(enm: any): { key: string; value: any }[] {
  return Object.keys(enm)
    .filter((k) => isNaN(Number(k))) // descarta reverso numérico
    .map((k) => ({ key: k, value: enm[k] }));
}

function formatEnumLabel(k: string) {
  return k.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function getWindowsPathError(value?: string): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return "Folder path is required";
  const isDrive = DRIVE_PATH_REGEX.test(raw);
  const isUnc = UNC_PATH_REGEX.test(raw);
  if (!isDrive && !isUnc) return "Must start with C:\\ or \\\\server\\share";
  const toCheck = isDrive ? raw.replace(/^[a-zA-Z]:/, "") : raw;
  if (INVALID_CHARS_REGEX.test(toCheck)) return 'Invalid chars: < > : " | ? *';
  const segments = (isDrive
    ? raw.split("\\").slice(1)
    : raw.replace(/^\\\\/, "").split("\\").slice(2)
  ).filter(Boolean);
  for (const seg of segments) {
    if (seg.endsWith(".") || seg.endsWith(" ")) return "Segment cannot end with dot or space";
  }
  return null;
}

const INVALID_CHARS_REGEX = /[<>:"|?*]/;
const DRIVE_PATH_REGEX = /^[a-zA-Z]:\\/;
const UNC_PATH_REGEX = /^\\\\[^\\/]+\\[^\\/]+/;

export function SettingsPage() {
  const { data, isLoading, isError, error } = useSettings();
  const updateMutation = useUpdateSettings();
  const [form, setForm] = React.useState<ISettingDto>();

  // API URL override (localStorage)
  const [apiUrl, setApiUrl] = React.useState(() => getApiBaseUrl());
  const [apiUrlInput, setApiUrlInput] = React.useState(() => getApiBaseUrl());
  const apiUrlChanged = apiUrlInput !== apiUrl;
  const isCustomApiUrl = apiUrl !== API_BASE_URL_DEFAULT;

  const handleSaveApiUrl = () => {
    const trimmed = apiUrlInput.trim();
    if (!trimmed) return;
    localStorage.setItem(API_BASE_URL_STORAGE_KEY, trimmed);
    setApiUrl(trimmed);
  };

  const handleResetApiUrl = () => {
    localStorage.removeItem(API_BASE_URL_STORAGE_KEY);
    setApiUrl(API_BASE_URL_DEFAULT);
    setApiUrlInput(API_BASE_URL_DEFAULT);
  };

  React.useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const pathError = getWindowsPathError(form?.watchFolder);

  const changed = React.useMemo(() => {
    if (!data || !form) return false;
    return JSON.stringify(data) !== JSON.stringify(form);
  }, [data, form]);

  const canSave = !!form && !pathError && changed && !updateMutation.isPending;

  const handleSave = () => {
    if (!form) return;
    updateMutation.mutate(form);
  };

  if (isLoading && !form) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 2 }}>
          {(error as any)?.message || "Error loading settings"}
        </Alert>
      </Container>
    );
  }

  if (!form) return null;

  const logLevelOptions = getLogLevelOptions(); // ya existente
  const conflictPolicyOptions = enumEntries(ConflictPolicyDto);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Configuración
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Ajusta las opciones del servicio
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ pt: 3 }}>

        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Configuración General
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Configura las opciones principales del servicio de gestión de archivos
                </Typography>
              </Box>
              <Divider />
              <Stack spacing={3}>
                <TextField
                  label="Watch folder (root)"
                  value={form.watchFolder || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p!, watchFolder: e.target.value }))
                  }
                  error={!!pathError}
                  helperText={pathError ?? "Folder monitored for rules processing"}
                  fullWidth
                  autoComplete="off"
                />

                <FormControl fullWidth>
                  <InputLabel id="log-level-label">Log level</InputLabel>
                  <Select
                    labelId="log-level-label"
                    label="Log level"
                    value={form.logLevel ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p!, logLevel: e.target.value as any }))
                    }
                  >
                    {logLevelOptions.map((lvl) => (
                      <MenuItem key={lvl} value={lvl}>
                        {lvl}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="conflict-policy-label">
                    Conflict policy
                  </InputLabel>
                  <Select
                    labelId="conflict-policy-label"
                    label="Conflict policy"
                    value={form.conflictPolicy ?? ""}
                    onChange={(e) =>
                      setForm((p) =>
                        p
                          ? { ...p, conflictPolicy: e.target.value as typeof p.conflictPolicy }
                          : p
                      )
                    }
                  >
                    {conflictPolicyOptions.map((opt) => (
                      <MenuItem key={opt.key} value={opt.value}>
                        {formatEnumLabel(opt.key)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Conexión API
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  URL base del servicio local. Modifícala solo si cambiaste el puerto por defecto.
                </Typography>
              </Box>
              <Divider />
              <Stack spacing={2}>
                <TextField
                  label="API base URL"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  helperText={
                    isCustomApiUrl
                      ? `Valor personalizado (por defecto: ${API_BASE_URL_DEFAULT})`
                      : `Valor por defecto${process.env.REACT_APP_API_BASE_URL ? " (desde variable de entorno)" : ""}`
                  }
                  fullWidth
                  autoComplete="off"
                />
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    disabled={!isCustomApiUrl}
                    onClick={handleResetApiUrl}
                  >
                    Restablecer URL
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!apiUrlChanged || !apiUrlInput.trim()}
                    onClick={handleSaveApiUrl}
                  >
                    Guardar URL
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="large"
                disabled={!changed || updateMutation.isPending}
                onClick={() => setForm(data!)}
              >
                Restablecer
              </Button>
              <Button
                variant="contained"
                size="large"
                disabled={!canSave}
                onClick={handleSave}
              >
                {updateMutation.isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
