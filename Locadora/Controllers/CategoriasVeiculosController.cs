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
    public class CategoriasVeiculosController : ControllerBase
    {
        private readonly LocadoraContext _context;

        public CategoriasVeiculosController(LocadoraContext context)
        {
            _context = context;
        }

        // GET: api/CategoriasVeiculos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoriasVeiculo>>> GetCategoriasVeiculos()
        {
            return await _context.CategoriasVeiculos.ToListAsync();
        }

        // GET: api/CategoriasVeiculos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriasVeiculo>> GetCategoriasVeiculo(int id)
        {
            var categoriasVeiculo = await _context.CategoriasVeiculos.FindAsync(id);

            if (categoriasVeiculo == null)
            {
                return NotFound();
            }

            return categoriasVeiculo;
        }

        // PUT: api/CategoriasVeiculos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoriasVeiculo(int id, CategoriasVeiculo categoriasVeiculo)
        {
            if (id != categoriasVeiculo.Id)
            {
                return BadRequest();
            }

            _context.Entry(categoriasVeiculo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriasVeiculoExists(id))
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

        // POST: api/CategoriasVeiculos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CategoriasVeiculo>> PostCategoriasVeiculo(CategoriasVeiculo categoriasVeiculo)
        {
            _context.CategoriasVeiculos.Add(categoriasVeiculo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategoriasVeiculo", new { id = categoriasVeiculo.Id }, categoriasVeiculo);
        }

        // DELETE: api/CategoriasVeiculos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoriasVeiculo(int id)
        {
            var categoriasVeiculo = await _context.CategoriasVeiculos.FindAsync(id);
            if (categoriasVeiculo == null)
            {
                return NotFound();
            }

            _context.CategoriasVeiculos.Remove(categoriasVeiculo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoriasVeiculoExists(int id)
        {
            return _context.CategoriasVeiculos.Any(e => e.Id == id);
        }
    }
}
