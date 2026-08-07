import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip, Avatar, IconButton, Button } from '@mui/material';
import { ShieldAlert, Cpu, Bell, Activity, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Sarah Jenkins', role: 'ADMIN' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="sticky" sx={{ background: '#0f172a', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', display: 'flex' }}>
            <ShieldAlert size={26} color="#ffffff" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#f8fafc', letterSpacing: 0.5, lineHeight: 1.1 }}>
              TRUST GRAPH
            </Typography>
            <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 600, letterSpacing: 1 }}>
              MULTI-ACTOR FRAUD REMEDIATION PLATFORM
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            icon={<Activity size={16} color="#10b981" />} 
            label="SYSTEM ONLINE" 
            size="small" 
            sx={{ bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
          />
          <Chip 
            icon={<Cpu size={16} color="#06b6d4" />} 
            label="GRAPH AI v1.0" 
            size="small" 
            sx={{ bgcolor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', border: '1px solid rgba(6, 182, 212, 0.3)' }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1, borderLeft: '1px solid #334155' }}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#06b6d4', fontSize: 14, fontWeight: 700 }}>
              {user.name ? user.name.charAt(0) : 'U'}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                {user.name || 'Sarah Jenkins'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#06b6d4', display: 'block', lineHeight: 1, fontWeight: 700 }}>
                ROLE: {user.role || 'ADMIN'}
              </Typography>
            </Box>
          </Box>

          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<LogOut size={16} />}
            onClick={handleLogout}
            sx={{ ml: 1, borderColor: 'rgba(239, 68, 68, 0.4)' }}
          >
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
