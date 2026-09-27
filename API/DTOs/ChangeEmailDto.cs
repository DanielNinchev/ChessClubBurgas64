namespace API.DTOs;

public class ChangeEmailDto
{
    public required string NewEmail { get; set; }
    public required string CurrentPassword { get; set; }
}
