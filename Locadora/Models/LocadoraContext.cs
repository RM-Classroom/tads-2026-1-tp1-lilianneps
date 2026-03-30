using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Locadora.Models;

public partial class LocadoraContext : DbContext
{
    public LocadoraContext()
    {
    }

    public LocadoraContext(DbContextOptions<LocadoraContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Aluguei> Alugueis { get; set; }

    public virtual DbSet<CategoriasVeiculo> CategoriasVeiculos { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Fabricante> Fabricantes { get; set; }

    public virtual DbSet<Pagamento> Pagamentos { get; set; }

    public virtual DbSet<Veiculo> Veiculos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=LocadoraVeiculos;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Aluguei>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Alugueis__3214EC07DA44AE3E");

            entity.Property(e => e.KmFinal).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.KmInicial).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.StatusAluguel)
                .HasMaxLength(20)
                .HasDefaultValue("Aberto");
            entity.Property(e => e.ValorDiaria).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ValorTotal).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Cliente).WithMany(p => p.Alugueis)
                .HasForeignKey(d => d.ClienteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Alugueis_Clientes");

            entity.HasOne(d => d.Veiculo).WithMany(p => p.Alugueis)
                .HasForeignKey(d => d.VeiculoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Alugueis_Veiculos");
        });

        modelBuilder.Entity<CategoriasVeiculo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07C9A4DDD7");

            entity.ToTable("CategoriasVeiculo");

            entity.HasIndex(e => e.Nome, "UQ__Categori__7D8FE3B26C1E83BB").IsUnique();

            entity.Property(e => e.Descricao).HasMaxLength(200);
            entity.Property(e => e.Nome).HasMaxLength(50);
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Clientes__3214EC07BB501E6B");

            entity.HasIndex(e => e.Email, "UQ__Clientes__A9D105340D14353E").IsUnique();

            entity.HasIndex(e => e.Cpf, "UQ__Clientes__C1F89731B2868024").IsUnique();

            entity.Property(e => e.Cnh)
                .HasMaxLength(20)
                .HasColumnName("CNH");
            entity.Property(e => e.Cpf)
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CPF");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.Nome).HasMaxLength(150);
            entity.Property(e => e.Telefone).HasMaxLength(20);
        });

        modelBuilder.Entity<Fabricante>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Fabrican__3214EC0737F9D69F");

            entity.Property(e => e.Nome).HasMaxLength(100);
            entity.Property(e => e.PaisOrigem).HasMaxLength(60);
        });

        modelBuilder.Entity<Pagamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Pagament__3214EC07B41A0632");

            entity.HasIndex(e => e.AluguelId, "UQ__Pagament__91554A7F0AA6DB85").IsUnique();

            entity.Property(e => e.MetodoPagamento).HasMaxLength(30);
            entity.Property(e => e.StatusPagamento)
                .HasMaxLength(20)
                .HasDefaultValue("Pendente");
            entity.Property(e => e.ValorPago).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Aluguel).WithOne(p => p.Pagamento)
                .HasForeignKey<Pagamento>(d => d.AluguelId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Pagamentos_Alugueis");
        });

        modelBuilder.Entity<Veiculo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Veiculos__3214EC07126CB8CB");

            entity.HasIndex(e => e.Placa, "UQ__Veiculos__8310F99D2DAC2D3E").IsUnique();

            entity.Property(e => e.Cor).HasMaxLength(30);
            entity.Property(e => e.Disponivel).HasDefaultValue(true);
            entity.Property(e => e.Modelo).HasMaxLength(100);
            entity.Property(e => e.Placa).HasMaxLength(10);
            entity.Property(e => e.Quilometragem).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Categoria).WithMany(p => p.Veiculos)
                .HasForeignKey(d => d.CategoriaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Veiculos_Categorias");

            entity.HasOne(d => d.Fabricante).WithMany(p => p.Veiculos)
                .HasForeignKey(d => d.FabricanteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Veiculos_Fabricantes");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
