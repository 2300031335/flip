import React, { useState } from 'react';
import { Paper, Box, Typography, Button, Chip, Alert } from '@mui/material';
import { Lock, ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { verifyAuditChain } from '../services/api';

const AuditViewer = ({ blocks }) => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await verifyAuditChain();
      setVerificationResult(res);
    } catch (err) {
      setVerificationResult({ is_valid: false, message: 'Verification API failed.' });
    }
    setVerifying(false);
  };

  return (
    <Paper sx={{ p: 3, bgcolor: '#111827' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Lock color="#10b981" size={24} />
          <Typography variant="h6" sx={{ color: '#f8fafc' }}>
            Cryptographic SHA-256 Audit Trail
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<ShieldCheck size={18} />}
          onClick={handleVerify}
          disabled={verifying}
        >
          {verifying ? 'Verifying Hashes...' : 'Verify Cryptographic Integrity'}
        </Button>
      </Box>

      {verificationResult && (
        <Alert
          severity={verificationResult.is_valid ? 'success' : 'error'}
          icon={verificationResult.is_valid ? <CheckCircle2 size={20} /> : <AlertOctagon size={20} />}
          sx={{ mb: 2, bgcolor: verificationResult.is_valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: '#f8fafc' }}
        >
          {verificationResult.message}
        </Alert>
      )}

      {/* Block List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {blocks?.map((b) => (
          <Box
            key={b.index}
            sx={{
              p: 2,
              bgcolor: '#0b0f19',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 700 }}>
                BLOCK #{b.index} | ORDER {b.order_id}
              </Typography>
              <Chip label={b.action} size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontSize: 11 }} />
            </Box>

            <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
              Timestamp: {b.timestamp} | Reviewer: {b.reviewer_id} | Risk Score: {b.risk_score}
            </Typography>

            <Box sx={{ mt: 1, p: 1, bgcolor: '#1e293b', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Prev Hash: {b.previous_hash}
              </Typography>
              <Typography variant="caption" sx={{ color: '#06b6d4', display: 'block', fontWeight: 600 }}>
                Current Hash: {b.block_hash}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default AuditViewer;
