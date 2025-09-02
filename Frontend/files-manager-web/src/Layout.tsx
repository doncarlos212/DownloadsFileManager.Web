import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { routes } from './routes';
import { Link as RouterLink } from 'react-router';
import BreadcrumbsNav from './components/BreadcrumbsNav';

function Layout() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h4"
                        noWrap
                        component={RouterLink}
                        to={routes.home.path}
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            '&[aria-current="page"]': {
                                bgcolor: 'action.selected',
                                color: 'secondary.main',
                            },
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            <MenuItem key={routes.rules.path} component={RouterLink} to={routes.rules.path}>
                                <Typography variant='h4' sx={{ textAlign: 'center' }}>Rules</Typography>
                            </MenuItem>
                            <MenuItem key={routes.settings.path} component={RouterLink} to={routes.settings.path}>
                                <Typography variant='h4' sx={{ textAlign: 'center' }}>Settings</Typography>
                            </MenuItem>
                            <MenuItem key={routes.logs.path} component={RouterLink} to={routes.logs.path}>
                                <Typography variant='h4' sx={{ textAlign: 'center' }}>Logs</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h4"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            key={routes.rules.path}
                            component={RouterLink}
                            to={routes.rules.path}
                            sx={{
                                my: 2, color: 'white', display: 'block', '&[aria-current="page"]': {
                                    bgcolor: 'action.selected',
                                    color: 'primary.main',
                                },
                            }}
                        >
                            Rules
                        </Button>
                        <Button
                            key={routes.settings.path}
                            component={RouterLink}
                            to={routes.settings.path}
                            sx={{
                                my: 2, color: 'white', display: 'block', '&[aria-current="page"]': {
                                    bgcolor: 'action.selected',
                                    color: 'primary.main',
                                },
                            }}
                        >
                            Settings
                        </Button>
                        <Button
                            key={routes.logs.path}
                            component={RouterLink}
                            to={routes.logs.path}
                            sx={{
                                my: 2, color: 'white', display: 'block', '&[aria-current="page"]': {
                                    bgcolor: 'action.selected',
                                    color: 'primary.main',
                                },
                            }}
                        >
                            Logs
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Layout;
