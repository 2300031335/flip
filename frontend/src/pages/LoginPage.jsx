import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Chip, Divider, InputAdornment, IconButton } from '@mui/material';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, KeyRound, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin@trustgraph.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username: username,
        password: password,
      });

      const { access_token, user_id, role, name } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify({ id: user_id, role, name, username }));

      // Attach token to default headers
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to Backend API server on http://localhost:8000. Please ensure python main.py is running.');
      } else {
        setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
      }
    }
    setLoading(false);
  };

  const handlePresetSelect = (presetEmail) => {
    setUsername(presetEmail);
    setPassword('password123');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0b0f19',
        p: 2,
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.12) 0%, transparent 60%)',
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 460,
          width: '100%',
          bgcolor: '#111827',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: 3,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Header Branding */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              mb: 1.5,
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)',
            }}
          >
            <ShieldAlert size={36} color="#ffffff" />
          </Box>
          <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 800, letterSpacing: 0.5 }}>
            TRUST GRAPH
          </Typography>
          <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 700, letterSpacing: 1.2, mt: 0.5 }}>
            ENTERPRISE FRAUD & REMEDIATION PORTAL
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#f8fafc' }}>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Enterprise Identity (Email)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={18} color="#06b6d4" />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: '#0b0f19' }}
          />

          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyRound size={18} color="#06b6d4" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#64748b' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: '#0b0f19' }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={<Lock size={18} />}
            sx={{
              py: 1.4,
              background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0891b2 0%, #1d4ed8 100%)',
              },
            }}
          >
            {loading ? 'Authenticating JWT Token...' : 'Secure Enterprise Sign In'}
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <Typography variant="caption" sx={{ color: '#64748b', px: 1 }}>
            DEMO QUICK LOGIN PRESETS
          </Typography>
        </Divider>

        {/* Quick Demo Presets */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          <Chip
            label="Admin (Sarah)"
            onClick={() => handlePresetSelect('admin@trustgraph.ai')}
            sx={{ bgcolor: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', cursor: 'pointer', border: '1px solid #06b6d4' }}
          />
          <Chip
            label="Investigator (Marcus)"
            onClick={() => handlePresetSelect('investigator@trustgraph.ai')}
            sx={{ bgcolor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', cursor: 'pointer', border: '1px solid #8b5cf6' }}
          />
          <Chip
            label="Auditor (Elena)"
            onClick={() => handlePresetSelect('auditor@trustgraph.ai')}
            sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', cursor: 'pointer', border: '1px solid #10b981' }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
