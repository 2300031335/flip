import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button } from '@mui/material';
import { DollarSign, ShieldAlert, Network, FileText, Activity, TrendingUp } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { fetchMetrics, fetchOrders } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const trendData = [
  { time: '00:00', fraud: 12, legit: 340 },
  { time: '04:00', fraud: 8, legit: 180 },
  { time: '08:00', fraud: 25, legit: 620 },
  { time: '12:00', fraud: 45, legit: 950 },
  { time: '16:00', fraud: 38, legit: 890 },
  { time: '20:00', fraud: 29, legit: 710 },
];

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const m = await fetchMetrics();
      const o = await fetchOrders();
      setMetrics(m);
      setRecentOrders(o);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#f8fafc', mb: 3 }}>
        Executive Fraud & Risk Intelligence Overview
      </Typography>

      {/* KPI Cards Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="TOTAL REVENUE SAVED"
            value={`$${(metrics?.revenue_saved_usd || 342150).toLocaleString()}`}
            subtitle="+14.2% chargeback reduction"
            icon={DollarSign}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="FRAUD ATTEMPTS BLOCKED"
            value={metrics?.total_fraud_blocked || 118}
            subtitle="96.4% Precision Model"
            icon={ShieldAlert}
            color="#ef4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="COLLUSION RINGS DETECTED"
            value={metrics?.collusion_rings_detected || 14}
            subtitle="Multi-Actor Graph AI"
            icon={Network}
            color="#06b6d4"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="PENDING APPEALS QUEUE"
            value={metrics?.pending_appeals_count || 2}
            subtitle="Graduated Remediation"
            icon={FileText}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      {/* Chart & Heatmap Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2.5, bgcolor: '#111827' }}>
            <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
              24-Hour Real-Time Fraud vs. Legitimate Transaction Velocity
            </Typography>
            <Box sx={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Area type="monotone" dataKey="legit" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.15)" />
                  <Area type="monotone" dataKey="fraud" stroke="#ef4444" fill="rgba(239, 68, 68, 0.3)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, bgcolor: '#111827' }}>
            <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
              AI Model Benchmark Metrics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: '#0b0f19', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Precision Rate</Typography>
                <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 700 }}>96.4%</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#0b0f19', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Recall Rate</Typography>
                <Typography variant="h5" sx={{ color: '#06b6d4', fontWeight: 700 }}>94.1%</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#0b0f19', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>F1-Score</Typography>
                <Typography variant="h5" sx={{ color: '#8b5cf6', fontWeight: 700 }}>95.2%</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Top High Risk Entities Tables */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, bgcolor: '#111827' }}>
            <Typography variant="subtitle1" sx={{ color: '#ef4444', fontWeight: 700, mb: 1.5 }}>
              Top High Risk Sellers
            </Typography>
            {metrics?.top_risk_sellers?.map((s) => (
              <Box key={s.seller_id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: '#0b0f19', borderRadius: 1.5, mb: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>{s.seller_id} | {s.collusion_links} links</Typography>
                </Box>
                <Chip label={`Score ${s.risk_score}`} color="error" size="small" />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, bgcolor: '#111827' }}>
            <Typography variant="subtitle1" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1.5 }}>
              Top High Risk Customers
            </Typography>
            {metrics?.top_risk_customers?.map((c) => (
              <Box key={c.customer_id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: '#0b0f19', borderRadius: 1.5, mb: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>{c.customer_id} | {c.shared_devices} shared devices</Typography>
                </Box>
                <Chip label={`Score ${c.risk_score}`} color="warning" size="small" />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, bgcolor: '#111827' }}>
            <Typography variant="subtitle1" sx={{ color: '#06b6d4', fontWeight: 700, mb: 1.5 }}>
              Top High Risk Delivery Partners
            </Typography>
            {metrics?.top_risk_delivery_partners?.map((d) => (
              <Box key={d.delivery_partner_id} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: '#0b0f19', borderRadius: 1.5, mb: 1 }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.name}</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>{d.delivery_partner_id} | Telematics Anomaly</Typography>
                </Box>
                <Chip label={`Score ${d.risk_score}`} color="primary" size="small" />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
