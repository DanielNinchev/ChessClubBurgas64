using Application.Announcements.DTOs;
using Application.Profiles.DTOs;
using Domain;

namespace Application.Core;

public static class MappingExtensions
{
    // --- Announcement ---

    public static AnnouncementDto ToDto(this Announcement a)
    {
        return new AnnouncementDto
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            Text = a.Text,
            Date = a.Date,
            MainPhotoUrl = a.MainPhotoUrl ?? string.Empty,
            Photos = a.Photos.Select(p => p.ToDto()).ToList(),
        };
    }

    public static IQueryable<AnnouncementDto> ProjectToDto(this IQueryable<Announcement> query)
    {
        return query.Select(a => new AnnouncementDto
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            Text = a.Text,
            Date = a.Date,
            MainPhotoUrl = a.MainPhotoUrl ?? string.Empty,
            Photos = a.Photos.Select(p => new PhotoDto
            {
                Id = p.Id,
                Url = p.Url,
                IsMain = p.IsMain,
            }).ToList(),
        });
    }

    public static Announcement ToEntity(this CreateAnnouncementDto dto)
    {
        return new Announcement
        {
            Id = Guid.NewGuid().ToString(),
            Title = dto.Title,
            Description = dto.Description,
            Text = dto.Text,
            MainPhotoUrl = string.Empty,
        };
    }

    public static void ApplyTo(this EditAnnouncementDto dto, Announcement announcement)
    {
        announcement.Title = dto.Title;
        announcement.Description = dto.Description;
        announcement.Text = dto.Text;
    }

    // --- Photo ---

    public static PhotoDto ToDto(this Photo p)
    {
        return new PhotoDto
        {
            Id = p.Id,
            Url = p.Url,
            IsMain = p.IsMain,
        };
    }

    // --- Profile ---

    public static ProfileDto ToBaseProfileDto(this Account a, IList<string> roles)
    {
        return new ProfileDto
        {
            Id = a.Id,
            FirstName = a.FirstName,
            MiddleName = a.MiddleName,
            LastName = a.LastName,
            Email = a.Email,
            PhoneNumber = a.PhoneNumber,
            Roles = roles.ToList(),
        };
    }

    public static StudentProfileDto ToStudentProfileDto(this Account a, IList<string> roles)
    {
        return new StudentProfileDto
        {
            Id = a.Id,
            FirstName = a.FirstName,
            MiddleName = a.MiddleName,
            LastName = a.LastName,
            Email = a.Email,
            PhoneNumber = a.StudentProfile?.PhoneNumber,
            Roles = roles.ToList(),
            BirthDate = a.StudentProfile?.BirthDate,
            Address = a.StudentProfile?.Address,
            School = a.StudentProfile?.School,
            DateOfJoiningClub = a.StudentProfile?.DateOfJoiningClub,
            ClubRating = a.StudentProfile?.ClubRating,
            FideRating = a.StudentProfile?.FideRating,
            PuzzlePoints = a.StudentProfile?.PuzzlePoints,
            TeacherName = a.StudentProfile?.Teacher?.Account != null
                ? $"{a.StudentProfile.Teacher.Account.FirstName} {a.StudentProfile.Teacher.Account.LastName}"
                : null,
        };
    }

    public static StudentProfileDto WithoutPrivateData(this StudentProfileDto dto)
    {
        dto.Email = null;
        dto.PhoneNumber = null;
        dto.Address = null;
        dto.BirthDate = null;
        return dto;
    }

    public static TeacherProfileDto ToTeacherProfileDto(this Account a, IList<string> roles)
    {
        return new TeacherProfileDto
        {
            Id = a.Id,
            FirstName = a.FirstName,
            MiddleName = a.MiddleName,
            LastName = a.LastName,
            Email = a.Email,
            PhoneNumber = a.PhoneNumber,
            Roles = roles.ToList(),
            Bio = a.TeacherProfile?.Bio,
            Specialization = a.TeacherProfile?.Specialization,
            StudentCount = a.TeacherProfile?.Students.Count ?? 0,
        };
    }

    public static void ApplyTo(this EditProfileDto dto, Account account)
    {
        account.FirstName = dto.FirstName;
        account.MiddleName = dto.MiddleName;
        account.LastName = dto.LastName;
        account.PhoneNumber = dto.PhoneNumber;
    }

    // Blank values clear the field - all student data is optional
    public static void ApplyTo(this EditStudentDataDto dto, StudentProfile studentProfile)
    {
        studentProfile.Address = NullIfBlank(dto.Address);
        studentProfile.School = NullIfBlank(dto.School);
        studentProfile.PhoneNumber = NullIfBlank(dto.PhoneNumber);
        // Birth dates are calendar dates: pin them to UTC midnight so no timezone shift can change the day
        studentProfile.BirthDate = dto.BirthDate.HasValue
            ? DateTime.SpecifyKind(dto.BirthDate.Value.Date, DateTimeKind.Utc)
            : null;
    }

    private static string? NullIfBlank(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    public static void ApplyTo(this EditProfileDto dto, TeacherProfile teacherProfile)
    {
        teacherProfile.Bio = dto.Bio ?? teacherProfile.Bio;
        teacherProfile.Specialization = dto.Specialization ?? teacherProfile.Specialization;
    }
}