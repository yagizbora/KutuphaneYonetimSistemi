using Npgsql;
using Dapper;

namespace KutuphaneYonetimSistemi.Common
{
    public class DbHelper
    {
        private readonly string _connectionString;

        public DbHelper(string connectionString)
        {
            _connectionString = connectionString;
        }

        public NpgsqlConnection GetConnection()
        {
            return new NpgsqlConnection(_connectionString);
        }

        public T Execute<T>(Func<NpgsqlConnection, T> func)
        {
            using (var connection = GetConnection())
            {
            connection.Open();
            return func(connection);
            }
        }
        
    }
}
