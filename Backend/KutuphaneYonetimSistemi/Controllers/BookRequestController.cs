using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Globalization;
using System.Reflection;


namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookRequestController : ControllerBase
    {

        private readonly DbHelper _dbHelper;

        public BookRequestController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        //[HttpGet("GetBookRequest")]
        //public async Task<IActionResult> GetBookRequest()
        //{
        //    TokenController g = new TokenController(_dbHelper);
        //    var login = g.GetUserByToken(ControllerContext);
        //    if (!login.Status)
        //        return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
        //    try
        //    {
        //        using (var connection = _dbHelper.GetConnection())
        //        {
        //            string query = "SELECT id,book_name,request_start_time,request_deadline,comment,is_complated FROM table_request_books WHERE is_deleted = false ORDER BY id ASC";
        //            var result = await connection.QueryAsync<BookRequestModels>(query);
        //            return Ok(result);
        //        }
        //    }
        //    catch(Exception ex)
        //    {
        //        return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
        //    }
        //}
        [HttpPost("GetBookRequest")]
        public async Task<IActionResult> GetBookRequest([FromBody] BookRequest model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@Now", DateTime.Now);

                    string filtersql = "";
                    string selectFields = "id, book_name, request_start_time, request_deadline, comment, is_complated, closed_subject_details";
                    string query = "";
                   
                    if (model.status.HasValue)
                    { 
                        if (model.status.Value) 
                        {
                            filtersql = " AND is_complated = true OR request_deadline < @Now";
                        }
                        else 
                        {
                            filtersql = " AND is_complated = false";
                        }
                    }

                   
                    query = $@"
                SELECT {selectFields}
                FROM table_request_books
                WHERE is_deleted = false {filtersql}
                ORDER BY id ASC";

                    
                    if (model.status.HasValue)
                    {
                        if (model.status.Value) 
                        {
                            var result = await connection.QueryAsync<BookRequestWithClosedDetailsModel>(query, parameters);
                            return Ok(result);
                        }
                        else 
                        {
                            var result = await connection.QueryAsync<BookRequestBasicModel>(query, parameters);
                            return Ok(result);
                        }
                    }

                    
                    var allResult = await connection.QueryAsync<BookRequestWithClosedDetailsModel>(query, parameters);
                    return Ok(allResult);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }


        [HttpGet("GetBookRequest/{id}")]
        public async Task <IActionResult> GetBookRequestByid(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT id,book_name,request_start_time,request_deadline,comment,is_complated FROM table_request_books WHERE is_deleted = false AND id = @id";
                    var result = await connection.QueryFirstOrDefaultAsync<BookRequestModels>(query,new {id = id});
                    if(result == null)
                    {
                    return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }
                    else
                    {
                        return Ok(result);
                    }
                    
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("ComplateRequest")]
        public async Task<IActionResult> ComplateRequest(ComplateRequest models)
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string requestisdeleted = "SELECT COUNT(*) FROM table_request_books WHERE is_deleted = true and id = @id";

                    int checkrequestisdeleted = await connection.QueryFirstOrDefaultAsync<int>(requestisdeleted, new { id = models.id });
                    if(checkrequestisdeleted == 1)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Bu istek zaten silinmiş!"));
                    }



                    string query = "UPDATE table_request_books SET is_complated = @is_complated WHERE id = @id";
                    var result = await connection.ExecuteAsync(query, models);
                    return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));

            }
        }

        [HttpPost("CreateRequest")]
        public async Task<IActionResult> CreateRequest(CreateRequest models)
        {

            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using(var connection = _dbHelper.GetConnection())
                {
                    string query = $"INSERT INTO table_request_books (book_name,request_start_time,request_deadline,comment,is_complated,is_deleted) " +
                                   $" VALUES (@book_name,@request_start_time,@request_deadline,@comment,@is_complated,false)";
                    var result = await connection.ExecuteAsync(query, models);
                    return Ok(ResponseHelper.ResponseSuccesfully<object>("Request Created Successfully"));
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpDelete("DeleteRequest/{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "UPDATE table_request_books SET is_deleted = true WHERE id = @id";
                    var result = await connection.ExecuteAsync(query, new { id });
                    if (result > 0)
                    {
                        return Ok(ResponseHelper.ActionResponse("Request deleted successfully"));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Request couldn't delete"));
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
