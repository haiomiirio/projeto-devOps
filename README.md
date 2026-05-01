# 🔍 DevOps Monitor

API de monitoramento de serviços com stack completa de observabilidade usando Prometheus e Grafana.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=flat&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=flat&logo=grafana&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)
![Synthetic Monitoring](https://img.shields.io/badge/Synthetic_Monitoring-FF9A00?style=flat&logo=grafana&logoColor=white)

## 🚀 Demo

- **API em produção:** https://projeto-devops-okd5.onrender.com
- **Dashboard Grafana Cloud:** https://jtadeu.grafana.net/public-dashboards/9ad2696151bf4fb4873d906fd2b81fd8

## 🏗️ Arquitetura

GitHub → GitHub Actions → Docker Hub → Render (produção)
↓
API Node.js /metrics
↓
Prometheus
↓
Grafana (local) + Grafana Cloud

## 📊 Endpoints

| Endpoint | Descrição |
|----------|-----------|
| `GET /` | Status da API |
| `GET /health` | Health check |
| `GET /monitor` | Monitora GitHub API e Google |
| `GET /metrics` | Métricas no formato Prometheus |

## 📈 Métricas coletadas

| Métrica | Tipo | Descrição |
|---------|------|-----------|
| `http_requests_total` | Counter | Total de requisições por rota e status |
| `http_request_duration_seconds` | Histogram | Latência de cada endpoint |
| `servico_online` | Gauge | Status dos serviços (1=online, 0=offline) |
| `process_resident_memory_bytes` | Gauge | Uso de memória RAM |

## 🌐 Monitoramento 24/7

O Synthetic Monitoring do Grafana Cloud verifica a disponibilidade da API a cada minuto, sem depender do meu PC ligado.

- **Uptime:** ~95% nos últimos testes
- **Latência média:** ~186ms (probe NorthCalifornia)
- **Certificado SSL:** válido por ~8 semanas

## 🛠️ Tecnologias

- **Runtime:** Node.js + Express
- **Métricas:** prom-client
- **Containers:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Deploy:** Render.com
- **Monitoramento:** Prometheus + Grafana
- **Observabilidade:** Grafana Cloud

## ⚙️ Como rodar localmente

### Pré-requisitos
- Docker Desktop instalado
- Git

### Passo a passo

```bash
# Clone o repositório
git clone https://github.com/haiomiirio/projeto-devOps.git
cd projeto-devOps

# Suba toda a stack
docker-compose up --build
