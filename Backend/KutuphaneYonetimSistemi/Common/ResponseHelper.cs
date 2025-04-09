using static System.Runtime.InteropServices.JavaScript.JSType;

namespace KutuphaneYonetimSistemi.Common
{
    public class ResponseHelper
    {
         public class ApiResponse<T>
        {
            public int StatusCode { get; set; }
            public bool Status { get; set; }
            public string? Message { get; set; }
            public string? ExceptionMessage { get; set; }
            public T? Data { get; set; } 
        }

        public static ApiResponse<T> OkResponse<T>(string message, T data)
        {
            return new ApiResponse<T> { StatusCode = 200, Status = true, Message = message, Data = data };
        }

        public static ApiResponse<T> ResponseSuccesfully<T>(string message)
        {
            return new ApiResponse<T> { StatusCode = 200, Status = true, Message = message };
        }

        public static ApiResponse<object> ActionResponse(string message)
        {
            return new ApiResponse<object> { StatusCode = 200, Status = true, Message = message, Data = null };
        }

        public static ApiResponse<object> ErrorResponse(string message)
        {
            return new ApiResponse<object> { StatusCode = 400, Status = false, Message = message, Data = null };
        }

        public static ApiResponse<object> ExceptionResponse(string ex="")
        {
            return new ApiResponse<object> { StatusCode = 500, Status = false, Message = ReturnMessages.Exception, Data = null, ExceptionMessage=ex };
        }

        public static ApiResponse<object> UnAuthorizedResponse(string? message)
        {
            return new ApiResponse<object>
            {
                StatusCode = 401,
                Status = false,
                Message = string.IsNullOrEmpty(message) ? ReturnMessages.UnAuthorized : message,
                Data = null
            };
        }

        public static ApiResponse<object> NotFoundResponse(string notFound)
        {
            return new ApiResponse<object> { StatusCode = 404, Status = false, Message = ReturnMessages.NotFound, Data = null };
        }
    }
}
