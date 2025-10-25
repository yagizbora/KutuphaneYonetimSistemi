using Dapper;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using static KutuphaneYonetimSistemi.Common.ResponseHelper;
using static KutuphaneYonetimSistemi.Common.UserLoginLogs;
using JWT;
using JWT.Algorithms;
using JWT.Builder;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

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
                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Login olmadan sisteme giriş yapamazsın!" };
            }

            using (var connection = _dbHelper.GetConnection())
            {
                try
                {
                    var sql = @"SELECT * FROM table_users WHERE token = @token and id = @user_id AND is_deleted = false";
                    var user = connection.QuerySingleOrDefault<UserLoginModels>(sql, new { token = token,user_id = user_id });
                    if (user == null)
                    {
                        return new ApiResponse<UserLoginModels>() { Status = false, Message = "Token doğrulanamadı!" };
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
                                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Oturum süresi doldu!" };
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
                                    Message = $"Sistemde hata oluştu sistemdeki giriş saatiniz" +
                                    $" güncel saatten daha az bu durum ile karşılaşırsanız destek ekibimiz ile acilen iletişime geçin!"
                                };
                            }
                        }
                    }
                    else
                    {
                        return new ApiResponse<UserLoginModels>() { Status = true, Message = "Token doğrulandı!" };
                    }
                }
                catch (Exception ex)
                {
                    return new ApiResponse<UserLoginModels>() { Status = false, Message = ex.ToString() };
                }
            }

            return new ApiResponse<UserLoginModels>() { Status = true, Message = "Token Geçerli" };
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
                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Login olmadan sisteme giriş yapamazsın!" };
            }

            var handler = new JwtSecurityTokenHandler();

            if (!handler.CanReadToken(token))
            {
                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Token geçerli değil!" };
            }

            using (var connection = _dbHelper.GetConnection())
            {
                try
                {
                    var sql = @"SELECT * FROM table_customer_users WHERE token = @token and id = @user_id AND is_deleted = false";
                    var user = connection.QuerySingleOrDefault<UserLoginModels>(sql, new { token = token, user_id = user_id });
                    if (user == null)
                    {
                        return new ApiResponse<UserLoginModels>() { Status = false, Message = "Token doğrulanamadı!" };
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
                                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Oturum süresi doldu!" };
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
                                    Message = $"Sistemde hata oluştu sistemdeki giriş saatiniz" +
                                    $" güncel saatten daha az bu durum ile karşılaşırsanız destek ekibimiz ile acilen iletişime geçin!"
                                };
                            }
                        }
                    }
                    else
                    {
                        return new ApiResponse<UserLoginModels>() { Status = true, Message = "Token doğrulandı!" };
                    }
                }
                catch (Exception ex)
                {
                    return new ApiResponse<UserLoginModels>() { Status = false, Message = ex.ToString() };
                }
            }

            return new ApiResponse<UserLoginModels>() { Status = true, Message = "Token Geçerli" };
        }
    }
}
