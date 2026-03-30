using System;
using System.Collections.Generic;

namespace Locadora.Models;

public partial class CategoriasVeiculo
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string? Descricao { get; set; }

    public virtual ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
}
