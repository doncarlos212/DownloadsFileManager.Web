import { Card, CardContent, Typography, Stack, Chip, Divider, Tooltip, Button, Grid } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router";
import { routes } from "../routes";
import AddRuleButton from "../components/AddRuleButton";

function statusIsActive(status: any, enabledFallback?: boolean) {
    if (typeof status === "boolean") return status;
    if (typeof status === "number") return status === 1;
    if (status == null && typeof enabledFallback === "boolean") return enabledFallback;
    return String(status).toLowerCase() === "active";
}

function formatDate(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

const PRIORITY_COLOR: Record<string, "default" | "success" | "warning" | "error"> = {
    low: "default",
    medium: "warning",
    high: "error",
};

export default function DashboardPage() {
    const { data, isLoading, error } = useDashboard();
    const navigate = useNavigate();

    if (isLoading) return <Typography sx={{ p: 3 }}>Cargando...</Typography>;
    if (error) return <Typography sx={{ p: 3 }}>Error al cargar dashboard</Typography>;

    const stats = data?.ruleStats;
    const latest = (data?.latestRules ?? []).slice(0, 8);

    return (
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} p={3}>
            <Grid size={12}>
                <Typography variant="h4" gutterBottom>Dashboard</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Resumen rápido de tus reglas
                </Typography>
            </Grid>

            {/* KPIs */}
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card><CardContent>
                    <Typography variant="subtitle2" color="text.secondary">Total reglas</Typography>
                    <Typography variant="h4">{stats?.total ?? 0}</Typography>
                </CardContent></Card>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card><CardContent>
                    <Typography variant="subtitle2" color="text.secondary">Activas</Typography>
                    <Typography variant="h4" color="success.main">{stats?.active ?? 0}</Typography>
                </CardContent></Card>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card><CardContent>
                    <Typography variant="subtitle2" color="text.secondary">Inactivas</Typography>
                    <Typography variant="h4" color="warning.main">{stats?.inactive ?? 0}</Typography>
                </CardContent></Card>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card><CardContent>
                    <Typography variant="subtitle2" color="text.secondary">Acciones hoy</Typography>
                    <Typography variant="h4">{stats?.actionsToday ?? 0}</Typography>
                </CardContent></Card>
            </Grid>

            {/* Últimas reglas */}
            <Grid size={{ xs: 4, sm: 8, md: 12 }}>
                <Card>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6">Últimas reglas</Typography>
                            <Button size="small" onClick={() => navigate(routes.rules.path)}>Ver todas</Button>
                        </Stack>
                        {latest.length === 0 && (
                            <Typography variant="body2" color="text.secondary">Sin reglas recientes</Typography>
                        )}
                        <Stack divider={<Divider flexItem />} spacing={1}>
                            {latest.map(r => {
                                const active = statusIsActive((r as any).status, (r as any).enabled);
                                const priority = ((r as any).priority ?? "").toString();
                                const colorKey = priority.toLowerCase();
                                const chipColor = PRIORITY_COLOR[colorKey] ?? "default";
                                return (
                                    <Stack key={r.id} direction="row" spacing={1} alignItems="center">
                                        <Tooltip title={active ? "Activa" : "Inactiva"}>
                                            <span>
                                                {active ? <CheckCircle fontSize="small" color="success" /> : <Cancel fontSize="small" color="disabled" />}
                                            </span>
                                        </Tooltip>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 600, flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                        >
                                            {r.name}
                                        </Typography>
                                        {priority && (
                                            <Chip
                                                label={priority}
                                                size="small"
                                                color={chipColor}
                                                variant={chipColor === "default" ? "outlined" : "filled"}
                                            />
                                        )}
                                        <Typography variant="caption" color="text.secondary">
                                            {formatDate((r as any).createdAtUtc)}
                                        </Typography>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>

            {/* Botón crear regla */}
            <Grid size={12} display="flex" justifyContent="center">
                <AddRuleButton />
            </Grid>
        </Grid>
    );
}
