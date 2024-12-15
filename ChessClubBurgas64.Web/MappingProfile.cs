using AutoMapper;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Infrastructure.Images;
using ChessClubBurgas64.Web.DTOs.AccountDTOs;
using ChessClubBurgas64.Web.DTOs.AnnouncementDTOs;

namespace ChessClubBurgas64.Web
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterDto, Account>();
            CreateMap<Account, UserDto>();
            CreateMap<ImageUploadResult, Image>()
                .ForMember(i => i.IsMain, iur => iur.Ignore());
            CreateMap<Announcement, AnnouncementDTO>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images.ToList()));
        }
    }
}
