using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace KutuphaneYonetimSistemi.Models
{

    public class ListBookModels
    {
        [JsonPropertyOrder(1)]
        public int? id { get; set; }
        [JsonPropertyOrder(2)]
        public string? kitap_adi { get; set; }
        [JsonPropertyOrder(3)]
        public string? ISBN { get; set; }
        [JsonPropertyOrder(4)]
        public bool? Durum { get; set; }
        [JsonPropertyOrder(5)]
        public string? kitap_tur { get; set; }
        [JsonPropertyOrder(6)]
        public int? kitap_tur_kodu { get; set; }
        [JsonPropertyOrder(7)]
        public string? author_name { get; set; }
        [JsonPropertyOrder(8)]
        public int? author_id { get; set; }
        [JsonPropertyOrder(9)]
        public string? library_name { get; set; }
        [JsonPropertyOrder(10)]
        public int? library_id { get; set; }
        [JsonPropertyOrder(11)]
        public int? daily_lending_fee { get; set; }
        [JsonPropertyOrder(12)]
        public string? location_google_map_adress { get; set; }

    }

    public class BookFilterModel
    {
        public string? kitap_adi { get; set; }
        public int? author_id { get; set; }
        public string? ISBN { get; set; }
        public bool? Durum { get; set; }
        public int? kitap_tur_kodu { get; set; }
        public int? library_id { get; set; }
        public string? library_location { get; set; }
        public int? daily_lending_fee { get; set; }

    }

    public class CreateBook
    {
        public required string kitap_adi { get; set; }
        public required int author_id { get; set; }
        public required string ISBN { get; set; }
        public required int kitap_tur_kodu { get; set; }
        public required int library_id { get; set; }
        public required int daily_lending_fee { get; set; }

    }
    public class UpdateBook
    {
        public required int id { get; set; }
        public required string kitap_adi { get; set; }
        public required int author_id { get; set; }
        public required string ISBN { get; set; }
        public required int kitap_tur_kodu { get; set; }
        public required int library_id { get; set; }
        public required int daily_lending_fee { get; set; }

    }

    public class lendingBooksGet
    {
        public int? Id { get; set; }
        public string? kitap_adi { get; set; }
        public string? author_name { get; set; }
        public string? isbn { get; set; }
        public int? daily_lending_fee { get; set; }
        public string? kitap_tur { get; set; }
        public bool? durum { get; set; }
    }

    public class LendingBooks
    {
        public required int id { get; set; }
        public required int customer_id { get; set; }
        public required DateTime odunc_alma_tarihi { get; set; }
    }
    public class TakenBooksGet
    {
        public int? id { get; set; }                 
        public string? kitap_adi { get; set; }        
        public bool? durum { get; set; }              
        public DateTime? odunc_alma_tarihi { get; set; } 
        public string? name_surname { get; set; }
        public int? customer_id { get; set; }
    }


    public class BookStatusModel
    {
        public bool Durum { get; set; }
        public DateTime? odunc_alma_tarihi { get; set; }
        public string? odunc_alan { get; set; }
    }


    public class ReturnBook
    {
        public required int id { get; set; }
        public required DateTime geri_verme_tarihi { get; set; }
        public required decimal payment_amount { get; set; }
        public required string payment_type { get; set; }
        public required string receipt_no { get; set; }
    }

}
