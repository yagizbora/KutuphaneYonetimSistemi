using Microsoft.Extensions.Caching.Memory;

namespace KutuphaneYonetimSistemi.Common
{
    public class CacheCleanupService : BackgroundService
    {
        private readonly IMemoryCache _cache;

        public CacheCleanupService(IMemoryCache cache)
        {
            _cache = cache;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                foreach (var key in CacheKeys.BookKeys.ToList())
                {
                    if (key.StartsWith("books_"))
                    {
                        _cache.Remove(key);
                        CacheKeys.BookKeys.Remove(key);
                    }
                }
                foreach (var key in CacheKeys.AuthorKeys.ToList())
                {
                    if (key.StartsWith("author_key"))
                    {
                        _cache.Remove(key);
                        CacheKeys.BookKeys.Remove(key);
                    }
                }
                foreach (var key in CacheKeys.BookKeys.ToList())
                {
                    if (key.StartsWith("librarycache"))
                    {
                        _cache.Remove(key);
                        CacheKeys.BookKeys.Remove(key);
                    }
                }

                await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken);
            }
        }
    }
}
