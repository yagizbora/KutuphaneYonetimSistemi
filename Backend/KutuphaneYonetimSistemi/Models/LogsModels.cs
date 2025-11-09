using System.Text.Json.Serialization;

namespace KutuphaneYonetimSistemi.Models
{
    public class FilterPaymentLogs
    {
        public bool? payment_is_success { get; set; }
    }
    public class PaymentLogs
    {
        public int id { get; set; }
        public decimal payment_amount { get; set; }
        public string? payment_type { get; set; }
        public int book_id { get; set; }
        public bool payment_is_success { get; set; }
        public string? kitap_adi { get; set; }
        public DateTime payment_date { get; set; }
        public string? payment_failed_subject { get; set; }
    }

    public class UserLoginOperationLogs
    {
        public int id { get; set; }
        public string? Event { get; set; }
        public string? event_description { get; set; }
    }  
    public class LogsFilter
    {
        public string? Event { get; set; }   
    }  
    public class UserLoginOperationLogsPagination
    {
        public string? Event { get; set; }   
        public int? count { get; set; }
        public int? page { get; set; }
    }
    public class UserLoginOperationLogsResponse
    {
        [JsonPropertyOrder(1)]
        public int Count { get; set; }
        [JsonPropertyOrder(2)]
        public List <UserLoginOperationLogs>? data { get; set; }
    }
    public class RequestBookLogsModels<T>
    {
        public int id { get; set; }
        public T? auth_person { get; set; }
        public string name_surname { get; set; }
        public string kitap_adi { get; set; }
        public bool request_status { get; set; }
    }
}
