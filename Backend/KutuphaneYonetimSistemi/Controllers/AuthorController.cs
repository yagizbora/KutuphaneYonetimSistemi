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
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
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
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
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
        public async Task<IActionResult> CreateAuthor(CreateAuthor model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkauthor = "SELECT name_surname, id FROM table_authors WHERE name_surname = @name_surname";
                    var checkauthorresult = await connection.QueryFirstOrDefaultAsync<(string name_surname, int id)>(checkauthor, new { name_surname = model.name_surname });
                    if (checkauthorresult.name_surname != default)
                    {
                        return BadRequest(ResponseHelper.ActionResponse($"Yazar zaten mevcut"));
                    }

                    string query = "INSERT INTO table_authors(name_surname, biography, birthday_date, is_deleted) VALUES (@name_surname, @biography, @birthday_date, false)";
                    var result = await connection.ExecuteAsync(query, model);
                    return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordAdded));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }


        [HttpPut("EditAuthor")]
        public async Task<IActionResult> EditAuthor(EditAuthor model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using(var connection = _dbHelper.GetConnection())
                {
                    string query = "UPDATE table_authors SET name_surname = @name_surname,biography = @biography,birthday_date = @birthday_date WHERE id = @id";
                    var result = await connection.ExecuteAsync(query, model);
                    return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated)); 
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpDelete("DeleteAuthor/{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkisdeleted = "SELECT name_surname FROM table_authors WHERE id = @id AND is_deleted = true";
                    var checkisdeletedresult = await connection.QueryFirstOrDefaultAsync<string>(checkisdeleted, new { id = id }); 
                    if (checkisdeletedresult != null)
                    {
                        return BadRequest(ResponseHelper.ActionResponse("Author is already deleted."));
                    }

                    string deleteQuery = "UPDATE table_authors SET is_deleted = true WHERE id = @id";
                    await connection.ExecuteAsync(deleteQuery, new { id = id });
                    return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordDeleted));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
    }
}
