using System.Text.Json.Serialization;

namespace KutuphaneYonetimSistemi.Models
{
    public class CustomerBookModels
    {
        [JsonPropertyOrder(1)]
        public int? id { get; set; }
        [JsonPropertyOrder(2)]
        public string? kitap_adi { get; set; }
        [JsonPropertyOrder(3)]
        public bool? durum { get; set; }
        [JsonPropertyOrder(4)]
        public string? author_name { get; set; }
        [JsonPropertyOrder(5)]
        public string? library_name { get; set; }
        [JsonPropertyOrder(6)]
        public string? location { get; set; }
        [JsonPropertyOrder(7)]
        public int library_id { get; set; }
    }
    public class RequestBookAdminList
    {
        public int? book_id { get; set; }
        public string? kitap_adi { get; set; }
        public string? library_name { get; set; }
        public string? name_surname { get; set; }

    }
    public class CustomerBookRequest
    {
        public required int book_id { get; set; }
        public required int library_id { get; set; }
    }
}
