# Frontend - Locadora de Veiculos

Este frontend foi criado para consumir o backend ASP.NET Core da primeira etapa do trabalho.

## Entregaveis

- `index.html`: aplicacao principal integrada com a API.
- `styles.css`: estilos da aplicacao.
- `app.js`: regras de tela, chamadas REST, CRUD e filtros.
- `wireframes.html`: wireframes de media fidelidade para documentacao.
- `roteiro-pitch.md`: roteiro sugerido para o video de 3 a 5 minutos.

## Funcionalidades atendidas

- Telas de cadastro, edicao, exclusao e listagem para:
  - Clientes
  - Fabricantes
  - Categorias de veiculos
  - Veiculos
  - Alugueis
  - Pagamentos
- Pesquisa com pelo menos dois filtros por entidade.
- Tela de consultas usando rotas do backend:
  - `/api/Alugueis/completo`
  - `/api/Alugueis/por-cliente/{nome}`
  - `/api/Alugueis/por-veiculo/{modelo}`
  - `/api/Alugueis/por-periodo`
  - `/api/Alugueis/com-pagamento`

## Como executar

Primeiro execute o backend:

```powershell
dotnet run --project ".\Locadora\Locadora.csproj"
```

Depois abra o arquivo:

```text
frontend/index.html
```

Ou execute um servidor estatico dentro da pasta `frontend`:

```powershell
cd frontend
python -m http.server 5500
```

E acesse:

```text
http://localhost:5500
```

## Observacao sobre CORS

Se o navegador bloquear as requisicoes para `http://localhost:5206/api`, adicione CORS no `Program.cs` do backend.

Antes de `var app = builder.Build();`, adicione:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

Depois de `app.UseHttpsRedirection();`, adicione:

```csharp
app.UseCors("PermitirFrontend");
```

## Link sugerido para wireframes

Depois de subir para o GitHub, use este arquivo como link dos wireframes:

```text
https://github.com/RM-Classroom/tads-2026-1-tp1-lilianneps/blob/main/frontend/wireframes.html
```
