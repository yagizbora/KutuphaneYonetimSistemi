using Dapper;
using JWT;
using JWT.Algorithms;
using JWT.Builder;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Threading;
using static KutuphaneYonetimSistemi.Common.ResponseHelper;
using static KutuphaneYonetimSistemi.Common.UserLoginLogs;

namespace KutuphaneYonetimSistemi.Common
{
    public class TokenController
    {
        private readonly DbHelper _dbHelper;

        public TokenController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }


        public ApiResponse<UserLoginModels> GetUserByToken(ControllerContext context)
        {
            UserLoginLogs userLoginLogs = new UserLoginLogs(_dbHelper);
            string? token = null;
            string? user_id_str = null;
            int user_id;

            if (context?.HttpContext?.Request?.Headers != null)
            {
                context.HttpContext.Request.Headers.TryGetValue("token", out var tokenValue);
                context.HttpContext.Request.Headers.TryGetValue("user_id", out var useridValue);
                token = tokenValue.FirstOrDefault();
                user_id_str = useridValue.FirstOrDefault();
            }

            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(user_id_str) || !int.TryParse(user_id_str, out user_id))
            {
                return new ApiResponse<UserLoginModels>() { Status = false, Message = "You cannot access the system without logging in!" };
            }

            var handler = new JwtSecurityTokenHandler();
            Helper helper = new Helper();
            if (!handler.CanReadToken(token))
            {
                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Invalid token!" };
            }

            var checkTokenSignature = helper.CheckJWTokenHaveTrueKey(token);

            if (!checkTokenSignature.status)
            {
                return new ApiResponse<UserLoginModels>() { Status = false, Message = checkTokenSignature.message };
            }

            using (var connection = _dbHelper.GetConnection())
            {
                try
                {
                    var sql = @"SELECT * FROM table_users WHERE token = @token and id = @user_id AND is_deleted = false";
                    var user = connection.QuerySingleOrDefault<UserLoginModels>(sql, new { token = token,user_id = user_id });
                    if (user == null)
                    {
                        return new ApiResponse<UserLoginModels>() { Status = false, Message = "Token could not be verified!" };
                    }
                    if (user.login_date != null)
                    {
                        TimeSpan loginTimeDiff = DateTime.Now - user.login_date.Value;

                        if (loginTimeDiff.TotalMinutes >= 270)
                        {
                            var timeoutsql = "UPDATE table_users SET token = NULL,login_date = NULL,is_login = FALSE WHERE id = @id";
                            int timeout = connection.Execute(timeoutsql, new { id = user.id });
                            if (timeout > 0)
                            {
                                if (!string.IsNullOrEmpty(user.username))
                                {
                                    userLoginLogs.LoginTimeOutLog(user.username, DateTime.Now);
                                }
                                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Session has expired!" };
                            }
                        }
                        if (user.login_date.Value > DateTime.Now)
                        {
                            var timeoutsql = "UPDATE table_users SET token = NULL,login_date = NULL,is_login = FALSE WHERE id = @id";
                            int timeout = connection.Execute(timeoutsql, new { id = user.id });
                            if (timeout > 0)
                            {
                                return new ApiResponse<UserLoginModels>()
                                {
                                    Status = false,
                                    Message = "A system error occurred: your login time is ahead of the current system time. " +
                                    "If you encounter this issue, please contact our support team immediately!"
                                };
                            }
                        }
                    }
                    else
                    {
                        return new ApiResponse<UserLoginModels>() { Status = true, Message = "Token verified!" };
                    }
                }
                catch (Exception ex)
                {
                    return new ApiResponse<UserLoginModels>() { Status = false, Message = ex.ToString() };
                }
            }

            return new ApiResponse<UserLoginModels>() { Status = true, Message = "Token is valid" };
        }
    }
    public class CustomerTokenController
    {
        private readonly DbHelper _dbHelper;

        public CustomerTokenController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public ApiResponse<UserLoginModels> GetUserByToken(ControllerContext context)
        {
            CustomerUserLoginLogs customeruserloginlogs = new(_dbHelper);
            string? token = null;
            string? user_id_str = null;
            int user_id;

            if (context?.HttpContext?.Request?.Headers != null)
            {
                context.HttpContext.Request.Headers.TryGetValue("token", out var tokenValue);
                context.HttpContext.Request.Headers.TryGetValue("user_id", out var useridValue);
                token = tokenValue.FirstOrDefault();
                user_id_str = useridValue.FirstOrDefault();
            }

            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(user_id_str) || !int.TryParse(user_id_str, out user_id))
            {
                return new ApiResponse<UserLoginModels>() { Status = false, Message = "You cannot access the system without logging in!" };
            }

            var handler = new JwtSecurityTokenHandler();
            Helper helper = new Helper();
            if (!handler.CanReadToken(token))
            {
                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Invalid token!" };
            }

            var checkTokenSignature = helper.CheckJWTokenHaveTrueKey(token);

            if (!checkTokenSignature.status)
            {
                return new ApiResponse<UserLoginModels>() { Status = false, Message = checkTokenSignature.message };
            }


            using (var connection = _dbHelper.GetConnection())
            {
                try
                {
                    var sql = @"SELECT * FROM table_customer_users WHERE token = @token and id = @user_id AND is_deleted = false";
                    var user = connection.QuerySingleOrDefault<UserLoginModels>(sql, new { token = token, user_id = user_id });
                    if (user == null)
                    {
                        return new ApiResponse<UserLoginModels>() { Status = false, Message = "Token could not be verified!" };
                    }
                    if (user.user_account_status.HasValue && !user.user_account_status.Value)
                    {
                        var disablesql = "UPDATE table_customer_users SET token = NULL,login_date = NULL,is_login = FALSE WHERE id = @id";
                        int disable = connection.Execute(disablesql, new { id = user.id });
                        if (disable > 0)
                        {
                            return new ApiResponse<UserLoginModels>() { Status = false, Message = "This account has been disabled!" };
                        }

                    }
                    if (user.login_date != null)
                    {
                        TimeSpan loginTimeDiff = DateTime.Now - user.login_date.Value;

                        if (loginTimeDiff.TotalMinutes >= 270)
                        {
                            var timeoutsql = "UPDATE table_customer_users SET token = NULL,login_date = NULL,is_login = FALSE WHERE id = @id";
                            int timeout = connection.Execute(timeoutsql, new { id = user.id });
                            if (timeout > 0)
                            {
                                if (!string.IsNullOrEmpty(user.username))
                                {
                                    customeruserloginlogs.LoginTimeOutLog(user.username, DateTime.Now);
                                }
                                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Session has expired!" };
                            }
                        }
                        if (user.login_date.Value > DateTime.Now)
                        {
                            var timeoutsql = "UPDATE table_customer_users SET token = NULL,login_date = NULL,is_login = FALSE WHERE id = @id";
                            int timeout = connection.Execute(timeoutsql, new { id = user.id });
                            if (timeout > 0)
                            {
                                return new ApiResponse<UserLoginModels>()
                                {
                                    Status = false,
                                    Message = "A system error occurred: your login time is ahead of the current system time. " +
                                    "If you encounter this issue, please contact our support team immediately!"
                                };
                            }
                        }
                    }
                    else
                    {
                        return new ApiResponse<UserLoginModels>() { Status = true, Message = "Token verified!" };
                    }
                }
                catch (Exception ex)
                {
                    return new ApiResponse<UserLoginModels>() { Status = false, Message = ex.ToString() };
                }
            }

            return new ApiResponse<UserLoginModels>() { Status = true, Message = "Token is valid" };
        }
    }
}
