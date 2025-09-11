import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

type Props = {
    open: boolean;
    title: string;
    description?: string;
    loading?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
};

export default function ConfirmationDialog({
    open,
    title,
    description,
    loading,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onClose,
}: Props) {
    return (
        <Dialog open={open} onClose={loading ? undefined : onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {description ? <Typography sx={{ mt: 1 }}>{description}</Typography> : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={!!loading}>
                    {cancelText}
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={!!loading}>
                    {loading ? "Deleting..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}