# Conversor de Moedas — BRL ↔ USD

Aplicação web moderna e responsiva para conversão em tempo real entre **Real Brasileiro (BRL)** e **Dólar Americano (USD)**, desenvolvida com foco em performance, acessibilidade e arquitetura escalável de Front-End.

<p align="left">
  <img src="https://github.com/user-attachments/assets/71320558-8017-4ff2-914f-b1221631d262" alt="Demonstração da aplicação" height="450">
</p>


**Acesse o projeto online:** [xampsdev.github.io/conversor-de-moedas](https://xampsdev.github.io/conversor-de-moedas/)

---

## Sobre o Projeto

Originalmente construído em HTML, CSS e JavaScript Vanilla para praticar manipulação do DOM e consumo de APIs REST, o projeto foi completamente refatorado para uma arquitetura moderna baseada em componentes utilizando **React**, **TypeScript** e **Tailwind CSS**, mantendo uma interface minimalista inspirada em plataformas fintech (*dark mode*, tipografia tabular e microinterações).

### Fluxo de Design e Engenharia Assistida por IA

A evolução visual e arquitetural desta versão contou com ferramentas modernas de design e desenvolvimento:
- **Google Stitch:** Utilizado na ideação e prototipação da nova identidade visual (UI/UX), definição de hierarquia de informação, espaçamentos e estados de interface.
- **Google AI Studio (Build Mode):** Empregado para migrar o código legado para a estrutura modular em React + TypeScript + Tailwind CSS e validar componentes em tempo real.
- **Google Gemini:** Utilizado como copiloto técnico para engenharia de prompts, refatoração arquitetural, implementação de máscara monetária internacionalizada, ajustes de responsividade mobile-first e configuração de CI/CD para o GitHub Pages.

---

## Funcionalidades

- **Conversão Bidirecional Instantânea:** Cálculo em tempo real de **BRL → USD** e **USD → BRL** com inversão rápida de direção.
- **Máscara Monetária Inteligente:** Formatação automática com separadores de milhar e casas decimais adaptados ao padrão de cada moeda (`pt-BR` para Real e `en-US` para Dólar).
- **Cotação ao Vivo + Cache Local:** Consulta atualizada via **AwesomeAPI** com fallback em `localStorage`, exibição de data/hora da última atualização e botão de atualização manual.
- **Atalhos de Valores Rápidos:** Seleção ágil de montantes pré-definidos (`100`, `500`, `1.000`, `5.000`).
- **Feedback Visual de Estados:** Indicadores de carregamento (*skeleton*), tratamento de falhas de rede/API com opção de nova tentativa e validação rigorosa de entrada.
- **Responsividade e Acessibilidade (A11y):** Layout *mobile-first* otimizado para diferentes resoluções, navegação por teclado (`:focus-visible`) e atributos semânticos ARIA.

---

## Tecnologias Utilizadas

- **Core:** React 18, TypeScript, Vite
- **Estilização:** Tailwind CSS, Lucide React (ícones)
- **Integração:** Fetch API, AwesomeAPI (`USD-BRL` / `BRL-USD`)
- **Deploy & CI/CD:** GitHub Pages, GitHub Actions

---

## Arquitetura do Projeto

```text
conversor-de-moedas/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Pipeline de build e deploy automático no GitHub Pages
├── public/                     # Assets estáticos e favicon
├── src/
│   ├── components/             # Componentes modulares de interface (cards, botão swap, status)
│   ├── hooks/                  # Custom hooks (gerenciamento de cotação, cache e estados)
│   ├── services/               # Cliente HTTP isolado para comunicação com a AwesomeAPI
│   ├── types/                  # Tipagens e interfaces TypeScript
│   ├── utils/                  # Formatação monetária (Intl.NumberFormat) e sanitização
│   ├── App.tsx                 # Composição principal da aplicação
│   └── main.tsx                # Ponto de entrada React
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
