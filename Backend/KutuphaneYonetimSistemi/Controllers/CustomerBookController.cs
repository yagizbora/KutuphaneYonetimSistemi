using Dapper;
using DocumentFormat.OpenXml.Math;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Npgsql;

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

        [HttpGet("MyBooks")]
        public async Task<IActionResult> MyBooks()
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
                        return NotFound(ResponseHelper.ErrorResponse("User ID header is missing."));
                    }
                    if (!int.TryParse(useridvalue, out int userid))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Invalid User ID."));
                    }
                    string sql = "SELECT tk.id, tk.kitap_adi,tk.odunc_alma_tarihi,lb.library_name,lb.location,au.name_surname as author_name " +
                                 "FROM table_kitaplar tk " +
                                 "JOIN table_libraries lb ON lb.id = tk.library_id " +
                                 "JOIN table_authors au ON au.id = tk.author_id " +
                                 "WHERE tk.is_deleted = false AND tk.durum = false AND tk.customer_id = @user_id " +
                                 "ORDER BY tk.id ASC;";
                    var result = await connection.QueryAsync<MyBooks>(sql, new { user_id = userid });
                    if (result == null || !result.Any())
                    {
                        return Ok(ResponseHelper.OkResponse("The user currently has no borrowed books.", result));
                    }
                    return Ok(ResponseHelper.OkResponse("Books retrieved successfully.", result));
                }   
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
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
                    string sql = @"SELECT DISTINCT 
    tk.id, 
    tk.kitap_adi, 
    tk.durum,
    lb.library_name,
    lb.id AS library_id,
    lb.location,
    au.name_surname AS author_name
FROM table_kitaplar tk
JOIN table_libraries lb ON lb.id = tk.library_id
JOIN table_authors au ON au.id = tk.author_id
LEFT JOIN table_kitap_request kr ON kr.book_id = tk.id
WHERE 
    tk.is_deleted = false
    AND tk.durum = true
    AND (
          (kr.request_status = false AND kr.book_id IS NOT NULL)
          OR kr.book_id IS NULL
        )
    AND NOT EXISTS (
        SELECT 1 
        FROM table_kitap_request kr2
        WHERE kr2.book_id = tk.id
        AND kr2.request_status = true
    )
ORDER BY tk.id ASC;";
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

        [HttpGet("RequestBookAdminList")]
        public async Task<IActionResult> RequestBookAdminList()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string sql = "SELECT kr.id,kr.customer_user_id,kr.request_date::timestamp as request_date, tk.id as book_id,tk.kitap_adi,lb.library_name,cu.name_surname FROM table_kitaplar tk " +
                                 "LEFT JOIN table_kitap_request kr ON kr.book_id = tk.id " +
                                 "JOIN table_libraries lb ON lb.id = kr.library_id " +
                                 "JOIN table_customer_users cu ON cu.id = kr.customer_user_id " +
                                 "WHERE kr.request_status = true";
                    var result = await connection.QueryAsync<RequestBookAdminList <object>>(sql);
                    return Ok(ResponseHelper.OkResponse("Books retrieved successfully.", result));

                }
            }
            catch (Exception ex)
            {
                // İç istisnayı da loglayın
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ResponseHelper.ExceptionResponse($"{ex.Message}"));
            }
        }
        [HttpPost("RequestBookAdminResult")]
        public async Task<IActionResult> RequestBookAdminResult([FromBody]RequestBookAdminResult model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var useridvalue);
            if (StringValues.IsNullOrEmpty(useridvalue))
            {
                return NotFound(ResponseHelper.ErrorResponse("User ID header is missing."));
            }
            if (!int.TryParse(useridvalue, out int userid))
            {
                return BadRequest(ResponseHelper.ErrorResponse("Invalid User ID."));
            }


            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    if (!model.result)
                    {
                        string sql = "UPDATE table_kitap_request SET request_status = false,auth_person_id = @userid,is_approved = @is_approved WHERE id = @id";
                        var result = await connection.ExecuteAsync(sql, new { id = model.request_id, userid = userid, is_approved = model.result });
                        return Ok(ResponseHelper.ActionResponse("Customer book borrowing request was rejected successfully!"));
                    }
                    else
                    {
                        string firstsql = "UPDATE table_kitap_request SET request_status = false,auth_person_id = @userid,is_approved = @is_approved WHERE id = @id";
                        int result = await connection.ExecuteAsync(firstsql, new { id = model.request_id, userid = userid, is_approved = model.result });
                        if (result > 0)
                        {
                            string secondsql = "UPDATE table_kitaplar SET durum = false, odunc_alma_tarihi = @odunc_alma_tarihi, customer_id = @customer_id WHERE id = @book_id";
                            var execute = await connection.ExecuteAsync(secondsql, new { odunc_alma_tarihi = DateTime.Now, customer_id = model.customer_id, book_id = model.book_id });
                            return Ok(ResponseHelper.ActionResponse("Customer book borrowing request was approved successfully!"));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    ResponseHelper.ExceptionResponse($"{ex.Message}"));
            }

            return BadRequest(ResponseHelper.ErrorResponse("An unexpected error occurred."));
        }
        [HttpPost("Customerbookrequest")]
        public async Task <IActionResult> Customerbookrequest([FromBody]CustomerBookRequest model)
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
                        return NotFound(ResponseHelper.ErrorResponse("User ID header is missing."));
                    }
                    if (!int.TryParse(useridvalue, out int userid))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Invalid User ID."));
                    }
                    string bookcountsql = "SELECT Count(*) FROM table_kitap_request WHERE request_status = true AND customer_user_id = @user_id";
                    var bookcontrol = await connection.QueryFirstOrDefaultAsync<int>(bookcountsql, new { user_id = userid });
                    if(bookcontrol >= 2)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ErrorResponse("You cannot create more than 2 book borrowing requests! Please contact library staff."));
                    }
                    string secondstatuscountsql = "SELECT Count(*) FROM table_kitaplar WHERE customer_id = @user_id AND durum = FALSE";
                    var secondstatuscountsqlresult = await connection.QueryFirstOrDefaultAsync<int>(secondstatuscountsql, new { user_id = userid });
                    if(secondstatuscountsqlresult >= 2)
                    {
                     return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ErrorResponse("You cannot borrow or request more than 2 books at a time! Please contact library staff."));
                    }
                    string bookisavaible = "SELECT request_status = true FROM table_kitap_request WHERE book_id = @book_id";
                    var bookfreecontrol = await connection.QueryFirstOrDefaultAsync<bool>(bookisavaible, new { book_id = model.book_id });
                    if (bookfreecontrol)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ErrorResponse("This book has already been requested!"));
                    }
                    
                        string sql = "INSERT INTO table_kitap_request (book_id,customer_user_id,request_status,library_id,request_date) VALUES (@book_id,@customer_user_id,true,@library_id,@request_date)";
                        int result = await connection.ExecuteAsync(sql, new { book_id = model.book_id, customer_user_id = userid, library_id = model.library_id, request_date = DateTime.Now.Date });
                        if (result == 1)
                        {
                            return Ok(ResponseHelper.ActionResponse("Book borrowing request submitted successfully. Please contact your library!"));
                        }
                        else
                        {
                            return BadRequest(ResponseHelper.ErrorResponse("Book borrowing request failed."));
                        }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
    }
}
