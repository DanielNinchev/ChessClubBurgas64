import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0D6E8A',
            light: '#3A9AB5',
            dark: '#094D61',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#1BA3C6',
            light: '#4DB8D4',
            dark: '#12728A',
            contrastText: '#FFFFFF',
        },
        background: {
            default: 'transparent',
            paper: 'rgba(255, 255, 255, 0.92)',
        },
        text: {
            primary: '#1A2A3A',
            secondary: '#546E7A',
        },
    },
    typography: {
        fontFamily: '"Simbal", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;