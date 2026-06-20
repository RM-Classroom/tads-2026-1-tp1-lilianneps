# Locadora de Veículos

Projeto de backend desenvolvido em ASP.NET Core com Entity Framework Core e SQL Server Express.

O sistema permite o gerenciamento de clientes, veículos, fabricantes, categorias, aluguéis e pagamentos, com APIs REST documentadas pelo Swagger.

## Tecnologias utilizadas

- C#
- ASP.NET Core
- Entity Framework Core
- SQL Server Express
- Swagger

## Entidades do sistema

O projeto possui as seguintes entidades:

- Cliente
- Fabricante
- Categoria de Veículo
- Veículo
- Aluguel
- Pagamento

## Funcionalidades

O sistema possui CRUD completo para:

- Clientes
- Fabricantes
- Categorias de Veículos
- Veículos
- Aluguéis
- Pagamentos

Também possui rotas de filtros com relacionamento entre tabelas para consulta de aluguéis.

## Como executar o projeto

### 1. Restaurar os pacotes

Na raiz do projeto, execute:

```powershell
dotnet restore ".\Locadora\Locadora.csproj"
