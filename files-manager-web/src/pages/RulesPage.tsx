import { Box, Container, Stack, Typography } from "@mui/material";
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
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Rules Manager
      </Typography>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <AddRuleButton disabled={isError || isLoading} />
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
        </Stack>
      </Box>
    </Container>
  );
}
