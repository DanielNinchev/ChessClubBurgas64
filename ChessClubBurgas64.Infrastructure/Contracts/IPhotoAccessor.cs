using ChessClubBurgas64.Infrastructure.Photos;
using Microsoft.AspNetCore.Http;

namespace ChessClubBurgas64.Infrastructure.Contracts
{
    public interface IPhotoAccessor
    {
        Task<PhotoUploadResult> AddPhoto(IFormFile file);

        Task<string> DeletePhoto(string publicId);
    }
}
