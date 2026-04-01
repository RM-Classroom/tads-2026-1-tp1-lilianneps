using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Locadora.Models;

namespace Locadora.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlugueisController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public AlugueisController(LocadoraContext context)
        {
            _context = context;
        }

        // GET: api/Alugueis
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aluguel>>> GetAlugueis()
        {
            return await _context.Alugueis.ToListAsync();
        }

        // GET: api/Alugueis/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Aluguel>> GetAluguel(int id)
        {
            var aluguel = await _context.Alugueis.FindAsync(id);

            if (aluguel == null)
            {
                return NotFound();
            }

            return aluguel;
        }

        // PUT: api/Alugueis/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAluguel(int id, Aluguel aluguel)
        {
            if (id != aluguel.Id)
            {
                return BadRequest();
            }

            _context.Entry(aluguel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AluguelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Alugueis
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Aluguel>> PostAluguel(Aluguel aluguel)
        {
            _context.Alugueis.Add(aluguel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAluguel", new { id = aluguel.Id }, aluguel);
        }

        // DELETE: api/Alugueis/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAluguel(int id)
        {
            var aluguel = await _context.Alugueis.FindAsync(id);
            if (aluguel == null)
            {
                return NotFound();
            }

            _context.Alugueis.Remove(aluguel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AluguelExists(int id)
        {
            return _context.Alugueis.Any(e => e.Id == id);
        }
        [HttpGet("completo")]
        public async Task<ActionResult> GetAlugueisCompletos()
        {
            var dados = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .Select(a => new
                {
                    a.Id,
                    Cliente = a.Cliente.Nome,
                    Veiculo = a.Veiculo.Modelo,
                    a.DataInicio,
                    a.DataFim,
                    a.ValorTotal
                })
                .ToListAsync();

            return Ok(dados);
        }
        [HttpGet("por-cliente/{nome}")]
        public async Task<ActionResult> GetAlugueisPorCliente(string nome)
        {
            var dados = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .Where(a => a.Cliente.Nome.Contains(nome))
                .Select(a => new
                {
                    a.Id,
                    Cliente = a.Cliente.Nome,
                    Veiculo = a.Veiculo.Modelo,
                    a.DataInicio,
                    a.DataFim,
                    a.ValorTotal
                })
                .ToListAsync();

            return Ok(dados);
        }
        [HttpGet("por-veiculo/{modelo}")]
        public async Task<ActionResult> GetAlugueisPorVeiculo(string modelo)
        {
            var dados = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .Where(a => a.Veiculo.Modelo.Contains(modelo))
                .Select(a => new
                {
                    a.Id,
                    Cliente = a.Cliente.Nome,
                    Veiculo = a.Veiculo.Modelo,
                    a.DataInicio,
                    a.DataFim,
                    a.ValorTotal
                })
                .ToListAsync();

            return Ok(dados);
        }
        [HttpGet("por-periodo")]
        public async Task<ActionResult> GetAlugueisPorPeriodo(DateOnly inicio, DateOnly fim)
        {
            var dados = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .Where(a => a.DataInicio >= inicio && a.DataFim <= fim)
                .Select(a => new
                {
                    a.Id,
                    Cliente = a.Cliente.Nome,
                    Veiculo = a.Veiculo.Modelo,
                    a.DataInicio,
                    a.DataFim,
                    a.ValorTotal
                })
                .ToListAsync();

            return Ok(dados);
        }
        [HttpGet("com-pagamento")]
        public async Task<ActionResult> GetAlugueisComPagamento()
        {
            var dados = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .Include(a => a.Pagamento)
                .Select(a => new
                {
                    a.Id,
                    Cliente = a.Cliente.Nome,
                    Veiculo = a.Veiculo.Modelo,
                    a.DataInicio,
                    a.DataFim,
                    a.ValorTotal,
                    ValorPago = a.Pagamento != null ? a.Pagamento.ValorPago : 0,
                    MetodoPagamento = a.Pagamento != null ? a.Pagamento.MetodoPagamento : "Não pago"
                })
                .ToListAsync();

            return Ok(dados);
        }
    }
}
