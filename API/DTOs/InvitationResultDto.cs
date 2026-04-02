namespace API.DTOs;

public class InvitationResultDto
{
    public required string RegistrationLink { get; set; }
    public DateTime ExpiresAt { get; set; }
}