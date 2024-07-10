namespace back_end_app.Momo.Config
{
    public class MomoConfig
    {
        public static string ConfigName => "Momo";
        public static string PartnerCode { get; set; } = string.Empty;
        public static string Returncode { get; set; } = string.Empty;
        public static string IpnUrl { get; set; } = string.Empty;
        public static string AcccessKey { get; set; } = string.Empty;
        public static string SceretKey { get; set; } = string.Empty;
        public static string PaymentUrl { get; set; } = string.Empty;
    }
}
