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

            int sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];     // 1,3,5,7,9
            int sumEven = digits[1] + digits[3] + digits[5] + digits[7];                // 2,4,6,8

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
