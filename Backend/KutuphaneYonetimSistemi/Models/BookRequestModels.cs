namespace KutuphaneYonetimSistemi.Models
{
    public class BookRequestModels
    {
        public int id {  get; set; }
        public string? book_name { get; set; }
        public DateTime? request_start_time { get; set; }
        public DateTime? request_deadline { get; set; }
        public string? comment { get; set; }
        public Boolean is_complated { get; set; }
    }
    public class CreateRequest
    {
        public required string book_name { get; set; }
        public required DateTime request_start_time { get; set; }
        public required DateTime request_deadline { get; set; }
        public string? comment { get; set; }
        public required Boolean is_complated { get; set; }
    }
    public class ComplateRequest
    {
        public required int id { get; set; }
        public required Boolean is_complated { get; set; }
    }
}
