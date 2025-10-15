using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookTakenUntakenController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public BookTakenUntakenController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }


        [HttpGet("LendingBooksGet")]
        public async Task<IActionResult> LendingBooksGet()
        {
            TokenController g = new (_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "SELECT DISTINCT tk.id, tk.kitap_adi,tk.daily_lending_fee, au.name_surname as author_name, tk.isbn, tk.durum, tkt.aciklama as kitap_tur " +
                                     "FROM table_kitaplar tk " +
                                     "JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu " +
                                     "LEFT JOIN table_kitap_request kr ON kr.book_id = tk.id " + 
                                     "FULL OUTER JOIN table_authors au ON au.id = tk.author_id " +
                                     "WHERE tk.is_deleted = false AND tk.durum = true " +
                                     "AND ((kr.request_status = false AND kr.book_id IS NOT NULL)OR kr.book_id IS NULL) " +
                                     "AND NOT EXISTS (SELECT 1 FROM table_kitap_request kr WHERE kr.book_id = tk.id AND request_status)";
                    var list = await connection.QueryAsync<lendingBooksGet>(query, connection);
                    return Ok(list);
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpGet("LendingBooksGetbyid/{id}")]
        public async Task<IActionResult> LendingBooksGetbyid(int id)
        {
            TokenController g = new (_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = @"SELECT tk.id, tk.kitap_adi,tk.daily_lending_fee, au.name_surname as author_name, tk.isbn, tk.durum, tkt.aciklama as kitap_tur
                                     FROM table_kitaplar tk 
                                     JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu 
                                     FULL OUTER JOIN table_authors au ON au.id = tk.author_id
                                     WHERE tk.id = @id AND tk.is_deleted = false AND tk.durum = true";
                    var list = await connection.QueryAsync<lendingBooksGet>(query, new { id });
                    return Ok(list);
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpPost("LendingBooks")]
        public async Task<IActionResult> LendingBooks([FromBody] LendingBooks models)
        {
            TokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkbooksisavaible = "SELECT Durum FROM table_kitaplar WHERE id = @id";
                    bool? checkbooksisavaibleresponse = await connection.QueryFirstOrDefaultAsync<bool?>(checkbooksisavaible, new { id = models.id });

                    if (!checkbooksisavaibleresponse.HasValue)
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }

                    if (checkbooksisavaibleresponse.Value == false)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse(ReturnMessages.BookIsNotFree));
                    }

                    string bookisavaible = "SELECT request_status = true FROM table_kitap_request WHERE book_id = @book_id";
                    var bookfreecontrol = await connection.QueryFirstOrDefaultAsync<bool>(bookisavaible, new { book_id = models.id });
                    if (bookfreecontrol)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, ResponseHelper.ErrorResponse("Bu kitap zaten talep edilmiş!"));
                    }

                    DateTime oduncAlmaTarihi = models.odunc_alma_tarihi.Date;


                    string sql = "UPDATE table_kitaplar SET customer_id = @customer_id, odunc_alma_tarihi = @odunc_alma_tarihi,durum = false WHERE id = @id";
                    int command = await connection.ExecuteAsync(sql, new
                    {
                        customer_id = models.customer_id,
                        odunc_alma_tarihi = oduncAlmaTarihi,
                        id = models.id,
                    });
                    if (command == 1)
                    {
                        return Ok(ResponseHelper.ActionResponse("Kitap başarıyla ödünç alındı."));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Lending failed."));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        //TAKEN BOOKS

        [HttpGet("TakenBooksGet")]
            public async Task<IActionResult> TakenBooksGet()
            {
                TokenController g = new(_dbHelper);
                var login = g.GetUserByToken(ControllerContext);
                if (!login.Status)
                    return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
                try
                {
                    using (var connection = _dbHelper.GetConnection())
                    {
                        string query = $@"SELECT tk.id, tk.kitap_adi, tk.durum, tk.odunc_alma_tarihi,cs.name_surname,cs.id as customer_id
                                        FROM table_kitaplar tk 
                                        JOIN table_customer_users cs ON tk.customer_id = cs.id
                                        WHERE tk.is_deleted = false AND tk.durum = false";
                        var list = await connection.QueryAsync<TakenBooksGet>(query);
                        return Ok(list);
                    }

                }
                catch (Exception ex)
                {
                    return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
                }
            }
        [HttpPost("CalculateBookLending")]
        public async Task<IActionResult> CalculateBook(CalculateBook model)
        {
            TokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkbooksisavaible = "SELECT Durum FROM table_kitaplar WHERE id = @id";
                    bool checkbooksisavaibleresponse = await connection.QueryFirstOrDefaultAsync<bool>(checkbooksisavaible, new { id = model.id });

                    if (checkbooksisavaibleresponse)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse(ReturnMessages.BookIsFree));
                    }

                    string findbook = "SELECT odunc_alma_tarihi FROM table_kitaplar WHERE id = @id";
                    DateTime oduncAlmaTarihi = await connection.QueryFirstOrDefaultAsync<DateTime>(findbook, new { id = model.id });

                    if (oduncAlmaTarihi == default(DateTime))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Kitap ödünç alma tarihi sistemde bulunamadı."));
                    }

                    DateTime geriAlmaTarihi = model.geri_alma_tarihi ?? DateTime.Now;

                    string findfee = "SELECT daily_lending_fee FROM table_kitaplar WHERE id = @id";
                    int findfeeresult = await connection.QueryFirstOrDefaultAsync<int>(findfee, new { id = model.id });

                    int gecenGun = (int)(geriAlmaTarihi.Date - oduncAlmaTarihi.Date).TotalDays;

                    int ceza = 0;
                    if (gecenGun > 10)
                    {
                        ceza = (gecenGun - 10) * findfeeresult;
                    }

                    var result = new
                    {
                        calculatedDelayAllowance = ceza
                    };

                    return Ok(ResponseHelper.OkResponse("Hesaplama başarılı!", result));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        [HttpPost("ReturnBook")]
        public async Task<IActionResult> ReturnBook([FromBody] ReturnBook models)
        {
            TokenController g = new(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkBookQuery = "SELECT Durum, odunc_alma_tarihi, customer_id FROM table_kitaplar WHERE id = @id";
                    BookStatusModel? book = await connection.QueryFirstOrDefaultAsync<BookStatusModel>(checkBookQuery, new { id = models.id });

                    if (book == null)
                        return BadRequest(ResponseHelper.ErrorResponse("Kitap bulunamadı!"));

                    if (book.Durum)
                        return BadRequest(ResponseHelper.ErrorResponse(ReturnMessages.BookIsFree));

                    if (!book.customer_id.HasValue || !book.odunc_alma_tarihi.HasValue)
                        return BadRequest(ResponseHelper.ErrorResponse("Kitap ödünç alınmamış!"));

                    string findFeeQuery = "SELECT daily_lending_fee FROM table_kitaplar WHERE id = @id";
                    int dailyFee = await connection.QueryFirstOrDefaultAsync<int>(findFeeQuery, new { id = models.id });

                    DateTime geriVermeTarihi = models.geri_verme_tarihi != default(DateTime) ? models.geri_verme_tarihi : DateTime.Now;

                    int totalDays = (int)(geriVermeTarihi.Date - book.odunc_alma_tarihi.Value.Date).TotalDays;

                    if (totalDays <= 10)
                    {
                        string updateQuery = "UPDATE table_kitaplar SET Durum = true, customer_id = NULL, odunc_alma_tarihi = NULL WHERE id = @id";
                        int updateResult = await connection.ExecuteAsync(updateQuery, new { id = models.id });

                        if (updateResult > 0)
                        {
                            string insertLogQuery = @"
                        INSERT INTO table_payment_logs (payment_amount, payment_type, book_id, payment_is_success, is_deleted, payment_date, receipt_no) 
                        VALUES (@payment_amount, @payment_type, @book_id, true, false, @payment_date, @receipt_no)";

                            int logResult = await connection.ExecuteAsync(insertLogQuery, new
                            {
                                models.payment_amount,
                                models.payment_type,
                                book_id = models.id,
                                payment_date = DateTime.Now,
                                receipt_no = models.receipt_no
                            });

                            if (logResult > 0)
                                return Ok(ResponseHelper.ActionResponse("Kitap zamanında iade edildi."));
                        }

                        return BadRequest(ResponseHelper.ErrorResponse("Kitap durumu güncellenemedi."));
                    }

                    int delayDays = totalDays - 10;
                    decimal delayFee = delayDays * dailyFee;

                    if (models.payment_amount < delayFee)
                    {
                        string insertFailLog = @"
                    INSERT INTO table_payment_logs (payment_amount, payment_type, book_id, payment_is_success, is_deleted, payment_date, payment_failed_subject) 
                    VALUES (@payment_amount, @payment_type, @book_id, false, false, @payment_date, 'Ödeme miktarı yetersiz!')";

                        await connection.ExecuteAsync(insertFailLog, new
                        {
                            models.payment_amount,
                            models.payment_type,
                            book_id = models.id,
                            payment_date = DateTime.Now
                        });

                        return BadRequest(ResponseHelper.ErrorResponse("Ödeme miktarı yetersiz!"));
                    }

                    string updateBookQuery = "UPDATE table_kitaplar SET Durum = true, customer_id = NULL, odunc_alma_tarihi = NULL WHERE id = @id";
                    int returnResult = await connection.ExecuteAsync(updateBookQuery, new { id = models.id });

                    if (returnResult > 0)
                    {
                        string insertLog = @"
                    INSERT INTO table_payment_logs (payment_amount, payment_type, book_id, payment_is_success, is_deleted, payment_date, receipt_no) 
                    VALUES (@payment_amount, @payment_type, @book_id, true, false, @payment_date, @receipt_no)";

                        int paymentLogResult = await connection.ExecuteAsync(insertLog, new
                        {
                            models.payment_amount,
                            models.payment_type,
                            book_id = models.id,
                            payment_date = DateTime.Now,
                            receipt_no = models.receipt_no
                        });

                        if (paymentLogResult > 0)
                            return Ok(ResponseHelper.ActionResponse("Kitap başarıyla iade edildi."));
                    }

                    return BadRequest(ResponseHelper.ErrorResponse("İade işlemi başarısız."));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

    }
}
