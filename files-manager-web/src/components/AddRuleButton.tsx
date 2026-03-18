import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { routes } from "../routes";

interface AddRuleButtonProps {
  disabled?: boolean;
}

export default function AddRuleButton({ disabled }: AddRuleButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => navigate(routes.newRule.to())}
      disabled={disabled}
      sx={{
        bgcolor: 'white',
        color: 'primary.main',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
        fontWeight: 600
      }}
    >
      Nueva Regla
    </Button>
  );
}
