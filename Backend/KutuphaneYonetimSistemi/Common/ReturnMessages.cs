
namespace KutuphaneYonetimSistemi.Common
{
    public class ReturnMessages
    {
        public const string ImageUploaded = "Resim başarıyla yüklendi";
        public const string ImageUploadFailed = "Resim yükleme başarısız oldu";

        public const string RecordAdded = "Kayıt başarıyla eklendi";
        public const string RecordUpdated = "Kayıt başarıyla güncellendi";
        public const string RecordDeleted = "Kayıt Başarıyla Silindi";

        public const string DataFetched = "Veriler başarıyla getirildi";
        public const string DataFetchingFailed = "Veri alınırken bir hata oluştu";

        public const string UnAuthorized = "Erişim izniniz yok";
        public const string Exception = "Beklenmeyen bir hata oluştu.Lütfen tekrar deneyiniz";
        public const string NotFound = "Aradığınız istek bulunamadı";
        public const string UsernameIsExist = "Bu kullanıcı ismi daha önce alınmış";

        public const string WrongFormat = "Yanlış format";

        public const string BookIsNotFree = "Kitap zaten ödünç alındı!";
        public const string BookIsFree = "Kitap ödünç alınmmaış!";
        public const string UserCredentialsInvalidMessage = "Kullanıcı Adı Veya Şifre Yanlış";
        public const string UserTokenInvalidMessage = "Failed to update user token";
        public const string UserTokenSignatureIsNotTrue = "JWT token imzası doğru değil";
    }
}
