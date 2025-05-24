using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorController : ControllerBase
    {

        private readonly DbHelper _dbHelper;

        public AuthorController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }


        [HttpGet("GetAuthor")]
        public async Task<IActionResult> Getauthor()
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT id,name_surname,biography,birthday_date FROM table_authors WHERE is_deleted = false";
                    var result = (await connection.QueryAsync<GetAuthor>(query)).ToList();
                    if (result.Count != 0)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("GetAuthor/{id}")]
        public async Task<IActionResult> Getauthorbyid(int id) 
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT id,name_surname,biography,birthday_date FROM table_authors WHERE is_deleted = false AND id = @id";
                    var result = (await connection.QueryAsync<GetAuthor>(query, new { id = id })).ToList(); 
                    if (result.Count != 0) 
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpPost("CreateAuthor")]
        public async Task <IActionResult> CreateAuthor(CreateAuthor model)
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "INSERT INTO table_authors(name_surname,biography,birthday_date,is_deleted) VALUES (@name_surname,@biography,@birthday_date,false)";
                    var result = await connection.ExecuteAsync(query, model);
                    return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordAdded));

                }
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));

            }
        }
        
    }
}
