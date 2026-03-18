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
    Card,
    CardContent,
} from "@mui/material";
import {
    Refresh,
    CheckCircle,
    FileCopy,
    DriveFileMove,
    Delete,
    Edit,
} from "@mui/icons-material";
import { useHistory, useHistoryStats } from "../hooks/useHistory";
import { useState } from "react";
import { HistoryRecordDto } from "../api/generated/models";

const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
        case "move":
            return <DriveFileMove fontSize="small" />;
        case "copy":
            return <FileCopy fontSize="small" />;
        case "delete":
            return <Delete fontSize="small" />;
        case "rename":
            return <Edit fontSize="small" />;
        default:
            return <DriveFileMove fontSize="small" />;
    }
};

const getActionColor = (action: string): "default" | "primary" | "secondary" | "error" | "warning" => {
    switch (action.toLowerCase()) {
        case "move":
            return "primary";
        case "copy":
            return "secondary";
        case "delete":
            return "error";
        case "rename":
            return "warning";
        default:
            return "default";
    }
};

const formatDate = (dateString?: Date | string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function HistoryPage() {
    const [selectedAction, setSelectedAction] = useState<string>("");
    const [count, setCount] = useState<number>(100);
    // const [currentPath, setCurrentPath] = useState<string>("");

    const { data: stats } = useHistoryStats();
    const { data: history, isLoading, error, refetch } = useHistory({
        count,
        actionType: selectedAction || undefined,
    });
    // const { data: filesData, isLoading: isLoadingFiles, error: filesError, refetch: refetchFiles } = useFiles(currentPath || undefined);

    const actionTypes = ["Move", "Copy", "Delete", "Rename"];

    // const handleFolderClick = (path: string) => {
    //     setCurrentPath(path);
    // };

    // const handleBreadcrumbClick = (path: string) => {
    //     setCurrentPath(path);
    // };

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
                                Historial de Archivos
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                Visualiza todos los archivos procesados por el sistema
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
                {/* Tabs - Temporarily disabled File Explorer until DirectoryContentsDto is available */}
                {/* <Paper sx={{ mb: 3 }}>
                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                        <Tab label="Historial de Operaciones" icon={<DriveFileMove />} iconPosition="start" />
                        <Tab label="Explorador de Archivos" icon={<FolderOpen />} iconPosition="start" />
                    </Tabs>
                </Paper> */}

                {/* Tab Content */}
                <Box>
                    {/* Stats Cards */}
                    {stats && (
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                            gap: 3,
                            mb: 3
                        }}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Total de Registros
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stats.total ?? 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Acciones por Tipo
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="primary">
                                        {stats.byAction?.length ?? 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Reglas Activas
                                    </Typography>
                                    <Typography variant="h4" fontWeight={700} color="success.main">
                                        {stats.byRule?.length ?? 0}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    )}

                    {/* Filters */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Tipo de Acción</InputLabel>
                                <Select
                                    value={selectedAction}
                                    onChange={(e) => setSelectedAction(e.target.value)}
                                    label="Tipo de Acción"
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {actionTypes.map((action) => (
                                        <MenuItem key={action} value={action}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {getActionIcon(action)}
                                                <span>{action}</span>
                                            </Stack>
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
                            Error al cargar el historial. Por favor, intenta nuevamente.
                        </Alert>
                    )}

                    {isLoading ? (
                        <Paper sx={{ p: 6, textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography sx={{ mt: 2 }}>Cargando historial...</Typography>
                        </Paper>
                    ) : history && history.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, width: '50px' }}>Estado</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: '120px' }}>Acción</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: '200px' }}>Archivo</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Desde</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Hasta</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: '150px' }}>Regla</TableCell>
                                        <TableCell sx={{ fontWeight: 700, width: '150px' }}>Fecha</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((item: HistoryRecordDto, index: number) => (
                                        <TableRow
                                            key={item.id || index}
                                            sx={{
                                                '&:hover': { bgcolor: 'action.hover' },
                                            }}
                                        >
                                            <TableCell>
                                                <Tooltip title={item.message || "Exitoso"}>
                                                    <span>
                                                        <CheckCircle color="success" fontSize="small" />
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getActionIcon(item.actionType || '')}
                                                    label={item.actionType}
                                                    color={getActionColor(item.actionType || '')}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 500,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: 200,
                                                    }}
                                                >
                                                    <Tooltip title={item.fileName || ''}>
                                                        <span>{item.fileName || '-'}</span>
                                                    </Tooltip>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.75rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: 300,
                                                    }}
                                                >
                                                    <Tooltip title={item.from || '-'}>
                                                        <span>{item.from || '-'}</span>
                                                    </Tooltip>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontFamily: 'monospace',
                                                        fontSize: '0.75rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: 300,
                                                    }}
                                                >
                                                    <Tooltip title={item.to || '-'}>
                                                        <span>{item.to || '-'}</span>
                                                    </Tooltip>
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={item.ruleName}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                {formatDate(item.timestamp) || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Paper sx={{ p: 6, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No hay registros en el historial
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Los archivos procesados aparecerán aquí.
                            </Typography>
                        </Paper>
                    )}
                </Box>
                {/* File Explorer tab temporarily removed until DirectoryContentsDto is available */}
            </Container>
        </Box>
    );
}
