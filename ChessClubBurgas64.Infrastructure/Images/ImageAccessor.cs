using ChessClubBurgas64.Infrastructure.Contracts;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ImageUploadResult = ChessClubBurgas64.Infrastructure.Images.ImageUploadResult;

namespace Infrastructure.Images
{
    public class ImageAccessor : IImageAccessor
    {
        private readonly Cloudinary _cloudinary;
        private readonly ILogger<ImageAccessor> _logger;

        public ImageAccessor(IOptions<CloudinarySettings> config, ILogger<ImageAccessor> logger)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
            _logger = logger;
        }

        public async Task<ImageUploadResult?> AddImageAsync(IFormFile file)
        {
            if (file != null && file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                if (uploadResult.Error != null)
                {
                    _logger.LogError($"Error uploading imageto Cloudinary. Error message: {uploadResult.Error.Message}");
                }

                return new ImageUploadResult
                {
                    Id = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString()
                };
            }

            return null;
        }

        public async Task DeleteImageAsync(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var response = await _cloudinary.DestroyAsync(deleteParams);
            if (response.Result != "ok")
            {
                _logger.LogError($"Error deleting image with publicId {publicId} from Cloudinary.");
            }
        }
    }
}