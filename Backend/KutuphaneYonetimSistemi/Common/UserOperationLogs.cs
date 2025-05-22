using Dapper;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Common
{
    public class UserOperationLogs
    {
        private readonly DbHelper _dbHelper;

        public UserOperationLogs(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public void changeusernamelog(string oldUsername, string newUsername)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                var eventName = $@"( {oldUsername} ) adlı kullanıcı ismini ( {newUsername} ) ile değiştirmiştir";
                var sql = "INSERT INTO table_user_operation_logs(event, event_name) VALUES(@event, @event_name);";
                connection.Execute(sql, new { @event = "Login Time out", event_name = eventName });
            }
        }
    }
}
