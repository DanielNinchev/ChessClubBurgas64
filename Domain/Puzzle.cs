using System.Text.Json.Serialization;

namespace Domain
{
    public class Puzzle
    {
        public required string Id { get; set; } = Guid.NewGuid().ToString();
        public int Number { get; set; }
        public int Points { get; set; }
        public required string Description { get; set; }
        public required string Solution { get; set; }
        public required string Difficulty { get; set; }
        public required string PhotoUrl { get; set; }

        // Navigation properties
        public required string PhotoId { get; set; }

        [JsonIgnore]
        public virtual Photo Photo { get; set; } = null!;
    }
}
