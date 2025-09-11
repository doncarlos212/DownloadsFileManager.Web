
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { routes } from "../routes";

interface AddRuleButtonProps {
  disabled?: boolean;
}

export default function AddRuleButton({ disabled }: AddRuleButtonProps) {
  const navigate = useNavigate();

  return (
    <div>
      <Button variant="contained" onClick={() => navigate(routes.newRule.to())} disabled={disabled}>
        Add Rule
      </Button>
    </div>
  );
}
