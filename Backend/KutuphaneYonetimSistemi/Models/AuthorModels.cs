using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Models
{
    public class GetAuthor
    {
        public int id { get; set; }
        public string name_surname { get; set; }
        public DateTime birthday_date { get; set; }
        public string biography { get; set; }
    }
    public class CreateAuthor
    {
        public required string name_surname { get; set; }
        public required DateTime birthday_date { get; set; }
        public required string biography { get; set; }
    }



}
