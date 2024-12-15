#nullable disable
using System.ComponentModel.DataAnnotations;

namespace ChessClubBurgas64.Data.Models
{
    public class Image
    {
        [Key]
        public string Id { get; set; }

        public string Url { get; set; }

        public bool IsMain { get; set; }
    }
}
