using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Resend;

namespace Infrastructure.Email;

public class EmailSender(IResend resend, IConfiguration config) : IEmailSender<Account>
{
    public async Task SendConfirmationLinkAsync(Account user, string email, string confirmationLink)
    {
        var subject = "Потвърдете имейл адреса си";
        var body = $"""
            <h2>Потвърждение на имейл адрес</h2>
            <p>Здравейте, {user.FirstName},</p>
            <p>Моля, потвърдете имейл адреса си, като кликнете на линка по-долу:</p>
            <p><a href='{confirmationLink}' style='display:inline-block;padding:12px 24px;background-color:#1976d2;color:white;text-decoration:none;border-radius:6px;font-weight:bold;'>Потвърдете имейл адреса си</a></p>
            <p>Ако не сте създавали акаунт, моля, игнорирайте този имейл.</p>
            <br/>
            <p style='color:#888;font-size:12px;'>Шахматен клуб Бургас 64</p>
            """;

        await SendMailAsync(email, subject, body);
    }

    public async Task SendPasswordResetCodeAsync(Account user, string email, string resetCode)
    {
        var clientUrl = config["ClientUrl"] ?? "http://localhost:3000";
        var resetLink = $"{clientUrl}/reset-password?email={Uri.EscapeDataString(email)}&code={resetCode}";

        var subject = "Смяна на парола - Шахматен клуб Бургас 64";
        var body = $"""
            <h2>Заявка за смяна на парола</h2>
            <p>Здравейте, {user.FirstName},</p>
            <p>Получихте това писмо, защото е направена заявка за смяна на паролата на вашия акаунт.</p>
            <p>Натиснете линка по-долу, за да зададете нова парола:</p>
            <p><a href='{resetLink}' style='display:inline-block;padding:12px 24px;background-color:#1976d2;color:white;text-decoration:none;border-radius:6px;font-weight:bold;'>Смяна на парола</a></p>
            <p>Ако не сте направили тази заявка, игнорирайте този имейл.</p>
            <br/>
            <p style='color:#888;font-size:12px;'>Шахматен клуб Бургас 64</p>
            """;

        await SendMailAsync(email, subject, body);
    }

    public async Task SendPasswordResetLinkAsync(Account user, string email, string resetLink)
    {
        var subject = "Смяна на парола - Шахматен клуб Бургас 64";
        var body = $"""
            <h2>Заявка за смяна на парола</h2>
            <p>Здравейте, {user.FirstName},</p>
            <p>Получихте това писмо, защото е направена заявка за смяна на паролата на вашия акаунт.</p>
            <p>Натиснете линка по-долу, за да зададете нова парола:</p>
            <p><a href='{resetLink}' style='display:inline-block;padding:12px 24px;background-color:#1976d2;color:white;text-decoration:none;border-radius:6px;font-weight:bold;'>Смяна на парола</a></p>
            <p>Ако не сте направили тази заявка, игнорирайте този имейл.</p>
            <br/>
            <p style='color:#888;font-size:12px;'>Шахматен клуб Бургас 64</p>
            """;

        await SendMailAsync(email, subject, body);
    }

    private async Task SendMailAsync(string email, string subject, string body)
    {
        var message = new EmailMessage
        {
            From = config["Email:From"] ?? "onboarding@resend.dev",
            Subject = subject,
            HtmlBody = body
        };
        message.To.Add(email);

        await resend.EmailSendAsync(message);
    }
}