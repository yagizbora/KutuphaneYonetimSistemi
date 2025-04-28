using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Globalization;


namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/auth/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DbHelper _dbHelper;



        public UserController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpGet("ListAllUser")]
        public IActionResult ListAllUser()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT id,username,login_date,is_login FROM table_users WHERE is_deleted = FALSE";
                    var List = connection.Query<ListAllUsers>(query, connection);
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserModel model)
        {
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string getuserdata = "SELECT * from table_users WHERE username = @username AND is_deleted = false";
                    GetuserData? userdata = await connection.QueryFirstOrDefaultAsync<GetuserData>(getuserdata, model);

                    if (userdata == null || !BCrypt.Net.BCrypt.Verify(model.password, userdata.hashedpassword))
                    {
                        return BadRequest(ResponseHelper.UnAuthorizedResponse("Username or password is not correct"));
                    }

                    var token = Guid.NewGuid().ToString("N");

                    string format = "yyyy-MM-dd HH:mm:ss";
                    DateTime? login_date = DateTime.ParseExact(DateTime.Now.ToString(), format, CultureInfo.InvariantCulture);
                    if (!string.IsNullOrEmpty(token) && login_date != null)
                    {
                        string inserttokenquery = "UPDATE table_users SET token = @token, login_date = @login_date,is_login = true WHERE id = @id";
                        var inserttoken = await connection.ExecuteAsync(inserttokenquery, new { token = token, id = userdata.id, login_date = login_date });
                    }
                    var response = new
                    {
                        login_date = login_date,
                        user_id = userdata.id,
                        username = userdata.username,
                        token = token,
                    };
                    return Ok(ResponseHelper.OkResponse("Login is successfully", response));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    if (!ControllerContext.HttpContext.Request.Headers.TryGetValue("token", out var tokenValue))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Token header eksik."));
                    }

                    string? token = tokenValue.FirstOrDefault();

                    if (string.IsNullOrEmpty(token))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Token boş."));
                    }

                    string useridisexist = "SELECT COUNT(*) FROM table_users WHERE id = @id";
                    int useridisexistresult = connection.QueryFirstOrDefault<int>(useridisexist, new { id });
                    if(useridisexistresult == 0)
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }

                   string CheckUsertoDeletedisSame = "SELECT COUNT(*) FROM table_users WHERE id = @id AND token = @token";
                   int checkuser = connection.QueryFirstOrDefault<int>(CheckUsertoDeletedisSame, new { id, token });
                   if(checkuser == 1)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("You can't delete yourself"));
                    }

                   string checkuserisdeleted = "SELECT COUNT(*) FROM table_users WHERE id = @id AND is_deleted = true";
                    int checkuserisdeletedresult = connection.QueryFirstOrDefault<int>(checkuserisdeleted, new { id });
                    if (checkuserisdeletedresult == 0)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User is already deleted"));
                    }

                    string query = "UPDATE table_users SET is_deleted = true,is_login = false,login_date = NULL WHERE id = @id";
                    var result = await connection.ExecuteAsync(query, new { id });
                    if (result > 0)
                    {
                        return Ok(ResponseHelper.ActionResponse("User deleted successfully"));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User couldn't delete"));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }


        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser(UserModel model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {

                    string usernameisexistquery = "SELECT COUNT(*) FROM table_users where username = @username";
                    int usernameisexist = connection.QueryFirstOrDefault<int>(usernameisexistquery, model);
                    if(usernameisexist > 0)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Username is exist user couldnt create"));
                    }
                    

                    string hashedpassword = model.password;
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(hashedpassword, 12);

                    string query = "INSERT INTO table_users (username, hashedpassword,is_deleted,is_login) VALUES (@username, @passwordHash,false,false)";
                    var result = await connection.ExecuteAsync(query, new { username = model.username, passwordHash = passwordHash });
                    return Ok(ResponseHelper.ResponseSuccesfully<object>("User created Successfully"));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
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
                    string checkuserislogin = "SELECT is_login FROM table_users WHERE id = @user_id";
                    var islogin = await connection.QueryFirstOrDefaultAsync<bool>(checkuserislogin, new { user_id = userid });
                    if (islogin == false)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User is not login"));
                    }
                    string query = "UPDATE table_users SET token = NULL, login_date = NULL,is_login = false WHERE id = @user_id";
                    var result = await connection.ExecuteAsync(query, new { user_id = userid });
                    if (result > 0)
                    {
                        return Ok(ResponseHelper.ActionResponse("User logout successfully"));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User couldn't logout"));
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
