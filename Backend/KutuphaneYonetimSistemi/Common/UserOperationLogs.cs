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
                connection.Execute(sql, new { @event = "Change Username", event_name = eventName });
            }
        }
        public void deleteuserlog(string deletedusername)
        {
                using (var connection = _dbHelper.GetConnection())
                {
                    var eventName = $@"( {deletedusername} ) adlı kullanıcı ( {DateTime.Now} ) zamanında silinmiştir";
                    var sql = "INSERT INTO table_user_operation_logs(event, event_name) VALUES(@event, @event_name);";
                    connection.Execute(sql, new { @event = "Delete User", event_name = eventName });
                }
        }
        public void edituserlog(int user_id, string editeduser, int editeduserid)
        {
            using (var connection = _dbHelper.GetConnection())
            {
                string findUsernameQuery = "SELECT username FROM table_users WHERE id = @user_id";
                var username = connection.QueryFirstOrDefault<string>(findUsernameQuery, new { user_id });
                var eventName = $@"( {username} ) adlı kullanıcı bu ( {editeduser} ) kullanıcı adlı ve ( {editeduserid} ) id ye sahip kullanıcı bu {DateTime.Now} zamanda düzenlenmiştir. Kullanıcı adı değişti ise id den kontrol ediniz";
                var sql = "INSERT INTO table_user_operation_logs(event, event_name) VALUES(@event, @event_name);";
                connection.Execute(sql, new { @event = "Edit User", event_name = eventName });
            }
        }
    }
}
