using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public CountController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }


        [HttpGet("CountBooks")]
        public async Task<IActionResult> CountBooks()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string taken_books_query = "SELECT COUNT(*) as taken_books FROM table_kitaplar WHERE durum = false AND is_deleted = false";
                    string books_count_query = "SELECT COUNT(*) as books_count FROM table_kitaplar WHERE is_deleted = false";
                    string untaken_books_query = "SELECT COUNT(*) as taken_books FROM table_kitaplar WHERE durum = true AND is_deleted = false";

                    var taken_books = await connection.ExecuteScalarAsync<int>(taken_books_query);
                    var books_count = await connection.ExecuteScalarAsync<int>(books_count_query);
                    var untaken_books = await connection.ExecuteScalarAsync<int>(untaken_books_query);

                    var result = new
                    {
                        taken_books,
                        books_count,
                        untaken_books
                    };

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
    }
}
