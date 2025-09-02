import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import AddRuleButton from "../components/AddRuleButton";

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

const latestRules = [
    { name: "Regla 1", status: "Activa", priority: "Alta" },
    { name: "Regla 2", status: "Inactiva", priority: "Baja" },
    { name: "Regla 3", status: "Activa", priority: "Media" },
];

const latestActions = [
    { time: "10:30", action: "Mover archivo", result: "✅" },
    { time: "09:10", action: "Renombrar archivo", result: "❌" },
    { time: "08:45", action: "Eliminar archivo", result: "✅" },
];

export default function DashboardPage() {
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
                        <Typography variant="h4">{stats.total}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Reglas activas</Typography>
                        <Typography variant="h4">{stats.active}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid size={{ xs: 2, sm: 4, md: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Reglas inactivas</Typography>
                        <Typography variant="h4">{stats.inactive}</Typography>
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
                            <Tooltip />
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
                            <Tooltip />
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
                        <Typography variant="h6">Últimas reglas</Typography>
                        {latestRules.map((rule, i) => (
                            <Typography key={i}>
                                {rule.name} - {rule.status} ({rule.priority})
                            </Typography>
                        ))}
                        <Button size="small" sx={{ mt: 1 }}>Ver todas</Button>
                    </CardContent>
                </Card>
            </Grid>

            {/* Latest Actions */}
            <Grid size={{ xs: 4, md: 6 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Últimas acciones</Typography>
                        {latestActions.map((a, i) => (
                            <Typography key={i}>
                                [{a.time}] {a.action} {a.result}
                            </Typography>
                        ))}
                        <Button size="small" sx={{ mt: 1 }}>Ver historial</Button>
                    </CardContent>
                </Card>
            </Grid>

            {/* Create Rule Button */}
            <Grid size={12} display="flex" justifyContent="center">
                <AddRuleButton isError={false} />
            </Grid>
        </Grid>
    );
}
