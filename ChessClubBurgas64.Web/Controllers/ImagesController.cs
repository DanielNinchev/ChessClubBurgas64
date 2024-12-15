using AutoMapper;
using ChessClubBurgas64.Data;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Infrastructure.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChessClubBurgas64.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController(AppDbContext context, IMapper mapper, IImageAccessor imageAccessor, IUserAccessor userAccessor) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly IImageAccessor _imageAccessor = imageAccessor;
        private readonly IUserAccessor _userAccessor = userAccessor;

        //[Authorize("IsChessClubAdmin")]
        //[HttpPost]
        //private async Task PostImage(Announcement announcement, IFormFile file)
        //{
        //    var imageUploadResult = await _imageAccessor.AddImage(file);
        //    var image = _mapper.Map<Image>(imageUploadResult);
        //    SetMainImage(announcement, image.Id);
        //    announcement.Images.Add(image);
        //}

        //private static void SetMainImage(Announcement announcement, Guid imageId)
        //{
        //    var image = announcement.Images.FirstOrDefault(x => x.Id == imageId);
        //    if (image == null)
        //    {
        //        return;
        //    }

        //    var currentMain = announcement.Images.FirstOrDefault(x => x.IsMain);
        //    if (currentMain != null)
        //    {
        //        currentMain.IsMain = false;
        //    }

        //    image.IsMain = true;
        //}
    }
}
