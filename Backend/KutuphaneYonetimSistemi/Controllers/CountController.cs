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
                    string query = $"SELECT  (SELECT COUNT(*) FROM table_kitaplar WHERE durum = false AND is_deleted = false ) AS taken_books, (SELECT COUNT(*) FROM table_kitaplar WHERE is_deleted = false  ) AS books_count,  (SELECT COUNT(*) FROM table_kitaplar WHERE durum = true AND is_deleted = false ) AS untaken_books;";
                    var result = await connection.QuerySingleAsync(query);
                    return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched,result));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
    }
}
