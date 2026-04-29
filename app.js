const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

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

// NOVO ENDPOINT /monitor
app.get('/monitor', async (req, res) => {
  const resultados = [];
  
  for (const s of servicos) {
    const inicio = Date.now();
    try {
      const resposta = await axios.get(s.url, { timeout: 5000 });
      resultados.push({
        nome: s.nome,
        status: '✅ ONLINE',
        tempo_resposta: `${Date.now() - inicio}ms`,
        codigo: resposta.status
      });
    } catch (erro) {
      resultados.push({
        nome: s.nome,
        status: '❌ OFFLINE',
        tempo_resposta: `${Date.now() - inicio}ms`,
        erro: erro.message
      });
    }
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    total_servicos: resultados.length,
    online: resultados.filter(r => r.status === '✅ ONLINE').length,
    offline: resultados.filter(r => r.status === '❌ OFFLINE').length,
    detalhes: resultados
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});