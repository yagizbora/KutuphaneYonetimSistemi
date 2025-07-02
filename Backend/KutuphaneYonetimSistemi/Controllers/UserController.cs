using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using static KutuphaneYonetimSistemi.Common.UserLoginLogs;
using static KutuphaneYonetimSistemi.Common.UserOperationLogs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Globalization;
using System.Reflection;
using Newtonsoft.Json.Linq;



namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/auth/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public const int saltrounds = 12;

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
                    string query = "SELECT id,username,login_date,is_login FROM table_users WHERE is_deleted = FALSE ORDER BY login_date ASC, id ASC";
                    var List = connection.Query<ListAllUsers>(query, connection);
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpGet("ListAllUser/{id}")]
        public async Task<IActionResult> ListAllUserbyidAsync(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT id,username,login_date,is_login FROM table_users WHERE is_deleted = FALSE AND id = @id";
                    var List = await connection.QueryAsync<ListAllUsers>(query, new {id = id});
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("EditUser")]
        public async Task<IActionResult> EditUser(EditUser model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                UserOperationLogs userOperationLogs = new UserOperationLogs(_dbHelper);
                using (var connection = _dbHelper.GetConnection())
                {
                    string usernameisexistquery = "SELECT id FROM table_users WHERE username = @username";
                    var existingUserId = connection.QueryFirstOrDefault<int?>(usernameisexistquery, new { username = model.username });

                    if (existingUserId != null && existingUserId != model.id)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Username already exists. Username can't be changed."));
                    }

                    ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var useridvalue);
                    if (StringValues.IsNullOrEmpty(useridvalue))
                    {
                        return NotFound(ResponseHelper.ErrorResponse("User id yok"));
                    }
                    if (!int.TryParse(useridvalue, out int userid))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User_id geçerli bir id değil"));
                    }
                    if(userid == model.id)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Kendi kullanıcı bilgilerinizi güncelleyemezsiniz!"));

                    }

                    //FOR LOGS
                    string fetcholdusernamesql = "SELECT username FROM table_users where id = @userid";
                    string? fetcholdusername = connection.QueryFirstOrDefault<string>(fetcholdusernamesql, new { userid = model.id });
                    //


                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.password, saltrounds);

                    string mainquery = "UPDATE table_users SET username = @username,hashedpassword = @hashedpassword,is_login = false,login_date = NULL,token = NULL WHERE id = @id";
                    var result = await connection.ExecuteAsync(mainquery, new
                    {
                        model.username,
                        hashedpassword = passwordHash,
                        model.id
                    });
                    if (result > 0)
                    {
                        if (fetcholdusername == null)
                        {
                            return NotFound(ResponseHelper.ErrorResponse("Kullanıcı bulunamadı."));
                        }

                        
                        userOperationLogs.edituserlog(userid, fetcholdusername, model.id);
                        return Ok(ResponseHelper.ActionResponse("Kullanıcı bilgileri değiştirildi"));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Kullanıcı bilgileri değiştirilirken hata oluştu"));
                    }

                }
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }


        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePassword model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            using (var connection = _dbHelper.GetConnection())
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




                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.password, saltrounds);
                    if (string.IsNullOrEmpty(passwordHash))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Şifre Hashlenemedi!"));
                    }

                    string query = "UPDATE table_users SET hashedpassword = @hashedpassword, token = NULL, login_date = NULL, is_login = false WHERE id = @id";
                    int result = await connection.ExecuteAsync(query, new { hashedpassword = passwordHash,id = userid });
                    if(result == 1)
                    {
                        return Ok(ResponseHelper.ActionResponse($@"Kullanıcı şifresi başarıyla güncellendi!"));
                    }
                    else
                    {
                        return BadRequest($@"Kullanıcı Şifresi güncellenemedi!");
                    }

                }
                catch (Exception ex)
                {
                    return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
                }
            }
        }




        [HttpPost("ChangeUsername")]
        public IActionResult ChangeUsername([FromBody] ChangeUsername model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                UserOperationLogs userOperationLogs = new UserOperationLogs(_dbHelper);


                using (var connection = _dbHelper.GetConnection())
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

                    //FOR LOGS
                    string fetcholdusernamesql = "SELECT username FROM table_users where id = @userid";
                    string? fetcholdusername = connection.QueryFirstOrDefault<string?>(fetcholdusernamesql, new { userid = userid });
                    if (fetcholdusername == null)
                    {
                        return NotFound(ResponseHelper.ErrorResponse("Kullanıcı bulunamadı."));
                    }
                    //

                    string usernameisexistquery = "SELECT COUNT(*) FROM table_users where username = @username";
                    int usernameisexist = connection.QueryFirstOrDefault<int>(usernameisexistquery, new { username = model.username });
                    if (usernameisexist > 0)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Username is exist username couldn't change"));
                    }
                    string mainquery = "UPDATE table_users SET username = @username WHERE id = @user_id";
                    int result = connection.Execute(mainquery, new { username = model.username, user_id = userid });

                    if(result == 1)
                    {
                        userOperationLogs.changeusernamelog(fetcholdusername, model.username);
                        return Ok(ResponseHelper.ActionResponse($@"Kullanıcı adı başarıyla güncellendi!"));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Kullanıcı adı güncellenemedi."));
                    }

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
            UserLoginLogs userLoginLogs = new UserLoginLogs(_dbHelper);
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string getuserdata = "SELECT * from table_users WHERE username = @username AND is_deleted = false";
                    GetuserData? userdata = await connection.QueryFirstOrDefaultAsync<GetuserData>(getuserdata, model);

                    if (userdata == null || !BCrypt.Net.BCrypt.Verify(model.password, userdata.hashedpassword))
                    {
                        return BadRequest(ResponseHelper.UnAuthorizedResponse(ReturnMessages.UserCredentialsInvalidMessage));
                    }

                    var token = Guid.NewGuid().ToString("N");

                    string format = "yyyy-MM-dd HH:mm:ss";
                    DateTime login_date = DateTime.ParseExact(DateTime.Now.ToString(format), format, CultureInfo.InvariantCulture);

                    if (!string.IsNullOrEmpty(token))
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
                    //LOGIN LOGS
                    userLoginLogs.LoginLogs(userdata.username, login_date, token);
                    //LOGIN LOGS END
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
            UserOperationLogs userOperationLogs = new UserOperationLogs(_dbHelper);
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

                    string fetcholdusernamesql = "SELECT username FROM table_users where id = @id";


                    string? fetcholdusername = connection.QueryFirstOrDefault<string?>(fetcholdusernamesql, new { id = id });
                    if (fetcholdusername == null)
                    {
                        return NotFound(ResponseHelper.ErrorResponse("Kullanıcı bulunamadı."));
                    }
                    if (!ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var useridvalue))
                    {
                        return NotFound(ResponseHelper.ErrorResponse("User id yok"));
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
                    if (checkuserisdeletedresult == 1)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User is already deleted"));
                    }

                    string query = "UPDATE table_users SET is_deleted = true,is_login = false,login_date = NULL WHERE id = @id";
                    var result = await connection.ExecuteAsync(query, new { id });
                    if (result > 0)
                    {
                        //LOGS
                        userOperationLogs.deleteuserlog(fetcholdusername);
                        //LOGS END
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


        [HttpGet("FirstRegisterController")]
        public async Task<IActionResult> FirstRegisterController()
        {
            try
            {
                using(var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT count(*) FROM table_users WHERE is_deleted = false";
                    int userisexist = await connection.QueryFirstOrDefaultAsync<int>(query, connection);
                    if (userisexist > 0)
                    {
                        return Ok(new
                        {
                            status = true,
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            status = false,
                            message = "Sistemde kullanıcı mevcut değildir!"
                        });
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser(UserModel model)
        {
            using (var connection = _dbHelper.GetConnection())
            {

                string query = "SELECT count(*) FROM table_users WHERE is_deleted = false";
                int userisexist = await connection.QueryFirstOrDefaultAsync<int>(query, connection);
                if (userisexist > 0)
                {
                    TokenController g = new TokenController(_dbHelper);
                    var login = g.GetUserByToken(ControllerContext);
                    if (!login.Status)
                        return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
                }
            }

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
                    string passwordHash = BCrypt.Net.BCrypt.HashPassword(hashedpassword, saltrounds);

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

            UserLoginLogs userLoginLogs = new UserLoginLogs(_dbHelper);
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
                        //LOGOUT LOGS
                        userLoginLogs.LogoutLogs(userid);
                        //LOGOUT LOGS END

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
