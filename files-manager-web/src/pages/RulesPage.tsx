import { Box, Container, Stack, Typography, Paper } from "@mui/material";
import AddRuleButton from "../components/AddRuleButton";
import RulesTable from "../components/RulesTable";
import { useDeleteRule, useRules } from "../hooks/useRules";
import { IRuleDto } from "../api/generated";
import { routes } from "../routes";
import { useNavigate } from "react-router";
import { useState } from "react";
import ConfirmationDialog from "../components/DialogConfirmation";
import { useQueryClient } from "@tanstack/react-query";

export default function RulesPage() {
  const navigate = useNavigate();
  const { data: rules, isLoading, isError, error, refetch } = useRules();
  const deleteMutation = useDeleteRule();
  const [rowToDelete, setRowToDelete] = useState<IRuleDto | null>(null);
  const qc = useQueryClient();

  const onEdit = (row: IRuleDto) => {
    navigate(routes.editRule.to({ id: row.id! }));
  };

  const onDelete = (row: IRuleDto) => {
    setRowToDelete(row);
  };

  const closeConfirm = () => setRowToDelete(null);
  const confirmDelete = () => {
    if (!rowToDelete?.id) return;
    deleteMutation.mutate(rowToDelete.id, {
      onSuccess: () => {
        qc.setQueryData<IRuleDto[]>(["rules"], (prev) =>
          (prev ?? []).filter((r) => r.id !== rowToDelete.id)
        );
        setRowToDelete(null);
        refetch();
      },
    });
  };

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
                Gestor de Reglas
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Administra las reglas de organización de archivos
              </Typography>
            </Box>
            <AddRuleButton disabled={isError || isLoading} />
          </Stack>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ pt: 3 }}>
        <Paper sx={{ p: 3 }}>
          <RulesTable
            rules={rules}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <ConfirmationDialog
            open={!!rowToDelete}
            title="Delete rule"
            description={
              rowToDelete
                ? `Are you sure you want to delete "${rowToDelete.name}"?`
                : ""
            }
            loading={deleteMutation.isPending}
            confirmText="Delete"
            onConfirm={confirmDelete}
            onClose={closeConfirm}
          />
        </Paper>
      </Container>
    </Box>
  );
}
