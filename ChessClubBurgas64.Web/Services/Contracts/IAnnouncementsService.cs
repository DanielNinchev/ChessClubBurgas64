using Application.Core;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Web.Core.PagingParams;
using ChessClubBurgas64.Web.Models.AnnouncementModels;

namespace ChessClubBurgas64.Web.Services.Contracts
{
    public interface IAnnouncementsService
    {
        Task<AnnouncementInputModel?> GetAnnouncementAsync(Guid id);
        Task<PagedList<Announcement, AnnouncementInputModel>?> GetAnnouncementAsync(AnnouncementParams pagingParams);
        Task<AnnouncementInputModel> CreateAnnouncementAsync(Announcement announcement, IFormFile mainImage);
        Task DeleteAnnouncementAsync(Guid id);
        Task UpdateAnnouncementAsync(Guid id, Announcement updatedAnnouncement, IFormFile mainImage);
    }
}
