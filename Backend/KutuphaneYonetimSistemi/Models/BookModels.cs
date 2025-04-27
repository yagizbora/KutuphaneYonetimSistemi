using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace KutuphaneYonetimSistemi.Models
{

    public class ListBookModels
    {
        public int id { get; set; }
        public string? kitap_adi { get; set; }
        public string? yazar_adi { get; set; }
        public string? yazar_soyadi { get; set; }
        public string? ISBN { get; set; }
        public bool? Durum { get; set; }
        public string? kitap_tur { get; set; }
        public int kitap_tur_kodu { get; set; }
     }
    public class CreateBook
    {
        public required string kitap_adi { get; set; }
        public required string yazar_adi { get; set; }
        public required string yazar_soyadi { get; set; }
        public required string ISBN { get; set; }
        public required int kitap_tur_kodu { get; set; }
    }
    public class UpdateBook
    {
        public required int id { get; set; }
        public required string kitap_adi { get; set; }
        public required string yazar_adi { get; set; }
        public required string yazar_soyadi { get; set; }
        public required string ISBN { get; set; }
        public required int kitap_tur_kodu { get; set; }
    }

    public class lendingBooksGet
    {
        public int? Id { get; set; }
        public string? kitap_adi { get; set; }
        public string? yazar_adi { get; set; }
        public string? yazar_soyadi { get; set; }
        public string? isbn { get; set; }
        public string? kitap_tur { get; set; }
        public string? odunc_alan { get; set; }
        public DateTime? odunc_alma_tarihi { get; set; }
        public bool? durum { get; set; }
    }

    public class LendingBooks
    {
        public required int id { get; set; }
        public required string odunc_alan { get; set; }
        public required DateTime odunc_alma_tarihi { get; set; }
    }
    public class TakenBooksGet
    {
        public int? id { get; set; }                 
        public string? kitap_adi { get; set; }        
        public bool? durum { get; set; }              
        public string? odunc_alan { get; set; }      
        public DateTime? odunc_alma_tarihi { get; set; } 
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
        public required string odunc_veren { get; set; }
        public required DateTime geri_verme_tarihi { get; set; }
        public required decimal payment_amount { get; set; }
        public required string payment_type { get; set; }
    }

}
