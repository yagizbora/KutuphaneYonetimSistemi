
namespace KutuphaneYonetimSistemi.Models
{
    public class UserModel
    {
        public required string username { get; set; }
        public required string password { get; set; }
    }
    public class ListAllUsers
    {
        public int id { get; set; }
        public string? username { get; set; }
        public DateTime? login_date { get; set; }
        public Boolean? is_login { get; set; }
    }
    public class GetuserData
    {
        public int id { get; set; }
        public required string username { get; set; }
        public required string hashedpassword { get; set; }
    }
    public class ChangeUsername
    {
        public required string username { get; set; }
    }
    public class ChangePassword
    {
        public required string password { get; set; }

    }
    public class EditUser
    {
        public required int id { get; set; }
        public required string username { get; set; }
        public required string password { get; set; }
    }
}
