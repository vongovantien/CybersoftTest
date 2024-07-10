using Microsoft.AspNetCore.Identity;

namespace back_end_app.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public decimal Amount { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Type { get; set; } // "Deposit" or "Transfer"

        public IdentityUser Sender { get; set; }
        public IdentityUser Receiver { get; set; }
    }
}
