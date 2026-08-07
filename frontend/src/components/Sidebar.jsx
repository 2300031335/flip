import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { LayoutDashboard, Network, ShieldCheck, FileCheck, Lock, PlayCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { text: 'Executive Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
  { text: 'Network Graph AI', icon: <Network size={20} />, path: '/graph' },
  { text: 'Investigator Queue', icon: <ShieldCheck size={20} />, path: '/investigate' },
  { text: 'Appeals Portal', icon: <FileCheck size={20} />, path: '/appeals' },
  { text: 'Cryptographic Audit', icon: <Lock size={20} />, path: '/audit' },
  { text: 'Judge Simulation Sandbox', icon: <PlayCircle size={20} />, path: '/simulation' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ width: 260, bgcolor: '#0f172a', borderRight: '1px solid rgba(255, 255, 255, 0.08)', minHeight: 'calc(100vh - 65px)' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: 1.2 }}>
          NAVIGATION MODULES
        </Typography>
        <List sx={{ mt: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    bgcolor: active ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    color: active ? '#06b6d4' : '#94a3b8',
                    borderLeft: active ? '3px solid #06b6d4' : '3px solid transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.04)',
                      color: '#f8fafc',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: active ? '#06b6d4' : '#64748b', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500 }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
