namespace Application.Profiles.DTOs;

public class StudentProfileDto : ProfileDto
{
    public DateTime? BirthDate { get; set; }
    public string? Address { get; set; }
    public string? School { get; set; }
    public DateTime? DateOfJoiningClub { get; set; }
    public int? ClubRating { get; set; }
    public int? FideRating { get; set; }
    public int? PuzzlePoints { get; set; }
    public string? TeacherName { get; set; }
}