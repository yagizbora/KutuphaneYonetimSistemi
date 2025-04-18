using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly DbHelper _dbHelper;

        public BookController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }


        [HttpGet("GetBook")]
        public async Task<IActionResult> GetBook()
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = @"
                    SELECT 
                    tk.id, 
                    tk.kitap_adi ,
                    tk.yazar_adi ,
                    tk.yazar_soyadi ,
                    tk.isbn ,
                    tk.durum ,
                    tk.odunc_alan ,
                    tk.odunc_alma_tarihi ,
                    tkt.kitap_tur_kodu ,
                    tkt.aciklama as kitap_tur 
                    FROM table_kitaplar tk 
                    JOIN table_kitap_turleri tkt 
                    ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu 
                    WHERE tk.is_deleted = false ORDER BY id ASC;";

                    var books = (await connection.QueryAsync<ListBookModels>(query)).ToList();
                    return Ok(ResponseHelper.OkResponse("Books fetched.", books));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));   
            }
        }
        [HttpGet("GetBook/{id}")]
        public IActionResult GetBook(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = @"SELECT tk.id, tk.kitap_adi, tk.yazar_adi, tk.yazar_soyadi, tk.isbn, tk.durum, tkt.kitap_tur_kodu, tkt.aciklama as kitap_tur 
                                     FROM table_kitaplar tk 
                                     JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu 
                                     WHERE tk.id = @id AND tk.is_deleted = false;";
                    var List = connection.Query<ListBookModels>(query, new { id }).ToList();
                    if (List.Count == 0)
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }
                    return Ok(List);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = "UPDATE table_kitaplar SET is_deleted = true WHERE id = @id";
                    var parameters = new { id = id };
                    var result = connection.Execute(query, parameters);
                    if (result > 0 || result == 1)
                    {
                        return Ok(ResponseHelper.ActionResponse("Book deleted successfully."));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Book not found."));
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }
        [HttpPost("CreateBook")]
        public IActionResult Createbook([FromBody] CreateBook models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string sql = "SELECT COUNT(*) FROM table_kitap_turleri WHERE kitap_tur_kodu = @kitap_tur_kodu";
                    int count = connection.QueryFirstOrDefault<int>(sql, models.kitap_tur_kodu);

                    if (count == 0)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Book type is not found!s"));
                    }

                    string query = "INSERT INTO table_kitaplar (kitap_adi,yazar_adi,yazar_soyadi,isbn,kitap_tur_kodu,is_deleted) VALUES (@kitap_adi,@yazar_adi,@yazar_soyadi,@isbn,@kitap_tur_kodu,false)";
                    //var parameters = new { models };
                    connection.Execute(query, models);
                    return Ok(ResponseHelper.ResponseSuccesfully<object>("Book Created Succesfully"));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("UpdateBook")]
        public IActionResult UpdateBook([FromBody] UpdateBook models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string checkbooktypesql = "SELECT COUNT(*) FROM table_kitap_turleri WHERE kitap_tur_kodu = @kitap_tur_kodu  ";
                    int count = connection.QueryFirstOrDefault<int>(checkbooktypesql, models);

                    if (count == 0)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Book type is not found!s"));
                    }

                    string datasql = "UPDATE table_kitaplar SET kitap_adi = @kitap_adi,yazar_adi = @yazar_adi " +
                        ",yazar_soyadi = @yazar_soyadi,isbn = @isbn,kitap_tur_kodu = @kitap_tur_kodu WHERE id = @id";
                    var result = connection.Execute(datasql, models);
                    if (result > 0 || result == 1)
                    {
                        return Ok(ResponseHelper.ResponseSuccesfully<object>(ReturnMessages.ReecordUpdated));
                    }
                    else
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("Update failed."));
                    }
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
                return BadRequest(ResponseHelper.UnAuthorizedResponse(login?.Message));
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
        [HttpGet("CalculateBookLending/{id}")]
        public async Task<IActionResult> CalculateBook(int id)
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
                    bool checkbooksisavaibleresponse = await connection.QueryFirstOrDefaultAsync<bool>(checkbooksisavaible, new { id = id });

                    if (checkbooksisavaibleresponse)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse(ReturnMessages.BookIsFree));
                    }

                    string findbook = "SELECT odunc_alma_tarihi FROM table_kitaplar WHERE id = @id";
                    DateTime findbookresponse = await connection.QueryFirstOrDefaultAsync<DateTime>(findbook, new { id = id });

                    DateTime todaydate = DateTime.Now;

                    int calculateday = (int)(todaydate - findbookresponse).TotalDays;

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
                           INSERT INTO table_payment_logs (payment_amount, payment_type, book_id, payment_is_success, is_deleted, payment_date) 
                           VALUES (@payment_amount, @payment_type, @book_id, true, false, @payment_date)";

                            int paymentLogResult = await connection.ExecuteAsync(insertSuccessPaymentQuery, new
                            {
                                models.payment_amount,
                                models.payment_type,
                                book_id = models.id,
                                payment_date = DateTime.Now
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
                       INSERT INTO table_payment_logs (payment_amount, payment_type, book_id, payment_is_success, is_deleted, payment_date) 
                       VALUES (@payment_amount, @payment_type, @book_id, true, false, @payment_date)";

                        int paymentLogResult = await connection.ExecuteAsync(insertSuccessPaymentQuery, new
                        {
                            models.payment_amount,
                            models.payment_type,
                            book_id = models.id,
                            payment_date = DateTime.Now
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
