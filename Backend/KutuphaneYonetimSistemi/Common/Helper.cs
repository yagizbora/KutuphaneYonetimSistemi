using DocumentFormat.OpenXml.Spreadsheet;
using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Exceptions;
using System.Diagnostics;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace KutuphaneYonetimSistemi.Common
{
    public class Helper
    {
        internal class JwtData
        {
            public int user_id { get; set; }
            public string username { get; set; }
            public DateTime login_date { get; set; }
        }

        string secretKey = "jwt";

        public string? GenerateJWTToken(int user_id, string username)
        {
            try
            {
                string randomtext = RandomString(32);

                string format = "yyyy-MM-dd HH:mm:ss";

                string token = new JwtBuilder()
                    .WithAlgorithm(new HMACSHA256Algorithm())
                    .WithSecret(secretKey)
                    .AddClaim("login_date", DateTime.ParseExact(DateTime.Now.ToString(format), format, CultureInfo.InvariantCulture))
                    .AddClaim("user_id", user_id)
                    .AddClaim("username", username)
                    .AddClaim("randomtext",randomtext)
                    .Encode();

                return token;
            }
            catch
            {
                return null;
            }
        }
        public (bool status,string? message) CheckJWTokenHaveTrueKey(string token)
        {
            try
            {
                var json = new JwtBuilder()
                    .WithAlgorithm(new HMACSHA256Algorithm())
                    .WithSecret(secretKey)
                    .MustVerifySignature()
                    .Decode(token);

                return (true,null);
                
            }

            catch (SignatureVerificationException)
            {
                return (false,"imza doğru değil"); 
            }
            catch (Exception ex)
            {
                return (false, ex.Message.ToString().Trim());
            }
        }

        //public (bool? status, string? message) CheckLoginDateValidate(string token)
        //{
        //    try
        //    {
        //        var handler = new JwtSecurityTokenHandler();
        //        var jwtToken = handler.ReadJwtToken(token);

        //        var logindateclaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "login_date");

        //        var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "user_id");
        //        var usernameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "username");
        //        var loginDateClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "login_date");

        //        if (userIdClaim == null || usernameClaim == null || loginDateClaim == null)
        //        {
        //            return (false, "Token içeriği eksik veya hatalı.");
        //        }
        //        var data = new JwtData
        //        {
        //            user_id = int.Parse(userIdClaim.Value),
        //            username = usernameClaim.Value,
        //            login_date = DateTime.Parse(loginDateClaim.Value)
        //        };

        //        TimeSpan loginTimeDiff = DateTime.Now - data.login_date;

        //        if (loginTimeDiff.TotalMinutes >= 270)
        //        {
        //            return (false, "Oturum süresi doldu!");
        //        }
        //        if (data.login_date > DateTime.Now)
        //        {
        //            return (false, "Sistemde hata oluştu sistemdeki giriş saatiniz" +
        //                            $" güncel saatten daha az bu durum ile karşılaşırsanız destek ekibimiz ile acilen iletişime geçin!");
        //        }
        //        else
        //        {
        //            return (true, null);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return (false, ex.Message);
        //    }
        //}


        public static string RandomString(int length)
        {
            const string chars = "abcdefghijklmnoprstuvyz"; 
            var result = new StringBuilder(length);
            using (var rng = RandomNumberGenerator.Create())
            {
                for (int i = 0; i < length; i++)
                {
                    // GetInt32 is available in .NET Core / .NET 5+
                    int idx = RandomNumberGenerator.GetInt32(chars.Length);
                    result.Append(chars[idx]);
                }
            }
            return result.ToString();
        }


        public (bool status, string? message) IsDateCheck(DateTime date)
        {
            try
            {
                DateTime todaydate = DateTime.Now;

                if (date > todaydate)
                {
                    return (false, "Tarih bugünde büyük olamaz");
                }
                else
                {
                    return (true, "");
                }
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
            ;
        }

        public (bool status, string message) IsNumberIsTrue(string number)
        {
            try
            {
                if (int.TryParse(number, out _))
                {
                    return (true, "Sayı geçerli");
                }
                else
                {
                    return (false,"Bu bir sayı değil!");
                }
            }
            catch
            {
                return (false,"Bi şeyler ters gitti");
            }
        }

        public bool validatemail(string email)
        {
            return Regex.IsMatch(input: email, @"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$");
        }
        public static bool ValidatePhoneNumber(string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
                return false;

            var normalized = Regex.Replace(phoneNumber, @"[^\d+]", "").Trim();

            var pattern = @"^(?:\+90|0)?(?:5\d{9}|[2-9]\d{2}\d{7})$";
            return Regex.IsMatch(normalized, pattern);
        }

        public static bool TcKimlikNoDogrula(string tc)
        {
            if (string.IsNullOrEmpty(tc) || tc.Length != 11 || !tc.All(char.IsDigit))
                return false;

            if (tc[0] == '0')
                return false;

            int[] digits = tc.Select(t => int.Parse(t.ToString())).ToArray();

            int sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];     
            int sumEven = digits[1] + digits[3] + digits[5] + digits[7];                

            int digit10 = ((sumOdd * 7) - sumEven) % 10;
            if (digit10 != digits[9])
                return false;

            int sumFirst10 = digits.Take(10).Sum();
            int digit11 = sumFirst10 % 10;

            if (digit11 != digits[10])
                return false;

            return true;
        }
    }
}
