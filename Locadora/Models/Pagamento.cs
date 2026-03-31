using System;
using System.Collections.Generic;

namespace Locadora.Models;

public partial class Pagamento
{
    public int Id { get; set; }

    public int AluguelId { get; set; }

    public DateOnly DataPagamento { get; set; }

    public decimal ValorPago { get; set; }

    public string MetodoPagamento { get; set; } = null!;

    public string StatusPagamento { get; set; } = null!;

    public virtual Aluguel Aluguel { get; set; } = null!;
}
