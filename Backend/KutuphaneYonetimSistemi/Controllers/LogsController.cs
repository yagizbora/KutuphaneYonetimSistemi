using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public LogsController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpGet("PaymentLogs")]
        public IActionResult PaymentLogs()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string datasql = $@"SELECT tbl.*, tk.kitap_adi FROM table_payment_logs AS tbl JOIN table_kitaplar AS tk ON tk.""id"" = tbl.""book_id"" ORDER BY tbl.payment_date DESC;";
                    var List = connection.Query<PaymentLogs>(datasql, connection);
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));

            }
        }
        [HttpPost("UserLoginOperationLogs")]
        public async Task<IActionResult> UserLoginOperationLogs([FromBody] UserLoginOperationLogsFilter models)
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

                    string eventFilterSql;
                    if (!string.IsNullOrEmpty(models.Event))
                    {
                        eventFilterSql = "AND event = @event";
                        parameters.Add("@event", models.Event);
                    }
                    else
                    {
                        eventFilterSql = "AND event IN ('Login', 'Login Time Out', 'Logout')";
                    }

                    string datasql = $@"
                SELECT * FROM table_user_operation_logs 
                WHERE 1=1
                {eventFilterSql}
                ORDER BY id ASC";

                    var list = await connection.QueryAsync<UserLoginOperationLogs>(datasql, parameters);
                    return Ok(list);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

    }
}
