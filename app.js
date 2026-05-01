const express = require('express');
const axios = require('axios');
const client = require('prom-client'); // NOVO
const app = express();
const port = process.env.PORT || 3000;

// ─── PROMETHEUS SETUP ───────────────────────────────────────────
const register = new client.Registry();
client.collectDefaultMetrics({ register }); // CPU, memória, etc. de graça

// Contador de requisições por endpoint e status
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Histograma de latência por endpoint
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

// Gauge de serviços online/offline
const servicoOnlineGauge = new client.Gauge({
  name: 'servico_online',
  help: '1 = online, 0 = offline',
  labelNames: ['nome'],
  registers: [register],
});

// ─── MIDDLEWARE de métricas automáticas ─────────────────────────
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, route: req.path, status_code: res.statusCode });
    end();
  });
  next();
});
// ────────────────────────────────────────────────────────────────

const servicos = [
  { nome: 'GitHub API', url: 'https://api.github.com' },
  { nome: 'Google', url: 'https://www.google.com' },
];

app.get('/health', (req, res) => {
  res.json({ status: 'online' });
});

app.get('/', (req, res) => {
  res.json({ mensagem: 'Rodando' });
});

app.get('/monitor', async (req, res) => {
  const resultados = [];

  for (const s of servicos) {
    const inicio = Date.now();
    try {
      const resposta = await axios.get(s.url, { timeout: 5000 });
      servicoOnlineGauge.set({ nome: s.nome }, 1); // NOVO
      resultados.push({
        nome: s.nome,
        status: '✅ ONLINE',
        tempo_resposta: `${Date.now() - inicio}ms`,
        codigo: resposta.status,
      });
    } catch (erro) {
      servicoOnlineGauge.set({ nome: s.nome }, 0); // NOVO
      resultados.push({
        nome: s.nome,
        status: '❌ OFFLINE',
        tempo_resposta: `${Date.now() - inicio}ms`,
        erro: erro.message,
      });
    }
  }

  res.json({
    timestamp: new Date().toISOString(),
    total_servicos: resultados.length,
    online: resultados.filter(r => r.status === '✅ ONLINE').length,
    offline: resultados.filter(r => r.status === '❌ OFFLINE').length,
    detalhes: resultados,
  });
});

// ─── ENDPOINT /metrics (para o Prometheus) ──────────────────────
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
// ────────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});