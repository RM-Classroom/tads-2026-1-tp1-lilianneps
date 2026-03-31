using System;
using System.Collections.Generic;

namespace Locadora.Models;

public partial class Veiculo
{
    public int Id { get; set; }

    public string Modelo { get; set; } = null!;

    public int AnoFabricacao { get; set; }

    public decimal Quilometragem { get; set; }

    public string Placa { get; set; } = null!;

    public string? Cor { get; set; }

    public bool Disponivel { get; set; }

    public int FabricanteId { get; set; }

    public int CategoriaId { get; set; }

    public virtual ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();

    public virtual CategoriasVeiculo Categoria { get; set; } = null!;

    public virtual Fabricante Fabricante { get; set; } = null!;
}
