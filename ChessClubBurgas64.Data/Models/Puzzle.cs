#nullable disable
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Data.Models
{
    public class Puzzle
    {
        [Key]
        public int Id { get; set; }
        public int Number { get; set; }
        public string Description { get; set; }
        public string Solution { get; set; }
        public int Points { get; set; }
        public string Difficulty { get; set; }
        public string ImageUrl { get; set; }
        public string ImageId { get; set; }
        public virtual Image Image { get; set; }
    }
}
