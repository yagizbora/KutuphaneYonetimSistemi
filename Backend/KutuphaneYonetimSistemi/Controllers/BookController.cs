﻿using ClosedXML.Excel;
using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;
using ClosedXML;
using System.Data;

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


        [HttpPost("GetBook")]
        public async Task<IActionResult> GetBook([FromBody] BookFilterModel models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string filtersql = "";
                    var parameters = new DynamicParameters();

                    if (!string.IsNullOrEmpty(models.kitap_adi))
                    {
                        filtersql += " AND tk.kitap_adi ILIKE @kitap_adi";
                        parameters.Add("kitap_adi", $"%{models.kitap_adi}%");
                    }
                    if (models.author_id.HasValue)
                    {
                        filtersql += " AND au.id = @author_id";
                        parameters.Add("author_id", models.author_id.Value); 
                    }

                    if (!string.IsNullOrEmpty(models.ISBN))
                    {
                        filtersql += " AND tk.isbn ILIKE @isbn";
                        parameters.Add("isbn", $"%{models.ISBN}%");
                    }
                    if (!string.IsNullOrEmpty(models.library_location))
                    {
                        filtersql += " AND li.location ILIKE @library_location";
                        parameters.Add("library_location", $"%{models.library_location}%");
                    }
                    if (models.Durum.HasValue)
                    {
                        filtersql += " AND tk.durum = @durum";
                        parameters.Add("durum", models.Durum.Value);
                    }
                    if (models.kitap_tur_kodu.HasValue)
                    {
                        filtersql += " AND tkt.kitap_tur_kodu = @kitap_tur_kodu";
                        parameters.Add("kitap_tur_kodu", models.kitap_tur_kodu.Value);
                    }
                    if (models.library_id.HasValue)
                    {
                        filtersql += " AND li.id = @library_id";
                        parameters.Add("library_id", models.library_id);
                    }

                    string query = $@"
                    SELECT 
                    tk.id, 
                    tk.kitap_adi,
                    tk.daily_lending_fee,
                    tk.isbn,
                    tk.durum,
                    au.name_surname as author_name,
                    au.id AS author_id, 
                    li.library_name,
                    li.id as library_id,
                    tkt.kitap_tur_kodu AS kitap_tur_kodu,
                    tkt.aciklama AS kitap_tur
                    FROM table_kitaplar tk
                    JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu
                    FULL OUTER JOIN table_authors au ON au.id = tk.author_id
                    FULL OUTER JOIN table_libraries li ON li.id = library_id
                    WHERE tk.is_deleted = false {filtersql}
                    ORDER BY tk.id ASC;";
                    var books = (await connection.QueryAsync<ListBookModels>(query, parameters)).ToList();
                    if (books == null || !books.Any())
                    {
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));
                    }
                    return Ok(ResponseHelper.OkResponse("Books fetched.", books));
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
            }
        }

        //[HttpPost("GetAllBooksExcel")]
        //public async Task<IActionResult> GetAllBooksExcel(BookFilterModel models)
        //{
        //    TokenController g = new TokenController(_dbHelper);
        //    var login = g.GetUserByToken(ControllerContext);
        //    if (!login.Status)
        //        return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));


        //    try
        //    {
        //        using (var connection = _dbHelper.GetConnection())
        //        {
        //            string filtersql = "";
        //            var parameters = new DynamicParameters();

        //            if (!string.IsNullOrEmpty(models.kitap_adi))
        //            {
        //                filtersql += " AND tk.kitap_adi ILIKE @kitap_adi";
        //                parameters.Add("kitap_adi", $"%{models.kitap_adi}%");
        //            }
        //            if (models.author_id.HasValue)
        //            {
        //                filtersql += " AND au.id = @author_id";
        //                parameters.Add("author_id", models.author_id.Value);
        //            }

        //            if (!string.IsNullOrEmpty(models.ISBN))
        //            {
        //                filtersql += " AND tk.isbn ILIKE @isbn";
        //                parameters.Add("isbn", $"%{models.ISBN}%");
        //            }
        //            if (models.Durum.HasValue)
        //            {
        //                filtersql += " AND tk.durum = @durum";
        //                parameters.Add("durum", models.Durum.Value);
        //            }
        //            if (models.kitap_tur_kodu.HasValue)
        //            {
        //                filtersql += " AND tkt.kitap_tur_kodu = @kitap_tur_kodu";
        //                parameters.Add("kitap_tur_kodu", models.kitap_tur_kodu.Value);
        //            }
        //            if (models.library_id.HasValue)
        //            {
        //                filtersql += " AND li.id = @library_id";
        //                parameters.Add("library_id", models.library_id);
        //            }

        //            string query = $@"SELECT 
        //        tk.kitap_adi, tk.isbn, tk.durum,
        //        au.name_surname AS author_name,
        //        tkt.kitap_tur_kodu, tkt.aciklama AS kitap_tur,
        //        li.library_name
        //        FROM table_kitaplar tk
        //        JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu
        //        FULL OUTER JOIN table_authors au ON au.id = tk.author_id
        //        FULL OUTER JOIN table_libraries li ON li.id = library_id
        //        WHERE tk.is_deleted = false {filtersql}
        //        ORDER BY tk.id ASC;";

        //            var books = (await connection.QueryAsync<ListBookModels>(query,parameters)).ToList();

        //            if (books == null || !books.Any())
        //                return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));

        //            using var workbook = new XLWorkbook();
        //            var ws = workbook.Worksheets.Add("Books");

        //            // Başlıklar
        //            ws.Cell(1, 1).Value = "Kitap Adı";
        //            ws.Cell(1, 2).Value = "ISBN";
        //            ws.Cell(1, 3).Value = "Durum";
        //            ws.Cell(1, 4).Value = "Yazar Adı";
        //            ws.Cell(1, 5).Value = "Kitap Türü";
        //            ws.Cell(1, 6).Value = "Kütüphane Adı";
        //            ws.Cell("A1").Style.Fill.SetBackgroundColor(XLColor.Red);
        //            ws.Cell("B1").Style.Fill.SetBackgroundColor(XLColor.Red);
        //            ws.Cell("C1").Style.Fill.SetBackgroundColor(XLColor.Red);
        //            ws.Cell("D1").Style.Fill.SetBackgroundColor(XLColor.Red);
        //            ws.Cell("E1").Style.Fill.SetBackgroundColor(XLColor.Red);
        //            ws.Cell("F1").Style.Fill.SetBackgroundColor(XLColor.Red);


        //            int row = 2;
        //            foreach (var book in books)
        //            {
        //                ws.Cell(row, 1).Value = book.kitap_adi;
        //                ws.Cell(row, 2).Value = book.ISBN;
        //                ws.Cell(row, 3).Value = (bool)book.Durum ? "Alındı" : "Boşta";
        //                ws.Cell(row, 4).Value = book.author_name;
        //                ws.Cell(row, 5).Value = book.kitap_tur;
        //                ws.Cell(row, 6).Value = book.library_name;

        //                row++;
        //            }

        //            ws.Columns().AdjustToContents();

        //            using var stream = new MemoryStream();
        //            workbook.SaveAs(stream);
        //            stream.Seek(0, SeekOrigin.Begin);

        //            var fileName = $"Books_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
        //            return File(stream.ToArray(),
        //                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //                fileName);

        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
        //    }
        //}
        [HttpPost("GetAllBooksExcel")]
        public async Task<IActionResult> GetAllBooksExcel(BookFilterModel models)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));


            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string filtersql = "";
                    var parameters = new DynamicParameters();

                    if (!string.IsNullOrEmpty(models.kitap_adi))
                    {
                        filtersql += " AND tk.kitap_adi ILIKE @kitap_adi";
                        parameters.Add("kitap_adi", $"%{models.kitap_adi}%");
                    }
                    if (models.author_id.HasValue)
                    {
                        filtersql += " AND au.id = @author_id";
                        parameters.Add("author_id", models.author_id.Value);
                    }

                    if (!string.IsNullOrEmpty(models.ISBN))
                    {
                        filtersql += " AND tk.isbn ILIKE @isbn";
                        parameters.Add("isbn", $"%{models.ISBN}%");
                    }
                    if (models.Durum.HasValue)
                    {
                        filtersql += " AND tk.durum = @durum";
                        parameters.Add("durum", models.Durum.Value);
                    }
                    if (!string.IsNullOrEmpty(models.library_location))
                    {
                        filtersql += " AND li.location ILIKE @library_location";
                        parameters.Add("library_location", $"%{models.library_location}%");
                    }
                    if (models.kitap_tur_kodu.HasValue)
                    {
                        filtersql += " AND tkt.kitap_tur_kodu = @kitap_tur_kodu";
                        parameters.Add("kitap_tur_kodu", models.kitap_tur_kodu.Value);
                    }
                    if (models.library_id.HasValue)
                    {
                        filtersql += " AND li.id = @library_id";
                        parameters.Add("library_id", models.library_id);
                    }

                    string query = $@"SELECT 
                tk.kitap_adi, tk.isbn, tk.durum,
                au.name_surname AS author_name,
                tkt.kitap_tur_kodu, tkt.aciklama AS kitap_tur,
                li.library_name
                FROM table_kitaplar tk
                JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu
                FULL OUTER JOIN table_authors au ON au.id = tk.author_id
                FULL OUTER JOIN table_libraries li ON li.id = library_id
                WHERE tk.is_deleted = false {filtersql}
                ORDER BY tk.id ASC;";

                    var books = (await connection.QueryAsync<ListBookModels>(query, parameters)).ToList();

                    if (books == null || !books.Any())
                        return NotFound(ResponseHelper.NotFoundResponse(ReturnMessages.NotFound));

                    using var workbook = new XLWorkbook();
                    var ws = workbook.Worksheets.Add("Kitaplar");

                    var dataTable = new DataTable();
                    dataTable.Columns.Add("Kitap Adı");
                    dataTable.Columns.Add("ISBN");
                    dataTable.Columns.Add("Durum");
                    dataTable.Columns.Add("Yazar Adı");
                    dataTable.Columns.Add("Kitap Türü");
                    dataTable.Columns.Add("Kütüphane Adı");

                    foreach (var book in books)
                    {
                            dataTable.Rows.Add
                            (
                            book.kitap_adi,
                            book.ISBN,
                            (bool)book.Durum ? "Alındı" : "Boşta",
                            book.author_name,
                            book.kitap_tur,
                            book.library_name
                            );
                    }

                    var table = ws.Cell(1, 1).InsertTable(dataTable, "KitaplarTablosu", true);
                    
                    ws.SheetView.FreezeRows(1);
                    ws.Columns().AdjustToContents();
                    table.Theme = XLTableTheme.TableStyleLight16; 


                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    stream.Seek(0, SeekOrigin.Begin);

                    var fileName = $"Books_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                    return File(stream.ToArray(),
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        fileName);

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
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {
                    string query = @"SELECT 
                    tk.id, 
                    tk.kitap_adi,
                    tk.daily_lending_fee,
                    tk.isbn,
                    tk.durum,
                    au.name_surname as author_name,
                    au.id AS author_id, 
                    tkt.kitap_tur_kodu AS kitap_tur_kodu,
                    tkt.aciklama AS kitap_tur,
                    li.library_name,
                    li.id as library_id
                    FROM table_kitaplar tk
                    JOIN table_kitap_turleri tkt ON tkt.kitap_tur_kodu = tk.kitap_tur_kodu
                    FULL OUTER JOIN table_authors au ON au.id = tk.author_id
                    FULL OUTER JOIN table_libraries li ON li.id = library_id
                    WHERE tk.is_deleted = false AND tk.id = @id
                    ORDER BY tk.id ASC;";
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
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
            try
            {
                using (var connection = _dbHelper.GetConnection())
                {

                    string firstquery = "SELECT Durum FROM table_kitaplar WHERE id = @id";
                    bool checkbookistakenornot = connection.QueryFirst<bool>(firstquery, new {id = id});
                    if (!checkbookistakenornot)
                    {
                        return BadRequest(ResponseHelper.ErrorResponse("This book is taken and cannot be delete"));
                    }

                    string query = "UPDATE table_kitaplar SET is_deleted = true WHERE id = @id";
                    var parameters = new { id = id };
                    var result = connection.Execute(query, parameters);
                    if (result > 0 || result == 1)
                    {
                        return Ok(ResponseHelper.ActionResponse(ReturnMessages.RecordUpdated));
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
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
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

                    string query = "INSERT INTO table_kitaplar (kitap_adi,author_id,isbn,kitap_tur_kodu,library_id,daily_lending_fee,is_deleted) VALUES (@kitap_adi,@author_id,@isbn,@kitap_tur_kodu,@library_id,@daily_lending_fee,false)";
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
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));
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

                    string datasql = "UPDATE table_kitaplar SET kitap_adi = @kitap_adi,author_id = @author_id,isbn = @isbn,kitap_tur_kodu = @kitap_tur_kodu,library_id = @library_id,daily_lending_fee = @daily_lending_fee WHERE id = @id";
                    var result = connection.Execute(datasql, models);
                    if (result > 0 || result == 1)
                    {
                        return Ok(ResponseHelper.ResponseSuccesfully<object>(ReturnMessages.RecordUpdated));
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
    }
}
