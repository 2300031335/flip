import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import AuditViewer from '../components/AuditViewer';
import { fetchAuditBlocks } from '../services/api';

const AuditLedgerPage = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    try {
      const data = await fetchAuditBlocks();
      setBlocks(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: '#f8fafc', mb: 1 }}>
        Cryptographic Immutable Audit Chain
      </Typography>
      <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
        Every risk decision, model version, risk score, and remediation action is cryptographically SHA-256 block-chained.
      </Typography>

      <AuditViewer blocks={blocks} />
    </Box>
  );
};

export default AuditLedgerPage;
