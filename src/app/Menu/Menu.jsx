import { Container, Typography, Grid } from '@mui/material';
import { People as UsersIcon } from '@mui/icons-material';
import MenuCard from './../components/Menu/Card.jsx';

const Menu = () => {
    // Opciones disponibles en el menú
    const menuItems = [
        {
            icon: UsersIcon,
            title: 'Usuarios',
            path: '/usuarios'
        },
    ];

    return (
        <Container sx={{ py: 2 }}>
            <Typography
                variant="h4"
                component="h1"
                align="left"
                sx={{
                    borderBottom: 1,
                    borderColor: 'black',
                    paddingBottom: 1,
                    width: '99%',
                    margin: '0 auto',
                    marginBottom: 4
                }}
            >
                Menú
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {menuItems.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <MenuCard {...item} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Menu;