import { Grid, Card, CardContent, Typography, Button, Chip, Stack, Tooltip, Divider } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import AddRuleButton from "../components/AddRuleButton";
import { useDashboard } from "../hooks/useDashboard";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { routes } from "../routes";

// Mock data
const stats = {
    total: 25,
    active: 18,
    inactive: 7,
    actionsToday: 12,
};

const pieData = [
    { name: "Activas", value: stats.active },
    { name: "Inactivas", value: stats.inactive },
];

const COLORS = ["#0088FE", "#FF8042"];

const actionsHistory = [
    { day: "Lun", actions: 4 },
    { day: "Mar", actions: 7 },
    { day: "Mié", actions: 2 },
    { day: "Jue", actions: 6 },
    { day: "Vie", actions: 3 },
];

const latestActions = [
    { time: "10:30", action: "Mover archivo", result: "✅" },
    { time: "09:10", action: "Renombrar archivo", result: "❌" },
    { time: "08:45", action: "Eliminar archivo", result: "✅" },
];

// Helpers de formato (simple, sin libs extra)
function formatDate(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

function statusIsActive(status: any, enabledFallback?: boolean) {
    if (typeof status === "boolean") return status;
    if (typeof status === "number") return status === 1;
    if (status == null && typeof enabledFallback === "boolean") return enabledFallback;
    return String(status).toLowerCase() === "active";
}

const PRIORITY_COLOR: Record<string, "default" | "success" | "warning" | "error"> = {
    low: "default",
    medium: "warning",
    high: "error",
};

export default function DashboardPage() {
    const { data, isLoading, error } = useDashboard();
    const navigate = useNavigate();

    if (isLoading) return <Typography>Cargando...</Typography>;
    if (error) return <Typography>Error al cargar datos</Typography>;

    return (
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} p={3}>
            {/* Header */}
            <Grid size={12}>
                <Typography variant="h4" gutterBottom>Dashboard</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Resumen de tu gestor de reglas y acciones
                </Typography>
            </Grid>

            {/* KPI Cards */}
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total reglas</Typography>
                        <Typography variant="h4">{data?.ruleStats?.total}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Reglas activas</Typography>
                        <Typography variant="h4">{data?.ruleStats?.active}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Reglas inactivas</Typography>
                        <Typography variant="h4">{data?.ruleStats?.inactive}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Acciones hoy</Typography>
                        <Typography variant="h4">{stats.actionsToday}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Charts */}
            <Grid size={{ xs: 4, sm: 8, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Estado de reglas</Typography>
                        <PieChart width={300} height={250}>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                        </PieChart>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 4, sm: 8, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Acciones esta semana</Typography>
                        <BarChart width={350} height={250} data={actionsHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="actions" fill="#82ca9d" />
                        </BarChart>
                    </CardContent>
                </Card>
            </Grid>

            {/* Latest Rules */}
            <Grid size={{ xs: 4, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Últimas reglas</Typography>
                        {!data?.latestRules?.length && (
                            <Typography variant="body2" color="text.secondary">Sin reglas recientes</Typography>
                        )}
                        <Stack divider={<Divider flexItem />} spacing={1}>
                            {(data?.latestRules ?? []).slice(0, 5).map(r => {
                                const active = statusIsActive((r as any).status, (r as any).enabled);
                                const priority = ((r as any).priority ?? "").toString();
                                const pKey = priority.toLowerCase();
                                const chipColor = PRIORITY_COLOR[pKey] ?? "default";
                                return (
                                    <Stack key={r.id} direction="row" spacing={1} alignItems="center">
                                        <Tooltip title={active ? "Activa" : "Inactiva"}>
                                            <span>
                                                {active ? (
                                                    <CheckCircle fontSize="small" color="success" />
                                                ) : (
                                                    <Cancel fontSize="small" color="disabled" />
                                                )}
                                            </span>
                                        </Tooltip>
                                        <Typography variant="body2" sx={{ fontWeight: 600, flexGrow: 1, minWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                        <Button size="small" sx={{ mt: 1 }} onClick={() => navigate(routes.rules.path)}>Ver todas</Button>
                    </CardContent>
                </Card>
            </Grid>

            {/* Latest Actions */}
            <Grid size={{ xs: 4, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Últimas acciones</Typography>
                        {(data?.latestActions ?? latestActions).slice(0, 6).map((a: any, i: number) => (
                            <Typography key={i} variant="body2">
                                [{formatDate(a.startedAtUtc) || a.time}] {a.actionType || a.action} - {a.ruleName || ""} {a.result === "Success" || a.result === "✅" ? "✅" : "❌"}
                            </Typography>
                        ))}
                        <Button size="small" sx={{ mt: 1 }}>Ver historial</Button>
                    </CardContent>
                </Card>
            </Grid>

            {/* Create Rule Button */}
            <Grid size={12} display="flex" justifyContent="center">
                <AddRuleButton disabled={false} />
            </Grid>
        </Grid>
    );
}
