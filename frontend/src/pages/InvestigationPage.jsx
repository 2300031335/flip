import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import XAIExplanationPanel from '../components/XAIExplanationPanel';
import { fetchInvestigationQueue, overrideDecision } from '../services/api';

const InvestigationPage = () => {
  const [queue, setQueue] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [newAction, setNewAction] = useState('APPROVE');
  const [overrideReason, setOverrideReason] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    try {
      const data = await fetchInvestigationQueue();
      setQueue(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOverrideSubmit = async () => {
    if (!selectedOrder) return;
    try {
      await overrideDecision(selectedOrder.order_id, newAction, overrideReason);
      setOverrideModalOpen(false);
      setOverrideReason('');
      loadQueue();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#f8fafc', mb: 1 }}>
        Investigator Queue & Graduated Remediation Workbench
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        Review high-risk transactions flagged by Multi-Agent AI for graduated action or manual override.
      </Typography>

      <Grid container spacing={3}>
        {/* Left Side: Case Queue Table */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2.5, bgcolor: '#111827' }}>
            <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
              Flagged High-Risk Cases ({queue.length})
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#64748b' }}>Order ID</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>Entities</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>Amount</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>Risk Score</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((row) => {
                  const isSelected = selectedOrder?.order_id === row.order_id;
                  return (
                    <TableRow
                      key={row.order_id}
                      onClick={() => setSelectedOrder(row)}
                      selected={isSelected}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: isSelected ? 'rgba(6, 182, 212, 0.1) !important' : 'transparent',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)' },
                      }}
                    >
                      <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>{row.order_id}</TableCell>
                      <TableCell sx={{ color: '#94a3b8' }}>
                        {row.customer_id} → {row.seller_id}
                      </TableCell>
                      <TableCell sx={{ color: '#f8fafc' }}>${row.amount?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.risk_score}
                          size="small"
                          color={row.risk_score >= 80 ? 'error' : 'warning'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={row.action} size="small" variant="outlined" sx={{ color: '#06b6d4', borderColor: '#06b6d4' }} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOverrideModalOpen(true)}
                disabled={!selectedOrder}
              >
                Override Graduated Action
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side: XAI Explanation & Evidence */}
        <Grid item xs={12} md={5}>
          <XAIExplanationPanel assessment={selectedOrder?.assessment} />
        </Grid>
      </Grid>

      {/* Manual Override Modal */}
      <Dialog open={overrideModalOpen} onClose={() => setOverrideModalOpen(false)} paperprops={{ style: { backgroundColor: '#111827', color: '#f8fafc' } }}>
        <DialogTitle sx={{ color: '#f8fafc' }}>Manual Investigator Action Override</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            Overriding decision for <strong>{selectedOrder?.order_id}</strong>. Action will be committed to the Cryptographic Audit Trail.
          </Typography>

          <Typography variant="caption" sx={{ color: '#64748b' }}>Select New Remediation Action:</Typography>
          <Select
            fullWidth
            value={newAction}
            onChange={(e) => setNewAction(e.target.value)}
            sx={{ mb: 2, bgcolor: '#0b0f19', color: '#f8fafc' }}
          >
            <MenuItem value="APPROVE">APPROVE (Frictionless)</MenuItem>
            <MenuItem value="REQUIRE_OTP">REQUIRE_OTP (2FA Challenge)</MenuItem>
            <MenuItem value="HOLD_PAYOUT">HOLD_PAYOUT (Freeze Seller Funds)</MenuItem>
            <MenuItem value="SUSPEND_ACCOUNTS">SUSPEND_ACCOUNTS (Full Ban)</MenuItem>
          </Select>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Justification & Audit Reason"
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            sx={{ bgcolor: '#0b0f19', borderRadius: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOverrideModalOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleOverrideSubmit}>Commit Override to Ledger</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvestigationPage;
