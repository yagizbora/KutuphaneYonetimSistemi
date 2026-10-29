using ClosedXML.Excel;
using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Data;
using System.Text.RegularExpressions;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EBookController : ControllerBase
    {
        private readonly DbHelper _dbHelper;
        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase) { ".pdf", ".epub" };

        public EBookController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        private static string DetermineFormat(string? filePath, string? externalUrl)
        {
            if (!string.IsNullOrWhiteSpace(filePath))
            {
                var ext = Path.GetExtension(filePath).ToLowerInvariant();
                if (ext == ".epub") return "EPUB";
                return "PDF";
            }

            if (!string.IsNullOrWhiteSpace(externalUrl))
            {
                var cleanUrl = externalUrl.Split('?')[0].ToLowerInvariant();
                if (cleanUrl.EndsWith(".epub")) return "EPUB";
                if (cleanUrl.EndsWith(".pdf")) return "PDF";
            }

            return "URL";
        }

        private static async Task<string> SaveUploadedFileAsync(IFormFile file)
        {
            var ext = Path.GetExtension(file.FileName);
            if (string.IsNullOrWhiteSpace(ext) || !AllowedExtensions.Contains(ext))
            {
                throw new InvalidOperationException("Sadece PDF veya EPUB formatında dosya yüklenebilir.");
            }

            var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "Upload", "EKitap");
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            var baseName = Path.GetFileNameWithoutExtension(file.FileName);
            var safeBase = Regex.Replace(baseName ?? "ekitap", @"[^a-zA-Z0-9_\-]", "_");
            if (safeBase.Length > 40) safeBase = safeBase.Substring(0, 40);

            var fileName = $"{Guid.NewGuid():N}_{safeBase}{ext.ToLowerInvariant()}";
            var fullPath = Path.Combine(uploadFolder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/Upload/EKitap/{fileName}";
        }

        private static void TryDeletePhysicalFile(string? relativePath)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(relativePath) || !relativePath.StartsWith("/Upload/EKitap/"))
                    return;

                var fileName = Path.GetFileName(relativePath);
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "Upload", "EKitap", fileName);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            catch
            {
                // Ignore cleanup failures
            }
        }

        [HttpPost("GetEBooks")]
        public async Task<IActionResult> GetEBooks([FromBody] EBookFilterModel? models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                models ??= new EBookFilterModel();

                using var connection = _dbHelper.GetConnection();
                string filtersql = "";
                var parameters = new DynamicParameters();

                if (!string.IsNullOrWhiteSpace(models.kitap_adi))
                {
                    filtersql += " AND ek.kitap_adi ILIKE @kitap_adi";
                    parameters.Add("kitap_adi", $"%{models.kitap_adi.Trim()}%");
                }
                if (models.author_id.HasValue && models.author_id.Value > 0)
                {
                    filtersql += " AND ek.author_id = @author_id";
                    parameters.Add("author_id", models.author_id.Value);
                }
                if (!string.IsNullOrWhiteSpace(models.isbn))
                {
                    filtersql += " AND ek.isbn ILIKE @isbn";
                    parameters.Add("isbn", $"%{models.isbn.Trim()}%");
                }
                if (models.kitap_tur_kodu.HasValue && models.kitap_tur_kodu.Value > 0)
                {
                    filtersql += " AND ek.kitap_tur_kodu = @kitap_tur_kodu";
                    parameters.Add("kitap_tur_kodu", models.kitap_tur_kodu.Value);
                }
                if (models.library_id.HasValue && models.library_id.Value > 0)
                {
                    filtersql += " AND ek.library_id = @library_id";
                    parameters.Add("library_id", models.library_id.Value);
                }
                if (models.requires_approval.HasValue)
                {
                    filtersql += " AND ek.requires_approval = @requires_approval";
                    parameters.Add("requires_approval", models.requires_approval.Value);
                }
                if (models.durum.HasValue)
                {
                    filtersql += " AND ek.durum = @durum";
                    parameters.Add("durum", models.durum.Value);
                }
                if (!string.IsNullOrWhiteSpace(models.file_format))
                {
                    filtersql += " AND ek.file_format = @file_format";
                    parameters.Add("file_format", models.file_format.Trim().ToUpperInvariant());
                }

                string query = $@"
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
                        ek.durum,
                        ek.created_at,
                        ek.author_id,
                        au.name_surname AS author_name,
                        ek.kitap_tur_kodu,
                        tkt.aciklama AS kitap_tur,
                        ek.library_id,
                        li.library_name
                    FROM table_ekitaplar ek
                    LEFT JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = ek.kitap_tur_kodu
                    LEFT JOIN table_authors au ON au.id = ek.author_id
                    LEFT JOIN table_libraries li ON li.id = ek.library_id
                    WHERE ek.is_deleted = false {filtersql}
                    ORDER BY ek.id DESC;";

                var ebooks = (await connection.QueryAsync<ListEBookModel>(query, parameters)).ToList();
                return Ok(ResponseHelper.OkResponse("E-Books fetched.", ebooks));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("GetEBook/{id}")]
        public async Task<IActionResult> GetEBook(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();
                const string query = @"
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
                        ek.durum,
                        ek.created_at,
                        ek.author_id,
                        au.name_surname AS author_name,
                        ek.kitap_tur_kodu,
                        tkt.aciklama AS kitap_tur,
                        ek.library_id,
                        li.library_name
                    FROM table_ekitaplar ek
                    LEFT JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = ek.kitap_tur_kodu
                    LEFT JOIN table_authors au ON au.id = ek.author_id
                    LEFT JOIN table_libraries li ON li.id = ek.library_id
                    WHERE ek.is_deleted = false AND ek.id = @id;";

                var ebook = await connection.QueryFirstOrDefaultAsync<ListEBookModel>(query, new { id });
                if (ebook == null)
                    return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));

                return Ok(ResponseHelper.OkResponse("E-Book fetched.", ebook));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("CreateEBook")]
        [RequestSizeLimit(104_857_600)]
        public async Task<IActionResult> CreateEBook([FromForm] CreateEBookFormModel model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);

                if (string.IsNullOrWhiteSpace(model.kitap_adi))
                    return BadRequest(ResponseHelper.ErrorResponse("Kitap adı zorunludur."));

                if (model.file == null && string.IsNullOrWhiteSpace(model.external_url))
                    return BadRequest(ResponseHelper.ErrorResponse("Lütfen bir PDF/EPUB dosyası yükleyin veya harici bir bağlantı (URL) girin."));

                string? filePath = null;
                if (model.file != null && model.file.Length > 0)
                {
                    filePath = await SaveUploadedFileAsync(model.file);
                }

                string? cleanUrl = string.IsNullOrWhiteSpace(model.external_url) ? null : model.external_url.Trim();
                string fileFormat = DetermineFormat(filePath, cleanUrl);

                using var connection = _dbHelper.GetConnection();
                const string insertSql = @"
                    INSERT INTO table_ekitaplar (
                        kitap_adi, author_id, isbn, kitap_tur_kodu, library_id,
                        aciklama, file_path, external_url, file_format, sayfa_sayisi,
                        requires_approval, durum, is_deleted
                    ) VALUES (
                        @kitap_adi, @author_id, @isbn, @kitap_tur_kodu, @library_id,
                        @aciklama, @file_path, @external_url, @file_format, @sayfa_sayisi,
                        @requires_approval, @durum, false
                    );";

                await connection.ExecuteAsync(insertSql, new
                {
                    kitap_adi = model.kitap_adi.Trim(),
                    author_id = model.author_id > 0 ? model.author_id : null,
                    isbn = string.IsNullOrWhiteSpace(model.isbn) ? null : model.isbn.Trim(),
                    kitap_tur_kodu = model.kitap_tur_kodu > 0 ? model.kitap_tur_kodu : null,
                    library_id = model.library_id > 0 ? model.library_id : null,
                    aciklama = string.IsNullOrWhiteSpace(model.aciklama) ? null : model.aciklama.Trim(),
                    file_path = filePath,
                    external_url = cleanUrl,
                    file_format = fileFormat,
                    sayfa_sayisi = model.sayfa_sayisi > 0 ? model.sayfa_sayisi : null,
                    requires_approval = model.requires_approval,
                    durum = model.durum
                });

                return Ok(ResponseHelper.ResponseSuccesfully<object>("E-Book created successfully."));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ResponseHelper.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPut("UpdateEBook")]
        [RequestSizeLimit(104_857_600)]
        public async Task<IActionResult> UpdateEBook([FromForm] UpdateEBookFormModel model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);

                if (string.IsNullOrWhiteSpace(model.kitap_adi))
                    return BadRequest(ResponseHelper.ErrorResponse("Kitap adı zorunludur."));

                using var connection = _dbHelper.GetConnection();
                var existing = await connection.QueryFirstOrDefaultAsync<ListEBookModel>(
                    "SELECT id, file_path, external_url FROM table_ekitaplar WHERE id = @id AND is_deleted = false;",
                    new { model.id });

                if (existing == null)
                    return NotFound(ResponseHelper.NotFoundResponse("E-Book not found."));

                string? filePath = existing.file_path;

                if (model.remove_existing_file && !string.IsNullOrWhiteSpace(filePath))
                {
                    TryDeletePhysicalFile(filePath);
                    filePath = null;
                }

                if (model.file != null && model.file.Length > 0)
                {
                    if (!string.IsNullOrWhiteSpace(filePath))
                    {
                        TryDeletePhysicalFile(filePath);
                    }
                    filePath = await SaveUploadedFileAsync(model.file);
                }

                string? cleanUrl = string.IsNullOrWhiteSpace(model.external_url) ? null : model.external_url.Trim();

                if (string.IsNullOrWhiteSpace(filePath) && string.IsNullOrWhiteSpace(cleanUrl))
                    return BadRequest(ResponseHelper.ErrorResponse("En az bir dosya veya harici URL bulunmalıdır."));

                string fileFormat = DetermineFormat(filePath, cleanUrl);

                const string updateSql = @"
                    UPDATE table_ekitaplar SET
                        kitap_adi = @kitap_adi,
                        author_id = @author_id,
                        isbn = @isbn,
                        kitap_tur_kodu = @kitap_tur_kodu,
                        library_id = @library_id,
                        aciklama = @aciklama,
                        file_path = @file_path,
                        external_url = @external_url,
                        file_format = @file_format,
                        sayfa_sayisi = @sayfa_sayisi,
                        requires_approval = @requires_approval,
                        durum = @durum
                    WHERE id = @id;";

                await connection.ExecuteAsync(updateSql, new
                {
                    id = model.id,
                    kitap_adi = model.kitap_adi.Trim(),
                    author_id = model.author_id > 0 ? model.author_id : null,
                    isbn = string.IsNullOrWhiteSpace(model.isbn) ? null : model.isbn.Trim(),
                    kitap_tur_kodu = model.kitap_tur_kodu > 0 ? model.kitap_tur_kodu : null,
                    library_id = model.library_id > 0 ? model.library_id : null,
                    aciklama = string.IsNullOrWhiteSpace(model.aciklama) ? null : model.aciklama.Trim(),
                    file_path = filePath,
                    external_url = cleanUrl,
                    file_format = fileFormat,
                    sayfa_sayisi = model.sayfa_sayisi > 0 ? model.sayfa_sayisi : null,
                    requires_approval = model.requires_approval,
                    durum = model.durum
                });

                return Ok(ResponseHelper.ResponseSuccesfully<object>(ReturnMessages.RecordUpdated));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ResponseHelper.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpDelete("DeleteEBook/{id}")]
        public async Task<IActionResult> DeleteEBook(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();
                int affected = await connection.ExecuteAsync(
                    "UPDATE table_ekitaplar SET is_deleted = true WHERE id = @id;",
                    new { id });

                if (affected > 0)
                    return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated));

                return BadRequest(ResponseHelper.ErrorResponse("E-Book not found."));
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("GetAllEBooksExcel")]
        public async Task<IActionResult> GetAllEBooksExcel([FromBody] EBookFilterModel? models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                models ??= new EBookFilterModel();

                using var connection = _dbHelper.GetConnection();
                string filtersql = "";
                var parameters = new DynamicParameters();

                if (!string.IsNullOrWhiteSpace(models.kitap_adi))
                {
                    filtersql += " AND ek.kitap_adi ILIKE @kitap_adi";
                    parameters.Add("kitap_adi", $"%{models.kitap_adi.Trim()}%");
                }
                if (models.author_id.HasValue && models.author_id.Value > 0)
                {
                    filtersql += " AND ek.author_id = @author_id";
                    parameters.Add("author_id", models.author_id.Value);
                }
                if (!string.IsNullOrWhiteSpace(models.isbn))
                {
                    filtersql += " AND ek.isbn ILIKE @isbn";
                    parameters.Add("isbn", $"%{models.isbn.Trim()}%");
                }
                if (models.kitap_tur_kodu.HasValue && models.kitap_tur_kodu.Value > 0)
                {
                    filtersql += " AND ek.kitap_tur_kodu = @kitap_tur_kodu";
                    parameters.Add("kitap_tur_kodu", models.kitap_tur_kodu.Value);
                }
                if (models.library_id.HasValue && models.library_id.Value > 0)
                {
                    filtersql += " AND ek.library_id = @library_id";
                    parameters.Add("library_id", models.library_id.Value);
                }

                string query = $@"
                    SELECT 
                        ek.kitap_adi,
                        ek.isbn,
                        ek.file_format,
                        ek.requires_approval,
                        ek.durum,
                        au.name_surname AS author_name,
                        tkt.aciklama AS kitap_tur,
                        li.library_name
                    FROM table_ekitaplar ek
                    LEFT JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = ek.kitap_tur_kodu
                    LEFT JOIN table_authors au ON au.id = ek.author_id
                    LEFT JOIN table_libraries li ON li.id = ek.library_id
                    WHERE ek.is_deleted = false {filtersql}
                    ORDER BY ek.id DESC;";

                var ebooks = (await connection.QueryAsync<ListEBookModel>(query, parameters)).ToList();

                using var workbook = new XLWorkbook();
                var dataTable = new DataTable();
                dataTable.Columns.Add("E-Book Name");
                dataTable.Columns.Add("Author Name");
                dataTable.Columns.Add("ISBN");
                dataTable.Columns.Add("Format");
                dataTable.Columns.Add("Category");
                dataTable.Columns.Add("Library");
                dataTable.Columns.Add("Access Type");
                dataTable.Columns.Add("Status");

                foreach (var eb in ebooks)
                {
                    dataTable.Rows.Add(
                        eb.kitap_adi,
                        eb.author_name ?? "-",
                        eb.isbn ?? "-",
                        eb.file_format ?? "PDF",
                        eb.kitap_tur ?? "-",
                        eb.library_name ?? "-",
                        eb.requires_approval ? "Approval Required" : "Open Access",
                        eb.durum ? "Active" : "Inactive"
                    );
                }

                var wsData = workbook.Worksheets.Add("EBooks");
                var dataTableRange = wsData.Cell(1, 1).InsertTable(dataTable, "EBooksTable", true);
                wsData.SheetView.FreezeRows(1);
                wsData.Columns().AdjustToContents();
                dataTableRange.Theme = XLTableTheme.TableStyleLight16;

                using var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Seek(0, SeekOrigin.Begin);

                var fileName = $"EBooks_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                return File(stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("Download/{id}")]
        public async Task<IActionResult> Download(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
            using var connection = _dbHelper.GetConnection();
            var ebook = await connection.QueryFirstOrDefaultAsync<ListEBookModel>(
                "SELECT id, kitap_adi, file_path, file_format FROM table_ekitaplar WHERE id = @id AND is_deleted = false;",
                new { id });

            if (ebook == null || string.IsNullOrWhiteSpace(ebook.file_path))
                return NotFound(ResponseHelper.NotFoundResponse("Dosya bulunamadı."));

            var physicalName = Path.GetFileName(ebook.file_path);
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "Upload", "EKitap", physicalName);
            if (!System.IO.File.Exists(fullPath))
                return NotFound(ResponseHelper.NotFoundResponse("Sunucuda dosya bulunamadı."));

            var ext = Path.GetExtension(fullPath).ToLowerInvariant();
            var contentType = ext == ".epub" ? "application/epub+zip" : "application/pdf";
            var downloadName = $"{Regex.Replace(ebook.kitap_adi ?? "ekitap", @"[^a-zA-Z0-9_\-ğüşıöçĞÜŞİÖÇ ]", "").Trim()}{ext}";

            var bytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            return File(bytes, contentType, downloadName);
        }

        [HttpGet("AdminRequestList")]
        public async Task<IActionResult> AdminRequestList()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();
                const string sql = @"
                    SELECT
                        r.id,
                        r.ebook_id,
                        ek.kitap_adi,
                        ek.file_format,
                        li.library_name,
                        r.customer_user_id,
                        cu.name_surname,
                        r.request_status,
                        r.is_approved,
                        r.request_date,
                        r.response_date
                    FROM table_ekitap_requests r
                    JOIN table_ekitaplar ek ON ek.id = r.ebook_id
                    LEFT JOIN table_libraries li ON li.id = ek.library_id
                    JOIN table_customer_users cu ON cu.id = r.customer_user_id
                    WHERE ek.is_deleted = false
                    ORDER BY r.request_status DESC, r.request_date DESC;";

                var list = (await connection.QueryAsync<AdminEBookRequestListModel>(sql)).ToList();
                return Ok(ResponseHelper.OkResponse("E-Book requests retrieved.", list));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("AdminRequestResult")]
        public async Task<IActionResult> AdminRequestResult([FromBody] AdminEBookRequestResultModel model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var useridvalue);
            if (StringValues.IsNullOrEmpty(useridvalue) || !int.TryParse(useridvalue, out int adminUserId))
                return BadRequest(ResponseHelper.ErrorResponse("Geçerli bir kullanıcı bilgisi bulunamadı."));

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();
                const string sql = @"
                    UPDATE table_ekitap_requests
                    SET request_status = false,
                        is_approved = @is_approved,
                        auth_person_id = @auth_person_id,
                        response_date = CURRENT_TIMESTAMP
                    WHERE id = @id;";

                int updated = await connection.ExecuteAsync(sql, new
                {
                    id = model.request_id,
                    is_approved = model.result,
                    auth_person_id = adminUserId
                });

                if (updated > 0)
                {
                    var msg = model.result
                        ? "Müşterinin e-kitap erişim talebi onaylandı."
                        : "Müşterinin e-kitap erişim talebi reddedildi.";
                    return Ok(ResponseHelper.ActionResponse(msg));
                }

                return NotFound(ResponseHelper.NotFoundResponse("Talep bulunamadı."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("RevokeAccess/{requestId}")]
        public async Task<IActionResult> RevokeAccess(int requestId)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            ControllerContext.HttpContext.Request.Headers.TryGetValue("user_id", out var useridvalue);
            int.TryParse(useridvalue, out int adminUserId);

            try
            {
                await EBookSchemaInitializer.EnsureCreatedAsync(_dbHelper);
                using var connection = _dbHelper.GetConnection();
                int updated = await connection.ExecuteAsync(@"
                    UPDATE table_ekitap_requests
                    SET request_status = false,
                        is_approved = false,
                        auth_person_id = @auth_person_id,
                        response_date = CURRENT_TIMESTAMP
                    WHERE id = @id;",
                    new { id = requestId, auth_person_id = adminUserId > 0 ? (int?)adminUserId : null });

                if (updated > 0)
                    return Ok(ResponseHelper.ActionResponse("E-kitap erişimi iptal edildi."));

                return NotFound(ResponseHelper.NotFoundResponse("Kayıt bulunamadı."));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
    }
}
