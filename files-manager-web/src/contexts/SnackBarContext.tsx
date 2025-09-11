import { Alert, Snackbar, AlertColor } from "@mui/material";
import React from "react";
import { createContext, useContext } from "react";

type SnackBarContextActions = {
    showSnackBar: (text: string, typeColor: AlertColor) => void;
};

const SnackBarContext = createContext({} as SnackBarContextActions);

interface SnackBarProviderProps {
    children: React.ReactNode;
}

export function SnackBarProvider({ children }: SnackBarProviderProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [typeColor, setTypeColor] = React.useState<AlertColor>('info');

    const showSnackBar = (text: string, color: AlertColor) => {
        setMessage(text);
        setTypeColor(color);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTypeColor('info');
    };

    return (
        <SnackBarContext.Provider value={{ showSnackBar }}>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity={typeColor}>
                    {message}
                </Alert>
            </Snackbar>
            {children}
        </SnackBarContext.Provider>
    );
}

export function useSnackBar() {
    const context = useContext(SnackBarContext);

    if (!context) {
        throw new Error('useSnackBar must be used within an SnackBarProvider');
    }

    return context;
}



