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
    }
}
