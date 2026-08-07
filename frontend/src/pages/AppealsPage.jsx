import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, TextField, Select, MenuItem } from '@mui/material';
import { FileCheck, Upload, Check, X } from 'lucide-react';
import { fetchAppeals, submitAppeal, reviewAppeal } from '../services/api';

const AppealsPage = () => {
  const [appeals, setAppeals] = useState([]);
  const [entityId, setEntityId] = useState('');
  const [entityType, setEntityType] = useState('SELLER');
  const [reason, setReason] = useState('');
  const [docName, setDocName] = useState('');

  useEffect(() => {
    loadAppeals();
  }, []);

  const loadAppeals = async () => {
    try {
      const data = await fetchAppeals();
      setAppeals(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitAppeal({
        entity_id: entityId,
        entity_type: entityType,
        reason: reason,
        evidence_documents: [docName || 'invoice_proof.pdf'],
      });
      setEntityId('');
      setReason('');
      setDocName('');
      loadAppeals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReview = async (appealId, newStatus) => {
    try {
      await reviewAppeal(appealId, newStatus, `Manual review completed by investigator.`);
      loadAppeals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#f8fafc', mb: 1 }}>
        Appeals & Dispute Remediation Center
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        Allows blocked Sellers and Delivery Partners to submit counter-evidence and track AI dispute screening.
      </Typography>

      <Grid container spacing={3}>
        {/* Submit Appeal Form */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, bgcolor: '#111827' }}>
            <Typography variant="subtitle1" sx={{ color: '#06b6d4', fontWeight: 700, mb: 2 }}>
              Submit New Dispute Appeal
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Entity ID (e.g. SELL-881)"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                required
                fullWidth
                size="small"
                sx={{ bgcolor: '#0b0f19' }}
              />
              <Select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                size="small"
                fullWidth
                sx={{ bgcolor: '#0b0f19' }}
              >
                <MenuItem value="SELLER">SELLER</MenuItem>
                <MenuItem value="DELIVERY_PARTNER">DELIVERY_PARTNER</MenuItem>
              </Select>
              <TextField
                label="Dispute Justification Reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                multiline
                rows={3}
                fullWidth
                size="small"
                sx={{ bgcolor: '#0b0f19' }}
              />
              <TextField
                label="Document Filename (Proof)"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. coworking_lease_invoice.pdf"
                fullWidth
                size="small"
                sx={{ bgcolor: '#0b0f19' }}
              />
              <Button type="submit" variant="contained" color="primary" startIcon={<Upload size={16} />}>
                Submit Appeal for AI Screening
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Active Appeals List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2.5, bgcolor: '#111827' }}>
            <Typography variant="subtitle1" sx={{ color: '#f8fafc', fontWeight: 700, mb: 2 }}>
              Active Appeals Queue ({appeals.length})
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#64748b' }}>Appeal ID</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>Entity</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>Reason</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>AI Confidence</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>Status</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appeals.map((a) => (
                  <TableRow key={a.appeal_id}>
                    <TableCell sx={{ color: '#f8fafc', fontWeight: 700 }}>{a.appeal_id}</TableCell>
                    <TableCell sx={{ color: '#06b6d4' }}>{a.entity_id} ({a.entity_type})</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: 200 }}>{a.reason}</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 700 }}>
                      {(a.ai_confidence_score * 100).toFixed(0)}%
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={a.status}
                        size="small"
                        color={a.status === 'APPROVED' ? 'success' : a.status === 'REJECTED' ? 'error' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      {a.status !== 'APPROVED' && a.status !== 'REJECTED' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            color="success"
                            variant="outlined"
                            onClick={() => handleReview(a.appeal_id, 'APPROVED')}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleReview(a.appeal_id, 'REJECTED')}
                          >
                            <X size={14} />
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppealsPage;
