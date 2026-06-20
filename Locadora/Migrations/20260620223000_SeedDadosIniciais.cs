using Locadora.Models;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Locadora.Migrations
{
    [DbContext(typeof(LocadoraContext))]
    [Migration("20260620223000_SeedDadosIniciais")]
    public partial class SeedDadosIniciais : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Id] = 1) AND NOT EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Nome] = N'Toyota')
BEGIN
    SET IDENTITY_INSERT [Fabricantes] ON;
    INSERT INTO [Fabricantes] ([Id], [Nome], [PaisOrigem]) VALUES (1, N'Toyota', N'Japao');
    SET IDENTITY_INSERT [Fabricantes] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Id] = 2) AND NOT EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Nome] = N'Honda')
BEGIN
    SET IDENTITY_INSERT [Fabricantes] ON;
    INSERT INTO [Fabricantes] ([Id], [Nome], [PaisOrigem]) VALUES (2, N'Honda', N'Japao');
    SET IDENTITY_INSERT [Fabricantes] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Id] = 3) AND NOT EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Nome] = N'Chevrolet')
BEGIN
    SET IDENTITY_INSERT [Fabricantes] ON;
    INSERT INTO [Fabricantes] ([Id], [Nome], [PaisOrigem]) VALUES (3, N'Chevrolet', N'Estados Unidos');
    SET IDENTITY_INSERT [Fabricantes] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Id] = 1) AND NOT EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Nome] = N'Sedan')
BEGIN
    SET IDENTITY_INSERT [CategoriasVeiculo] ON;
    INSERT INTO [CategoriasVeiculo] ([Id], [Nome], [Descricao]) VALUES (1, N'Sedan', N'Carro de passeio confortavel');
    SET IDENTITY_INSERT [CategoriasVeiculo] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Id] = 2) AND NOT EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Nome] = N'SUV')
BEGIN
    SET IDENTITY_INSERT [CategoriasVeiculo] ON;
    INSERT INTO [CategoriasVeiculo] ([Id], [Nome], [Descricao]) VALUES (2, N'SUV', N'Veiculo utilitario esportivo');
    SET IDENTITY_INSERT [CategoriasVeiculo] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Id] = 3) AND NOT EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Nome] = N'Hatch')
BEGIN
    SET IDENTITY_INSERT [CategoriasVeiculo] ON;
    INSERT INTO [CategoriasVeiculo] ([Id], [Nome], [Descricao]) VALUES (3, N'Hatch', N'Carro compacto');
    SET IDENTITY_INSERT [CategoriasVeiculo] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [Clientes] WHERE [Id] = 1) AND NOT EXISTS (SELECT 1 FROM [Clientes] WHERE [CPF] = '12345678901')
BEGIN
    SET IDENTITY_INSERT [Clientes] ON;
    INSERT INTO [Clientes] ([Id], [Nome], [CPF], [Email], [Telefone], [CNH]) VALUES (1, N'Ana Souza', '12345678901', N'ana@email.com', N'31999990001', N'CNH123456');
    SET IDENTITY_INSERT [Clientes] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [Clientes] WHERE [Id] = 2) AND NOT EXISTS (SELECT 1 FROM [Clientes] WHERE [CPF] = '23456789012')
BEGIN
    SET IDENTITY_INSERT [Clientes] ON;
    INSERT INTO [Clientes] ([Id], [Nome], [CPF], [Email], [Telefone], [CNH]) VALUES (2, N'Bruno Lima', '23456789012', N'bruno@email.com', N'31999990002', N'CNH234567');
    SET IDENTITY_INSERT [Clientes] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [Clientes] WHERE [Id] = 3) AND NOT EXISTS (SELECT 1 FROM [Clientes] WHERE [CPF] = '34567890123')
BEGIN
    SET IDENTITY_INSERT [Clientes] ON;
    INSERT INTO [Clientes] ([Id], [Nome], [CPF], [Email], [Telefone], [CNH]) VALUES (3, N'Carla Mendes', '34567890123', N'carla@email.com', N'31999990003', N'CNH345678');
    SET IDENTITY_INSERT [Clientes] OFF;
END;

IF EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Id] = 1) AND EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Id] = 1)
   AND NOT EXISTS (SELECT 1 FROM [Veiculos] WHERE [Id] = 1) AND NOT EXISTS (SELECT 1 FROM [Veiculos] WHERE [Placa] = N'ABC1D23')
BEGIN
    SET IDENTITY_INSERT [Veiculos] ON;
    INSERT INTO [Veiculos] ([Id], [Modelo], [AnoFabricacao], [Quilometragem], [Placa], [Cor], [Disponivel], [FabricanteId], [CategoriaId]) VALUES (1, N'Corolla', 2022, 15000.00, N'ABC1D23', N'Prata', 1, 1, 1);
    SET IDENTITY_INSERT [Veiculos] OFF;
END;

IF EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Id] = 2) AND EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Id] = 2)
   AND NOT EXISTS (SELECT 1 FROM [Veiculos] WHERE [Id] = 2) AND NOT EXISTS (SELECT 1 FROM [Veiculos] WHERE [Placa] = N'DEF4G56')
BEGIN
    SET IDENTITY_INSERT [Veiculos] ON;
    INSERT INTO [Veiculos] ([Id], [Modelo], [AnoFabricacao], [Quilometragem], [Placa], [Cor], [Disponivel], [FabricanteId], [CategoriaId]) VALUES (2, N'HR-V', 2021, 28000.00, N'DEF4G56', N'Preto', 1, 2, 2);
    SET IDENTITY_INSERT [Veiculos] OFF;
END;

IF EXISTS (SELECT 1 FROM [Fabricantes] WHERE [Id] = 3) AND EXISTS (SELECT 1 FROM [CategoriasVeiculo] WHERE [Id] = 3)
   AND NOT EXISTS (SELECT 1 FROM [Veiculos] WHERE [Id] = 3) AND NOT EXISTS (SELECT 1 FROM [Veiculos] WHERE [Placa] = N'GHI7J89')
BEGIN
    SET IDENTITY_INSERT [Veiculos] ON;
    INSERT INTO [Veiculos] ([Id], [Modelo], [AnoFabricacao], [Quilometragem], [Placa], [Cor], [Disponivel], [FabricanteId], [CategoriaId]) VALUES (3, N'Onix', 2023, 9000.00, N'GHI7J89', N'Branco', 1, 3, 3);
    SET IDENTITY_INSERT [Veiculos] OFF;
END;

IF EXISTS (SELECT 1 FROM [Clientes] WHERE [Id] = 1) AND EXISTS (SELECT 1 FROM [Veiculos] WHERE [Id] = 1)
   AND NOT EXISTS (SELECT 1 FROM [Alugueis] WHERE [Id] = 1)
BEGIN
    SET IDENTITY_INSERT [Alugueis] ON;
    INSERT INTO [Alugueis] ([Id], [ClienteId], [VeiculoId], [DataInicio], [DataFim], [DataDevolucao], [KmInicial], [KmFinal], [ValorDiaria], [ValorTotal], [StatusAluguel]) VALUES (1, 1, 1, '2026-06-01', '2026-06-05', '2026-06-05', 15000.00, 15200.00, 180.00, 720.00, N'Finalizado');
    SET IDENTITY_INSERT [Alugueis] OFF;
END;

IF EXISTS (SELECT 1 FROM [Clientes] WHERE [Id] = 2) AND EXISTS (SELECT 1 FROM [Veiculos] WHERE [Id] = 2)
   AND NOT EXISTS (SELECT 1 FROM [Alugueis] WHERE [Id] = 2)
BEGIN
    SET IDENTITY_INSERT [Alugueis] ON;
    INSERT INTO [Alugueis] ([Id], [ClienteId], [VeiculoId], [DataInicio], [DataFim], [DataDevolucao], [KmInicial], [KmFinal], [ValorDiaria], [ValorTotal], [StatusAluguel]) VALUES (2, 2, 2, '2026-06-10', '2026-06-12', '2026-06-12', 28000.00, 28120.00, 220.00, 440.00, N'Finalizado');
    SET IDENTITY_INSERT [Alugueis] OFF;
END;

IF EXISTS (SELECT 1 FROM [Clientes] WHERE [Id] = 3) AND EXISTS (SELECT 1 FROM [Veiculos] WHERE [Id] = 3)
   AND NOT EXISTS (SELECT 1 FROM [Alugueis] WHERE [Id] = 3)
BEGIN
    SET IDENTITY_INSERT [Alugueis] ON;
    INSERT INTO [Alugueis] ([Id], [ClienteId], [VeiculoId], [DataInicio], [DataFim], [DataDevolucao], [KmInicial], [KmFinal], [ValorDiaria], [ValorTotal], [StatusAluguel]) VALUES (3, 3, 3, '2026-06-15', '2026-06-18', NULL, 9000.00, NULL, 130.00, 390.00, N'Aberto');
    SET IDENTITY_INSERT [Alugueis] OFF;
END;

IF EXISTS (SELECT 1 FROM [Alugueis] WHERE [Id] = 1)
   AND NOT EXISTS (SELECT 1 FROM [Pagamentos] WHERE [Id] = 1) AND NOT EXISTS (SELECT 1 FROM [Pagamentos] WHERE [AluguelId] = 1)
BEGIN
    SET IDENTITY_INSERT [Pagamentos] ON;
    INSERT INTO [Pagamentos] ([Id], [AluguelId], [DataPagamento], [ValorPago], [MetodoPagamento], [StatusPagamento]) VALUES (1, 1, '2026-06-05', 720.00, N'Cartao', N'Pago');
    SET IDENTITY_INSERT [Pagamentos] OFF;
END;

IF EXISTS (SELECT 1 FROM [Alugueis] WHERE [Id] = 2)
   AND NOT EXISTS (SELECT 1 FROM [Pagamentos] WHERE [Id] = 2) AND NOT EXISTS (SELECT 1 FROM [Pagamentos] WHERE [AluguelId] = 2)
BEGIN
    SET IDENTITY_INSERT [Pagamentos] ON;
    INSERT INTO [Pagamentos] ([Id], [AluguelId], [DataPagamento], [ValorPago], [MetodoPagamento], [StatusPagamento]) VALUES (2, 2, '2026-06-12', 440.00, N'Pix', N'Pago');
    SET IDENTITY_INSERT [Pagamentos] OFF;
END;
");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DELETE FROM [Pagamentos] WHERE [Id] IN (1, 2);
DELETE FROM [Alugueis] WHERE [Id] IN (1, 2, 3);
DELETE FROM [Veiculos] WHERE [Id] IN (1, 2, 3);
DELETE FROM [Clientes] WHERE [Id] IN (1, 2, 3);
DELETE FROM [CategoriasVeiculo] WHERE [Id] IN (1, 2, 3);
DELETE FROM [Fabricantes] WHERE [Id] IN (1, 2, 3);
");
        }
    }
}
