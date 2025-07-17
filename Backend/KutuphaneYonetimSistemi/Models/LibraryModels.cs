namespace KutuphaneYonetimSistemi.Models
{
    public class LibraryModels
    {
        public int id { get; set; }
        public string? library_name { get; set; }
        public TimeSpan? library_working_start_time { get; set; }
        public TimeSpan? library_working_end_time { get; set; }
        public string? location { get; set; }
        public string? location_google_map_adress { get; set; }
        public string? library_email { get; set; }
        public decimal? phone_number { get; set; }
    }
    public class CreateLibrary
    {
        public required string library_name { get; set; }
        public required TimeSpan library_working_start_time { get; set; }
        public required TimeSpan library_working_end_time { get; set; }
        public required string location { get; set; }
        public string? library_email { get; set; }
        public string? location_google_map_adress { get; set; }
        public decimal? phone_number { get; set; }
    }
    public class EditLibraryModels
    {
        public required int id { get; set; }
        public required string? library_name { get; set; }
        public required TimeSpan? library_working_start_time { get; set; }
        public required TimeSpan? library_working_end_time { get; set; }
        public required string location { get; set; }
        public string? library_email { get; set; }
        public string? location_google_map_adress { get; set; }
        public decimal? phone_number { get; set; }
    }
}
