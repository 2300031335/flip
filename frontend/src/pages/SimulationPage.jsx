import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Alert, Chip, Divider } from '@mui/material';
import { PlayCircle, ShieldAlert, CheckCircle2, Network, Cpu, Lock } from 'lucide-react';
import { processOrderRisk } from '../services/api';
import XAIExplanationPanel from '../components/XAIExplanationPanel';

const scenarios = [
  {
    title: '🚨 Multi-Actor Collusion Ring Attack',
    description: 'Customer CUST-109, Seller SELL-881, and Delivery Partner DELIV-302 execute circular order refund loop over shared device DEV-RING-01.',
    payload: {
      order_id: 'SIM-RING-99',
      customer_id: 'CUST-109',
      customer_name: 'Alice Vance (Ring Leader)',
      seller_id: 'SELL-881',
      seller_name: 'Apex Digital Store',
      delivery_partner_id: 'DELIV-302',
      delivery_partner_name: 'QuickExpress Rider 12',
      amount: 4250.00,
      device_id: 'DEV-RING-01',
      ip_address: '198.51.100.44',
      phone: '+1-555-0199',
      shipping_address: '404 Phantom Loop, Austin TX',
      bank_account_hash: 'BANK-HASH-992',
    },
  },
  {
    title: '📱 Device Hopping & Refund Abuse',
    description: 'Single hardware device linked to 5 buyer accounts attempting rapid high-value refund requests.',
    payload: {
      order_id: 'SIM-DEV-44',
      customer_id: 'CUST-305',
      customer_name: 'Bob Smith (Fake)',
      seller_id: 'SELL-209',
      seller_name: 'FastTrack Wireless',
      delivery_partner_id: 'DELIV-110',
      delivery_partner_name: 'FedEx Express #10',
      amount: 1890.00,
      device_id: 'DEV-RING-01',
      ip_address: '198.51.100.99',
      phone: '+1-555-0442',
      shipping_address: '900 Market St, San Francisco CA',
      bank_account_hash: 'BANK-HASH-441',
    },
  },
  {
    title: '🚚 Telematics GPS Spoofing',
    description: 'Carrier marks high-value delivery complete 18 miles away in 0 seconds.',
    payload: {
      order_id: 'SIM-GPS-77',
      customer_id: 'CUST-501',
      customer_name: 'Carol Danvers',
      seller_id: 'SELL-999',
      seller_name: 'Global Tech Imports',
      delivery_partner_id: 'DELIV-302',
      delivery_partner_name: 'QuickExpress Rider 12',
      amount: 2100.00,
      device_id: 'DEV-SPOOF-99',
      ip_address: '203.0.113.88',
      phone: '+1-555-0881',
      shipping_address: '12 Ocean Drive, Miami FL',
      bank_account_hash: 'BANK-HASH-110',
    },
  },
  {
    title: '✅ Clean Legitimate Purchase',
    description: 'Verified buyer purchasing regular item from verified merchant with matched IP and shipping address.',
    payload: {
      order_id: 'SIM-CLEAN-01',
      customer_id: 'CUST-204',
      customer_name: 'David Miller',
      seller_id: 'SELL-442',
      seller_name: 'Green Earth Books',
      delivery_partner_id: 'DELIV-110',
      delivery_partner_name: 'FedEx Express #10',
      amount: 65.00,
      device_id: 'DEV-LEGIT-99',
      ip_address: '203.0.113.12',
      phone: '+1-555-0123',
      shipping_address: '123 Main St, Seattle WA',
      bank_account_hash: 'BANK-HASH-001',
    },
  },
];

const SimulationPage = () => {
  const [runningScenario, setRunningScenario] = useState(null);
  const [result, setResult] = useState(null);

  const handleRunScenario = async (scenario) => {
    setRunningScenario(scenario.title);
    try {
      const res = await processOrderRisk(scenario.payload);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
    setRunningScenario(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#f8fafc', mb: 1 }}>
        Judge Interactive Simulation Sandbox
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        Test the Trust Graph AI Platform end-to-end in real-time. Trigger live multi-actor collusion attacks, device hopping, and telematics spoofing scenarios.
      </Typography>

      <Grid container spacing={3}>
        {/* Preset Scenario Cards */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ color: '#06b6d4', fontWeight: 700, mb: 2 }}>
            SELECT PRESET FRAUD SCENARIO:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {scenarios.map((sc, idx) => (
              <Paper key={idx} sx={{ p: 2.5, bgcolor: '#111827', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Typography variant="subtitle2" sx={{ color: '#f8fafc', fontWeight: 700, mb: 0.5 }}>
                  {sc.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 2 }}>
                  {sc.description}
                </Typography>
                <Button
                  variant="contained"
                  color={idx === 3 ? "success" : "error"}
                  startIcon={<PlayCircle size={18} />}
                  onClick={() => handleRunScenario(sc)}
                  disabled={runningScenario === sc.title}
                >
                  {runningScenario === sc.title ? 'Executing Multi-Agent Evaluation...' : 'Run Scenario Live'}
                </Button>
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* Live Evaluation Output */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 700, mb: 2 }}>
            REAL-TIME MULTI-AGENT INFERENCE RESULT:
          </Typography>

          {result ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper sx={{ p: 2.5, bgcolor: '#0b0f19', border: '1px solid #06b6d4' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                    ORDER {result.order_id}
                  </Typography>
                  <Chip
                    label={`GRADUATED ACTION: ${result.action}`}
                    color={result.risk_score >= 80 ? 'error' : result.risk_score >= 50 ? 'warning' : 'success'}
                    sx={{ fontWeight: 800 }}
                  />
                </Box>

                <Grid container spacing={2} sx={{ my: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Risk Score</Typography>
                    <Typography variant="h4" sx={{ color: result.risk_score >= 80 ? '#ef4444' : '#10b981', fontWeight: 800 }}>
                      {result.risk_score} / 100
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Collusion Detected?</Typography>
                    <Typography variant="h4" sx={{ color: result.collusion_detected ? '#ef4444' : '#10b981', fontWeight: 800 }}>
                      {result.collusion_detected ? 'YES (RINGS)' : 'NO'}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ p: 1, bgcolor: '#1e293b', borderRadius: 1, mt: 1 }}>
                  <Typography variant="caption" sx={{ color: '#06b6d4', display: 'block', fontFamily: 'monospace' }}>
                    SHA-256 Audit Block Hash: {result.agent_breakdowns?.audit_block_hash}
                  </Typography>
                </Box>
              </Paper>

              <XAIExplanationPanel assessment={result} />
            </Box>
          ) : (
            <Paper sx={{ p: 4, bgcolor: '#111827', textAlign: 'center', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Cpu size={48} color="#06b6d4" style={{ marginBottom: 16 }} />
              <Typography variant="h6" sx={{ color: '#f8fafc' }}>
                Sandbox Ready
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 360, mt: 1 }}>
                Click any preset scenario on the left to witness live multi-agent risk scoring, NetworkX collusion tracing, graduated action enforcement, and SHA-256 audit block logging.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SimulationPage;
