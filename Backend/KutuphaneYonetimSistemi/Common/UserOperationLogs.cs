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
                var event_description = $@"User ({oldUsername}) changed their username to ({newUsername}).";
                var sql = "INSERT INTO table_user_operation_logs(event, event_description) VALUES(@event, @event_description);";
                connection.Execute(sql, new { @event = "Change Username", event_description = event_description });
            }
        }
        public void deleteuserlog(string deletedusername)
        {
                using (var connection = _dbHelper.GetConnection())
                {
                    var event_description = $@"User ({deletedusername}) was deleted at {DateTime.Now}.";
                    var sql = "INSERT INTO table_user_operation_logs(event, event_description) VALUES(@event, @event_description);";
                    connection.Execute(sql, new { @event = "Delete User", event_description = event_description });
                }
        }
        public void edituserlog(int user_id, string editeduser, int editeduserid)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                string findUsernameQuery = "SELECT username FROM table_users WHERE id = @user_id";
                var username = connection.QueryFirstOrDefault<string>(findUsernameQuery, new { user_id });
                var event_description = $@"User ({username}) edited user ({editeduser}, ID: {editeduserid}) at {DateTime.Now}. Check by ID if the username was changed.";
                var sql = "INSERT INTO table_user_operation_logs(event, event_description) VALUES(@event, @event_description);";
                connection.Execute(sql, new { @event = "Edit User", event_description = event_description });
            }
        }
    }
}
