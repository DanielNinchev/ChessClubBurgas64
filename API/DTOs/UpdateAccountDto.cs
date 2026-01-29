namespace API.DTOs
{
    public class UpdateAccountDto
    {
        public required string Email { get; set; }
        public required string FirstName { get; set; }
        public required string MiddleName { get; set; }
        public required string LastName { get; set; }
        public required string PhoneNumber { get; set; }
        public bool IsAdmin { get; set; }
    }
}
