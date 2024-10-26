namespace ChessClubBurgas64.Web.Core.PagingParams
{
    public class AnnouncementParams : PagingParams
    {
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}
