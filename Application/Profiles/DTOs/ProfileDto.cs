namespace Application.Profiles.DTOs
{
    public class ProfileDto
    {
        public required string Id { get; set; }
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string MiddleName { get; set; }
        public required string LastName { get; set; }
        public required string PhoneNumber { get; set; }
        public required DateTime BirthDate { get; set; }
        public required string? Address { get; set; }
        public required string? School { get; set; }
    }
}
