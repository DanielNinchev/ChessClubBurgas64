namespace Application.Profiles.DTOs;

public class TeacherProfileDto : ProfileDto
{
    public string? Bio { get; set; }
    public string? Specialization { get; set; }
    public int StudentCount { get; set; }
}