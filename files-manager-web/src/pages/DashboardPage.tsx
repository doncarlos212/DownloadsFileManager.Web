import { Box, Card, CardContent, Typography, Stack, Chip, Divider, Tooltip, Button, Grid, Container, Paper } from "@mui/material";
import { CheckCircle, Cancel, FolderSpecial, FolderOff, TrendingUp } from "@mui/icons-material";
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
                        Dashboard
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Vista general de tu sistema de gestión de archivos
                    </Typography>
                </Container>
            </Box>
            <Container maxWidth="xl" sx={{ pt: 3 }}>
                <Grid container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>

                    {/* KPIs */}
                    <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Total reglas
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700}>
                                            {stats?.total ?? 0}
                                        </Typography>
                                    </Box>
                                    <FolderSpecial sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Activas
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700} color="success.main">
                                            {stats?.active ?? 0}
                                        </Typography>
                                    </Box>
                                    <CheckCircle sx={{ fontSize: 40, color: 'success.main', opacity: 0.3 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Inactivas
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700} color="warning.main">
                                            {stats?.inactive ?? 0}
                                        </Typography>
                                    </Box>
                                    <FolderOff sx={{ fontSize: 40, color: 'warning.main', opacity: 0.3 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                        <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Acciones hoy
                                        </Typography>
                                        <Typography variant="h3" fontWeight={700}>
                                            {stats?.actionsToday ?? 0}
                                        </Typography>
                                    </Box>
                                    <TrendingUp sx={{ fontSize: 40, color: 'primary.main', opacity: 0.3 }} />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Últimas reglas */}
                    <Grid size={{ xs: 4, sm: 8, md: 12 }}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h5" fontWeight={600}>Últimas reglas</Typography>
                                    <Button variant="outlined" size="small" onClick={() => navigate(routes.rules.path)}>
                                        Ver todas
                                    </Button>
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
                </Grid>
            </Container>
        </Box>
    );
}
