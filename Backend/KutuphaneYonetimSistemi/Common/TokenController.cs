﻿using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using static KutuphaneYonetimSistemi.Common.ResponseHelper;
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
            string? token = null;

            if (context?.HttpContext?.Request?.Headers != null)
            {
                context.HttpContext.Request.Headers.TryGetValue("token", out var tokenValue);
                token = tokenValue.FirstOrDefault();
            }

            if (string.IsNullOrEmpty(token))
            {
                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Login olmadan sisteme giriş yapamazsın!" };
            }

            using (var connection = _dbHelper.GetConnection())
            {
                try
                {
                    var sql = @"SELECT * FROM table_users WHERE token = @token AND is_deleted = false";
                    var user = connection.QuerySingleOrDefault<UserLoginModels>(sql, new { token = token });
                    if (user == null)
                    {
                        return new ApiResponse<UserLoginModels>() { Status = false, Message = "Token doğrulanamadı!" };
                    }
                    if (user.login_date != null)
                    {
                        TimeSpan loginTimeDiff = DateTime.Now - user.login_date.Value;

                        if (loginTimeDiff.TotalMinutes >= 90)
                        {
                            var timeoutsql = "UPDATE table_users SET token = NULL,login_date = NULL,is_login = FALSE WHERE id = @id";
                            int timeout = connection.Execute(timeoutsql, new { id = user.id });
                            if (timeout > 0)
                            {
                                return new ApiResponse<UserLoginModels>() { Status = false, Message = "Oturum süresi doldu!" };
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
