using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Data;
using Data.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace employees_uploader_server.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;
        public EmployeesController(ApplicationDbContext context, IWebHostEnvironment hostEnvironment)
        {
            this._context = context;
            this._hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return Ok(await this._context.Employees.Select(x => new Employee
            {
                Id = x.Id,
                Fullname = x.Fullname,
                Occupation = x.Occupation,
                ImageName = x.ImageName,
                ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName) // Special prop for client side img tag
            })
            .ToListAsync());
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int Id)
        {
            var employee = await this._context.Employees.FindAsync(Id);
            if (employee == null)
            {
                return NotFound();
            }
            return employee;
        }

        [HttpPut("{Id}")]
        public async Task<IActionResult> PutEmployee(int Id, [FromForm]Employee model)
        {
            if(Id != model.Id)
            {
                return BadRequest();
            }

            if(model.ImageFile != null)
            {
                DeleteImage(model.ImageName);
                var imageName = this.SaveImage(model.ImageFile);
                model.ImageName = imageName.Result;
            }

            this._context.Entry(model).State = EntityState.Modified; // Updating

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeModelExists(Id))
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

        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee([FromForm]Employee model)
        {
            if(model.ImageFile != null)
            {
                var imageName = await this.SaveImage(model.ImageFile);
                model.ImageName = imageName;
            }
            this._context.Employees.Add(model);
            await this._context.SaveChangesAsync();

            return StatusCode(201);
        }

        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteEmployee(int Id)
        {
            var employee = await this._context.Employees.FindAsync(Id);
            if(employee == null)
            {
                return NotFound();
            }
            this.DeleteImage(employee.ImageName);
            this._context.Employees.Remove(employee);
            await this._context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeModelExists(int Id)
        {
            return this._context.Employees.Any(e => e.Id == Id);
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile ImageFile)
        {
            var imageName = new String(Path.GetFileNameWithoutExtension(ImageFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(ImageFile.FileName);
            var imagePath = Path.Combine(this._hostEnvironment.ContentRootPath, "Images", imageName);
            using(var fileStream = new FileStream(imagePath, FileMode.Create)) // Creates an empty file in the specified path. With specified extension.
            {
                await ImageFile.CopyToAsync(fileStream); // Copies the current file into the empty file (path), which created above in the using statement.
            }
            return imageName;
        }

        [NonAction]
        public void DeleteImage(string ImageName)
        {
            var imagePath = Path.Combine(this._hostEnvironment.ContentRootPath, "Images", ImageName);
            if(System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }
    }
}
