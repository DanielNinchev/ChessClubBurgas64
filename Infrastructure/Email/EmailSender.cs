using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Resend;

namespace Infrastructure.Email;

public class EmailSender(IResend resend, IConfiguration config) : IEmailSender<Account>
{
    public async Task SendConfirmationLinkAsync(Account user, string email, string confirmationLink)
    {
        var subject = "���������� ������������ �� ����";
        var body = $@"
            <p>���������, {user.FirstName},</p>
            <p>����� �� ���������� ������ ���������� ����, ���������� �� �������� ��-����:</p>
            <p><a href='{confirmationLink}'>��������� ��� �� ������������</a></p>
            <p>����������!</p>
        ";

        await SendMailAsync(email, subject, body);
    }

    public async Task SendPasswordResetCodeAsync(Account user, string email, string resetCode)
    {
        var subject = "��������� �������� ��";
        var body = $@"
            <p>���������, {user.FirstName},</p>
            <p>��������� ���, �� �� ��������� �������� ��:</p>
            <p><a href='{config["ClientAppUrl"]}/reset-password?email={email}&code={resetCode}'>
                ������� �� ������</a>
            </p>
            <p>��� �� ��� �������� ������� �� �������� ��, �� ��������� �������� �� ���� ���������.</p>
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
