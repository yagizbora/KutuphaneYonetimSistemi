namespace KutuphaneYonetimSistemi.Models
{
    public class CustomerUserModels
    {
        public int? id { get; set; }
        public string? tc_kimlik_no { get; set; }
        public string? username { get; set; }
        public string? name_surname { get; set; }
        public DateOnly? birthday_date { get; set; }
        public decimal? phone_number { get; set; }
        public string? eposta { get; set; }
    }


    public class CreateCustomerUserModels
    {
        public required string tc_kimlik_no { get; set; }
        public required string username { get; set; }
        public required string password { get; set; }
        public required string name_surname { get; set; }
        public required DateTime birthday_date { get; set; }
        public required decimal phone_number { get; set; }
        public required string eposta { get; set; }
    }

    public class EditCustomerUserModels
    {
        public required int id { get; set; }
        public required string tc_kimlik_no { get; set; }
        public required string username { get; set; }
        public required string name_surname { get; set; }
        public required DateTime birthday_date { get; set; }
        public required decimal phone_number { get; set; }
        public required string eposta { get; set; }
    }

    public class CustomerUserModel
    {
        public required string username { get; set; }
        public required string password { get; set; }
    }
}
