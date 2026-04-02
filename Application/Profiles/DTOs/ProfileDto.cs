namespace Application.Profiles.DTOs;

public class ProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public List<string> Roles { get; set; } = [];
}
