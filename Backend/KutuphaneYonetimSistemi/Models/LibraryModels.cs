namespace KutuphaneYonetimSistemi.Models
{
    public class LibraryModels
    {
        public int id { get; set; }
        public string? library_name { get; set; }
        public TimeSpan? library_working_start_time { get; set; }
        public TimeSpan? library_working_end_time { get; set; }
    }
    public class CreateLibrary
    {
        public required string library_name { get; set; }
        public required TimeSpan library_working_start_time { get; set; }
        public required TimeSpan library_working_end_time { get; set; }
    }

}
