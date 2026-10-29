using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Text.RegularExpressions;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerEBookController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public CustomerEBookController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        private bool TryGetCustomerId(out int userId)
        {
            userId = 0;
            ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var userIdVal);
            return !StringValues.IsNullOrEmpty(userIdVal) && int.TryParse(userIdVal, out userId);
        }

        private class RawCustomerEBookRow
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
            public int? req_id { get; set; }
            public bool? req_status { get; set; }
            public bool? req_approved { get; set; }
        }

        private static CustomerEBookItemModel MapRow(RawCustomerEBookRow r)
        {
            string accessStatus;
            bool canRead;

            if (!r.requires_approval)
            {
                accessStatus = "open";
                canRead = true;
            }
            else if (r.req_id.HasValue && r.req_status == true)
            {
                accessStatus = "pending";
                canRead = false;
            }
            else if (r.req_id.HasValue && r.req_status == false && r.req_approved == true)
            {
                accessStatus = "approved";
                canRead = true;
            }
            else if (r.req_id.HasValue && r.req_status == false && r.req_approved == false)
            {
                accessStatus = "rejected";
                canRead = false;
            }
            else
            {
                accessStatus = "none";
                canRead = false;
            }

            return new CustomerEBookItemModel
            {
                id = r.id,
                kitap_adi = r.kitap_adi,
                isbn = r.isbn,
                aciklama = r.aciklama,
                sayfa_sayisi = r.sayfa_sayisi,
                file_path = canRead ? r.file_path : null,
                external_url = canRead ? r.external_url : null,
                file_format = r.file_format,
                requires_approval = r.requires_approval,
                author_name = r.author_name,
                kitap_tur = r.kitap_tur,
                library_name = r.library_name,
                is_favorite = r.is_favorite,
                access_status = accessStatus,
                can_read = canRead,
                active_request_id = r.req_id
            };
        }

        [HttpGet("Catalog")]
        public async Task<IActionResult> Catalog()
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            if (!TryGetCustomerId(out int userId))
                return BadRequest(ResponseHelper.ErrorResponse("Valid user information not found."));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();

                const string sql = @"
                    SELECT
                        ek.id,
                        ek.kitap_adi,
                        ek.isbn,
                        ek.aciklama,
                        ek.sayfa_sayisi,
                        ek.file_path,
                        ek.external_url,
                        ek.file_format,
                        ek.requires_approval,
                        au.name_surname AS author_name,
                        tkt.aciklama AS kitap_tur,
                        li.library_name,
                        EXISTS (
                            SELECT 1 FROM table_customer_ekitap_library cel
                            WHERE cel.ebook_id = ek.id AND cel.customer_user_id = @user_id
                        ) AS is_favorite,
                        req.id AS req_id,
                        req.request_status AS req_status,
                        req.is_approved AS req_approved
                    FROM table_ekitaplar ek
                    LEFT JOIN table_authors au ON au.id = ek.author_id
                    LEFT JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = ek.kitap_tur_kodu
                    LEFT JOIN table_libraries li ON li.id = ek.library_id
                    LEFT JOIN LATERAL (
                        SELECT id, request_status, is_approved
                        FROM table_ekitap_requests r
                        WHERE r.ebook_id = ek.id AND r.customer_user_id = @user_id
                        ORDER BY r.id DESC
                        LIMIT 1
                    ) req ON true
                    WHERE ek.is_deleted = false AND ek.durum = true
                    ORDER BY ek.id DESC;";

                var rows = await connection.QueryAsync<RawCustomerEBookRow>(sql, new { user_id = userId });
                var items = rows.Select(MapRow).ToList();

                return Ok(ResponseHelper.OkResponse("E-Books retrieved successfully.", items));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("MyLibrary")]
        public async Task<IActionResult> MyLibrary()
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            if (!TryGetCustomerId(out int userId))
                return BadRequest(ResponseHelper.ErrorResponse("Valid user information not found."));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();

                const string sql = @"
                    SELECT
                        ek.id,
                        ek.kitap_adi,
                        ek.isbn,
                        ek.aciklama,
                        ek.sayfa_sayisi,
                        ek.file_path,
                        ek.external_url,
                        ek.file_format,
                        ek.requires_approval,
                        au.name_surname AS author_name,
                        tkt.aciklama AS kitap_tur,
                        li.library_name,
                        EXISTS (
                            SELECT 1 FROM table_customer_ekitap_library cel
                            WHERE cel.ebook_id = ek.id AND cel.customer_user_id = @user_id
                        ) AS is_favorite,
                        req.id AS req_id,
                        req.request_status AS req_status,
                        req.is_approved AS req_approved
                    FROM table_ekitaplar ek
                    LEFT JOIN table_authors au ON au.id = ek.author_id
                    LEFT JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = ek.kitap_tur_kodu
                    LEFT JOIN table_libraries li ON li.id = ek.library_id
                    LEFT JOIN LATERAL (
                        SELECT id, request_status, is_approved
                        FROM table_ekitap_requests r
                        WHERE r.ebook_id = ek.id AND r.customer_user_id = @user_id
                        ORDER BY r.id DESC
                        LIMIT 1
                    ) req ON true
                    WHERE ek.is_deleted = false AND ek.durum = true
                      AND (
                          EXISTS (
                              SELECT 1 FROM table_customer_ekitap_library cel2
                              WHERE cel2.ebook_id = ek.id AND cel2.customer_user_id = @user_id
                          )
                          OR (req.request_status = false AND req.is_approved = true)
                      )
                    ORDER BY ek.id DESC;";

                var rows = await connection.QueryAsync<RawCustomerEBookRow>(sql, new { user_id = userId });
                var items = rows.Select(MapRow).ToList();

                return Ok(ResponseHelper.OkResponse("My E-Books retrieved successfully.", items));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("MyRequests")]
        public async Task<IActionResult> MyRequests()
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            if (!TryGetCustomerId(out int userId))
                return BadRequest(ResponseHelper.ErrorResponse("Valid user information not found."));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();

                const string sql = @"
                    SELECT
                        r.id,
                        r.ebook_id,
                        ek.kitap_adi,
                        au.name_surname AS author_name,
                        li.library_name,
                        ek.file_format,
                        CASE WHEN r.request_status = false AND r.is_approved = true THEN ek.file_path ELSE NULL END AS file_path,
                        CASE WHEN r.request_status = false AND r.is_approved = true THEN ek.external_url ELSE NULL END AS external_url,
                        r.request_status,
                        r.is_approved,
                        r.request_date,
                        r.response_date
                    FROM table_ekitap_requests r
                    JOIN table_ekitaplar ek ON ek.id = r.ebook_id
                    LEFT JOIN table_authors au ON au.id = ek.author_id
                    LEFT JOIN table_libraries li ON li.id = ek.library_id
                    WHERE r.customer_user_id = @user_id AND ek.is_deleted = false
                    ORDER BY r.id DESC;";

                var list = (await connection.QueryAsync<CustomerEBookRequestHistoryModel>(sql, new { user_id = userId })).ToList();
                return Ok(ResponseHelper.OkResponse("Requests retrieved successfully.", list));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("RequestAccess")]
        public async Task<IActionResult> RequestAccess([FromBody] CreateCustomerEBookRequestModel model)
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            if (!TryGetCustomerId(out int userId))
                return BadRequest(ResponseHelper.ErrorResponse("Valid user information not found."));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();

                var ebook = await connection.QueryFirstOrDefaultAsync<ListEBookModel>(
                    "SELECT id, requires_approval, durum FROM table_ekitaplar WHERE id = @id AND is_deleted = false;",
                    new { id = model.ebook_id });

                if (ebook == null || !ebook.durum)
                    return NotFound(ResponseHelper.NotFoundResponse("E-Book not found."));

                if (!ebook.requires_approval)
                    return BadRequest(ResponseHelper.ErrorResponse("This e-book is already open access; you can read it directly."));

                var activeOrApproved = await connection.QueryFirstOrDefaultAsync<int?>(@"
                    SELECT id FROM table_ekitap_requests
                    WHERE ebook_id = @ebook_id
                      AND customer_user_id = @user_id
                      AND (request_status = true OR (request_status = false AND is_approved = true))
                    LIMIT 1;",
                    new { ebook_id = model.ebook_id, user_id = userId });

                if (activeOrApproved.HasValue)
                    return BadRequest(ResponseHelper.ErrorResponse("You already have an active request or approved access for this e-book."));

                await connection.ExecuteAsync(@"
                    INSERT INTO table_ekitap_requests (ebook_id, customer_user_id, request_status, request_date)
                    VALUES (@ebook_id, @user_id, true, CURRENT_TIMESTAMP);",
                    new { ebook_id = model.ebook_id, user_id = userId });

                return Ok(ResponseHelper.ActionResponse("Your e-book access request has been submitted successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpDelete("CancelRequest/{requestId}")]
        public async Task<IActionResult> CancelRequest(int requestId)
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            if (!TryGetCustomerId(out int userId))
                return BadRequest(ResponseHelper.ErrorResponse("Valid user information not found."));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();

                int deleted = await connection.ExecuteAsync(
                    "DELETE FROM table_ekitap_requests WHERE id = @id AND customer_user_id = @user_id;",
                    new { id = requestId, user_id = userId });

                if (deleted > 0)
                    return Ok(ResponseHelper.ActionResponse("Operation completed successfully."));

                return NotFound(ResponseHelper.NotFoundResponse("Request record not found."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("ToggleFavorite/{ebookId}")]
        public async Task<IActionResult> ToggleFavorite(int ebookId)
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            if (!TryGetCustomerId(out int userId))
                return BadRequest(ResponseHelper.ErrorResponse("Valid user information not found."));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();

                var existingId = await connection.QueryFirstOrDefaultAsync<int?>(
                    "SELECT id FROM table_customer_ekitap_library WHERE ebook_id = @ebook_id AND customer_user_id = @user_id;",
                    new { ebook_id = ebookId, user_id = userId });

                if (existingId.HasValue)
                {
                    await connection.ExecuteAsync(
                        "DELETE FROM table_customer_ekitap_library WHERE id = @id;",
                        new { id = existingId.Value });

                    return Ok(ResponseHelper.OkResponse("E-Book removed from your library.", new { added = false }));
                }
                else
                {
                    await connection.ExecuteAsync(
                        "INSERT INTO table_customer_ekitap_library (ebook_id, customer_user_id) VALUES (@ebook_id, @user_id);",
                        new { ebook_id = ebookId, user_id = userId });

                    return Ok(ResponseHelper.OkResponse("E-Book added to your library.", new { added = true }));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("Download/{ebookId}")]
        public async Task<IActionResult> Download(int ebookId)
        {
            CustomerTokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            if (!TryGetCustomerId(out int userId))
                return BadRequest(ResponseHelper.ErrorResponse("Valid user information not found."));

            await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
            using var connection = _dbHelper.GetConnection();

            const string sql = @"
                SELECT
                    ek.id,
                    ek.kitap_adi,
                    ek.file_path,
                    ek.requires_approval,
                    EXISTS (
                        SELECT 1 FROM table_ekitap_requests r
                        WHERE r.ebook_id = ek.id
                          AND r.customer_user_id = @user_id
                          AND r.request_status = false
                          AND r.is_approved = true
                    ) AS has_approved_access
                FROM table_ekitaplar ek
                WHERE ek.id = @id AND ek.is_deleted = false AND ek.durum = true;";

            var ebook = await connection.QueryFirstOrDefaultAsync<dynamic>(sql, new { id = ebookId, user_id = userId });
            if (ebook == null)
                return NotFound(ResponseHelper.NotFoundResponse("E-Book not found."));

            bool requiresApproval = (bool)ebook.requires_approval;
            bool hasApprovedAccess = (bool)ebook.has_approved_access;

            if (requiresApproval && !hasApprovedAccess)
                return Unauthorized(ResponseHelper.ErrorResponse("Administrator approval is required to download this e-book."));

            string? filePath = (string?)ebook.file_path;
            if (string.IsNullOrWhiteSpace(filePath))
                return NotFound(ResponseHelper.NotFoundResponse("No downloadable file found for this e-book."));

            var physicalName = Path.GetFileName(filePath);
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "Upload", "EKitap", physicalName);
            if (!System.IO.File.Exists(fullPath))
                return NotFound(ResponseHelper.NotFoundResponse("File not found on server."));

            var ext = Path.GetExtension(fullPath).ToLowerInvariant();
            var contentType = ext == ".epub" ? "application/epub+zip" : "application/pdf";
            string bookTitle = (string?)ebook.kitap_adi ?? "ebook";
            var downloadName = $"{Regex.Replace(bookTitle, @"[^a-zA-Z0-9_\-ğüşıöçĞÜŞİÖÇ ]", "").Trim()}{ext}";

            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(bytes, contentType, downloadName);
        }
    }
}
