import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    Paper,
    Chip,
} from '@mui/material';
import {
    Download,
    FolderSpecial,
    AutoAwesome,
    Settings,
    CloudDownload,
    Speed,
    Dashboard,
} from '@mui/icons-material';
import { routes } from '../routes';
import { Link as RouterLink } from 'react-router';

const DOWNLOAD_URL = 'https://github.com/doncarlos212/DownloadsFileManager.Service/releases/latest/download/ProjectSetup.msi';

const LandingPage: React.FC = () => {
    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: { xs: 8, md: 12 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 4,
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{ flex: { md: '1 1 58%' } }}>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                                }}
                            >
                                Downloads File Manager
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 4,
                                    opacity: 0.95,
                                    fontWeight: 300,
                                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                                }}
                            >
                                Organiza automáticamente tus descargas con reglas personalizadas.
                                Mantén tu carpeta de descargas limpia y ordenada sin esfuerzo.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<Download />}
                                    href={DOWNLOAD_URL}
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            bgcolor: 'grey.100',
                                            transform: 'scale(1.05)',
                                        },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    Descargar Ahora
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    component={RouterLink}
                                    to={routes.dashboard.to()}
                                    startIcon={<Dashboard />}
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    Ir al Dashboard
                                </Button>
                            </Stack>
                            <Box sx={{ mt: 3 }}>
                                <Chip
                                    label="Windows"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        mr: 1,
                                        fontWeight: 500,
                                    }}
                                />
                                <Chip
                                    label="Instalador MSI"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        mr: 1,
                                        fontWeight: 500,
                                    }}
                                />
                                <Chip
                                    label="Gratis"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: 500,
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ flex: { md: '1 1 42%' }, textAlign: 'center' }}>
                            <CloudDownload
                                sx={{
                                    fontSize: { xs: 150, md: 250 },
                                    opacity: 0.9,
                                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 6 }}
                >
                    Características Principales
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(4, 1fr)',
                        },
                        gap: 4,
                    }}
                >
                    <Card
                        sx={{
                            height: '100%',
                            textAlign: 'center',
                            transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <AutoAwesome
                                sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                Organización Automática
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Mueve archivos automáticamente según reglas personalizadas
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card
                        sx={{
                            height: '100%',
                            textAlign: 'center',
                            transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <FolderSpecial
                                sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                Reglas Flexibles
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Crea reglas basadas en extensiones, nombres y patrones
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card
                        sx={{
                            height: '100%',
                            textAlign: 'center',
                            transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Speed sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                Rápido y Ligero
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Servicio en segundo plano de bajo consumo
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card
                        sx={{
                            height: '100%',
                            textAlign: 'center',
                            transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: 6,
                            },
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Settings sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                Fácil Configuración
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Interfaz web intuitiva para gestionar tus reglas
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Container>

            {/* Installation Section */}
            <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
                <Container maxWidth="md">
                    <Typography
                        variant="h3"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 700, mb: 4 }}
                    >
                        Instalación Simple
                    </Typography>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Stack spacing={3}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        mr: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    1
                                </Box>
                                <Box>
                                    <Typography variant="h6" gutterBottom fontWeight={600}>
                                        Descarga el instalador
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Haz clic en el botón de descarga para obtener el instalador MSI
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        mr: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    2
                                </Box>
                                <Box>
                                    <Typography variant="h6" gutterBottom fontWeight={600}>
                                        Ejecuta el instalador
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Abre el archivo ProjectSetup.msi y sigue las instrucciones del asistente
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Box
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        mr: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    3
                                </Box>
                                <Box>
                                    <Typography variant="h6" gutterBottom fontWeight={600}>
                                        ¡Listo para usar!
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        El servicio se instalará como un servicio de Windows y comenzará a funcionar automáticamente
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Download />}
                                href={DOWNLOAD_URL}
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                }}
                            >
                                Descargar ProjectSetup.msi
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            {/* CTA Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 4,
                    }}
                >
                    <Typography variant="h4" gutterBottom fontWeight={700}>
                        ¿Listo para organizar tus descargas?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Descarga ahora y empieza a disfrutar de una carpeta de descargas siempre ordenada
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Download />}
                        href={DOWNLOAD_URL}
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            px: 5,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: 'grey.100',
                            },
                        }}
                    >
                        Descargar Gratis
                    </Button>
                </Paper>
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    bgcolor: 'grey.900',
                    color: 'white',
                    py: 4,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>
                        Downloads File Manager Service © {new Date().getFullYear()}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                        Sistema de gestión de archivos descargados
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default LandingPage;
