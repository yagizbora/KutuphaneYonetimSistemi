using KutuphaneYonetimSistemi.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
            return Ok(); // Will be create
        }
    }
}
