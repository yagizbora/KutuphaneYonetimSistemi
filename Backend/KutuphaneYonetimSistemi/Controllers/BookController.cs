using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly DbHelper _dbHelper;

        public BookController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }


        [HttpPost("GetBook")]
        public async Task<IActionResult> GetBook([FromBody] ListBookModels models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string filtersql = "";
                    var parameters = new DynamicParameters();

                    if (!string.IsNullOrEmpty(models.kitap_adi))
                    {
                        filtersql += " AND tk.kitap_adi ILIKE @kitap_adi";
                        parameters.Add("kitap_adi", $"%{models.kitap_adi}%");
                    }
                    if (!string.IsNullOrEmpty(models.yazar_adi))
                    {
                        filtersql += " AND tk.yazar_adi ILIKE @yazar_adi";
                        parameters.Add("yazar_adi", $"%{models.yazar_adi}%");
                    }
                    if (!string.IsNullOrEmpty(models.yazar_soyadi))
                    {
                        filtersql += " AND tk.yazar_soyadi ILIKE @yazar_soyadi";
                        parameters.Add("yazar_soyadi", $"%{models.yazar_soyadi}%");
                    }
                    if (!string.IsNullOrEmpty(models.ISBN))
                    {
                        filtersql += " AND tk.isbn ILIKE @isbn";
                        parameters.Add("isbn", $"%{models.ISBN}%");
                    }
                    if (models.Durum.HasValue)
                    {
                        filtersql += " AND tk.durum = @durum";
                        parameters.Add("durum", models.Durum.Value);
                    }
                    if (models.kitap_tur_kodu.HasValue)
                    {
                        filtersql += " AND tkt.kitap_tur_kodu = @kitap_tur_kodu";
                        parameters.Add("kitap_tur_kodu", models.kitap_tur_kodu.Value);
                    }

                    string query = $@"
            SELECT 
                tk.id, 
                tk.kitap_adi,
                tk.yazar_adi,
                tk.yazar_soyadi,
                tk.isbn,
                tk.durum,
                tkt.kitap_tur_kodu AS kitap_tur_kodu,
                tkt.aciklama AS kitap_tur
            FROM table_kitaplar tk
            JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu
            WHERE tk.is_deleted = false {filtersql}
            ORDER BY tk.id ASC;";

                    var books = await connection.QueryAsync<ListBookModels>(query, parameters);
                    return Ok(ResponseHelper.OkResponse("Books fetched.", books));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("GetBook/{id}")]
        public IActionResult GetBook(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = @"SELECT tk.id, tk.kitap_adi, tk.yazar_adi, tk.yazar_soyadi, tk.isbn, tk.durum, tkt.kitap_tur_kodu, tkt.aciklama as kitap_tur 
                                     FROM table_kitaplar tk 
                                     JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu 
                                     WHERE tk.id = @id AND tk.is_deleted = false;";
                    var List = connection.Query<ListBookModels>(query, new { id }).ToList();
                    if (List.Count == 0)
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {

                    string firstquery = "SELECT Durum FROM table_kitaplar WHERE id = @id";
                    bool checkbookistakenornot = connection.QueryFirst<bool>(firstquery, new {id = id});
                    if (!checkbookistakenornot)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("This book is taken and cannot be delete"));
                    }

                    string query = "UPDATE table_kitaplar SET is_deleted = true WHERE id = @id";
                    var parameters = new { id = id };
                    var result = connection.Execute(query, parameters);
                    if (result > 0 || result == 1)
                    {
                        return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Book not found."));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }


        [HttpPost("CreateBook")]
        public IActionResult Createbook([FromBody] CreateBook models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string sql = "SELECT COUNT(*) FROM table_kitap_turleri WHERE kitap_tur_kodu = @kitap_tur_kodu";
                    int count = connection.QueryFirstOrDefault<int>(sql, models.kitap_tur_kodu);

                    if (count == 0)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Book type is not found!s"));
                    }

                    string query = "INSERT INTO table_kitaplar (kitap_adi,yazar_adi,yazar_soyadi,isbn,kitap_tur_kodu,is_deleted) VALUES (@kitap_adi,@yazar_adi,@yazar_soyadi,@isbn,@kitap_tur_kodu,false)";
                    //var parameters = new { models };
                    connection.Execute(query, models);
                    return Ok(ResponseHelper.ResponseSuccesfully<object>("Book Created Succesfully"));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("UpdateBook")]
        public IActionResult UpdateBook([FromBody] UpdateBook models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkbooktypesql = "SELECT COUNT(*) FROM table_kitap_turleri WHERE kitap_tur_kodu = @kitap_tur_kodu  ";
                    int count = connection.QueryFirstOrDefault<int>(checkbooktypesql, models);

                    if (count == 0)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Book type is not found!s"));
                    }

                    string datasql = "UPDATE table_kitaplar SET kitap_adi = @kitap_adi,yazar_adi = @yazar_adi " +
                        ",yazar_soyadi = @yazar_soyadi,isbn = @isbn,kitap_tur_kodu = @kitap_tur_kodu WHERE id = @id";
                    var result = connection.Execute(datasql, models);
                    if (result > 0 || result == 1)
                    {
                        return Ok(ResponseHelper.ResponseSuccesfully<object>(ReturnMessages.RecordUpdated));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Update failed."));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }


       
        
    }
}
