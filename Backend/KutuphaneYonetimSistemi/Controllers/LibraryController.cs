using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
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
        private readonly IMemoryCache _cache;

        public LibraryController(DbHelper dbHelper, IMemoryCache cache)
        {
            _dbHelper = dbHelper;
            _cache = cache;

        }

        Helper helper = new Helper();

        public const string cachekeys = "librarycache";

        //FOR CUSTOMER PANEL

        [HttpGet("GetAllLibrariesForCustomer")]
        public async Task<IActionResult> GetAllLibrariesforCustomers()
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {

                    string query = "SELECT id,library_name,library_working_start_time,library_working_end_time,location,location_google_map_adress,phone_number,library_email FROM table_libraries WHERE is_deleted = false ORDER BY id ASC";
                    var result = await connection.QueryAsync<LibraryModels>(query, connection);
                    return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, result));
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        // end


        [HttpGet("GetAllLibraries")]
        public async Task<IActionResult> GetLibraries()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            CacheKeys.LibraryKeys.Add(cachekeys);
            if(_cache.TryGetValue(cachekeys, out List <LibraryModels> data))
            {
                Response.Headers["X-Cache"] = "Cache Active";
                return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, data));
            }

            try
            {
                using (var connection = _dbHelper.GetConnection())
                {

                    string query = "SELECT id,library_name,library_working_start_time,library_working_end_time,location,location_google_map_adress,phone_number,library_email FROM table_libraries WHERE is_deleted = false ORDER BY id ASC";
                    var result = await connection.QueryAsync<LibraryModels>(query, connection);
                    _cache.Set(cachekeys, result, TimeSpan.FromMinutes(10));
                    return Ok(ResponseHelper.OkResponse(ReturnMessages.DataFetched, result));
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpGet("GetAllLibraries/{id}")]
        public async Task<IActionResult> GetLibrariesbyid(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {

                    string query = "SELECT id,library_name,library_working_start_time,library_working_end_time,location_google_map_adress,location,phone_number,library_email FROM table_libraries WHERE is_deleted = false AND id = @id";
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
        [HttpPut("EditLibrary")]
        public async Task<IActionResult> EditLibrary(EditLibraryModels models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            if (!string.IsNullOrEmpty(models.library_email))
            {
                var checkemail = helper.ValidateEmail(models.library_email);
                if (!checkemail)
                {
                    return BadRequest(ResponseHelper.ErrorResponse("Bu e mail geçerli değil!"));
                }
            }   
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {

                    if (models.phone_number.HasValue)
                    {
                        var phoneNumberString = models.phone_number.Value.ToString(CultureInfo.InvariantCulture);
                        if (!Helper.ValidatePhoneNumber(phoneNumberString))
                        {
                            return BadRequest(ResponseHelper.ErrorResponse("Telefon numarası geçerli değil!"));
                        }
                    }

                    string updatesql = "UPDATE table_libraries SET library_name = @library_name,library_working_start_time = @library_working_start_time,library_working_end_time = @library_working_end_time, location_google_map_adress  = @location_google_map_adress, location = @location,library_email = @library_email,phone_number = @phone_number WHERE id = @id ";
                    var result = await connection.ExecuteAsync(updatesql, models);
                    if(result > 1 || result == 1)
                    {
                        foreach (var key in CacheKeys.BookKeys.ToList())
                        {
                            if (key.StartsWith(cachekeys))
                            {
                                _cache.Remove(key);
                                CacheKeys.BookKeys.Remove(key);
                            }
                        }
                        return Ok(ResponseHelper.ResponseSuccesfully<object>(ReturnMessages.RecordUpdated));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse(ReturnMessages.Exception));
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
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                if (!string.IsNullOrEmpty(model.library_email))
                {
                    var checkemail = helper.ValidateEmail(model.library_email);
                    if (!checkemail)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Bu e mail geçerli değil!"));
                    }
                }
                using (var connection = _dbHelper.GetConnection())
                {
                    if (model.phone_number.HasValue)
                    {
                        var phoneNumberString = model.phone_number.Value.ToString(CultureInfo.InvariantCulture);
                        if (!Helper.ValidatePhoneNumber(phoneNumberString))
                        {
                            return BadRequest(ResponseHelper.ErrorResponse("Telefon numarası geçerli değil!"));
                        }
                    }

                    string query = "INSERT INTO table_libraries(library_name,library_working_start_time,library_working_end_time,location_google_map_adress,location,library_email,phone_number,is_deleted) VALUES (@library_name,@library_working_start_time,@library_working_end_time,@location_google_map_adress,@location,@library_email,@phone_number,false)";
                    var result = await connection.ExecuteAsync(query, model);
                    foreach (var key in CacheKeys.BookKeys.ToList())
                    {
                        if (key.StartsWith(cachekeys))
                        {
                            _cache.Remove(key);
                            CacheKeys.BookKeys.Remove(key);
                        }
                    }
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
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using(var connection = _dbHelper.GetConnection())
                {
                    string query = "UPDATE table_libraries SET is_deleted = true WHERE id = @id";
                    var result = await connection.ExecuteAsync(query, new { id = id });
                    if(result == 1)
                    {
                        foreach (var key in CacheKeys.BookKeys.ToList())
                        {
                            if (key.StartsWith(cachekeys))
                            {
                                _cache.Remove(key);
                                CacheKeys.BookKeys.Remove(key);
                            }
                        }
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
