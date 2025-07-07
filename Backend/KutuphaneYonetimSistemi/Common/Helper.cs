using System.Text.RegularExpressions;

namespace KutuphaneYonetimSistemi.Common
{
    public class Helper
    {
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
            return Regex.IsMatch(email, @"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$");
        }

    }
}
