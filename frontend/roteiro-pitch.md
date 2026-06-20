# Roteiro do pitch - 3 a 5 minutos

## 0:00 a 0:40 - Problema

Apresentar o problema: uma locadora precisa controlar clientes, veiculos, fabricantes, categorias, alugueis e pagamentos de forma integrada.

Falar que o objetivo do sistema e permitir cadastro, consulta, atualizacao e exclusao dos dados, alem de consultas especificas para acompanhar as locacoes.

## 0:40 a 1:30 - Modelagem

Explicar rapidamente as entidades:

- Cliente possui nome, CPF, email, telefone e CNH.
- Veiculo possui modelo, ano, quilometragem, placa, cor, fabricante e categoria.
- Fabricante e categoria organizam a frota.
- Aluguel liga cliente e veiculo em um periodo.
- Pagamento registra o pagamento de um aluguel.

Destacar que os relacionamentos foram implementados com Entity Framework e SQL Server Express.

## 1:30 a 2:20 - Backend e banco

Mostrar rapidamente o Swagger.

Falar que o backend possui CRUD para todas as entidades:

- Clientes
- Fabricantes
- Categorias de veiculos
- Veiculos
- Alugueis
- Pagamentos

Mostrar tambem que o banco pode ser recriado com migrations e dados iniciais.

## 2:20 a 3:30 - Frontend

Mostrar o frontend.

Passar pelas telas:

- Painel principal com totais.
- Tela de clientes com filtros por nome e CPF.
- Tela de veiculos com filtros por modelo e placa.
- Tela de alugueis com cadastro, edicao, exclusao e filtros.

Demonstrar um cadastro simples ou uma edicao.

## 3:30 a 4:30 - Consultas integradas

Mostrar pelo menos duas consultas:

1. Alugueis completos:
   - Rota: `/api/Alugueis/completo`
   - Resultado: cliente, veiculo, periodo e valor.

2. Alugueis com pagamento:
   - Rota: `/api/Alugueis/com-pagamento`
   - Resultado: cliente, veiculo, valor total, valor pago e metodo de pagamento.

Tambem pode mostrar consulta por cliente ou por veiculo.

## 4:30 a 5:00 - Fechamento

Concluir dizendo que o sistema integra frontend, backend e banco de dados, permitindo operacao completa da locadora e visualizacao das informacoes principais para tomada de decisao.
