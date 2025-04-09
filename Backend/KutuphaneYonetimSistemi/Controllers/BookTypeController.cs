using Microsoft.AspNetCore.Mvc;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Npgsql;
using Dapper;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookTypeController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public BookTypeController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }


        [HttpGet("ListBookType")]
        public IActionResult GetAllBookTypes()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT * FROM table_kitap_turleri ORDER BY kitap_tur_kodu ASC";
                    var bookTypes = connection.Query<GetBookTypes>(query).ToList();

                    return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, bookTypes));

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
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT * FROM table_kitap_turleri WHERE kitap_tur_kodu = @id";
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

        [HttpPost("CreateBookType")]
        public IActionResult CreateBookType([FromBody] CreateBookType models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try     
            {
                if (string.IsNullOrEmpty(models.aciklama))
                {
                    return BadRequest(ResponseHelper.ErrorResponse("Tür ismi boş olamaz!"));
                }
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "INSERT INTO table_kitap_turleri (aciklama) VALUES (@aciklama)";
                    var list = new { aciklama = models.aciklama };
                    connection.Execute(query, list);
                    return Ok(ResponseHelper.ActionResponse("Book type created successfully."));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
    }
}
