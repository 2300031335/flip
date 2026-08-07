import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every outgoing HTTP request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchMetrics = async () => {
  const response = await api.get('/metrics/summary');
  return response.data;
};

export const fetchGraphData = async () => {
  const response = await api.get('/graph/');
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get('/orders/');
  return response.data;
};

export const fetchInvestigationQueue = async () => {
  const response = await api.get('/investigate/queue');
  return response.data;
};

export const processOrderRisk = async (orderPayload) => {
  const response = await api.post('/orders/process', orderPayload);
  return response.data;
};

export const overrideDecision = async (orderId, newAction, reason) => {
  const response = await api.post('/investigate/override', {
    order_id: orderId,
    new_action: newAction,
    reason: reason,
    reviewer_id: 'INVESTIGATOR_UI',
  });
  return response.data;
};

export const fetchAppeals = async () => {
  const response = await api.get('/appeals/');
  return response.data;
};

export const submitAppeal = async (appealPayload) => {
  const response = await api.post('/appeals/submit', appealPayload);
  return response.data;
};

export const reviewAppeal = async (appealId, status, notes) => {
  const response = await api.post('/appeals/review', {
    appeal_id: appealId,
    status: status,
    notes: notes,
    reviewer_id: 'INVESTIGATOR_UI',
  });
  return response.data;
};

export const fetchAuditBlocks = async () => {
  const response = await api.get('/audit/blocks');
  return response.data;
};

export const verifyAuditChain = async () => {
  const response = await api.get('/audit/verify');
  return response.data;
};

export default api;
