using System;
using System.Collections.Generic;

namespace Locadora.Models;

public partial class Aluguei
{
    public int Id { get; set; }

    public int ClienteId { get; set; }

    public int VeiculoId { get; set; }

    public DateOnly DataInicio { get; set; }

    public DateOnly DataFim { get; set; }

    public DateOnly? DataDevolucao { get; set; }

    public decimal KmInicial { get; set; }

    public decimal? KmFinal { get; set; }

    public decimal ValorDiaria { get; set; }

    public decimal? ValorTotal { get; set; }

    public string StatusAluguel { get; set; } = null!;

    public virtual Cliente Cliente { get; set; } = null!;

    public virtual Pagamento? Pagamento { get; set; }

    public virtual Veiculo Veiculo { get; set; } = null!;
}
