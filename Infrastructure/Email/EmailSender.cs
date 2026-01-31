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
        var body = $@"
            <p>Здравейте, {user.FirstName},</p>
            <p>Моля, потвърдете имейл адреса си, като кликнете на следния линк:</p>
            <p><a href='{confirmationLink}'>Потвърдете имейл адреса си</a></p>
            <p>Благодарим ви!</p>
        ";

        await SendMailAsync(email, subject, body);
    }

    public async Task SendPasswordResetCodeAsync(Account user, string email, string resetCode)
    {
        var subject = "Възстановяване на парола";
        var body = $@"
            <p>Здравейте, {user.FirstName},</p>
            <p>Моля, използвайте следния код за възстановяване на паролата си:</p>
            <p><a href='{config["ClientAppUrl"]}/reset-password?email={email}&code={resetCode}'>
                Възстановяване на парола</a>
            </p>
            <p>Ако не сте поискали възстановяване на паролата си, моля, игнорирайте този имейл.</p>
        ";

        await SendMailAsync(email, subject, body);
    }

    public Task SendPasswordResetLinkAsync(Account user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    private async Task SendMailAsync(string email, string subject, string body)
    {
        var message = new EmailMessage
        {
            From = "no-reply@resend.trycatchlearn.com",
            Subject = subject,
            HtmlBody = body
        };
        message.To.Add(email);

        Console.WriteLine(message.HtmlBody);

        await resend.EmailSendAsync(message);
    }
}
