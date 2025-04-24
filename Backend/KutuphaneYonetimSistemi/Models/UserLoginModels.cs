namespace KutuphaneYonetimSistemi.Models
{
    public class UserLoginModels
    {
        public int? id { get; set; }
        public string? username { get; set; }
        public string? token { get; set; }
        public DateTime? login_date { get; set; }
    }
    public class TokenControlModels
    {
        public bool status { get; set; }
        public string? message { get; set; }
    }
}
