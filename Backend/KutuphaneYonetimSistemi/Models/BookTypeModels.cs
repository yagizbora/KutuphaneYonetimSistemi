namespace KutuphaneYonetimSistemi.Models
{
    public class GetBookTypes
    {
        public required int kitap_tur_kodu { get; set; }
        public required string aciklama { get; set; }
        public int book_group_id { get; set; }
        public string? book_types_group { get; set; }
    }
    public class CreateBookType
    {
        public required string aciklama { get; set; }
        public int book_group_id { get; set; }
    }

    public class GetBookTypesNew
    {
        public int book_group_id { get; set; }
        public string book_types_group { get; set; }

        public List<GetBookTypesNames> bookTypes { get; set; }
    }

    public class GetBookTypesNames
    {
        public required int kitap_tur_kodu { get; set; }
        public required string aciklama { get; set; }
    }
}
