﻿using Microsoft.AspNetCore.Mvc;
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
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT * FROM table_kitap_turleri WHERE is_deleted = FALSE ORDER BY kitap_tur_kodu ASC";
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
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT * FROM table_kitap_turleri WHERE kitap_tur_kodu = @id AND is_deleted = FALSE";
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
                    string query = "UPDATE table_kitap_turleri SET aciklama = @aciklama WHERE kitap_tur_kodu = @kitap_tur_kodu";
                    var list = new { aciklama = models.aciklama, kitap_tur_kodu = models.kitap_tur_kodu };
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
                    var result = connection.Execute(deletebook, parameters);
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
