using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerBookController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public CustomerBookController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpGet("CustomerBookList")]
        public async Task<IActionResult> CustomerBookList()
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using(var connection = _dbHelper.GetConnection())
                {
                    string sql = "SELECT tk.id, tk.kitap_adi, tk.durum,lb.library_name,lb.location,au.name_surname as author_name " +
                                 "FROM table_kitaplar tk " +
                                 "JOIN table_libraries lb ON lb.id = tk.library_id " +
                                 "JOIN table_authors au ON au.id = tk.author_id " +
                                 "WHERE tk.is_deleted = false AND tk.durum = true " +
                                 "ORDER BY tk.id ASC;";
                    var result = await connection.QueryAsync<CustomerBookModels>(sql);
                    if (result == null || !result.Any())
                    {
                        return NotFound(ResponseHelper.NotFoundResponse("No books found."));
                    }
                    return Ok(ResponseHelper.OkResponse("Books retrieved successfully.", result));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpPost("Customerbookrequest")]
        public async Task <IActionResult> Customerbookrequest(CustomerBookRequest model)
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var useridvalue);
                    if (StringValues.IsNullOrEmpty(useridvalue))
                    {
                        return NotFound(ResponseHelper.ErrorResponse("User id yok"));
                    }
                    if (!int.TryParse(useridvalue, out int userid))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User_id geçerli bir id değil"));
                    }


                    string bookisavaible = "SELECT request_status = true FROM table_kitap_request WHERE book_id = @book_id";
                    var bookfreecontrol = await connection.QueryFirstOrDefaultAsync<bool>(bookisavaible, new { book_id = model.book_id });
                    if (bookfreecontrol)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse("Bu kitap zaten talep edilmiş!"));
                    }
                    string sql = "UPDATE table_kitap_request SET book_id = @book_id, customer_user_id = @customer_user_id,library_id = @library_id request_status = true";
                    int result = await connection.ExecuteAsync(sql, new { book_id = model.book_id, customer_user_id = useridvalue,library_id = model.library_id });
                    if(result == 1)
                    {
                        return Ok(ResponseHelper.ActionResponse($@"Kitap ödünç isteği başarı ile iletildi lütfen kütüphanenizle görüşünüz!"));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Kitap ödünç isteği başarısız oldu"));
                    }
                }
                    
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
    }
}
