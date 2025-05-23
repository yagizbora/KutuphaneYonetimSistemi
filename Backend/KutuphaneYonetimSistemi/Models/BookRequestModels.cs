namespace KutuphaneYonetimSistemi.Models
{


    public class BookRequest
    {
        public Boolean? status { get; set; }
    }

    public class BookRequestModels
    {
        public int id {  get; set; }
        public string? book_name { get; set; }
        public DateTime? request_start_time { get; set; }
        public DateTime? request_deadline { get; set; }
        public string? comment { get; set; }
        public string? closed_subject_details { get; set; }
        public Boolean is_complated { get; set; }

    }
    public class BookRequestBasicModel
    {
        public int id { get; set; }
        public string book_name { get; set; }
        public DateTime request_start_time { get; set; }
        public DateTime request_deadline { get; set; }
        public string comment { get; set; }
        public bool is_complated { get; set; }
    }

    public class BookRequestWithClosedDetailsModel : BookRequestBasicModel
    {
        public string closed_subject_details { get; set; }
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
        public required DateTime request_start_time { get; set; }
        public required DateTime request_deadline { get; set; }
        public required string closed_subject_details { get; set; }
    }
}
