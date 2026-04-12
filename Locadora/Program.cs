using Microsoft.EntityFrameworkCore;
using Locadora.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<LocadoraContext>(options =>
    options.UseSqlServer("Server=.\\SQLEXPRESS;Database=LocadoraVeiculos;Trusted_Connection=True;TrustServerCertificate=True;"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

//teste