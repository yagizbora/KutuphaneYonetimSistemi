using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookTypeGroupController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public BookTypeGroupController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpGet("GetBookTypeGroup")]
        public async Task<IActionResult> GetBookTypeGroup()
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string sql = "SELECT * FROM table_kitap_turleri_group";
                    var data = await connection.QueryAsync<BooktypeGroup>(sql);
                    return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, data));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("InsertBookTypeGroup")]
        public async Task<IActionResult> InsertBookTypeGroup(InsertBookTypeGroup model)
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string sql = "INSERT INTO table_kitap_turleri_group(book_types_group) VALUES (@book_types_group);";
                    var response = await connection.ExecuteAsync(sql, new { book_types_group = model.book_types_group });
                    return Ok(ResponseHelper.OkResponse(ReturnMessages.RecordAdded, response));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpPut("UpdateBookTypeGroup")]
        public async Task<IActionResult> UpdateBookTypeGroup(UpdateBookTypeGroup model)
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string sql = "UPDATE table_kitap_turleri_group SET book_types_group = @book_types_group WHERE id = @id";
                    var response = await connection.ExecuteAsync(sql, new { id = model.id, book_types_group = model.book_types_group });
                    if(response == 1)
                    {
                        return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse(ReturnMessages.Exception));
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
    }
}
