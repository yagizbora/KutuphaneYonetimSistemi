using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.X509Certificates;

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

        [HttpPost("PaymentLogs")]
        public IActionResult PaymentLogs([FromBody]FilterPaymentLogs models)
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
                    if (models.payment_is_success.HasValue)
                    {
                        filtersql += " AND tbl.payment_is_success = @durum";
                        parameters.Add("durum", models.payment_is_success.Value);
                    }


                    string datasql = $@"SELECT tbl.*, tk.kitap_adi FROM table_payment_logs AS tbl JOIN table_kitaplar AS tk ON tk.""id"" = tbl.""book_id"" WHERE 1=1 {filtersql} ORDER BY tbl.payment_date DESC;";
                    var List = connection.Query<PaymentLogs>(datasql, parameters);
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
                        eventFilterSql = "AND event IN ('Login', 'Login Time out', 'Logout')";
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

        [HttpPost("UserOperationLogs")]
        public async Task<IActionResult> UserOperationLogs([FromBody] UserLoginOperationLogsFilter models)
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
                        eventFilterSql = "AND event IN ('Change Username', 'Edit User')";
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
