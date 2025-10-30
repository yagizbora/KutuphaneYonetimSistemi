using Dapper;

namespace KutuphaneYonetimSistemi.Common
{
    public class CustomerUserLoginLogs
    {
        private readonly DbHelper _dbHelper;

        public CustomerUserLoginLogs(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public void LoginLogs(string username, DateTime login_date)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                var event_description = $@"Bu ( {username} ) adlı müşteri kullanıcısı bu zamanda {login_date} giriş yaptı!";

                var sql = "INSERT INTO table_user_operation_logs(event, event_description) VALUES(@event, @event_description);";
                connection.Execute(sql, new { @event = "Login", event_description = event_description });
            }
        }

        public void LogoutLogs(int user_id)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                string findUsernameQuery = "SELECT username FROM table_customer_users WHERE id = @user_id";
                var username = connection.QueryFirstOrDefault<string>(findUsernameQuery, new { user_id });


                var logoutDate = DateTime.Now;

                var event_description = $@"Bu ( {username} ) adlı müşteri kullanıcısı kullanıcı bu ( {logoutDate} ) bu zamanda çıkış yapmıştır";

                var sql = "INSERT INTO table_user_operation_logs(event, event_description) VALUES(@event, @event_description);";
                connection.Execute(sql, new { @event = "Logout", event_description = event_description });
            }
        }
        public void LoginTimeOutLog(string username, DateTime login_date)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                var event_description = $@"Bu ( {username} ) adlı müşteri kullanıcısı  kullanıcsı bu zamanda ( {login_date} ) oturum süresi dolduğu için çıkış yaptırılmıştır!";
                var sql = "INSERT INTO table_user_operation_logs(event, event_description) VALUES(@event, @event_description);";
                connection.Execute(sql, new { @event = "Login Time out", event_description = event_description });
            }
        }
    }
}
