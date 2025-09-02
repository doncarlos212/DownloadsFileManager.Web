import { Container, Stack, Typography } from "@mui/material";
import AddRuleButton from "../components/AddRuleButton";
import RulesTable from "../components/RulesTable";
import { useRules } from "../hooks/useRules";

export default function RulesPage() {
  const { data: rules, isLoading, isError, error } = useRules();
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Rules Manager
      </Typography>
      <Stack spacing={2}>
        <AddRuleButton isError={isError} />
        <RulesTable rules={rules} isLoading={isLoading} isError={isError} error={error} />
      </Stack>
    </Container>
  );
}
