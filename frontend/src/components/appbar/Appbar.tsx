import React, { useState } from 'react';
import { AppBar, Drawer, IconButton, List, ListItemButton, ListItemText, Toolbar, styled } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useApp } from 'hooks/app';
import { horizon } from 'config/theme';

const Brand = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  '& > img': {
    height: 30,
    width: 30,
  },
  '& > span': {
    color: '#fff',
    fontWeight: 700,
    letterSpacing: 3,
    fontSize: 16,
  },
});

const Navigation = styled('nav')({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginLeft: 30,
  '& > a': {
    color: '#fff',
    textDecoration: 'none',
    padding: '20px 14px',
    fontWeight: 500,
    fontSize: 14,
    borderBottom: '3px solid transparent',
  },
  '& > a.active': {
    borderBottomColor: horizon.yellow,
    fontWeight: 700,
  },
});

const links = [
  { to: '/companies', label: 'Empresas' },
  { to: '/products', label: 'Produtos' },
];

const Appbar: React.FC = () => {
  const { isMobile } = useApp();
  const [openedMenu, setOpenedMenu] = useState(false);

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: horizon.graphite }}>
      <Toolbar>
        {isMobile && (
          <IconButton color="inherit" edge="start" aria-label="Abrir menu" onClick={() => setOpenedMenu(true)}>
            <Menu />
          </IconButton>
        )}

        <Brand>
          <img src="/horizon-logo.png" alt="Horizon Tecnologia" />
          <span>HORIZON</span>
        </Brand>

        {!isMobile && (
          <Navigation>
            {links.map(link => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </Navigation>
        )}
      </Toolbar>

      <Drawer anchor="left" open={openedMenu} onClose={() => setOpenedMenu(false)}>
        <List sx={{ width: 220 }}>
          {links.map(link => (
            <ListItemButton
              key={link.to}
              component={NavLink}
              to={link.to}
              onClick={() => setOpenedMenu(false)}
              sx={{ '&.active': { borderLeft: `4px solid ${horizon.yellow}`, fontWeight: 700 } }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Appbar;
