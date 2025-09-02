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
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router";
import { routes } from "../routes";
import { ActionDto, ConditionDto, IRuleDto } from "../api/generated";
import { useRule, useUpdateRule } from "../hooks/useRules";

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const emptyRule = (): IRuleDto => ({
    id: "",
    name: "",
    description: "",
    priority: 0,
    enabled: false,
    // @ts-ignore opcionales en tu modelo
    conditions: [],
    // @ts-ignore
    actions: [],
});

const CONDITION_TYPES = ["Extension", "NameContains", "MimeType", "Regex"];
const ACTION_TYPES = ["Move", "Copy", "Delete", "Rename"];

// Extensiones comunes para el selector cuando el tipo es "Extension"
const COMMON_EXTENSIONS = [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".txt", ".csv", ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg",
    ".zip", ".rar", ".7z", ".mp3", ".wav", ".mp4", ".avi", ".mkv",
    ".exe", ".msi", ".iso", ".html", ".json", ".xml"
];

export default function EditRulePage() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const location = useLocation() as any;

    const stateRule: IRuleDto | undefined = location?.state?.rule;
    const { data: fetchedRule, isLoading, isError, error } = useRule((stateRule?.id ?? id) as string);
    const sourceRule = useMemo<IRuleDto | undefined>(() => stateRule ?? fetchedRule, [stateRule, fetchedRule]);

    const [form, setForm] = useState<IRuleDto>(emptyRule());
    const updateMutation = useUpdateRule();

    // Sincroniza el formulario con la regla cargada
    useEffect(() => {
        if (sourceRule) setForm(deepClone(sourceRule));
    }, [sourceRule, sourceRule?.id]);

    const handleText =
        (key: keyof IRuleDto) =>
            (e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, [key]: e.target.value as any }));

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
        setForm((prev) => ({
            ...prev,
            actions: [...(prev.actions ?? []), ({ type: ACTION_TYPES[0], target: "" } as ActionDto)],
        }));

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

    const canSave = (form.name ?? "").trim().length > 0 && !!form.id;

    const onCancel = () => navigate(routes.rules.to());
    const onSave = () => {
        updateMutation.mutate(deepClone(form));
    };

    if (isLoading && !sourceRule) {
        return (
            <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError && !sourceRule) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{(error as any)?.message ?? "Failed to load rule"}</Alert>
                <Button sx={{ mt: 2 }} onClick={onCancel}>
                    Back
                </Button>
            </Box>
        );
    }

    return (
        <Paper sx={{ p: 2, maxWidth: 900, m: "16px auto" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">Edit rule</Typography>
                <Stack direction="row" spacing={1}>
                    <Button color="inherit" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" disabled={!canSave || updateMutation.isPending} onClick={onSave}>
                        {updateMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                </Stack>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
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
                    <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
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
                                    {/* Si el valor actual no está en la lista, se muestra para evitar inconsistencia visual */}
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
                    <Stack key={idx} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
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
                        <TextField
                            label="Target"
                            value={a?.target ?? ""}
                            onChange={(e) => updateAction(idx, { target: e.target.value })}
                            fullWidth
                        />
                        <IconButton aria-label="remove action" onClick={() => removeAction(idx)}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                ))}
                <Button startIcon={<AddIcon />} onClick={addAction} variant="outlined" size="small" sx={{ alignSelf: "flex-start" }}>
                    Add action
                </Button>
            </Stack>
        </Paper>
    );
}