using Microsoft.AspNetCore.Mvc;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Npgsql;
using Dapper;
using Microsoft.Extensions.Caching.Memory;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookTypeController : ControllerBase
    {
        private readonly DbHelper _dbHelper;
        private readonly IMemoryCache _cache;

        public BookTypeController(DbHelper dbHelper, IMemoryCache cache)
        {
            _dbHelper = dbHelper;
            _cache = cache;
        }

        public static string cachekey = "book_type_key";

        [HttpGet("ListBookType")]
        public IActionResult GetAllBookTypes()
        {
            /* 
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            */

            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT tk.*,tkg.id as book_group_id, tkg.book_types_group FROM table_kitap_turleri tk " +
                                    "FULL JOIN table_kitap_turleri_group tkg ON tkg.id = tk.book_group_id " +
                                    "WHERE is_deleted = FALSE ORDER BY kitap_tur_kodu ASC";
                    var allBookTypes = connection.Query<GetBookTypes>(query).ToList();

                    var groupedBookTypes = allBookTypes
                        .Where(x => x.book_group_id != 0)
                        .GroupBy(x => new { x.book_group_id, x.book_types_group })
                        .Select(g => new GetBookTypesNew
                        {
                            book_group_id = g.Key.book_group_id,
                            book_types_group = g.Key.book_types_group,
                            bookTypes = g.Where(x => x.kitap_tur_kodu != 0).Select(x => new GetBookTypesNames
                            {
                                kitap_tur_kodu = x.kitap_tur_kodu,
                                aciklama = x.aciklama
                            }).ToList()
                        }).ToList();

                    return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, groupedBookTypes));

                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpGet("ListBookType/{id}")]
        public IActionResult GetAllBookTypes(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT tk.*,tkg.id as book_group_id, tkg.book_types_group FROM table_kitap_turleri tk " +
                                    "FULL JOIN table_kitap_turleri_group tkg ON tkg.id = tk.book_group_id " +
                                    "WHERE is_deleted = FALSE AND tk.kitap_tur_kodu = @id ORDER BY kitap_tur_kodu ASC ";
                    var List = connection.Query<GetBookTypes>(query, new { id }).ToList();
                    if (List.Count == 0)
                    {
                        return BadRequest(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }
                    return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, List));
                    
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPut("UpdateBookType")]
        public IActionResult UpdateBookType( [FromBody] GetBookTypes models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "UPDATE table_kitap_turleri SET aciklama = @aciklama,book_group_id = @book_group_id WHERE kitap_tur_kodu = @kitap_tur_kodu";
                    var list = new { aciklama = models.aciklama, kitap_tur_kodu = models.kitap_tur_kodu, book_group_id = models.book_group_id };
                    connection.Execute(query, list);
                    return Ok(ResponseHelper.ActionResponse("Book type updated successfully."));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("CreateBookType")]
        public IActionResult CreateBookType([FromBody] CreateBookType models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try     
            {
                if (string.IsNullOrEmpty(models.aciklama))
                {
                    return BadRequest(ResponseHelper.ErrorResponse("Tür ismi boş olamaz!"));
                }
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "INSERT INTO table_kitap_turleri (aciklama,book_group_id) VALUES (@aciklama,@book_group_id)";
                    var list = new { aciklama = models.aciklama, book_group_id = models.book_group_id };
                    connection.Execute(query, list);

                    return Ok(ResponseHelper.ActionResponse("Book type created successfully."));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpDelete("DeleteTypeOfBook/{id}")]
        public async Task<IActionResult> DeleteTypeOfBook(int id)
        {
            try
            {
                using(var connection = _dbHelper.GetConnection())
                {

                    string checkbookisdeleted = "SELECT COUNT(*) FROM table_kitap_turleri WHERE kitap_tur_kodu = @id";
                    int resultcheckbook = connection.QueryFirstOrDefault<int>(checkbookisdeleted, new { id });
                    if(resultcheckbook == 0)
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }



                    string deletebook = "UPDATE table_kitap_turleri SET is_deleted = TRUE WHERE kitap_tur_kodu = @id";
                    var parameters = new { id = id };
                    var result = await connection.ExecuteAsync(deletebook, parameters);
                    if(result == 1 || result > 0)
                    {
                        return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Book Type is not found"));
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
