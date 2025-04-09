namespace KutuphaneYonetimSistemi.Models
{
    public class UserModel
    {
        public required string username { get; set; }
        public required string password { get; set; }
    }
    public class GetuserData
    {
        public int id { get; set; }
        public required string username { get; set; }
        public required string hashedpassword { get; set; }
    }
}
