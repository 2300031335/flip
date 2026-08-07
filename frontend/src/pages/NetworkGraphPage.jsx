import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Alert } from '@mui/material';
import { Network, AlertTriangle } from 'lucide-react';
import GraphVisualizer from '../components/GraphVisualizer';
import { fetchGraphData } from '../services/api';

const NetworkGraphPage = () => {
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    try {
      const data = await fetchGraphData();
      setGraphData(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#f8fafc', mb: 1 }}>
        Multi-Actor Network Graph AI & Collusion Tracing
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        Detecting cross-entity credential sharing, device hopping, circular refund rings, and ghost delivery patterns.
      </Typography>

      <Alert severity="warning" icon={<AlertTriangle size={20} />} sx={{ mb: 3, bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f8fafc' }}>
        <strong>Graph Intelligence Alert:</strong> Detected 1 active multi-actor collusion ring containing Customer CUST-109, Seller SELL-881, Delivery Partner DELIV-302 sharing Hardware Device DEV-RING-01.
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <GraphVisualizer graphData={graphData} onRefresh={loadGraph} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetworkGraphPage;
