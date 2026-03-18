import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
    Tooltip,
    InputAdornment,
    Container,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Link as LinkIcon, LinkOff as LinkOffIcon } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router";
import { routes } from "../routes";
import { ActionDto, ActionTypeDto, ConditionDto, IRuleDto } from "../api/generated";
import { useRule, useUpdateRule, useAddRule } from "../hooks/useRules";
import { useSettings } from "../hooks/useSettings";

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const emptyRule = (): IRuleDto => ({
    id: "",          // quedará vacío hasta que el backend asigne (o puedes omitirlo antes del POST)
    name: "",
    description: "",
    priority: 0,
    enabled: true,
    // @ts-ignore (si tu DTO los marca opcionales)
    conditions: [],
    // @ts-ignore
    actions: [],
});

const CONDITION_TYPES = ["Extension", "NameContains", "MimeType", "Regex"];
const ACTION_TYPES = ["Move", "Copy", "Delete", "Rename"];
const MAX_ACTIONS = 1;

// Extensiones comunes para el selector cuando el tipo es "Extension"
const COMMON_EXTENSIONS = [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".txt", ".csv", ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg",
    ".zip", ".rar", ".7z", ".mp3", ".wav", ".mp4", ".avi", ".mkv",
    ".exe", ".msi", ".iso", ".html", ".json", ".xml"
];

// Validación simple de paths en Windows
const INVALID_CHARS_REGEX = /[<>:"|?*]/; // caracteres no permitidos
const DRIVE_PATH_REGEX = /^[a-zA-Z]:\\/; // C:\...
const UNC_PATH_REGEX = /^\\\\[^\\/]+\\[^\\/]+/; // \\server\share

function requiresPath(actionType?: string) {
    return actionType === "Move" || actionType === "Copy";
}

function getWindowsPathError(value: string): string | null {
    const path = (value ?? "").trim();
    if (!path) return "Path is required";

    const isDrive = DRIVE_PATH_REGEX.test(path); // C:\...
    const isUnc = UNC_PATH_REGEX.test(path);     // \\server\share

    if (!isDrive && !isUnc) {
        return "Path must start with C:\\ or \\\\server\\share";
    }

    // Quitar el prefijo de unidad (C:) para no penalizar el ':')
    const toCheck = isDrive ? path.replace(/^[a-zA-Z]:/, "") : path;

    // Carácteres inválidos (ahora el ':' del prefijo no se evalúa)
    if (INVALID_CHARS_REGEX.test(toCheck)) {
        return "Path contains invalid characters: < > : \" | ? *";
    }

    // Validar que ningún segmento termine en punto o espacio
    let segments: string[] = [];
    if (isDrive) {
        // C:\folder\sub -> saltar el primer segmento "C:"
        segments = path.split("\\").slice(1);
    } else if (isUnc) {
        // \\server\share\folder -> saltar \\server\share
        segments = path.replace(/^\\\\/, "").split("\\").slice(2);
    }

    for (const seg of segments) {
        if (!seg) continue;
        if (seg.endsWith(".") || seg.endsWith(" ")) {
            return "Folder/file names cannot end with a dot or space";
        }
    }

    return null;
}

export default function RuleFormPage() {
    const { id } = useParams<{ id?: string }>();
    const isNew = !id;
    const navigate = useNavigate();
    const location = useLocation() as any;

    const stateRule: IRuleDto | undefined = location?.state?.rule;
    const effectiveId = stateRule?.id ?? id;
    const { data: fetchedRule, isLoading, isError, error } = useRule(isNew ? undefined : (effectiveId as string));
    const sourceRule = useMemo<IRuleDto | undefined>(
        () => (isNew ? undefined : (stateRule ?? fetchedRule)),
        [isNew, stateRule, fetchedRule]
    );

    const [form, setForm] = useState<IRuleDto>(emptyRule());
    const updateMutation = useUpdateRule();
    const createMutation = useAddRule();
    const { data: settings } = useSettings();
    const baseWatchFolder = (settings?.watchFolder || "").trim();
    const baseWatchFolderLower = baseWatchFolder.toLowerCase();

    useEffect(() => {
        if (isNew) {
            setForm(emptyRule());
        } else if (sourceRule) {
            setForm(deepClone(sourceRule));
        }
    }, [isNew, sourceRule, sourceRule?.id]);

    const handleText =
        (key: keyof IRuleDto) =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({ ...prev, [key]: e.target.value as any }));
                console.log(form.id);
            }

    const handleNumber =
        (key: keyof IRuleDto) =>
            (e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, [key]: Number(e.target.value) as any }));

    const handleBool =
        (key: keyof IRuleDto) =>
            (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
                setForm((prev) => ({ ...prev, [key]: checked as any }));

    // Conditions
    const addCondition = () =>
        setForm((prev) => ({
            ...prev,
            conditions: [...(prev.conditions ?? []), ({ type: CONDITION_TYPES[0], value: "" } as ConditionDto)],
        }));

    const updateCondition = (index: number, patch: Partial<ConditionDto>) =>
        setForm((prev) => {
            const next = [...(prev.conditions ?? [])];
            next[index] = { ...(next[index] ?? {}), ...patch } as ConditionDto;
            return { ...prev, conditions: next };
        });

    const removeCondition = (index: number) =>
        setForm((prev) => {
            const next = [...(prev.conditions ?? [])];
            next.splice(index, 1);
            return { ...prev, conditions: next };
        });

    // Actions
    const addAction = () =>
        setForm(prev => {
            if ((prev.actions?.length ?? 0) >= MAX_ACTIONS) return prev;
            return {
                ...prev,
                actions: [...(prev.actions ?? []), ({ type: ACTION_TYPES[0], target: "" } as ActionDto)],
            };
        });

    // Garantiza que nunca haya más de una acción (por si una regla antigua trae varias)
    useEffect(() => {
        setForm(prev => {
            if ((prev.actions?.length ?? 0) > MAX_ACTIONS) {
                return { ...prev, actions: prev.actions?.slice(0, MAX_ACTIONS) };
            }
            return prev;
        });
    }, []);

    const updateAction = (index: number, patch: Partial<ActionDto>) =>
        setForm((prev) => {
            const next = [...(prev.actions ?? [])];
            next[index] = { ...(next[index] ?? {}), ...patch } as ActionDto;
            return { ...prev, actions: next };
        });

    const removeAction = (index: number) =>
        setForm((prev) => {
            const next = [...(prev.actions ?? [])];
            next.splice(index, 1);
            return { ...prev, actions: next };
        });

    // Invalida guardar si algún target (Move/Copy) tiene path inválido
    const anyInvalidActionPath =
        (form.actions ?? []).some(a => requiresPath(a?.type) && !!getWindowsPathError(a?.target ?? ""));
    // En creación no exigimos form.id
    const canSave = (form.name ?? "").trim().length > 0 && !anyInvalidActionPath && !(updateMutation.isPending || createMutation.isPending);

    const onBack = () => navigate(routes.rules.to());
    const onSave = () => {
        const payload = deepClone(form);
        if (isNew) {
            // Quita id vacío si el backend lo genera
            if (!payload.id) delete (payload as any).id;
            createMutation.mutate(payload, {
                onSuccess: () => navigate(routes.rules.to()),
            });
        } else {
            updateMutation.mutate(payload, {
                onSuccess: () => navigate(routes.rules.to()),
            });
        }
    };

    // Helpers modo relativo (usa WatchFolder como prefijo)
    function isActionRelative(target?: string) {
        if (!baseWatchFolder) return false;
        if (!target) return false;
        return target.toLowerCase().startsWith(baseWatchFolderLower + "\\") || target.toLowerCase() === baseWatchFolderLower;
    }

    function getSubfolderFromTarget(target?: string) {
        if (!isActionRelative(target)) return "";
        if (!target) return "";
        if (target.toLowerCase() === baseWatchFolderLower) return "";
        return target.slice(baseWatchFolder.length + 1);
    }

    function joinBaseAndSub(sub: string) {
        if (!baseWatchFolder) return sub;
        const cleaned = sub.replace(/^\\+/, "");
        if (!cleaned) return baseWatchFolder;
        return baseWatchFolder.replace(/\\+$/, "") + "\\" + cleaned;
    }

    if (!isNew && isLoading && !sourceRule) {
        return (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isNew && isError && !sourceRule) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{(error as any)?.message ?? "Failed to load rule"}</Alert>
                <Button sx={{ mt: 2 }} onClick={onBack}>
                    Back
                </Button>
            </Box>
        );
    }

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
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="h3" fontWeight={700} gutterBottom>
                                {isNew ? "Nueva Regla" : "Editar Regla"}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                {isNew ? "Crea una nueva regla de organización" : "Modifica la regla existente"}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="outlined"
                                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                                onClick={onBack}
                            >
                                {isNew ? "Cancelar" : "Volver"}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                                disabled={!canSave}
                                onClick={onSave}
                            >
                                {updateMutation.isPending || createMutation.isPending
                                    ? "Guardando..."
                                    : (isNew ? "Crear Regla" : "Guardar Cambios")}
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
            <Container maxWidth="xl" sx={{ pt: 3 }}>
                <Paper sx={{ p: 3, width: "100%" }}>
                    <Stack spacing={3}>
                        <TextField label="Name" value={form.name ?? ""} onChange={handleText("name")} autoFocus />
                        <TextField
                            label="Description"
                            value={form.description ?? ""}
                            onChange={handleText("description")}
                            multiline
                            minRows={2}
                        />
                        <TextField
                            label="Priority"
                            type="number"
                            value={Number(form.priority ?? 0)}
                            onChange={handleNumber("priority")}
                            slotProps={{ htmlInput: { min: 0 } }}
                        />
                        <FormControlLabel
                            control={<Switch checked={Boolean(form.enabled)} onChange={handleBool("enabled")} />}
                            label="Enabled"
                        />
                    </Stack>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                        Conditions
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                        {(form.conditions ?? []).map((c, idx) => (
                            <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="flex-start">
                                <FormControl sx={{ minWidth: 180 }}>
                                    <InputLabel id={`cond-type-${idx}`}>Type</InputLabel>
                                    <Select
                                        labelId={`cond-type-${idx}`}
                                        label="Type"
                                        value={c?.type ?? ""}
                                        onChange={(e) =>
                                            updateCondition(idx, { type: e.target.value as any, value: "" })
                                        }
                                    >
                                        {CONDITION_TYPES.map((t) => (
                                            <MenuItem key={t} value={t}>
                                                {t}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {c?.type === "Extension" ? (
                                    <FormControl sx={{ minWidth: 200, flex: 1 }}>
                                        <InputLabel id={`cond-value-${idx}`}>Extension</InputLabel>
                                        <Select
                                            labelId={`cond-value-${idx}`}
                                            label="Extension"
                                            value={c?.value ?? ""}
                                            onChange={(e) => updateCondition(idx, { value: e.target.value as string })}
                                        >
                                            {c?.value && !COMMON_EXTENSIONS.includes(c.value) && (
                                                <MenuItem value={c.value}>{c.value}</MenuItem>
                                            )}
                                            {COMMON_EXTENSIONS.map((ext) => (
                                                <MenuItem key={ext} value={ext}>
                                                    {ext}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        label="Value"
                                        value={c?.value ?? ""}
                                        onChange={(e) => updateCondition(idx, { value: e.target.value })}
                                        fullWidth
                                    />
                                )}

                                <IconButton aria-label="remove condition" onClick={() => removeCondition(idx)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        ))}
                        <Button startIcon={<AddIcon />} onClick={addCondition} variant="outlined" size="small" sx={{ alignSelf: "flex-start" }}>
                            Add condition
                        </Button>
                    </Stack>

                    <Typography variant="subtitle1" sx={{ mt: 3 }}>
                        Actions
                    </Typography>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                        {(form.actions ?? []).map((a, idx) => (
                            <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="flex-start">
                                <FormControl sx={{ minWidth: 180 }}>
                                    <InputLabel id={`act-type-${idx}`}>Type</InputLabel>
                                    <Select
                                        labelId={`act-type-${idx}`}
                                        label="Type"
                                        value={a?.type ?? ""}
                                        onChange={(e) => updateAction(idx, { type: e.target.value as any })}
                                    >
                                        {ACTION_TYPES.map((t) => (
                                            <MenuItem key={t} value={t}>
                                                {t}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {(() => {
                                    const showValidation = requiresPath(a?.type);
                                    const relativeCapable = showValidation && !!baseWatchFolder;
                                    const relative = relativeCapable && isActionRelative(a?.target);
                                    const subfolder = relative ? getSubfolderFromTarget(a?.target) : "";
                                    const fullForValidation = relative ? joinBaseAndSub(subfolder) : (a?.target ?? "");
                                    const errorMsg = showValidation ? getWindowsPathError(fullForValidation) : null;

                                    if (relative) {
                                        return (
                                            <TextField
                                                disabled={a?.type === ActionTypeDto.Delete}
                                                label="Subfolder (relative)"
                                                value={subfolder}
                                                onChange={(e) => {
                                                    const newFull = joinBaseAndSub(e.target.value);
                                                    updateAction(idx, { target: newFull });
                                                }}
                                                error={!!errorMsg}
                                                helperText={errorMsg ? errorMsg : `Full: ${fullForValidation}`}
                                                slotProps={{
                                                    formHelperText: { sx: { minHeight: 20, m: 0 } },
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start" sx={{ fontSize: 11, maxWidth: 200, textOverflow: "ellipsis" }}>
                                                                {baseWatchFolder}\
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                                fullWidth
                                            />
                                        );
                                    }

                                    return (
                                        <TextField
                                            disabled={a?.type === ActionTypeDto.Delete}
                                            label={showValidation ? "Target path (Windows)" : "Target"}
                                            value={a?.target ?? ""}
                                            onChange={(e) => updateAction(idx, { target: e.target.value })}
                                            error={!!errorMsg}
                                            helperText={
                                                errorMsg
                                                    ? errorMsg
                                                    : (relativeCapable
                                                        ? "Pulsa el icono de cadena para usar WatchFolder como base"
                                                        : " ")
                                            }
                                            slotProps={{ formHelperText: { sx: { minHeight: 20, m: 0 } } }}
                                            fullWidth
                                        />
                                    );
                                })()}
                                {(() => {
                                    const showValidation = requiresPath(a?.type);
                                    const relativeCapable = showValidation && !!baseWatchFolder;
                                    if (!showValidation) {
                                        return (
                                            <Tooltip title="Este tipo no requiere path">
                                                <span>
                                                    <IconButton size="small" disabled>
                                                        <LinkOffIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        );
                                    }
                                    if (!relativeCapable) {
                                        return (
                                            <Tooltip title="Configura WatchFolder en Settings para modo relativo">
                                                <span>
                                                    <IconButton size="small" disabled>
                                                        <LinkOffIcon fontSize="small" />
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        );
                                    }
                                    const relative = isActionRelative(a?.target);
                                    return (
                                        <Tooltip title={relative ? "Salir de modo relativo" : "Usar WatchFolder como base"}>
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    if (relative) {
                                                        // salir: si era solo la base, limpia; si tenía subcarpeta deja el valor completo
                                                        if (a?.target?.toLowerCase() === baseWatchFolderLower) {
                                                            updateAction(idx, { target: "" });
                                                        }
                                                    } else {
                                                        const current = a?.target ?? "";
                                                        if (!current.toLowerCase().startsWith(baseWatchFolderLower + "\\")) {
                                                            updateAction(idx, { target: baseWatchFolder });
                                                        }
                                                    }
                                                }}
                                                color={relative ? "primary" : "default"}
                                            >
                                                {relative ? <LinkIcon fontSize="small" /> : <LinkOffIcon fontSize="small" />}
                                            </IconButton>
                                        </Tooltip>
                                    );
                                })()}
                                <IconButton aria-label="remove action" onClick={() => removeAction(idx)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        ))}
                        {(form.actions?.length ?? 0) < MAX_ACTIONS ? (
                            <Button
                                startIcon={<AddIcon />}
                                onClick={addAction}
                                variant="outlined"
                                size="small"
                                sx={{ alignSelf: "flex-start" }}
                            >
                                Add action
                            </Button>
                        ) : (
                            <Typography variant="caption" color="text.secondary">
                                Solo se permite una acción por regla (Move / Copy / Delete / Rename).
                            </Typography>
                        )}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}