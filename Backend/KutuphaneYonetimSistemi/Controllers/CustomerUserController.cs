using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Npgsql;
using System.Globalization;
using System.Threading.Tasks;
using JWT;
namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/auth/[controller]")]
    [ApiController]
    public class CustomerUserController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public CustomerUserController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public const int saltrounds = 12;


        // ADMIN PANEL API

        [HttpPost("CreateCustomerUser")]
        public async Task<IActionResult> CreateCustomerUser(CreateCustomerUserModels model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

                try
                {

                        Helper helper = new();
                        if (!Helper.TcKimlikNoDogrula(model.tc_kimlik_no))
                        {
                        return Ok(ResponseHelper.ErrorResponse("TC Kimlik No Geçersiz"));
                        }


                    using (var connection = _dbHelper.GetConnection())
                    {

                        string usernameisexistquery = "SELECT COUNT(*) FROM table_customer_users where username = @username";
                        int usernameisexist = connection.QueryFirstOrDefault<int>(usernameisexistquery, model);
                        if (usernameisexist > 0)
                        {
                            return BadRequest(ResponseHelper.ErrorResponse(ReturnMessages.UsernameIsExist));
                        }


                        string hashedpassword = model.password;
                        string passwordHash = BCrypt.Net.BCrypt.HashPassword(hashedpassword, saltrounds);

                        string query = $"INSERT INTO table_customer_users (username, hashedpassword,is_deleted,is_login,name_surname,tc_kimlik_no,birthday_date,phone_number,eposta) VALUES (@username, @passwordHash,false,false,@name_surname,@tc_kimlik_no,@birthday_date,@phone_number,@eposta)";
                        var result = await connection.ExecuteAsync(query, new { username = model.username, passwordHash = passwordHash,name_surname = model.name_surname, tc_kimlik_no = model.tc_kimlik_no, birthday_date = model.birthday_date,phone_number = model.phone_number,eposta = model.eposta });
                        return Ok(ResponseHelper.ResponseSuccesfully<object>("Customer User created Successfully"));
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
                }
        }




        [HttpGet("ListAllCustomerUser")]
        public async Task <IActionResult> ListAllCustomerUser()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT id,username,is_login,name_surname,birthday_date,eposta,tc_kimlik_no,phone_number,user_account_status FROM table_customer_users WHERE is_deleted = FALSE ORDER BY login_date ASC, id ASC";
                    var List = await connection.QueryAsync<CustomerUserModels>(query, connection);
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("DisableCustomerUserAccount/{id}/{status}")]
        public async Task<IActionResult> DisableCustomerUserAccount(int id,bool status)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string sql = "UPDATE table_customer_users SET user_account_status = @status WHERE id = @id ";
                    var response = await connection.ExecuteAsync(sql, new { status = status, id = id });
                    if(response > 0)
                    {
                        return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated));
                    }
                    else
                    {
                        return StatusCode(500,new
                        {
                            message = "Bir şeyler ters gitti :("
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }

        }

        [HttpGet("ListAllCustomerUser/{id}")]
        public async Task<IActionResult> ListAllCustomerUserbyid(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT id,username,is_login,name_surname,birthday_date,eposta,tc_kimlik_no,phone_number,user_account_status FROM table_customer_users WHERE is_deleted = FALSE AND id = @id ORDER BY login_date ASC, id ASC";
                    var List = await connection.QueryAsync<CustomerUserModels>(query, new {id = id});
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPut("EditCustomerUser")]
        public async Task <IActionResult> EditCustomerUser(EditCustomerUserModels model)
        {
            try
            {
                Helper helper = new();

                using (var connection = _dbHelper.GetConnection())
                {

                    string usernameisexistquery = "SELECT COUNT(*) FROM table_customer_users where username = @username";
                    int usernameisexist = connection.QueryFirstOrDefault<int>(usernameisexistquery, model);
                    if (usernameisexist > 0)
                    {
                        return Ok(ResponseHelper.ErrorResponse(ReturnMessages.UsernameIsExist));
                    }

                    if (!Helper.TcKimlikNoDogrula(model.tc_kimlik_no))
                    {
                        return Ok(ResponseHelper.ErrorResponse("TC Kimlik No Geçersiz"));
                    }

                    string sql = @$"
                        UPDATE table_customer_users 
                        SET 
                        username = @username,
                        name_surname = @name_surname,
                        birthday_date = @birthday_date,
                        tc_kimlik_no = @tc_kimlik_no,
                        phone_number = @phone_number,
                        eposta = @eposta,
                        is_deleted = FALSE 
                        WHERE id = @id";
                    var result = await connection.ExecuteAsync(sql, model);
                    if (result == 1)
                    {
                        return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated));
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse("Kullanıcı Güncellenemedi!"));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }



        //ADMIN PANEL API END

        [HttpPost("CustomerLogin")]
        public async Task<IActionResult> Login([FromBody] CustomerUserModel model)
        {
            CustomerUserLoginLogs customeruserloginlogs = new(_dbHelper);
            Helper helper = new();
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string getuserdata = "SELECT * from table_customer_users WHERE username = @username AND is_deleted = false";
                    GetuserData? userdata = await connection.QueryFirstOrDefaultAsync<GetuserData>(getuserdata, model);

                    if (userdata == null || !BCrypt.Net.BCrypt.Verify(model.password, userdata.hashedpassword))
                    {
                        return BadRequest(ResponseHelper.UnAuthorizedResponse(ReturnMessages.UserCredentialsInvalidMessage));
                    }

                    if(userdata.user_account_status.HasValue && userdata.user_account_status.Value)
                    {
                        return BadRequest(ResponseHelper.UnAuthorizedResponse("Bu hesaba giriş mümkün değildir! Lütfen kütüphanenizle görüşünüz!"));
                    }

                    string? token = helper.GenerateJWTToken(userdata.id, userdata.username);
                    if (string.IsNullOrEmpty(token))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Token generation failed"));
                    }

                    string format = "yyyy-MM-dd HH:mm:ss";
                    DateTime login_date = DateTime.ParseExact(DateTime.Now.ToString(format), format, CultureInfo.InvariantCulture);

                    string inserttokenquery = "UPDATE table_customer_users SET token = @token, login_date = @login_date,is_login = true WHERE id = @id";
                    var inserttoken = await connection.ExecuteAsync(inserttokenquery, new { token = token, id = userdata.id, login_date = login_date });

                    var response = new
                    {
                        login_date = login_date,
                        user_id = userdata.id,
                        username = userdata.username,
                        token = token,
                    };
                    customeruserloginlogs.LoginLogs(userdata.username, login_date);

                    return Ok(ResponseHelper.OkResponse("Login is successfully", response));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpPost("CustomerLogout")]
        public async Task<IActionResult> Logout()
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            CustomerUserLoginLogs customeruserloginlogs = new(_dbHelper);

            try
            {
                ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var useridvalue);
                if (StringValues.IsNullOrEmpty(useridvalue))
                {
                    return NotFound(ResponseHelper.ErrorResponse("User id yok"));
                }
                if (!int.TryParse(useridvalue, out int userid))
                {
                    return BadRequest(ResponseHelper.ErrorResponse("User_id geçerli bir id değil"));
                }
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkuserislogin = "SELECT is_login FROM table_customer_users WHERE id = @user_id";
                    var islogin = await connection.QueryFirstOrDefaultAsync<bool>(checkuserislogin, new { user_id = userid });
                    if (islogin == false)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User is not login"));
                    }
                    string query = "UPDATE table_customer_users SET token = NULL, login_date = NULL,is_login = false WHERE id = @user_id";
                    var result = await connection.ExecuteAsync(query, new { user_id = userid });
                    if (result > 0)
                    {
                        customeruserloginlogs.LogoutLogs(userid);

                        return Ok(ResponseHelper.ActionResponse("User logout successfully"));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User couldn't logout"));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpPost("GetCustomerInformation")]
        public async Task<IActionResult> GetCustomerInformation()
        {
            try
            {
                ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var useridvalue);
                if (StringValues.IsNullOrEmpty(useridvalue))
                {
                    return NotFound(ResponseHelper.ErrorResponse("User id yok"));
                }
                if (!int.TryParse(useridvalue, out int userid))
                {
                    return BadRequest(ResponseHelper.ErrorResponse("User_id geçerli bir id değil"));
                }

                using (var connection = _dbHelper.GetConnection())
                {
                    string sql = "SELECT username,name_surname,phone_number,tc_kimlik_no,birthday_date,eposta FROM table_customer_users WHERE id = @id";
                    var response = await connection.QueryAsync<dynamic>(sql,new {id = userid});
                    return Ok(response);
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

    } 
}

