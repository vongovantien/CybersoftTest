using back_end_app.Data;
using back_end_app.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MomoPaymentAPI.Services;

namespace PaymentAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly MomoService _momoService;
        private readonly UserManager<IdentityUser> _userManager;

        public PaymentController(ApplicationDbContext context, MomoService momoService, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _momoService = momoService;
            _userManager = userManager;
        }

        [HttpPost("deposit")]
        public async Task<IActionResult> Deposit([FromBody] DepositRequest request)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var orderId = Guid.NewGuid().ToString();
            var orderInfo = "Deposit to wallet";
            var returnUrl = "https://your-return-url.com";
            var notifyUrl = "https://your-notify-url.com";

            var result = await _momoService.CreatePayment(request.Amount, orderId, orderInfo, returnUrl, notifyUrl);

            var currentBalanceClaim = (await _userManager.GetClaimsAsync(user)).FirstOrDefault(c => c.Type == "Balance");
            var currentBalance = currentBalanceClaim != null ? decimal.Parse(currentBalanceClaim.Value) : 0;

            if (currentBalanceClaim != null)
            {
                await _userManager.RemoveClaimAsync(user, currentBalanceClaim);
            }
            await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("Balance", (currentBalance + request.Amount).ToString()));

            var transaction = new Transaction
            {
                SenderId = user.Id,
                ReceiverId = user.Id,
                Amount = request.Amount,
                TransactionDate = DateTime.Now,
                Type = "Deposit"
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(result);
        }

        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer([FromBody] TransferRequest request)
        {
            var sender = await _userManager.FindByIdAsync(request.SenderId);
            var receiver = await _userManager.FindByIdAsync(request.ReceiverId);

            if (sender == null || receiver == null)
            {
                return NotFound("Sender or receiver not found");
            }

            var senderBalanceClaim = (await _userManager.GetClaimsAsync(sender)).FirstOrDefault(c => c.Type == "Balance");
            var receiverBalanceClaim = (await _userManager.GetClaimsAsync(receiver)).FirstOrDefault(c => c.Type == "Balance");

            var senderBalance = senderBalanceClaim != null ? decimal.Parse(senderBalanceClaim.Value) : 0;
            var receiverBalance = receiverBalanceClaim != null ? decimal.Parse(receiverBalanceClaim.Value) : 0;

            if (senderBalance < request.Amount)
            {
                return BadRequest("Insufficient balance");
            }

            if (senderBalanceClaim != null)
            {
                await _userManager.RemoveClaimAsync(sender, senderBalanceClaim);
            }
            await _userManager.AddClaimAsync(sender, new System.Security.Claims.Claim("Balance", (senderBalance - request.Amount).ToString()));

            if (receiverBalanceClaim != null)
            {
                await _userManager.RemoveClaimAsync(receiver, receiverBalanceClaim);
            }
            await _userManager.AddClaimAsync(receiver, new System.Security.Claims.Claim("Balance", (receiverBalance + request.Amount).ToString()));

            var transaction = new Transaction
            {
                SenderId = sender.Id,
                ReceiverId = receiver.Id,
                Amount = request.Amount,
                TransactionDate = DateTime.Now,
                Type = "Transfer"
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Transfer successful" });
        }

        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetTransactionHistory(string userId)
        {
            var transactions = await _context.Transactions
                .Where(t => t.SenderId == userId || t.ReceiverId == userId)
                .Include(t => t.Sender)
                .Include(t => t.Receiver)
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            return Ok(transactions);
        }
    }

    public class DepositRequest
    {
        public string UserId { get; set; }
        public decimal Amount { get; set; }
    }

    public class TransferRequest
    {
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public decimal Amount { get; set; }
    }
}
