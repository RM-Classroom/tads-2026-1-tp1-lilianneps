using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Locadora.Models;

public partial class Aluguel
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

    [JsonIgnore]
    [ValidateNever]
    public virtual Cliente? Cliente { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public virtual Pagamento? Pagamento { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public virtual Veiculo? Veiculo { get; set; }
}