import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Stack,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useLogs, useLogLevels } from "../hooks/useLogs";
import { useState } from "react";

const getLevelColor = (level: string): "default" | "info" | "warning" | "error" | "success" => {
    switch (level) {
        case "Error":
        case "Fatal":
            return "error";
        case "Warning":
            return "warning";
        case "Information":
            return "info";
        case "Debug":
        case "Verbose":
            return "default";
        default:
            return "default";
    }
};

export default function LogsPage() {
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [count, setCount] = useState<number>(100);

    const { data: levels } = useLogLevels();
    const { data: logs, isLoading, error, refetch } = useLogs({
        count,
        level: selectedLevel || undefined,
    });

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
                                Registros del Sistema
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Monitorea los eventos y errores del sistema
                            </Typography>
                        </Box>
                        <Tooltip title="Actualizar">
                            <IconButton
                                onClick={() => refetch()}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                                }}
                            >
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ pt: 3, pb: 4 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Nivel de Log</InputLabel>
                            <Select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                label="Nivel de Log"
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {levels?.map((level) => (
                                    <MenuItem key={level} value={level}>
                                        {level}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Cantidad de registros"
                            type="number"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            inputProps={{ min: 10, max: 1000, step: 10 }}
                            sx={{ minWidth: 200 }}
                        />
                    </Stack>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Error al cargar los registros. Por favor, intenta nuevamente.
                    </Alert>
                )}

                {isLoading ? (
                    <Paper sx={{ p: 6, textAlign: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Cargando registros...</Typography>
                    </Paper>
                ) : logs && logs.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, width: '180px' }}>
                                        Fecha y Hora
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, width: '120px' }}>
                                        Nivel
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>
                                        Mensaje
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:hover': { bgcolor: 'action.hover' },
                                            bgcolor: log.exception ? 'error.light' : 'inherit',
                                        }}
                                    >
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={log.level}
                                                color={getLevelColor(log.level || '')}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {log.message}
                                            </Typography>
                                            {log.exception && (
                                                <Typography
                                                    variant="caption"
                                                    color="error"
                                                    sx={{
                                                        display: 'block',
                                                        mt: 1,
                                                        fontFamily: 'monospace',
                                                        bgcolor: 'error.light',
                                                        p: 1,
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    {log.exception}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Paper sx={{ p: 6, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            No hay registros disponibles
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Los registros aparecerán aquí cuando el sistema genere eventos.
                        </Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
}
