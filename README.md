# Locadora de Veiculos

Projeto de backend desenvolvido em ASP.NET Core com Entity Framework Core e SQL Server Express.

O sistema permite o gerenciamento de clientes, veiculos, fabricantes, categorias, alugueis e pagamentos, com APIs REST documentadas pelo Swagger.

## Tecnologias utilizadas
- Figma
- C#
- ASP.NET Core
- Entity Framework Core
- SQL Server Express
- Swagger

## Protótipo do Figma
[Ver protótipo no Figma](https://www.figma.com/proto/RpEMQ04PYUscNHFI9TY1Xv/Untitled?page-id=0%3A1&node-id=1-2&p=f&viewport=284%2C28%2C0.2&t=uxvE9FFbsFvoVHzE-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A2)

## Demonstração do sistema

[Assistir ao vídeo](./videoAlugafacil.mp4)

## Entidades do sistema

- Cliente
- Fabricante
- Categoria de veiculo
- Veiculo
- Aluguel
- Pagamento

## Funcionalidades

O sistema possui CRUD completo para:

- Clientes
- Fabricantes
- Categorias de veiculos
- Veiculos
- Alugueis
- Pagamentos

Tambem possui rotas de filtros com relacionamento entre tabelas para consulta de alugueis.

## Como executar o projeto

### 1. Restaurar os pacotes

Na raiz do projeto, execute:

```powershell
dotnet restore ".\Locadora\Locadora.csproj"
```

### 2. Instalar a ferramenta do Entity Framework

Caso ainda nao tenha instalado:

```powershell
dotnet tool install --global dotnet-ef
```

Para conferir:

```powershell
dotnet ef --version
```

### 3. Criar ou atualizar o banco de dados

O projeto possui migrations. Para criar o banco no SQL Server Express, execute:

```powershell
dotnet ef database update --project ".\Locadora\Locadora.csproj" --startup-project ".\Locadora\Locadora.csproj"
```

As migrations tambem inserem dados ficticios iniciais para facilitar os testes no Swagger.

### 4. Executar a aplicacao

```powershell
dotnet run --project ".\Locadora\Locadora.csproj"
```

### 5. Acessar o Swagger

Abra no navegador:

```text
http://localhost:5206/swagger
```

## String de conexao

A conexao com o banco esta configurada em `Locadora/appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=LocadoraVeiculos;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

## Endpoints principais

### Clientes

```text
GET    /api/Clientes
GET    /api/Clientes/{id}
POST   /api/Clientes
PUT    /api/Clientes/{id}
DELETE /api/Clientes/{id}
```

### Fabricantes

```text
GET    /api/Fabricantes
GET    /api/Fabricantes/{id}
POST   /api/Fabricantes
PUT    /api/Fabricantes/{id}
DELETE /api/Fabricantes/{id}
```

### Categorias de veiculos

```text
GET    /api/CategoriasVeiculos
GET    /api/CategoriasVeiculos/{id}
POST   /api/CategoriasVeiculos
PUT    /api/CategoriasVeiculos/{id}
DELETE /api/CategoriasVeiculos/{id}
```

### Veiculos

```text
GET    /api/Veiculos
GET    /api/Veiculos/{id}
POST   /api/Veiculos
PUT    /api/Veiculos/{id}
DELETE /api/Veiculos/{id}
```

### Alugueis

```text
GET    /api/Alugueis
GET    /api/Alugueis/{id}
POST   /api/Alugueis
PUT    /api/Alugueis/{id}
DELETE /api/Alugueis/{id}
```

### Pagamentos

```text
GET    /api/Pagamentos
GET    /api/Pagamentos/{id}
POST   /api/Pagamentos
PUT    /api/Pagamentos/{id}
DELETE /api/Pagamentos/{id}
```

## Rotas de filtros

O sistema possui 5 rotas de consulta com relacionamento entre tabelas:

```text
GET /api/Alugueis/completo
GET /api/Alugueis/por-cliente/{nome}
GET /api/Alugueis/por-veiculo/{modelo}
GET /api/Alugueis/por-periodo?inicio=2026-06-01&fim=2026-06-30
GET /api/Alugueis/com-pagamento
```

## Ordem recomendada para testar no Swagger

Para cadastrar registros manualmente, use esta ordem:

```text
1. Fabricantes
2. CategoriasVeiculos
3. Clientes
4. Veiculos
5. Alugueis
6. Pagamentos
```

Para excluir registros, use a ordem inversa:

```text
1. Pagamentos
2. Alugueis
3. Veiculos
4. Clientes
5. Fabricantes
6. CategoriasVeiculos
```

Essa ordem evita erros de chave estrangeira.

## Observacao sobre o banco de dados

Caso o banco ja exista e apresente conflito com as migrations, e possivel apaga-lo e recria-lo com:

```powershell
dotnet ef database drop --project ".\Locadora\Locadora.csproj" --startup-project ".\Locadora\Locadora.csproj" --force
dotnet ef database update --project ".\Locadora\Locadora.csproj" --startup-project ".\Locadora\Locadora.csproj"
```

Atencao: esse comando apaga os dados existentes no banco local.
