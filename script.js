let cotacaoDolarAtual = 0; // Variável global para armazenar a cotação
let autoConvertTimeout = null;
let apiCallCount = 0;
const COTACAO_LOCAL_KEY = "conversorCotacaoDolar";
const HISTORICO_LOCAL_KEY = "conversorHistoricoCotacao";

function atualizarConsumoApi() {
  const elementoApi = document.getElementById("apiConsumo");
  if (elementoApi) {
    elementoApi.textContent = apiCallCount;
  }
}

function salvarCotacaoLocal(cotacao, timestamp) {
  localStorage.setItem(
    COTACAO_LOCAL_KEY,
    JSON.stringify({ cotacao, timestamp }),
  );
}

function carregarCotacaoLocal() {
  const raw = localStorage.getItem(COTACAO_LOCAL_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function salvarHistoricoLocal(historico) {
  localStorage.setItem(HISTORICO_LOCAL_KEY, JSON.stringify(historico));
}

function carregarHistoricoLocal() {
  const raw = localStorage.getItem(HISTORICO_LOCAL_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function exibirCotacaoAtual(cotacao, offline = false, timestamp = null) {
  const cotacaoAtualElement = document.getElementById("cotacaoAtual");
  if (!cotacaoAtualElement) return;

  cotacaoAtualElement.style.fontWeight = "bold";
  cotacaoAtualElement.style.fontSize = "1.2em";
  cotacaoAtualElement.style.margin = "20px 0";

  if (cotacao > 0) {
    const textoValor = `R$ ${cotacao.toFixed(2).replace(".", ",")}`;
    if (offline) {
      const ultimaData = timestamp
        ? new Date(timestamp).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "desconhecida";
      cotacaoAtualElement.textContent = `Offline. Não foi possível atualizar. Última cotação conhecida: ${textoValor} (${ultimaData})`;
      cotacaoAtualElement.style.color = "#ebcb8b";
    } else {
      cotacaoAtualElement.textContent = `Dólar atual: ${textoValor}`;
      cotacaoAtualElement.style.color = "#a3be8c";
    }
  } else {
    cotacaoAtualElement.textContent =
      "Não foi possível obter a cotação. Tente novamente mais tarde.";
    cotacaoAtualElement.style.color = "#bf616a";
  }
}

// Função para buscar a cotação do dólar
async function buscarCotacaoDolar() {
  const cotacaoAtualElement = document.getElementById("cotacaoAtual");

  try {
    // Requisição à API Awesome API para a cotação BRL/USD
    const response = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL",
    );
    apiCallCount += 1;
    atualizarConsumoApi();
    const data = await response.json();

    // Acessa o valor de "bid" (preço de compra) do dólar
    cotacaoDolarAtual = parseFloat(data.USDBRL.bid);
    salvarCotacaoLocal(cotacaoDolarAtual, Date.now());
    exibirCotacaoAtual(cotacaoDolarAtual);
  } catch (error) {
    console.error("Erro ao buscar cotação do dólar:", error);
    const local = carregarCotacaoLocal();
    if (local && local.cotacao > 0) {
      cotacaoDolarAtual = parseFloat(local.cotacao);
      exibirCotacaoAtual(cotacaoDolarAtual, true, local.timestamp);
    } else {
      cotacaoDolarAtual = 0;
      exibirCotacaoAtual(cotacaoDolarAtual);
    }
  }
}

async function buscarHistoricoCotacao() {
  try {
    const response = await fetch(
      "https://economia.awesomeapi.com.br/json/daily/USD-BRL/7",
    );
    apiCallCount += 1;
    atualizarConsumoApi();
    const data = await response.json();
    salvarHistoricoLocal(data);
    renderGraficoCotacao(data);
  } catch (error) {
    console.error("Erro ao buscar histórico de cotação:", error);
    const historicoLocal = carregarHistoricoLocal();
    if (historicoLocal) {
      renderGraficoCotacao(historicoLocal);
    }
  }
}

function renderGraficoCotacao(historico) {
  const canvas = document.getElementById("graficoCotacao");
  if (!canvas || !canvas.getContext) return;

  const dados = Array.isArray(historico)
    ? historico.slice()
    : Object.values(historico);
  if (dados.length === 0) return;

  dados.sort((a, b) => parseFloat(a.timestamp) - parseFloat(b.timestamp));

  const labels = dados.map((item) => {
    const data = new Date(parseFloat(item.timestamp) * 1000);
    return `${String(data.getDate()).padStart(2, "0")}/${String(
      data.getMonth() + 1,
    ).padStart(2, "0")}`;
  });

  const valores = dados.map((item) => parseFloat(item.bid));
  const minValor = Math.min(...valores);
  const maxValor = Math.max(...valores);
  const range = maxValor - minValor || 1;

  const elementoMaximo = document.getElementById("valorMaximo");
  const elementoMinimo = document.getElementById("valorMinimo");

  if (elementoMaximo) {
    elementoMaximo.textContent = maxValor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (elementoMinimo) {
    elementoMinimo.textContent = minValor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = 28;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = padding + (chartHeight / 3) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  const points = valores.map((valor, index) => {
    const x = padding + (chartWidth / (valores.length - 1)) * index;
    const y = padding + ((maxValor - valor) / range) * chartHeight;
    return { x, y };
  });

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.strokeStyle = "#88c0d0";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.lineTo(points[points.length - 1].x, height - padding);
  ctx.lineTo(padding, height - padding);
  ctx.closePath();
  ctx.fillStyle = "rgba(136, 192, 208, 0.18)";
  ctx.fill();

  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#88c0d0";
    ctx.fill();
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  ctx.fillStyle = "#d0d0d0";
  ctx.font = "12px Manrope, Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  points.forEach((point, index) => {
    ctx.fillText(labels[index], point.x, height - 8);
  });
}

// Função para normalizar entrada de números brasileiros
function normalizarNumerobrasileiro(valorString) {
  // Remove todos os caracteres exceto dígitos, ponto e vírgula
  valorString = valorString.replace(/[^\d.,]/g, "").trim();

  // Se não tem vírgula, assume que pontos são separadores de milhares
  if (!valorString.includes(",")) {
    valorString = valorString.replace(/\./g, "");
  } else {
    valorString = valorString.replace(/\./g, "").replace(",", ".");
  }

  return valorString;
}

// Função para validar se um número é válido após normalização
function isNumeroValido(numeroString) {
  // Verifica se após a limpeza ainda é um número válido
  const numero = parseFloat(numeroString);
  return !isNaN(numero) && numero >= 0;
}

// Função para converter Real para Dólar
function converter(isAuto = false) {
  const valorCarteiraInput = document.getElementById("valorCarteira").value;
  const resultadoElement = document.getElementById("resultado");

  // Remove a classe de erro anterior
  resultadoElement.classList.remove("error");

  // Verifica se a cotação está disponível
  if (cotacaoDolarAtual <= 0) {
    if (!isAuto) {
      resultadoElement.textContent =
        "Cotação do dólar não disponível. Não é possível converter.";
      resultadoElement.classList.add("error");
      resultadoElement.style.display = "block";
    }
    return;
  }

  // Normaliza o número brasileiro para formato internacional
  const valorNormalizado = normalizarNumerobrasileiro(valorCarteiraInput);

  // Valida se o número é válido
  if (!isNumeroValido(valorNormalizado)) {
    if (!isAuto) {
      resultadoElement.textContent = "Por favor, insira um valor válido.";
      resultadoElement.classList.add("error");
      resultadoElement.style.display = "block";
    }
    return;
  }

  // Converte para número
  const valorCarteira = parseFloat(valorNormalizado);

  // Calcula o valor em dólares
  const valorEmDolar = valorCarteira / cotacaoDolarAtual;

  // Exibe o resultado formatado no padrão brasileiro
  const valorReaisFormatado = valorCarteira.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const valorDolarFormatado = valorEmDolar.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Exibe o resultado formatado
  resultadoElement.textContent = `${valorReaisFormatado} equivalem a ${valorDolarFormatado}`;
  resultadoElement.style.display = "block";
}

// Função para formatar entrada em tempo real como moeda BRL
function formatarEntrada() {
  const campo = document.getElementById("valorCarteira");
  const valorAtual = campo.value;
  const posicaoAtual = campo.selectionStart;

  const digitosAntesCursor = valorAtual
    .slice(0, posicaoAtual)
    .replace(/\D/g, "").length;

  // Remove tudo exceto dígitos e vírgula
  let valor = valorAtual.replace(/[^\d,]/g, "");

  if (!valor) {
    campo.value = "";
    return;
  }

  const partes = valor.split(",");
  const inteiro = partes[0].replace(/^0+(?=\d)/, "") || "0";
  let decimal = partes[1] || "";

  if (decimal.length > 2) {
    decimal = decimal.slice(0, 2);
  }

  const inteiroFormatado = new Intl.NumberFormat("pt-BR").format(
    parseInt(inteiro, 10),
  );
  const novoValor = decimal
    ? `R$ ${inteiroFormatado},${decimal}`
    : `R$ ${inteiroFormatado},00`;

  campo.value = novoValor;

  let novaPosicao = 0;
  if (digitosAntesCursor === 0) {
    novaPosicao = novoValor.indexOf(" ") + 1;
  } else {
    let contadorDigitos = 0;
    for (let i = 0; i < novoValor.length; i += 1) {
      if (/\d/.test(novoValor[i])) {
        contadorDigitos += 1;
      }
      if (contadorDigitos === digitosAntesCursor) {
        novaPosicao = i + 1;
        break;
      }
    }
    if (novaPosicao === 0) {
      novaPosicao = novoValor.length;
    }
  }

  campo.setSelectionRange(novaPosicao, novaPosicao);
}

function handleKeyPress(evento) {
  // Verifica se a tecla pressionada foi Enter
  if (evento.key === "Enter") {
    // Previne comportamentos padrão (como submeter formulário)
    evento.preventDefault();

    // Chama a função de conversão
    converter();
  }
}

function agendarConversaoAutomatica() {
  if (autoConvertTimeout) {
    clearTimeout(autoConvertTimeout);
  }

  autoConvertTimeout = setTimeout(() => {
    converter(true);
  }, 500);
}

function limpar() {
  const campo = document.getElementById("valorCarteira");
  const resultadoElement = document.getElementById("resultado");

  if (campo) {
    campo.value = "";
  }

  if (resultadoElement) {
    resultadoElement.textContent = "";
    resultadoElement.classList.remove("error", "auto-convert");
    resultadoElement.style.display = "none";
  }

  if (autoConvertTimeout) {
    clearTimeout(autoConvertTimeout);
    autoConvertTimeout = null;
  }
}

// Função para atualizar a data de última atualização
function atualizarUltimaAtualizacao() {
  const elementoData = document.getElementById("ultimaAtualizacao");
  if (!elementoData) return;

  const hoje = new Date();
  elementoData.textContent = hoje.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Inicializa quando a página carrega
document.addEventListener("DOMContentLoaded", function () {
  buscarCotacaoDolar();
  atualizarUltimaAtualizacao();

  document.addEventListener("keydown", handleKeyPress);

  const campoValor = document.getElementById("valorCarteira");
  if (campoValor) {
    campoValor.addEventListener("input", () => {
      formatarEntrada();
      agendarConversaoAutomatica();
    });
  }

  buscarHistoricoCotacao();
});
