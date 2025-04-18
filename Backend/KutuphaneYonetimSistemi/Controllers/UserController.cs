﻿using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Globalization;
using System.Threading.RateLimiting;


namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DbHelper _dbHelper;



        public UserController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        [HttpGet("ListAllUser")]
        public async Task<IActionResult> ListAllUser()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using(var connection = _dbHelper.GetConnection())
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

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser(UserModel model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
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

                    string query = "INSERT INTO table_users (username, hashedpassword,is_deleted) VALUES (@username, @passwordHash,false)";
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
        public async Task<IActionResult> Logout(Logout model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkuserislogin = "SELECT is_login FROM table_users WHERE id = @user_id";
                    var islogin = await connection.QueryFirstOrDefaultAsync<bool>(checkuserislogin, model);
                    if (islogin == false)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("User is not login"));
                    }
                    string query = "UPDATE table_users SET token = NULL, login_date = NULL,is_login = false WHERE id = @user_id";
                    var result = await connection.ExecuteAsync(query, model);
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
