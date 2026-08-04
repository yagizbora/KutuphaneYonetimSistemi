namespace KutuphaneYonetimSistemi.Models
{
    public class BooktypeGroup
    {
        public int id { get; set; }
        public string? book_types_group { get; set; }
    }
    public class InsertBookTypeGroup
    {
        public required string  book_types_group { get; set; }
    }
    public class UpdateBookTypeGroup
    {
        public required int id { get; set; }
        public required string book_types_group { get; set; }
    }
}
