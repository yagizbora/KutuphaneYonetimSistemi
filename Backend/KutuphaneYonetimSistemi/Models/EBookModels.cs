using Microsoft.AspNetCore.Http;

namespace KutuphaneYonetimSistemi.Models
{
    public class ListEBookModel
    {
        public int id { get; set; }
        public string? kitap_adi { get; set; }
        public string? isbn { get; set; }
        public string? aciklama { get; set; }
        public int? sayfa_sayisi { get; set; }
        public string? file_path { get; set; }
        public string? external_url { get; set; }
        public string? file_format { get; set; }
        public bool requires_approval { get; set; }
        public bool durum { get; set; }
        public DateTime? created_at { get; set; }
        public int? author_id { get; set; }
        public string? author_name { get; set; }
        public int? kitap_tur_kodu { get; set; }
        public string? kitap_tur { get; set; }
        public int? library_id { get; set; }
        public string? library_name { get; set; }
    }

    public class EBookFilterModel
    {
        public string? kitap_adi { get; set; }
        public int? author_id { get; set; }
        public string? isbn { get; set; }
        public int? kitap_tur_kodu { get; set; }
        public int? library_id { get; set; }
        public bool? requires_approval { get; set; }
        public bool? durum { get; set; }
        public string? file_format { get; set; }
    }

    public class CreateEBookFormModel
    {
        public required string kitap_adi { get; set; }
        public int? author_id { get; set; }
        public string? isbn { get; set; }
        public int? kitap_tur_kodu { get; set; }
        public int? library_id { get; set; }
        public string? aciklama { get; set; }
        public int? sayfa_sayisi { get; set; }
        public string? external_url { get; set; }
        public bool requires_approval { get; set; } = false;
        public bool durum { get; set; } = true;
        public IFormFile? file { get; set; }
    }

    public class UpdateEBookFormModel
    {
        public required int id { get; set; }
        public required string kitap_adi { get; set; }
        public int? author_id { get; set; }
        public string? isbn { get; set; }
        public int? kitap_tur_kodu { get; set; }
        public int? library_id { get; set; }
        public string? aciklama { get; set; }
        public int? sayfa_sayisi { get; set; }
        public string? external_url { get; set; }
        public bool requires_approval { get; set; } = false;
        public bool durum { get; set; } = true;
        public bool remove_existing_file { get; set; } = false;
        public IFormFile? file { get; set; }
    }

    public class CustomerEBookItemModel
    {
        public int id { get; set; }
        public string? kitap_adi { get; set; }
        public string? isbn { get; set; }
        public string? aciklama { get; set; }
        public int? sayfa_sayisi { get; set; }
        public string? file_path { get; set; }
        public string? external_url { get; set; }
        public string? file_format { get; set; }
        public bool requires_approval { get; set; }
        public string? author_name { get; set; }
        public string? kitap_tur { get; set; }
        public string? library_name { get; set; }
        public bool is_favorite { get; set; }
        public string access_status { get; set; } = "open";
        public bool can_read { get; set; }
        public int? active_request_id { get; set; }
    }

    public class CreateCustomerEBookRequestModel
    {
        public required int ebook_id { get; set; }
    }

    public class CustomerEBookRequestHistoryModel
    {
        public int id { get; set; }
        public int ebook_id { get; set; }
        public string? kitap_adi { get; set; }
        public string? author_name { get; set; }
        public string? library_name { get; set; }
        public string? file_format { get; set; }
        public string? file_path { get; set; }
        public string? external_url { get; set; }
        public bool request_status { get; set; }
        public bool? is_approved { get; set; }
        public DateTime? request_date { get; set; }
        public DateTime? response_date { get; set; }
    }

    public class AdminEBookRequestListModel
    {
        public int id { get; set; }
        public int ebook_id { get; set; }
        public string? kitap_adi { get; set; }
        public string? file_format { get; set; }
        public string? library_name { get; set; }
        public int customer_user_id { get; set; }
        public string? name_surname { get; set; }
        public bool request_status { get; set; }
        public bool? is_approved { get; set; }
        public DateTime? request_date { get; set; }
        public DateTime? response_date { get; set; }
    }

    public class AdminEBookRequestResultModel
    {
        public required int request_id { get; set; }
        public required bool result { get; set; }
    }
}
