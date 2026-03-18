import { Alert, AlertTitle, Box, Button, Chip, CircularProgress, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ActionDto, ConditionDto, IRuleDto } from "../api/generated";
import { useQueryClient } from "@tanstack/react-query";

interface RulesTableProps {
    rules: IRuleDto[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    onEdit: (row: IRuleDto) => void;
    onDelete: (row: IRuleDto) => void;
}

const truncate = (v: string | undefined, max = 30) =>
    !v ? "" : v.length <= max ? v : v.slice(0, max - 1) + "…";

const conditionColor = (type: string) => {
    switch (type.toLowerCase()) {
        case "extension":
            return "primary";
        case "namecontains":
            return "secondary";
        case "mimetype":
            return "info";
        case "regex":
            return "warning";
        default:
            return "default";
    }
};

const actionColor = (type: string) => {
    switch (type.toLowerCase()) {
        case "move":
            return "primary";
        case "copy":
            return "info";
        case "delete":
            return "error";
        case "rename":
            return "warning";
        default:
            return "default";
    }
};

// --- estilos compactos ---
const compactChipSx = {
    height: 22,
    borderRadius: 1.5,
    fontWeight: 500,
    '& .MuiChip-label': {
        px: 0.75,
        py: 0,
        lineHeight: '18px',
        fontSize: '0.70rem',
        letterSpacing: .15,
    }
};

export default function RulesTable({ rules, isLoading, isError, error, onEdit, onDelete }: RulesTableProps) {
    const queryClient = useQueryClient();

    // Filtrar reglas que no tengan id válido
    const validRules = Array.isArray(rules) ? rules.filter(r => r.id != null && r.id !== "") : [];

    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", flex: 1, minWidth: 140 },
        { field: "description", headerName: "Description", flex: 1.5, minWidth: 180 },
        { field: "priority", headerName: "Priority", width: 80 },
        {
            field: "enabled",
            headerName: "Enabled",
            width: 90,
            type: "boolean",
            renderCell: (p) => (
                <Chip
                    size="small"
                    label={p.row.enabled ? "Yes" : "No"}
                    color={p.row.enabled ? "success" : "default"}
                    variant={p.row.enabled ? "filled" : "outlined"}
                    sx={compactChipSx}
                />
            ),
        },
        {
            field: "conditions",
            headerName: "Conditions",
            flex: 2,
            minWidth: 220,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        width: "100%",
                        alignItems: "center",
                        py: 0,
                    }}
                >
                    {params.row.conditions?.map((c: ConditionDto, i: number) => {
                        const label = `${c.type}: ${truncate(c.value, 16)}`;
                        return (
                            <Tooltip key={i} title={`${c.type}: ${c.value}`}>
                                <Chip
                                    size="small"
                                    label={label}
                                    color={conditionColor(c.type ?? "") as any}
                                    variant="outlined"
                                    sx={{
                                        ...compactChipSx,
                                        maxWidth: 110,
                                        '& .MuiChip-label': {
                                            ...compactChipSx['& .MuiChip-label'],
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }
                                    }}
                                />
                            </Tooltip>
                        );
                    })}
                </Box>
            ),
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 1.4,
            minWidth: 200,
            renderCell: (params) => (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        width: "100%",
                        alignItems: "center",
                        py: 0,
                    }}
                >
                    {params.row.actions?.map((a: ActionDto, i: number) => {
                        const path = a.target ? truncate(a.target, 20) : "";
                        const label = a.target ? `${a.type} → ${path}` : a.type;
                        return (
                            <Tooltip key={i} title={a.target ? `${a.type} → ${a.target}` : a.type}>
                                <Chip
                                    size="small"
                                    label={label}
                                    color={actionColor(a.type ?? "") as any}
                                    variant="filled"
                                    sx={{
                                        ...compactChipSx,
                                        maxWidth: 170,
                                        '& .MuiChip-label': {
                                            ...compactChipSx['& .MuiChip-label'],
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }
                                    }}
                                />
                            </Tooltip>
                        );
                    })}
                </Box>
            ),
        },
        {
            field: "edit",
            headerName: "Edit",
            width: 90,
            sortable: false,
            renderCell: (params) => (
                <Button size="small" onClick={() => onEdit(params.row)}>
                    EDIT
                </Button>
            ),
        },
        {
            field: "delete",
            headerName: "Delete",
            width: 90,
            sortable: false,
            renderCell: (params) => (
                <Button size="small" color="error" onClick={() => onDelete(params.row)}>
                    DELETE
                </Button>
            ),
        },
    ];

    if (isLoading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Box>
        );

    if (isError)
        return (
            <Alert
                severity="error"
                action={
                    <Button
                        color="inherit"
                        size="small"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["rules"] })}
                    >
                        Retry
                    </Button>
                }
            >
                <AlertTitle>Error loading rules</AlertTitle>
                {(error as any)?.message ?? "Please try again."}
            </Alert>
        );

    return (
        <DataGrid
            rows={validRules}
            columns={columns}
            getRowId={(row: IRuleDto) => row.id as any}
            disableRowSelectionOnClick
            rowHeight={38}
            sx={{
                '& .MuiDataGrid-columnHeaders': {
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    minHeight: 40,
                },
                '& .MuiDataGrid-cell': {
                    py: 0,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                },
                '& .MuiDataGrid-virtualScrollerRenderZone': {
                    '& .MuiDataGrid-row': {
                        maxHeight: 38,
                    }
                },
                '& .MuiDataGrid-row': {
                    '&:hover': { backgroundColor: 'action.hover' },
                },
            }}
        />
    );
}