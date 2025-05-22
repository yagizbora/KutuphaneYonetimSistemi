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
        }

        public void LogoutLogs(int user_id)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                string findUsernameQuery = "SELECT username FROM table_users WHERE id = @user_id";
                var username = connection.QueryFirstOrDefault<string>(findUsernameQuery, new { user_id });

                
                var logoutDate = DateTime.Now;

                var eventName = $@"Bu ( {username} ) adlı kullanıcı bu ( {logoutDate} ) bu zamanda çıkış yapmıştır";

                var sql = "INSERT INTO table_login_logs(event, event_name) VALUES(@event, @event_name);";
                connection.Execute(sql, new { @event = "Logout", event_name = eventName });
            }
        }
        public void LoginTimeOutLog(string username, DateTime login_date)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                var eventName = $@"Bu ( {username} ) adlı kullanıcsı bu zamanda ( {login_date} ) oturum süresi dolduğu için çıkış yaptırılmıştır!";
                var sql = "INSERT INTO table_login_logs(event, event_name) VALUES(@event, @event_name);";
                connection.Execute(sql, new { @event = "Login Time out", event_name = eventName });
            }
        }
    }
}

