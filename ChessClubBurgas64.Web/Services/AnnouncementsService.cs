using Application.Core;
using AutoMapper;
using ChessClubBurgas64.Data;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Infrastructure.Contracts;
using ChessClubBurgas64.Web.Core.PagingParams;
using ChessClubBurgas64.Web.Models.AnnouncementModels;
using ChessClubBurgas64.Web.Services.Contracts;
using Microsoft.EntityFrameworkCore;

namespace ChessClubBurgas64.Web.Services
{
    public class AnnouncementsService(ILogger<AnnouncementsService> logger, AppDbContext dbContext, IMapper mapper, IImageAccessor imageAccessor) : IAnnouncementsService
    {
        private readonly ILogger<AnnouncementsService> _logger = logger;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly IMapper _mapper = mapper;
        private readonly IImageAccessor _imageAccessor = imageAccessor;

        public async Task<PagedList<Announcement, AnnouncementInputModel>?> GetAnnouncementAsync(AnnouncementParams pagingParams)
        {
            if (_dbContext.Announcements == null)
            {
                return null;
            }

            var query = _dbContext.Announcements
                .Include(a => a.Images)
                .Where(x => x.DateCreated.Day <= pagingParams.StartDate.Day)
                .OrderByDescending(d => d.DateCreated)
                .AsQueryable();

            return await PagedList<Announcement, AnnouncementInputModel>.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize, mapper);
        }

        public async Task<AnnouncementInputModel?> GetAnnouncementAsync(Guid id)
        {
            if (_dbContext.Announcements == null)
            {
                return null;
            }

            var announcement = await _dbContext.Announcements
                .Include(x => x.Images)
                .SingleOrDefaultAsync(x => x.Id == id);

            return _mapper.Map<AnnouncementInputModel>(announcement);
        }

        public async Task<AnnouncementInputModel> CreateAnnouncementAsync(Announcement announcement, IFormFile mainImage)
        {
            await UpdateAnnouncementMainImageAsync(announcement, mainImage);
            _dbContext.Announcements.Add(announcement);
            await _dbContext.SaveChangesAsync();
            return _mapper.Map<AnnouncementInputModel>(announcement);
        }

        public async Task DeleteAnnouncementAsync(Guid id)
        {
            var announcement = await _dbContext.Announcements
                .Include(a => a.Images)
                .SingleAsync(a => a.Id == id);

            foreach (var image in announcement.Images)
            {
                await _imageAccessor.DeleteImageAsync(image.Id);
                _dbContext.Images.Remove(image);
            }

            _dbContext.Announcements.Remove(announcement);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAnnouncementAsync(Guid id, Announcement updatedAnnouncement, IFormFile mainImage)
        {
            var currentAnnouncement = await _dbContext.Announcements
                .Include(a => a.Images)
                .SingleAsync(a => a.Id == id);
            
            currentAnnouncement.DateUpdated = DateTime.UtcNow;
            currentAnnouncement.Description = updatedAnnouncement.Description;
            currentAnnouncement.Text = updatedAnnouncement.Text;
            currentAnnouncement.Title = updatedAnnouncement.Title;

            await UpdateAnnouncementMainImageAsync(currentAnnouncement, mainImage);
            _dbContext.Entry(currentAnnouncement).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
        }

        private async Task UpdateAnnouncementMainImageAsync(Announcement announcement, IFormFile file)
        {
            var imageUploadResult = await _imageAccessor.AddImageAsync(file);
            var newMainImage = _mapper.Map<Image>(imageUploadResult);
            SetAnnouncementMainImage(announcement, newMainImage);
        }

        private void SetAnnouncementMainImage(Announcement announcement, Image newMainImage)
        {
            if (newMainImage == null)
            {
                _logger.LogError("Failed setting main image! The image was null!");
                return;
            }

            var currentMainImage = announcement.Images.SingleOrDefault(x => x.IsMain);
            if (currentMainImage != null)
            {
                currentMainImage.IsMain = false;
            }

            newMainImage.IsMain = true;
            if (!_dbContext.Images.Any(x => x.Id == newMainImage.Id))
            {
                _dbContext.Images.Add(newMainImage);
                announcement.Images.Add(newMainImage);
            }
        }
    }
}
