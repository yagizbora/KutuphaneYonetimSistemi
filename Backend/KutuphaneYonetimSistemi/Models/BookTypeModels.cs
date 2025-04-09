namespace KutuphaneYonetimSistemi.Models
{
    public class GetBookTypes
    {
        public required int kitap_tur_kodu { get; set; }
        public required string aciklama { get; set; }
    }
    public class CreateBookType
    {
        public required string aciklama { get; set; }
    }
}
