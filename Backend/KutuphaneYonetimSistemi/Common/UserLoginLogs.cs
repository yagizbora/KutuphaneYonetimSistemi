using Dapper;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Common
{
    public class UserLoginLogs
    {
        private readonly DbHelper _dbHelper;

        public UserLoginLogs(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public void LoginLogs(string username, DateTime login_date, string token)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                var eventName = $@"Bu ( {username} ) adlı kullanıcı bu zamanda {login_date} bu token ( {token} ) ile giriş yaptı!";

                var sql = "INSERT INTO table_login_logs(event, event_name) VALUES(@event, @event_name);";
                connection.Execute(sql, new { @event = "Login", event_name = eventName });
            }
        }     }
}

