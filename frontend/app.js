const apiInput = document.getElementById("apiBase");
const apiStatus = document.getElementById("apiStatus");
const app = document.getElementById("app");

const state = {
  view: "home",
  apiBase: localStorage.getItem("locadora-api") || "http://localhost:5206/api",
  data: {},
  filters: {},
  modal: null
};

apiInput.value = state.apiBase;

const entities = {
  clientes: {
    title: "Clientes",
    singular: "Cliente",
    endpoint: "Clientes",
    fields: [
      { name: "nome", label: "Nome", required: true },
      { name: "cpf", label: "CPF", required: true, maxLength: 11 },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "telefone", label: "Telefone" },
      { name: "cnh", label: "CNH" }
    ],
    columns: ["id", "nome", "cpf", "email", "telefone", "cnh"],
    filters: [
      { name: "nome", label: "Filtrar por nome" },
      { name: "cpf", label: "Filtrar por CPF" }
    ]
  },
  fabricantes: {
    title: "Fabricantes",
    singular: "Fabricante",
    endpoint: "Fabricantes",
    fields: [
      { name: "nome", label: "Nome", required: true },
      { name: "paisOrigem", label: "Pais de origem" }
    ],
    columns: ["id", "nome", "paisOrigem"],
    filters: [
      { name: "nome", label: "Filtrar por nome" },
      { name: "paisOrigem", label: "Filtrar por pais" }
    ]
  },
  categorias: {
    title: "Categorias",
    singular: "Categoria",
    endpoint: "CategoriasVeiculos",
    fields: [
      { name: "nome", label: "Nome", required: true },
      { name: "descricao", label: "Descricao" }
    ],
    columns: ["id", "nome", "descricao"],
    filters: [
      { name: "nome", label: "Filtrar por nome" },
      { name: "descricao", label: "Filtrar por descricao" }
    ]
  },
  veiculos: {
    title: "Veiculos",
    singular: "Veiculo",
    endpoint: "Veiculos",
    fields: [
      { name: "modelo", label: "Modelo", required: true },
      { name: "anoFabricacao", label: "Ano de fabricacao", type: "number", required: true },
      { name: "quilometragem", label: "Quilometragem", type: "number", step: "0.01", required: true },
      { name: "placa", label: "Placa", required: true },
      { name: "cor", label: "Cor" },
      { name: "disponivel", label: "Disponivel", type: "select", options: [{ value: true, label: "Sim" }, { value: false, label: "Nao" }] },
      { name: "fabricanteId", label: "Fabricante", type: "lookup", source: "fabricantes", required: true },
      { name: "categoriaId", label: "Categoria", type: "lookup", source: "categorias", required: true }
    ],
    columns: ["id", "modelo", "anoFabricacao", "quilometragem", "placa", "cor", "disponivel", "fabricanteId", "categoriaId"],
    filters: [
      { name: "modelo", label: "Filtrar por modelo" },
      { name: "placa", label: "Filtrar por placa" }
    ]
  },
  alugueis: {
    title: "Alugueis",
    singular: "Aluguel",
    endpoint: "Alugueis",
    fields: [
      { name: "clienteId", label: "Cliente", type: "lookup", source: "clientes", required: true },
      { name: "veiculoId", label: "Veiculo", type: "lookup", source: "veiculos", required: true },
      { name: "dataInicio", label: "Data de inicio", type: "date", required: true },
      { name: "dataFim", label: "Data final", type: "date", required: true },
      { name: "dataDevolucao", label: "Data de devolucao", type: "date" },
      { name: "kmInicial", label: "KM inicial", type: "number", step: "0.01", required: true },
      { name: "kmFinal", label: "KM final", type: "number", step: "0.01" },
      { name: "valorDiaria", label: "Valor da diaria", type: "number", step: "0.01", required: true },
      { name: "valorTotal", label: "Valor total", type: "number", step: "0.01" },
      { name: "statusAluguel", label: "Status", required: true }
    ],
    columns: ["id", "clienteId", "veiculoId", "dataInicio", "dataFim", "dataDevolucao", "valorTotal", "statusAluguel"],
    filters: [
      { name: "clienteId", label: "Filtrar por cliente" },
      { name: "statusAluguel", label: "Filtrar por status" }
    ]
  },
  pagamentos: {
    title: "Pagamentos",
    singular: "Pagamento",
    endpoint: "Pagamentos",
    fields: [
      { name: "aluguelId", label: "Aluguel", type: "lookup", source: "alugueis", required: true },
      { name: "dataPagamento", label: "Data do pagamento", type: "date", required: true },
      { name: "valorPago", label: "Valor pago", type: "number", step: "0.01", required: true },
      { name: "metodoPagamento", label: "Metodo de pagamento", required: true },
      { name: "statusPagamento", label: "Status", required: true }
    ],
    columns: ["id", "aluguelId", "dataPagamento", "valorPago", "metodoPagamento", "statusPagamento"],
    filters: [
      { name: "metodoPagamento", label: "Filtrar por metodo" },
      { name: "statusPagamento", label: "Filtrar por status" }
    ]
  }
};

document.getElementById("saveApi").addEventListener("click", async () => {
  state.apiBase = apiInput.value.replace(/\/$/, "");
  localStorage.setItem("locadora-api", state.apiBase);
  await loadAll();
});

document.getElementById("homeButton").addEventListener("click", () => {
  state.view = "home";
  setActiveNav();
  render();
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    setActiveNav();
    render();
  });
});

loadAll();

async function loadAll() {
  setStatus("Carregando dados...", "");

  try {
    for (const [key, config] of Object.entries(entities)) {
      state.data[key] = await request(config.endpoint);
    }
    setStatus("Conectado ao backend", "ok");
  } catch (error) {
    setStatus(error.message, "error");
  }

  render();
}

async function request(path, options = {}) {
  const response = await fetch(`${state.apiBase}/${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const data = await response.json();

if (data.errors) {
  message = Object.entries(data.errors)
    .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
    .join("\n");
} else {
  message = data.detail || data.title || JSON.stringify(data);
}
    } catch {
      message = await response.text() || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function setActiveNav() {
  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.view);
  });
}

function render() {
  if (state.view === "home") {
    renderHome();
    return;
  }

  if (state.view === "dashboard") {
    renderDashboard();
    return;
  }

  if (state.view === "consultas") {
    renderConsultas();
    return;
  }

  renderEntity(state.view);
}

function renderHome() {
  app.innerHTML = `
    <section class="home-screen">
      <img class="home-logo" src="assets/logoAlugafacil.PNG" alt="AlugaFacil Locadora de Veiculos">
    </section>
  `;
}

function renderDashboard() {
  const cards = Object.keys(entities).map((key) => ({
    title: entities[key].title,
    value: (state.data[key] || []).length
  }));

  app.innerHTML = `
    <section class="dashboard-page">
      <div class="dashboard-cards">
        ${cards.map((card) => `
          <button class="dashboard-card" type="button" data-open-card="${card.title.toLowerCase()}">
            <strong>${card.title}</strong>
            <span>${card.value}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderEntity(key) {
  const config = entities[key];
  const rows = filteredRows(key);

  app.innerHTML = `
    <section class="list-page">
      <div class="list-header">
        <h2>${config.title}</h2>
      </div>

      <div class="list-toolbar">
        <div class="filters">
          ${config.filters.map((filter) => `
            <label class="filter-field">
              <span>${filter.label}</span>
              <input data-filter="${filter.name}" value="${escapeHtml((state.filters[key] || {})[filter.name] || "")}">
            </label>
          `).join("")}
        </div>
        <button class="new-record-button" type="button" data-new-record>Novo Registro</button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              ${config.columns.map((column) => `<th>${labelForColumn(column)}</th>`).join("")}
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            ${rows.length ? rows.map((row) => rowHtml(key, row)).join("") : emptyRow(config.columns.length + 1)}
          </tbody>
        </table>
      </div>
    </section>
  `;

  app.querySelector("[data-new-record]").addEventListener("click", () => openFormModal(key));

  app.querySelectorAll("[data-filter]").forEach((input) => {
    input.addEventListener("input", (event) => {
      state.filters[key] = state.filters[key] || {};
      state.filters[key][event.target.dataset.filter] = event.target.value;
      updateEntityTable(key);
    });
  });

  app.querySelectorAll("[data-consult]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = findRecord(key, button.dataset.consult);
      openDetailsModal(key, record);
    });
  });

  app.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = findRecord(key, button.dataset.edit);
      openFormModal(key, record);
    });
  });

  app.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => openDeleteModal(key, button.dataset.delete));
  });
}

function updateEntityTable(key) {
  const config = entities[key];
  const rows = filteredRows(key);
  const tbody = app.querySelector("tbody");

  if (!tbody) {
    return;
  }

  tbody.innerHTML = rows.length
    ? rows.map((row) => rowHtml(key, row)).join("")
    : emptyRow(config.columns.length + 1);

  bindRowActions(key);
}

function bindRowActions(key) {
  app.querySelectorAll("[data-consult]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = findRecord(key, button.dataset.consult);
      openDetailsModal(key, record);
    });
  });

  app.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const record = findRecord(key, button.dataset.edit);
      openFormModal(key, record);
    });
  });

  app.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => openDeleteModal(key, button.dataset.delete));
  });
}

function rowHtml(key, row) {
  const config = entities[key];

  return `
    <tr>
      ${config.columns.map((column) => `<td>${formatField(key, column, row[column])}</td>`).join("")}
      <td>
        <div class="row-actions">
          <button class="action-button consult" type="button" data-consult="${row.id}">Consultar</button>
          <button class="action-button edit" type="button" data-edit="${row.id}">Editar</button>
          <button class="action-button delete" type="button" data-delete="${row.id}">Excluir</button>
        </div>
      </td>
    </tr>
  `;
}

function emptyRow(colspan) {
  return `<tr><td class="empty-state" colspan="${colspan}">Nenhum registro encontrado.</td></tr>`;
}

function filteredRows(key) {
  const filters = state.filters[key] || {};
  return (state.data[key] || []).filter((row) => {
    return Object.entries(filters).every(([field, value]) => {
      if (!value) return true;
      return filterText(key, field, row[field]).toLowerCase().includes(value.toLowerCase());
    });
  });
}

function filterText(key, field, value) {
  if (field.endsWith("Id")) {
    return `${value ?? ""} ${formatField(key, field, value)}`;
  }
  return String(value ?? "");
}

function findRecord(key, id) {
  return (state.data[key] || []).find((item) => Number(item.id) === Number(id));
}

function openDetailsModal(key, record) {
  const config = entities[key];
  const rows = ["id", ...config.fields.map((field) => field.name)];

  openModal({
    title: `Consultar ${config.singular}`,
    size: "small",
    content: `
      <div class="details-list">
        ${rows.map((name) => `
          <div class="details-row">
            <strong>${labelForColumn(name)}</strong>
            <span>${formatField(key, name, record?.[name])}</span>
          </div>
        `).join("")}
      </div>
    `,
    actions: [
      { label: "Fechar", className: "modal-secondary", onClick: closeModal }
    ]
  });
}

function openFormModal(key, record = null) {
  const config = entities[key];
  const isEdit = Boolean(record);

  openModal({
    title: `${isEdit ? "Editar" : "Cadastrar"} ${config.singular}`,
    size: "small",
    content: `
      <form id="recordForm" class="modal-form">
        ${isEdit ? `<input type="hidden" name="id" value="${record.id}">` : ""}
        ${config.fields.map((field) => fieldHtml(field, record)).join("")}
      </form>
    `,
    actions: [
      { label: "Cancelar", className: "modal-secondary", onClick: closeModal },
      { label: isEdit ? "Salvar" : "Cadastrar", className: "modal-primary", onClick: () => saveRecord(key, record) }
    ]
  });
}

function fieldHtml(field, record) {
  const value = record ? record[field.name] : "";

  if (field.type === "lookup") {
    const options = state.data[field.source] || [];
    return `
      <label class="modal-field">
        <span>${field.label}</span>
        <select name="${field.name}" ${field.required ? "required" : ""}>
          <option value="">Selecione</option>
          ${options.map((option) => `
            <option value="${option.id}" ${Number(value) === Number(option.id) ? "selected" : ""}>${escapeHtml(lookupLabel(field.source, option))}</option>
          `).join("")}
        </select>
      </label>
    `;
  }

  if (field.type === "select") {
    return `
      <label class="modal-field">
        <span>${field.label}</span>
        <select name="${field.name}" ${field.required ? "required" : ""}>
          ${field.options.map((option) => `
            <option value="${option.value}" ${String(value) === String(option.value) ? "selected" : ""}>${option.label}</option>
          `).join("")}
        </select>
      </label>
    `;
  }

  return `
    <label class="modal-field">
      <span>${field.label}</span>
      <input
        name="${field.name}"
        type="${field.type || "text"}"
        value="${escapeHtml(value ?? "")}"
        ${field.required ? "required" : ""}
        ${field.step ? `step="${field.step}"` : ""}
        ${field.maxLength ? `maxlength="${field.maxLength}"` : ""}
      >
    </label>
  `;
}

async function saveRecord(key, record) {
  const config = entities[key];
  const form = document.getElementById("recordForm");

  if (!form.reportValidity()) {
    return;
  }

  const formData = new FormData(form);
  const payload = {};

  config.fields.forEach((field) => {
    payload[field.name] = coerceValue(formData.get(field.name), field);
  });

  if (record) {
    payload.id = Number(record.id);
  }

  try {
    if (record) {
      await request(`${config.endpoint}/${record.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      await request(config.endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }

    closeModal();
    await loadAll();
    state.view = key;
    setActiveNav();
    renderEntity(key);
  } catch (error) {
    showModalMessage(error.message, "error");
  }
}

function openDeleteModal(key, id) {
  const config = entities[key];

  openModal({
    title: `Excluir ${config.singular}`,
    size: "small",
    content: `<p class="modal-text">Deseja excluir o registro ${id}? Essa acao nao pode ser desfeita.</p>`,
    actions: [
      { label: "Cancelar", className: "modal-secondary", onClick: closeModal },
      { label: "Excluir", className: "modal-danger", onClick: () => deleteRecord(key, id) }
    ]
  });
}

async function deleteRecord(key, id) {
  const config = entities[key];

  try {
    await request(`${config.endpoint}/${id}`, { method: "DELETE" });
    closeModal();
    await loadAll();
    state.view = key;
    setActiveNav();
    renderEntity(key);
  } catch (error) {
    showModalMessage(error.message, "error");
  }
}

function coerceValue(raw, field) {
  if (raw === "" && !field.required) {
    return null;
  }
  if (field.type === "number" || field.type === "lookup") {
    return Number(raw);
  }
  if (field.type === "select") {
    return raw === "true";
  }
  return raw;
}

function renderConsultas() {
  app.innerHTML = `
    <section class="consultas-page">
      <h2>Consultas de Alugueis</h2>
      <div class="consulta-grid">
        <label>
          <span>Aluguel completo</span>
          <button class="consulta-button" data-query="completo" type="button">Consultar</button>
        </label>
        <label>
          <span>Por cliente</span>
          <input id="consultaCliente" value="Ana">
          <button class="consulta-button" data-query="cliente" type="button">Consultar</button>
        </label>
        <label>
          <span>Por veiculo</span>
          <input id="consultaVeiculo" value="Corolla">
          <button class="consulta-button" data-query="veiculo" type="button">Consultar</button>
        </label>
        <label>
          <span>Por periodo</span>
          <div class="date-row">
            <input id="periodoInicio" type="date" value="2026-06-01">
            <input id="periodoFim" type="date" value="2026-06-30">
          </div>
          <button class="consulta-button" data-query="periodo" type="button">Consultar</button>
        </label>
        <label>
          <span>Com pagamento</span>
          <button class="consulta-button" data-query="pagamento" type="button">Consultar</button>
        </label>
      </div>

      <h3>Resultado da Consulta</h3>
      <div id="queryResult" class="table-wrap">
        <p class="empty-state">Escolha uma consulta acima.</p>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => runConsulta(button.dataset.query));
  });
}

async function runConsulta(type) {
  const result = document.getElementById("queryResult");
  result.innerHTML = `<p class="empty-state">Consultando...</p>`;

  const routes = {
    completo: "Alugueis/completo",
    cliente: `Alugueis/por-cliente/${encodeURIComponent(document.getElementById("consultaCliente").value || "Ana")}`,
    veiculo: `Alugueis/por-veiculo/${encodeURIComponent(document.getElementById("consultaVeiculo").value || "Corolla")}`,
    periodo: `Alugueis/por-periodo?inicio=${document.getElementById("periodoInicio").value}&fim=${document.getElementById("periodoFim").value}`,
    pagamento: "Alugueis/com-pagamento"
  };

  try {
    const data = await request(routes[type]);
    result.innerHTML = buildGenericTable(data);
  } catch (error) {
    result.innerHTML = `<p class="message error">${escapeHtml(error.message)}</p>`;
  }
}

function buildGenericTable(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return `<p class="empty-state">Nenhum resultado encontrado.</p>`;
  }

  const columns = Object.keys(rows[0]);
  return `
    <table>
      <thead>
        <tr>${columns.map((column) => `<th>${labelForColumn(column)}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr>${columns.map((column) => `<td>${formatPlainValue(row[column])}</td>`).join("")}</tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function openModal({ title, content, actions = [], size = "normal" }) {
  closeModal();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal ${size === "small" ? "modal-small" : ""}" role="dialog" aria-modal="true">
      <button class="modal-close" type="button" aria-label="Fechar">x</button>
      <h2>${title}</h2>
      <div class="modal-message" hidden></div>
      <div class="modal-body">${content}</div>
      <div class="modal-actions"></div>
    </div>
  `;

  const actionsContainer = overlay.querySelector(".modal-actions");
  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.className = action.className || "modal-secondary";
    button.addEventListener("click", action.onClick);
    actionsContainer.appendChild(button);
  });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });
  overlay.querySelector(".modal-close").addEventListener("click", closeModal);

  document.body.appendChild(overlay);
  state.modal = overlay;
}

function closeModal() {
  if (state.modal) {
    state.modal.remove();
    state.modal = null;
  }
}

function showModalMessage(message, type) {
  const box = state.modal?.querySelector(".modal-message");
  if (!box) return;
  box.hidden = false;
  box.textContent = message;
  box.className = `modal-message ${type}`;
}

function formatField(entityKey, column, value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (column === "fabricanteId") return escapeHtml(lookupById("fabricantes", value));
  if (column === "categoriaId") return escapeHtml(lookupById("categorias", value));
  if (column === "clienteId") return escapeHtml(lookupById("clientes", value));
  if (column === "veiculoId") return escapeHtml(lookupById("veiculos", value));
  if (column === "aluguelId") return escapeHtml(lookupById("alugueis", value));

  if (typeof value === "boolean") {
    return value ? "Sim" : "Nao";
  }

  return escapeHtml(String(value));
}

function formatPlainValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "boolean") {
    return value ? "Sim" : "Nao";
  }
  return escapeHtml(String(value));
}

function lookupById(source, id) {
  const record = (state.data[source] || []).find((item) => Number(item.id) === Number(id));
  return record ? lookupLabel(source, record) : String(id);
}

function lookupLabel(source, record) {
  if (source === "clientes") return `${record.nome} - ${record.cpf}`;
  if (source === "veiculos") return `${record.modelo} - ${record.placa}`;
  if (source === "alugueis") return `Aluguel ${record.id} - cliente ${record.clienteId}`;
  if (source === "fabricantes") return record.nome;
  if (source === "categorias") return record.nome;
  return record.nome || record.id;
}

function labelForColumn(column) {
  const labels = {
    id: "ID",
    nome: "Nome",
    cpf: "CPF",
    email: "Email",
    telefone: "Telefone",
    cnh: "CNH",
    paisOrigem: "Pais Origem",
    descricao: "Descricao",
    modelo: "Modelo",
    anoFabricacao: "Ano",
    quilometragem: "KM",
    placa: "Placa",
    cor: "Cor",
    disponivel: "Disponivel",
    fabricanteId: "Fabricante",
    categoriaId: "Categoria",
    clienteId: "Cliente",
    veiculoId: "Veiculo",
    aluguelId: "Aluguel",
    dataInicio: "Data Inicio",
    dataFim: "Data Fim",
    dataDevolucao: "Data Devolucao",
    kmInicial: "KM Inicial",
    kmFinal: "KM Final",
    valorDiaria: "Valor Diaria",
    valorTotal: "Valor Total",
    statusAluguel: "Status",
    dataPagamento: "Data Pagamento",
    valorPago: "Valor Pago",
    metodoPagamento: "Metodo",
    statusPagamento: "Status"
  };

  return labels[column] || column;
}

function setStatus(message, type) {
  apiStatus.textContent = message;
  apiStatus.className = `status ${type}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
