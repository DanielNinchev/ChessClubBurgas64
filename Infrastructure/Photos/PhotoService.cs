using System.Net;
using Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    public PhotoService(IOptions<CloudinarySettings> config)
    {
        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(account);
    }

    public async Task<DeletionResult> DeletePhotoAsync(string? publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
            return new DeletionResult { Result = "Error deleting photo - missing public ID.", StatusCode = HttpStatusCode.BadRequest };

        var deleteParams = new DeletionParams(publicId);

        return await _cloudinary.DestroyAsync(deleteParams);
    }

    public async Task<UploadResult?> UploadPhotoAsync(IFormFile file)
    {
        if (file.Length <= 0) return null;

        await using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "ChessClubBurgas64"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        return uploadResult;
    }
}
