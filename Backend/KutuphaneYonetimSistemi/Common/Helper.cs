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
                    return (true,"");
                }
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            };
        }
    }
}
