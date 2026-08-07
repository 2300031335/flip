import React from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = '#06b6d4' }) => {
  return (
    <Paper sx={{ p: 2.5, bgcolor: '#111827', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: '#f8fafc', mt: 0.5, fontWeight: 700 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: color, mt: 0.5, display: 'block', fontWeight: 600 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}20`, color: color, width: 44, height: 44, borderRadius: 2 }}>
          <Icon size={24} />
        </Avatar>
      </Box>
    </Paper>
  );
};

export default MetricCard;
