// Services/MomoService.cs
using System;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace MomoPaymentAPI.Services
{
    public class MomoService
    {
        private readonly string _partnerCode;
        private readonly string _accessKey;
        private readonly string _secretKey;
        private readonly string _endpoint;

        public MomoService(IConfiguration configuration)
        {
            _partnerCode = configuration["Momo:PartnerCode"];
            _accessKey = configuration["Momo:AccessKey"];
            _secretKey = configuration["Momo:SecretKey"];
            _endpoint = configuration["Momo:Endpoint"];
        }

        public async Task<string> CreatePayment(decimal amount, string orderId, string orderInfo, string returnUrl, string notifyUrl)
        {
            var requestId = Guid.NewGuid().ToString();
            var rawHash = $"accessKey={_accessKey}&amount={amount}&extraData=&ipnUrl={notifyUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={_partnerCode}&redirectUrl={returnUrl}&requestId={requestId}&requestType=captureWallet";

            var signature = CreateSignature(rawHash);

            var paymentRequest = new
            {
                partnerCode = _partnerCode,
                accessKey = _accessKey,
                requestId,
                amount,
                orderId,
                orderInfo,
                returnUrl,
                notifyUrl,
                requestType = "captureWallet",
                signature,
                extraData = ""
            };

            using (var client = new HttpClient())
            {
                var content = new StringContent(JObject.FromObject(paymentRequest).ToString(), Encoding.UTF8, "application/json");
                var response = await client.PostAsync(_endpoint, content);
                var responseContent = await response.Content.ReadAsStringAsync();
                return responseContent;
            }
        }

        private string CreateSignature(string rawHash)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secretKey)))
            {
                var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawHash));
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
    }
}
