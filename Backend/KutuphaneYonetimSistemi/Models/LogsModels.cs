namespace KutuphaneYonetimSistemi.Models
{
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
        public string event_description { get; set; }
    }  
    public class UserLoginOperationLogsFilter
    {
        public string? Event { get; set; }   
    }
}
