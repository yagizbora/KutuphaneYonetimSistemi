using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Globalization;
using System.Threading.Tasks;


namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public LibraryController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpGet("GetAllLibraries")]
        public async Task<IActionResult> GetLibraries()
        {
            try
            {
                using(var connection = _dbHelper.GetConnection())
                {

                 string query = "SELECT id,library_name,library_working_start_time,library_working_end_time FROM table_libraries WHERE is_deleted = false";
                    var result = await connection.QueryAsync<LibraryModels>(query,connection);
                    return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, result));
                }
                
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpGet("GetAllLibraries/{id}")]
        public async Task<IActionResult> GetLibrariesbyid(int id)
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {

                    string query = "SELECT id,library_name,library_working_start_time,library_working_end_time FROM table_libraries WHERE is_deleted = false AND id = @id";
                    var result = (await connection.QueryAsync<LibraryModels>(query, new { id = id})).ToList();
                    if(result.Count == 1)
                    {
                     return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, result));
                    }
                    else
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("CreateLibraries")]
        public async Task<IActionResult> CreateLibraries(CreateLibrary model)
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "INSERT INTO table_libraries(library_name,library_working_start_time,library_working_end_time,is_deleted) VALUES (@library_name,@library_working_start_time,@library_working_end_time,false)";
                    var result = await connection.ExecuteAsync(query, model);
                    return Ok(ResponseHelper.ResponseSuccesfully<object>(ReturnMessages.RecordAdded));

                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpDelete("DeleteLibrary/{id}")]
        public async Task<IActionResult> DeleteLibrary(int id)
        {
            try
            {
                using(var connection = _dbHelper.GetConnection())
                {
                    string query = "UPDATE table_libraries SET is_deleted = true WHERE id = @id";
                    var result = await connection.ExecuteAsync(query, new { id = id });
                    if(result == 1)
                    {
                        return Ok(ResponseHelper.ResponseSuccesfully<object>(ReturnMessages.RecordDeleted));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Bi şeyler ters gitti"));
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
