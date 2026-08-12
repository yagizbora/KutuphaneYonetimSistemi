
namespace KutuphaneYonetimSistemi.Common
{
    public class ReturnMessages
    {
        public const string ImageUploaded = "Image uploaded successfully";
        public const string ImageUploadFailed = "Image upload failed";

        public const string RecordAdded = "Record added successfully";
        public const string RecordUpdated = "Record updated successfully";
        public const string RecordDeleted = "Record deleted successfully";

        public const string DataFetched = "Data fetched successfully";
        public const string DataFetchingFailed = "An error occurred while fetching data";

        public const string UnAuthorized = "You do not have permission";
        public const string Exception = "An unexpected error occurred. Please try again";
        public const string NotFound = "The requested item was not found";
        public const string UsernameIsExist = "This username is already taken";

        public const string WrongFormat = "Wrong format";

        public const string BookIsNotFree = "Book is already lent!";
        public const string BookIsFree = "Book is not lent!";
        public const string UserCredentialsInvalidMessage = "Invalid Username or Password";
        public const string UserTokenInvalidMessage = "Failed to update user token";
        public const string UserTokenSignatureIsNotTrue = "JWT token signature is invalid";
    }
}
