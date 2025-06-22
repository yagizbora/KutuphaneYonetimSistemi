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

        [HttpPost("PaymentLogs")]
        public async Task <IActionResult> PaymentLogs([FromBody]FilterPaymentLogs models)
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
                    var List = await connection.QueryAsync<PaymentLogs>(datasql, parameters);
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));

            }
        }

                [HttpPost("UserLoginOperationLogs")]
                public async Task<IActionResult> UserLoginOperationLogs([FromBody] UserLoginOperationLogsPagination models)
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
                            string filtersql = "";

                            if (!string.IsNullOrEmpty(models.Event))
                            {
                                filtersql += " AND event = @event";
                                parameters.Add("event", models.Event);
                            }
                            else
                            {
                                filtersql += " AND event IN ('Login', 'Login Time out', 'Logout')"; 
                            }

                            string paginationsql = "";
                            if (models.count.HasValue || models.page.HasValue)
                            {
                                int? offset = (models.page - 1) * models.count;
                                paginationsql += " LIMIT @count OFFSET @offset";
                                parameters.Add("count", models.count.Value); 
                                parameters.Add("offset", offset); 
                            }

                            string countsql = $"SELECT COUNT(*) FROM table_user_operation_logs WHERE 1=1 {filtersql}";
                            string datasql = $"SELECT id, event, event_description FROM table_user_operation_logs WHERE 1=1 {filtersql} ORDER BY id ASC {paginationsql}";

                            var count = await connection.QuerySingleAsync<int>(countsql, parameters);
                            var data = (await connection.QueryAsync<UserLoginOperationLogs>(datasql, parameters)).ToList();

                            var result = new UserLoginOperationLogsResponse
                            {
                                Count = count,
                                data = data 
                            };

                            return Ok(result);
                        }
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
                    }
                }


        [HttpPost("UserOperationLogs")]
        public async Task<IActionResult> UserOperationLogs([FromBody] LogsFilter models)
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
