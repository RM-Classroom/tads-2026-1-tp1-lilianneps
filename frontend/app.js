const apiInput = document.getElementById("apiBase");
const apiStatus = document.getElementById("apiStatus");
const app = document.getElementById("app");
const template = document.getElementById("entityTemplate");

const state = {
  view: "dashboard",
  apiBase: localStorage.getItem("locadora-api") || "http://localhost:5206/api",
  data: {},
  filters: {},
  editing: {}
};

apiInput.value = state.apiBase;

const entities = {
  clientes: {
    title: "Clientes",
    subtitle: "Cadastro, edicao, exclusao e pesquisa",
    endpoint: "Clientes",
    id: "id",
    fields: [
      { name: "nome", label: "Nome", required: true },
      { name: "cpf", label: "CPF", required: true, maxLength: 11 },
      { name: "email", label: "E-mail", type: "email", required: true },
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
    subtitle: "Marcas dos veiculos",
    endpoint: "Fabricantes",
    id: "id",
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
    subtitle: "Classificacao dos veiculos",
    endpoint: "CategoriasVeiculos",
    id: "id",
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
    subtitle: "Frota disponivel para locacao",
    endpoint: "Veiculos",
    id: "id",
    fields: [
      { name: "modelo", label: "Modelo", required: true },
      { name: "anoFabricacao", label: "Ano de fabricacao", type: "number", required: true },
      { name: "quilometragem", label: "Quilometragem", type: "number", step: "0.01", required: true },
      { name: "placa", label: "Placa", required: true },
      { name: "cor", label: "Cor" },
      { name: "disponivel", label: "Disponivel", type: "select", options: [{ value: true, label: "Sim" }, { value: false, label: "Nao" }] },
      { name: "fabricanteId", label: "Id do fabricante", type: "number", required: true },
      { name: "categoriaId", label: "Id da categoria", type: "number", required: true }
    ],
    columns: ["id", "modelo", "anoFabricacao", "quilometragem", "placa", "cor", "disponivel", "fabricanteId", "categoriaId"],
    filters: [
      { name: "modelo", label: "Filtrar por modelo" },
      { name: "placa", label: "Filtrar por placa" }
    ]
  },
  alugueis: {
    title: "Alugueis",
    subtitle: "Locacoes realizadas",
    endpoint: "Alugueis",
    id: "id",
    fields: [
      { name: "clienteId", label: "Id do cliente", type: "number", required: true },
      { name: "veiculoId", label: "Id do veiculo", type: "number", required: true },
      { name: "dataInicio", label: "Data de inicio", type: "date", required: true },
      { name: "dataFim", label: "Data final", type: "date", required: true },
      { name: "dataDevolucao", label: "Data de devolucao", type: "date" },
      { name: "kmInicial", label: "KM inicial", type: "number", step: "0.01", required: true },
      { name: "kmFinal", label: "KM final", type: "number", step: "0.01" },
      { name: "valorDiaria", label: "Valor da diaria", type: "number", step: "0.01", required: true },
      { name: "valorTotal", label: "Valor total", type: "number", step: "0.01" },
      { name: "statusAluguel", label: "Status", required: true }
    ],
    columns: ["id", "clienteId", "veiculoId", "dataInicio", "dataFim", "dataDevolucao", "kmInicial", "kmFinal", "valorDiaria", "valorTotal", "statusAluguel"],
    filters: [
      { name: "clienteId", label: "Filtrar por clienteId" },
      { name: "statusAluguel", label: "Filtrar por status" }
    ]
  },
  pagamentos: {
    title: "Pagamentos",
    subtitle: "Pagamentos das locacoes",
    endpoint: "Pagamentos",
    id: "id",
    fields: [
      { name: "aluguelId", label: "Id do aluguel", type: "number", required: true },
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

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    state.view = button.dataset.view;
    render();
  });
});

loadAll();

async function loadAll() {
  setStatus("Carregando dados...", "");
  try {
    await Promise.all(Object.entries(entities).map(async ([key, config]) => {
      state.data[key] = await request(config.endpoint);
    }));
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
      message = data.title || JSON.stringify(data);
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

function render() {
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

function renderDashboard() {
  const counts = Object.keys(entities).map((key) => ({
    label: entities[key].title,
    value: (state.data[key] || []).length
  }));

  app.innerHTML = `
    <section class="dashboard-grid">
      ${counts.map((item) => `
        <div class="metric">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `).join("")}
    </section>
    <section class="panel">
      <div class="section-title">
        <div>
          <p class="eyebrow">Visao geral</p>
          <h2>Fluxo principal do sistema</h2>
        </div>
        <button class="ghost-button" type="button" data-action="reload">Recarregar dados</button>
      </div>
      <ul class="help-list">
        <li>Cadastre fabricantes e categorias antes de cadastrar veiculos.</li>
        <li>Cadastre clientes e veiculos antes de registrar alugueis.</li>
        <li>Cadastre pagamentos depois do aluguel criado.</li>
        <li>Use a aba Consultas para visualizar alugueis completos, por cliente, por veiculo, por periodo e com pagamento.</li>
      </ul>
    </section>
  `;

  app.querySelector("[data-action='reload']").addEventListener("click", loadAll);
}

function renderEntity(key) {
  const config = entities[key];
  const node = template.content.cloneNode(true);
  const section = node.querySelector(".entity-layout");
  const form = node.querySelector(".entity-form");

  node.querySelector(".entity-title").textContent = config.title;
  node.querySelector(".entity-subtitle").textContent = config.subtitle;
  node.querySelector(".form-title").textContent = config.title;
  node.querySelector(".reload-button").addEventListener("click", loadAll);
  node.querySelector(".new-button").addEventListener("click", () => {
    state.editing[key] = null;
    renderEntity(key);
  });
  node.querySelector(".clear-button").addEventListener("click", () => {
    state.editing[key] = null;
    renderEntity(key);
  });
  node.querySelector(".save-button").addEventListener("click", () => saveRecord(key, form));

  const filters = node.querySelector(".filters");
  config.filters.forEach((filter) => {
    const wrapper = document.createElement("div");
    wrapper.className = "filter-field";
    wrapper.innerHTML = `
      <label>${filter.label}</label>
      <input data-filter="${filter.name}" value="${escapeHtml((state.filters[key] || {})[filter.name] || "")}">
    `;
    wrapper.querySelector("input").addEventListener("input", (event) => {
      state.filters[key] = state.filters[key] || {};
      state.filters[key][filter.name] = event.target.value;
      renderTable(key, section);
    });
    filters.appendChild(wrapper);
  });

  renderForm(config, form, state.editing[key]);
  app.replaceChildren(node);
  renderTable(key, app);
}

function renderForm(config, form, record) {
  form.innerHTML = "";
  const id = record ? record[config.id] : "";
  const idField = document.createElement("input");
  idField.type = "hidden";
  idField.name = config.id;
  idField.value = id;
  form.appendChild(idField);

  form.closest(".form-panel").querySelector(".form-mode").textContent = record ? `Editando ID ${id}` : "Cadastro";

  config.fields.forEach((field) => {
    const wrapper = document.createElement("div");
    wrapper.className = "field";
    const value = record ? record[field.name] : "";

    if (field.type === "select") {
      wrapper.innerHTML = `
        <label>${field.label}</label>
        <select name="${field.name}">
          ${field.options.map((option) => `<option value="${option.value}" ${String(value) === String(option.value) ? "selected" : ""}>${option.label}</option>`).join("")}
        </select>
      `;
    } else {
      wrapper.innerHTML = `
        <label>${field.label}</label>
        <input
          name="${field.name}"
          type="${field.type || "text"}"
          value="${value ?? ""}"
          ${field.required ? "required" : ""}
          ${field.step ? `step="${field.step}"` : ""}
          ${field.maxLength ? `maxlength="${field.maxLength}"` : ""}
        >
      `;
    }

    form.appendChild(wrapper);
  });
}

function renderTable(key, root) {
  const config = entities[key];
  const rows = filteredRows(key);
  const thead = root.querySelector("thead");
  const tbody = root.querySelector("tbody");

  thead.innerHTML = `
    <tr>
      ${config.columns.map((column) => `<th>${column}</th>`).join("")}
      <th>Acoes</th>
    </tr>
  `;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td class="empty-state" colspan="${config.columns.length + 1}">Nenhum registro encontrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map((row) => `
    <tr>
      ${config.columns.map((column) => `<td>${formatValue(row[column])}</td>`).join("")}
      <td>
        <div class="row-actions">
          <button class="small-button" type="button" data-edit="${row[config.id]}">Editar</button>
          <button class="small-button delete" type="button" data-delete="${row[config.id]}">Excluir</button>
        </div>
      </td>
    </tr>
  `).join("");

  tbody.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.edit);
      state.editing[key] = (state.data[key] || []).find((item) => Number(item[config.id]) === id);
      renderEntity(key);
    });
  });

  tbody.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteRecord(key, Number(button.dataset.delete)));
  });
}

function filteredRows(key) {
  const filters = state.filters[key] || {};
  return (state.data[key] || []).filter((row) => {
    return Object.entries(filters).every(([field, value]) => {
      if (!value) return true;
      return String(row[field] ?? "").toLowerCase().includes(value.toLowerCase());
    });
  });
}

async function saveRecord(key, form) {
  const config = entities[key];
  const formData = new FormData(form);
  const id = formData.get(config.id);
  const payload = {};

  config.fields.forEach((field) => {
    const raw = formData.get(field.name);
    payload[field.name] = coerceValue(raw, field);
  });

  if (id) {
    payload[config.id] = Number(id);
  }

  try {
    if (id) {
      await request(`${config.endpoint}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });
    } else {
      await request(config.endpoint, {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    state.editing[key] = null;
    await loadAll();
    state.view = key;
    renderEntity(key);
  } catch (error) {
    alert(error.message);
  }
}

async function deleteRecord(key, id) {
  const config = entities[key];
  if (!confirm(`Excluir registro ${id}?`)) {
    return;
  }

  try {
    await request(`${config.endpoint}/${id}`, { method: "DELETE" });
    await loadAll();
    state.view = key;
    renderEntity(key);
  } catch (error) {
    alert(error.message);
  }
}

function coerceValue(raw, field) {
  if (raw === "" && !field.required) {
    return null;
  }
  if (field.type === "number") {
    return Number(raw);
  }
  if (field.type === "select") {
    return raw === "true";
  }
  return raw;
}

function renderConsultas() {
  app.innerHTML = `
    <section class="panel">
      <div class="section-title">
        <div>
          <p class="eyebrow">Rotas com joins e filtros</p>
          <h2>Consultas de alugueis</h2>
        </div>
        <button class="ghost-button" type="button" data-action="reload">Recarregar base</button>
      </div>
      <div class="query-grid">
        <div class="query-card">
          <h3>Alugueis completos</h3>
          <button class="primary-button" data-query="completo" type="button">Consultar</button>
        </div>
        <div class="query-card">
          <h3>Por cliente</h3>
          <div class="query-form">
            <input id="consultaCliente" placeholder="Ex.: Ana">
            <button class="primary-button" data-query="cliente" type="button">Consultar</button>
          </div>
        </div>
        <div class="query-card">
          <h3>Por veiculo</h3>
          <div class="query-form">
            <input id="consultaVeiculo" placeholder="Ex.: Corolla">
            <button class="primary-button" data-query="veiculo" type="button">Consultar</button>
          </div>
        </div>
        <div class="query-card">
          <h3>Por periodo</h3>
          <div class="query-form">
            <input id="periodoInicio" type="date" value="2026-06-01">
            <input id="periodoFim" type="date" value="2026-06-30">
            <button class="primary-button" data-query="periodo" type="button">Consultar</button>
          </div>
        </div>
        <div class="query-card">
          <h3>Com pagamento</h3>
          <button class="primary-button" data-query="pagamento" type="button">Consultar</button>
        </div>
      </div>
    </section>
    <section class="panel result-box">
      <div class="section-title compact">
        <div>
          <p class="eyebrow">Resultado</p>
          <h3>Dados retornados pela API</h3>
        </div>
      </div>
      <div id="queryResult" class="table-wrap">
        <p class="empty-state">Escolha uma consulta acima.</p>
      </div>
    </section>
  `;

  app.querySelector("[data-action='reload']").addEventListener("click", loadAll);
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
        <tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr>${columns.map((column) => `<td>${formatValue(row[column])}</td>`).join("")}</tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function setStatus(message, type) {
  apiStatus.textContent = message;
  apiStatus.className = `status ${type}`;
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "boolean") {
    return value ? "Sim" : "Nao";
  }
  return escapeHtml(String(value));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
