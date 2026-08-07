import React, { useState } from 'react';
import { Paper, Box, Typography, Chip, Button, Tooltip } from '@mui/material';
import { Network, AlertTriangle, ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

const categoryColors = {
  CUSTOMER: '#3b82f6',
  SELLER: '#8b5cf6',
  DELIVERY_PARTNER: '#10b981',
  DEVICE: '#ef4444',
  IP_ADDRESS: '#f59e0b',
  ADDRESS: '#ec4899',
  BANK_ACCOUNT: '#06b6d4',
};

const categoryPositions = {
  'CUST-109': { x: 150, y: 120 },
  'SELL-881': { x: 450, y: 120 },
  'DELIV-302': { x: 300, y: 280 },
  'DEV-RING-01': { x: 300, y: 150 },
  'IP-198.51.100.44': { x: 220, y: 50 },
  'ADDR-RING-404': { x: 380, y: 50 },
  'BANK-HASH-992': { x: 450, y: 280 },
  'CUST-305': { x: 150, y: 280 },
  
  'CUST-204': { x: 650, y: 120 },
  'SELL-442': { x: 800, y: 120 },
  'DELIV-110': { x: 725, y: 250 },
  'DEV-LEGIT-99': { x: 725, y: 60 },
  'IP-203.0.113.12': { x: 600, y: 220 },
  'ADDR-LEGIT-123': { x: 850, y: 220 },
};

const GraphVisualizer = ({ graphData, onRefresh }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightCollusionOnly, setHighlightCollusionOnly] = useState(false);

  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  return (
    <Paper sx={{ p: 3, bgcolor: '#111827', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Network color="#06b6d4" size={24} />
          <Typography variant="h6" sx={{ color: '#f8fafc' }}>
            Multi-Actor Collusion Topology Graph
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Button
            size="small"
            variant={highlightCollusionOnly ? "contained" : "outlined"}
            color="error"
            startIcon={<AlertTriangle size={16} />}
            onClick={() => setHighlightCollusionOnly(!highlightCollusionOnly)}
          >
            {highlightCollusionOnly ? "Show Full Network" : "Filter Collusion Rings"}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={onRefresh}
            sx={{ color: '#94a3b8', borderColor: '#334155' }}
          >
            Refresh Graph
          </Button>
        </Box>
      </Box>

      {/* Category Legend */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, p: 1.5, bgcolor: '#0f172a', borderRadius: 2 }}>
        {Object.entries(categoryColors).map(([cat, color]) => (
          <Chip
            key={cat}
            label={cat.replace('_', ' ')}
            size="small"
            sx={{ bgcolor: `${color}20`, color: color, border: `1px solid ${color}40`, fontSize: 11 }}
          />
        ))}
      </Box>

      {/* Interactive Node Graph Canvas */}
      <Box sx={{ position: 'relative', width: '100%', height: 380, bgcolor: '#0b0f19', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Edges */}
          {edges.map((edge, idx) => {
            const sourcePos = categoryPositions[edge.source] || { x: 100 + (idx * 30) % 700, y: 100 + (idx * 40) % 250 };
            const targetPos = categoryPositions[edge.target] || { x: 200 + (idx * 40) % 700, y: 200 + (idx * 30) % 250 };
            const isCollusionEdge = ['DEV-RING-01', 'CUST-109', 'SELL-881', 'DELIV-302', 'BANK-HASH-992'].includes(edge.source) &&
                                    ['DEV-RING-01', 'CUST-109', 'SELL-881', 'DELIV-302', 'BANK-HASH-992'].includes(edge.target);

            if (highlightCollusionOnly && !isCollusionEdge) return null;

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={isCollusionEdge ? '#ef4444' : '#334155'}
                  strokeWidth={isCollusionEdge ? 2.5 : 1}
                  strokeDasharray={edge.relation === 'SHARED_DEVICE' ? '4,4' : 'none'}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pos = categoryPositions[node.id] || { x: 100 + Math.random() * 600, y: 100 + Math.random() * 200 };
            const color = categoryColors[node.category] || '#06b6d4';
            const isCollusionNode = node.is_suspicious;

            if (highlightCollusionOnly && !isCollusionNode) return null;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isCollusionNode ? 22 : 16}
                  fill={isCollusionNode ? '#ef4444' : color}
                  stroke={isCollusionNode ? '#fca5a5' : '#ffffff'}
                  strokeWidth={isCollusionNode ? 3 : 1.5}
                  filter={isCollusionNode ? 'url(#glow-red)' : 'none'}
                />
                <text
                  x={pos.x}
                  y={pos.y + 34}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="600"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <Box sx={{ position: 'absolute', bottom: 16, right: 16, p: 2, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 2, maxWidth: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                {selectedNode.label}
              </Typography>
              <Button size="small" onClick={() => setSelectedNode(null)} sx={{ color: '#64748b', minWidth: 20 }}>✕</Button>
            </Box>
            <Typography variant="caption" sx={{ color: '#06b6d4', display: 'block', mt: 0.5 }}>
              Category: {selectedNode.category}
            </Typography>
            <Typography variant="caption" sx={{ color: selectedNode.is_suspicious ? '#ef4444' : '#10b981', display: 'block', mt: 0.5, fontWeight: 700 }}>
              Risk Score: {selectedNode.risk_score} / 100 {selectedNode.is_suspicious && '(COLLUSION RING HUB)'}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default GraphVisualizer;
