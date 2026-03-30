using System;
using System.Collections.Generic;

namespace Locadora.Models;

public partial class Fabricante
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string? PaisOrigem { get; set; }

    public virtual ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
}
