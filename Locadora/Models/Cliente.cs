using System;
using System.Collections.Generic;

namespace Locadora.Models;

public partial class Cliente
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Cpf { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Telefone { get; set; }

    public string? Cnh { get; set; }

    public virtual ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
}
