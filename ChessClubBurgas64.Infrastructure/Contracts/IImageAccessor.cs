using ChessClubBurgas64.Infrastructure.Images;
using Microsoft.AspNetCore.Http;

namespace ChessClubBurgas64.Infrastructure.Contracts
{
    public interface IImageAccessor
    {
        Task<ImageUploadResult?> AddImage(IFormFile file);

        Task<string?> DeleteImage(string publicId);
    }
}
