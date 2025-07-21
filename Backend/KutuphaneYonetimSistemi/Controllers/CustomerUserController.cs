using Dapper;
using KutuphaneYonetimSistemi.Common;
using KutuphaneYonetimSistemi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KutuphaneYonetimSistemi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerUserController : ControllerBase
    {
        private readonly DbHelper _dbHelper;

        public CustomerUserController(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }
        public const int saltrounds = 12;

        [HttpPost("CreateCustomerUser")]
        public async Task<IActionResult> CreateCustomerUser(CustomerUserModels model)
        {
            TokenController g = new TokenController(_dbHelper);
            var login = g.GetUserByToken(ControllerContext);
            if (!login.Status)
                return Unauthorized(ResponseHelper.UnAuthorizedResponse(login?.Message));

                try
                {
                    using (var connection = _dbHelper.GetConnection())
                    {

                        string usernameisexistquery = "SELECT COUNT(*) FROM table_customer_users where username = @username";
                        int usernameisexist = connection.QueryFirstOrDefault<int>(usernameisexistquery, model);
                        if (usernameisexist > 0)
                        {
                            return BadRequest(ResponseHelper.ErrorResponse("Username is exist user couldnt create"));
                        }


                        string hashedpassword = model.password;
                        string passwordHash = BCrypt.Net.BCrypt.HashPassword(hashedpassword, saltrounds);

                        string query = $"INSERT INTO table_customer_users (username, hashedpassword,is_deleted,is_login,name_surname,tc_kimlik_no,birthday_date,phone_number,eposta) VALUES (@username, @passwordHash,false,false,@name_surname,@tc_kimlik_no,@birthday_date,@phone_number,@eposta)";
                        var result = await connection.ExecuteAsync(query, new { username = model.username, passwordHash = passwordHash,name_surname = model.name_surname, tc_kimlik_no = model.tc_kimlik_no, birthday_date = model.birthday_date,phone_number = model.phone_number,eposta = model.eposta });
                        return Ok(ResponseHelper.ResponseSuccesfully<object>("Customer User created Successfully"));
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ResponseHelper.ExceptionResponse(ex.Message));
                }
        }
    } 
}

