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

    public virtual DbSet<Aluguel> Alugueis { get; set; }

    public virtual DbSet<CategoriasVeiculo> CategoriasVeiculos { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Fabricante> Fabricantes { get; set; }

    public virtual DbSet<Pagamento> Pagamentos { get; set; }

    public virtual DbSet<Veiculo> Veiculos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=LocadoraVeiculos;Trusted_Connection=True;TrustServerCertificate=True;");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Aluguel>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.KmFinal).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.KmInicial).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.StatusAluguel)
                .HasMaxLength(20)
                .HasDefaultValue("Aberto");
            entity.Property(e => e.ValorDiaria).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ValorTotal).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Cliente)
                .WithMany(p => p.Alugueis)
                .HasForeignKey(d => d.ClienteId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Veiculo)
                .WithMany(p => p.Alugueis)
                .HasForeignKey(d => d.VeiculoId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<CategoriasVeiculo>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.ToTable("CategoriasVeiculo");

            entity.HasIndex(e => e.Nome).IsUnique();

            entity.Property(e => e.Nome).HasMaxLength(50);
            entity.Property(e => e.Descricao).HasMaxLength(200);
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.Cpf).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.Property(e => e.Nome).HasMaxLength(150);
            entity.Property(e => e.Cpf)
                .HasMaxLength(11)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CPF");
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.Telefone).HasMaxLength(20);
            entity.Property(e => e.Cnh)
                .HasMaxLength(20)
                .HasColumnName("CNH");
        });

        modelBuilder.Entity<Fabricante>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Nome).HasMaxLength(100);
            entity.Property(e => e.PaisOrigem).HasMaxLength(60);
        });

        modelBuilder.Entity<Pagamento>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.AluguelId).IsUnique();

            entity.Property(e => e.MetodoPagamento).HasMaxLength(30);
            entity.Property(e => e.StatusPagamento)
                .HasMaxLength(20)
                .HasDefaultValue("Pendente");
            entity.Property(e => e.ValorPago).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Aluguel)
                .WithOne(p => p.Pagamento)
                .HasForeignKey<Pagamento>(d => d.AluguelId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        modelBuilder.Entity<Veiculo>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.Placa).IsUnique();

            entity.Property(e => e.Modelo).HasMaxLength(100);
            entity.Property(e => e.Placa).HasMaxLength(10);
            entity.Property(e => e.Cor).HasMaxLength(30);
            entity.Property(e => e.Quilometragem).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Disponivel).HasDefaultValue(true);

            entity.HasOne(d => d.Categoria)
                .WithMany(p => p.Veiculos)
                .HasForeignKey(d => d.CategoriaId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            entity.HasOne(d => d.Fabricante)
                .WithMany(p => p.Veiculos)
                .HasForeignKey(d => d.FabricanteId)
                .OnDelete(DeleteBehavior.ClientSetNull);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}