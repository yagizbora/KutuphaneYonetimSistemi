namespace KutuphaneYonetimSistemi.Models
{
    public class CustomerUserModels
    {
        public required string tc_kimlik_no { get; set; }
        public required string username { get; set; }
        public required string password { get; set; }
        public required string name_surname { get; set; }
        public required DateTime birthday_date { get; set; }
        public required decimal phone_number { get; set; }
        public required string eposta { get; set; }
    }
}
