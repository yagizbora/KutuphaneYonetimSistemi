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
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = @"SELECT tk.id, tk.kitap_adi, au.name_surname as author_name, tk.isbn, tk.durum, tkt.aciklama as kitap_tur
                                     FROM table_kitaplar tk 
                                     JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu 
                                      FULL OUTER JOIN table_authors au ON au.id = tk.author_id
                                     WHERE tk.is_deleted = false AND tk.durum = true;";
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
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = @"SELECT tk.id, tk.kitap_adi, au.name_surname as author_name, tk.isbn, tk.durum, tkt.aciklama as kitap_tur
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
            TokenController g = new TokenController(_dbHelper);
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

                    DateTime oduncAlmaTarihi = models.odunc_alma_tarihi.Date;


                    string sql = "UPDATE table_kitaplar SET odunc_alan = @odunc_alan, odunc_alma_tarihi = @odunc_alma_tarihi,durum = false WHERE id = @id";
                    int command = await connection.ExecuteAsync(sql, new
                    {
                        odunc_alan = models.odunc_alan,
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
                TokenController g = new TokenController(_dbHelper);
                var login = g.GetUserByToken(ControllerContext);
                if (!login.Status)
                    return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
                try
                {
                    using (var connection = _dbHelper.GetConnection())
                    {
                        string query = @"SELECT id,kitap_adi,durum,odunc_alan,odunc_alma_tarihi 
                                         FROM table_kitaplar 
                                         WHERE is_deleted = false AND durum = false;";
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
            TokenController g = new TokenController(_dbHelper);
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
                    DateTime date_of_taken_book;
                    if (!model.odunc_alma_tarihi.HasValue)
                    {
                    string findbook = "SELECT odunc_alma_tarihi FROM table_kitaplar WHERE id = @id";
                    DateTime findbookresponse = await connection.QueryFirstOrDefaultAsync<DateTime>(findbook, new { id = model.id });
                    if (findbookresponse == default(DateTime))
                    {
                            return BadRequest(ResponseHelper.ErrorResponse("Kitap ödünç alma tarihi sistemde bulunamadı."));
                    }
                    date_of_taken_book = findbookresponse;
                    }
                    else
                    {
                        date_of_taken_book = (DateTime)model.odunc_alma_tarihi;
                    }

                    DateTime todaydate = DateTime.Now;
                    int calculateday = (int)(todaydate - date_of_taken_book).TotalDays;

                    if (calculateday > 10)
                    {
                        int delayallowance = (int)(calculateday - 10) * 1;
                        var list = (new
                        {
                            calculatedDelayAllowance = delayallowance
                        });
                        return Ok(ResponseHelper.OkResponse("Hesaplama başarılı!", list));
                    }
                    else
                    {
                        var list = (new
                        {
                            calculatedDelayAllowance = 0
                        });
                        return Ok(ResponseHelper.OkResponse("Hesaplama başarılı!", list));
                    }
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
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkBookQuery = "SELECT Durum, odunc_alma_tarihi, odunc_alan FROM table_kitaplar WHERE id = @id";
                    BookStatusModel? book = await connection.QueryFirstOrDefaultAsync<BookStatusModel>(checkBookQuery, new { id = models.id });

                    if (book == null)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Kitap bulunamadı!"));
                    }

                    if (book.Durum)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse(ReturnMessages.BookIsFree));
                    }

                    if (string.IsNullOrEmpty(book.odunc_alan))
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Kitap ödünç alınmamış!"));
                    }

                    if (!book.odunc_alma_tarihi.HasValue)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Kitap ödünç alınmamış!"));
                    }

                    int calculateday = (int)(models.geri_verme_tarihi - book.odunc_alma_tarihi.Value).TotalDays;

                    if (calculateday <= 10)
                    {
                        string updateQuery = "UPDATE table_kitaplar SET Durum = true, odunc_alan = NULL, odunc_alma_tarihi = NULL WHERE id = @id";
                        int updateResult = await connection.ExecuteAsync(updateQuery, new { id = models.id });

                        if (updateResult > 0)
                        {
                            string insertSuccessPaymentQuery = @"
                           INSERT INTO table_payment_logs (payment_amount, payment_type, book_id, payment_is_success, is_deleted, payment_date,receipt_no) 
                           VALUES (@payment_amount, @payment_type, @book_id, true, false, @payment_date,@receipt_no)";

                            int paymentLogResult = await connection.ExecuteAsync(insertSuccessPaymentQuery, new
                            {
                                models.payment_amount,
                                models.payment_type,
                                book_id = models.id,
                                payment_date = DateTime.Now,
                                receipt_no = models.receipt_no
                            });
                            if (paymentLogResult > 0)
                            {
                                return Ok(ResponseHelper.ActionResponse("Kitap zamanında iade edildi."));
                            }
                        }
                        else
                        {
                            return BadRequest(ResponseHelper.ErrorResponse("Kitap durumu güncellenemedi. Bir Hata oluştu"));
                        }
                    }

                    int delayDays = calculateday - 10;
                    decimal delayFee = delayDays * 1;

                    if (models.payment_amount < delayFee)
                    {
                        string insertPaymentQuery = @"
                       INSERT INTO table_payment_logs (payment_amount, payment_type, book_id, payment_is_success, is_deleted, payment_date, payment_failed_subject) 
                       VALUES (@payment_amount, @payment_type, @book_id, false, false, @payment_date, 'Ödeme miktarı yetersiz!')";

                        await connection.ExecuteAsync(insertPaymentQuery, new
                        {
                            models.payment_amount,
                            models.payment_type,
                            book_id = models.id,
                            payment_date = DateTime.Now
                        });

                        return BadRequest(ResponseHelper.ErrorResponse("Ödeme miktarı yetersiz!"));
                    }

                    string updateBookQuery = "UPDATE table_kitaplar SET Durum = true, odunc_alan = NULL, odunc_alma_tarihi = NULL WHERE id = @id";
                    int returnBookResult = await connection.ExecuteAsync(updateBookQuery, new { id = models.id });

                    if (returnBookResult > 0)
                    {
                        string insertSuccessPaymentQuery = @"
                       INSERT INTO table_payment_logs (payment_amount, payment_type, book_id, payment_is_success, is_deleted, payment_date,receipt_no) 
                       VALUES (@payment_amount, @payment_type, @book_id, true, false, @payment_date,@receipt_no)";

                        int paymentLogResult = await connection.ExecuteAsync(insertSuccessPaymentQuery, new
                        {
                            models.payment_amount,
                            models.payment_type,
                            book_id = models.id,
                            payment_date = DateTime.Now,
                            receipt_no = models.receipt_no
                        });

                        if (paymentLogResult > 0)
                        {
                            return Ok(ResponseHelper.ActionResponse("Kitap başarıyla iade edildi."));
                        }
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
