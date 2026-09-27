namespace API.DTOs;

public class ConfirmEmailChangeDto
{
    public required string UserId { get; set; }
    public required string NewEmail { get; set; }
    public required string Token { get; set; }
}
