using Dapper;

namespace KutuphaneYonetimSistemi.Common
{
    public static class EBookSchemaInitializer
    {
        private static bool _initialized = false;
        private static readonly SemaphoreSlim _lock = new SemaphoreSlim(1, 1);

        public static async Task EnsureCreatedAsync(DbHelper dbHelper)
        {
            if (_initialized) return;

            await _lock.WaitAsync();
            try
            {
                if (_initialized) return;

                const string sql = @"
                CREATE TABLE IF NOT EXISTS table_ekitaplar (
                    id SERIAL PRIMARY KEY,
                    kitap_adi VARCHAR(255) NOT NULL,
                    author_id INT NULL,
                    isbn VARCHAR(100) NULL,
                    kitap_tur_kodu INT NULL,
                    library_id INT NULL,
                    aciklama TEXT NULL,
                    file_path TEXT NULL,
                    external_url TEXT NULL,
                    file_format VARCHAR(30) NOT NULL DEFAULT 'PDF',
                    sayfa_sayisi INT NULL,
                    requires_approval BOOLEAN NOT NULL DEFAULT false,
                    durum BOOLEAN NOT NULL DEFAULT true,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    is_deleted BOOLEAN NOT NULL DEFAULT false
                );

                CREATE TABLE IF NOT EXISTS table_ekitap_requests (
                    id SERIAL PRIMARY KEY,
                    ebook_id INT NOT NULL REFERENCES table_ekitaplar(id) ON DELETE CASCADE,
                    customer_user_id INT NOT NULL,
                    request_status BOOLEAN NOT NULL DEFAULT true,
                    is_approved BOOLEAN NULL,
                    auth_person_id INT NULL,
                    request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    response_date TIMESTAMP NULL
                );

                CREATE TABLE IF NOT EXISTS table_customer_ekitap_library (
                    id SERIAL PRIMARY KEY,
                    ebook_id INT NOT NULL REFERENCES table_ekitaplar(id) ON DELETE CASCADE,
                    customer_user_id INT NOT NULL,
                    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT uq_customer_ekitap UNIQUE (ebook_id, customer_user_id)
                );

                CREATE INDEX IF NOT EXISTS idx_ekitaplar_deleted_durum ON table_ekitaplar (is_deleted, durum);
                CREATE INDEX IF NOT EXISTS idx_ekitap_requests_customer ON table_ekitap_requests (customer_user_id, ebook_id);
                CREATE INDEX IF NOT EXISTS idx_ekitap_requests_status ON table_ekitap_requests (request_status);
                CREATE INDEX IF NOT EXISTS idx_customer_ekitap_library_user ON table_customer_ekitap_library (customer_user_id);";

                using var connection = dbHelper.GetConnection();
                await connection.ExecuteAsync(sql);
                _initialized = true;
            }
            finally
            {
                _lock.Release();
            }
        }
    }
}
