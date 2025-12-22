using ClosedXML.Excel;
using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Data;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly DbHelper _dbHelper;

        public VersionController(IMemoryCache cache, DbHelper dbHelper)
        {
            _cache = cache;
            _dbHelper = dbHelper;
        }

        [HttpGet("CheckVersion")]
        public async Task<IActionResult> CheckVersion()
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    var sql = "SELECT * FROM table_version";
                    var response = await connection.QueryAsync<dynamic>(sql);
                    return Ok(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking the version.", error = ex.Message });
            }
        }
    }
}
