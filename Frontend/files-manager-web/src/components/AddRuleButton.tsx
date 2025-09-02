
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { routes } from "../routes";

interface AddRuleButtonProps {
  isError: boolean;
}

export default function AddRuleButton({ isError }: AddRuleButtonProps) {
  const navigate = useNavigate();

  if (isError) { <></> }

  return (
    <div>
      <Button variant="contained" onClick={() => navigate(routes.newRule.to())}>
        Add Rule
      </Button>
    </div>
  );
}
