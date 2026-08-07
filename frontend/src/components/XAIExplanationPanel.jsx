import React from 'react';
import { Paper, Box, Typography, LinearProgress, Chip, Divider } from '@mui/material';
import { BrainCircuit, AlertCircle, ShieldAlert } from 'lucide-react';

const XAIExplanationPanel = ({ assessment }) => {
  if (!assessment) {
    return (
      <Paper sx={{ p: 3, bgcolor: '#111827', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Select an order to inspect AI Explainability details.
        </Typography>
      </Paper>
    );
  }

  const { risk_score, risk_level, action, collusion_detected, top_features, natural_explanations } = assessment;

  return (
    <Paper sx={{ p: 3, bgcolor: '#111827' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <BrainCircuit color="#06b6d4" size={24} />
          <Typography variant="h6" sx={{ color: '#f8fafc' }}>
            Explainable AI (XAI) Risk Breakdown
          </Typography>
        </Box>
        <Chip
          label={`ACTION: ${action}`}
          color={risk_score >= 80 ? 'error' : risk_score >= 50 ? 'warning' : 'success'}
          sx={{ fontWeight: 700 }}
        />
      </Box>

      {/* Natural Language Reasons */}
      <Box sx={{ p: 2, bgcolor: '#0b0f19', borderRadius: 2, mb: 3, borderLeft: '4px solid #06b6d4' }}>
        <Typography variant="subtitle2" sx={{ color: '#06b6d4', fontWeight: 700, mb: 1 }}>
          HUMAN-READABLE REASON SYNTHESIS:
        </Typography>
        {natural_explanations?.map((reason, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
            <AlertCircle size={16} color="#ef4444" style={{ marginTop: 2, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: '#e2e8f0', fontSize: '0.875rem' }}>
              {reason}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="subtitle2" sx={{ color: '#94a3b8', fontWeight: 600, mb: 1.5 }}>
        TOP SHAP RISK FEATURE CONTRIBUTIONS:
      </Typography>

      {/* SHAP Feature Contribution Bars */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {top_features?.map((feat, idx) => (
          <Box key={idx}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                {feat.feature_name} ({feat.value})
              </Typography>
              <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 700 }}>
                +{feat.contribution}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(feat.contribution * 3, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: '#1e293b',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #06b6d4 0%, #ef4444 100%)',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block', mt: 0.2 }}>
              {feat.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default XAIExplanationPanel;
