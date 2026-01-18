using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Resend;

namespace Infrastructure.Email;

public class EmailSender(IResend resend, IConfiguration config) : IEmailSender<Account>
{
    public async Task SendConfirmationLinkAsync(Account user, string email, string confirmationLink)
    {
        var subject = "Потвърдете електронната си поща";
        var body = $@"
            <p>Здравейте, {user.FirstName},</p>
            <p>Молим да потвърдите своята електронна поща, натискайки на връзката по-долу:</p>
            <p><a href='{confirmationLink}'>Натиснете тук за потвърждение</a></p>
            <p>Благодарим!</p>
        ";

        await SendMailAsync(email, subject, body);
    }

    public async Task SendPasswordResetCodeAsync(Account user, string email, string resetCode)
    {
        var subject = "Променете паролата си";
        var body = $@"
            <p>Здравейте, {user.FirstName},</p>
            <p>Натиснете тук, за да промените паролата си:</p>
            <p><a href='{config["ClientAppUrl"]}/reset-password?email={email}&code={resetCode}'>
                Промяна на парола</a>
            </p>
            <p>Ако не сте поискали промяна на паролата си, не обръщайте внимание на това съобщение.</p>
            </p>
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
