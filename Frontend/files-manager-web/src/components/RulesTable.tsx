import { Alert, AlertTitle, Box, Button, Chip, CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ActionDto, ConditionDto, IRuleDto } from "../api/generated";
import { useNavigate } from "react-router";
import { routes } from "../routes";
import { useQueryClient } from "@tanstack/react-query";

interface RulesTableProps {
    rules: IRuleDto[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
}

export default function RulesTable({ rules, isLoading, isError, error }: RulesTableProps) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const handleEdit = (row: IRuleDto) => {
        navigate(routes.editRule.to({ id: row.id! }));
    };

    const columns: GridColDef[] = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "description", headerName: "Description", flex: 2 },
        { field: "priority", headerName: "Priority", width: 100 },
        { field: "enabled", headerName: "Enabled", width: 100, type: "boolean" },
        {
            field: "conditions", headerName: "Conditions", width: 300, renderCell: (params) => (
                <div style={{ display: 'flex', overflowX: 'auto', gap: 4 }}>
                    {params.row.conditions.map((c: ConditionDto, index: number) => (
                        <Chip key={index} label={`${c.type}: ${c.value}`} size="small" />
                    ))}
                </div>
            )

        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <div>
                    {params.row.actions.map((a: ActionDto, index: number) => (
                        <Chip key={index} label={`${a.type} → ${a.target || ''}`} size="small" sx={{ mr: 0.5 }} />
                    ))}
                </div>
            )
        },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 100,
            renderCell: (params) => (
                <Button onClick={() => handleEdit(params.row)}>Edit</Button>
            )
        }
    ];

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>);

    if (isError) return (
        <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={() => queryClient.invalidateQueries({ queryKey: ["rules"] })}>
                Retry
            </Button>
        }>
            <AlertTitle>Error loading rules</AlertTitle>
            {(error as any)?.message ?? "Please try again."}
        </Alert>
    );

    console.log("Rendering RulesTable with rules:", rules);
    return (
        <>
            <DataGrid
                rows={rules ?? []}
                columns={columns}
                getRowId={(row: IRuleDto) => row.id as any}
            />
        </>
    );
}