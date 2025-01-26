using AutoMapper;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Infrastructure.Images;
using ChessClubBurgas64.Web.Models.AccountModels;
using ChessClubBurgas64.Web.Models.AnnouncementModels;

namespace ChessClubBurgas64.Web.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterInputModel, Account>();
            CreateMap<Account, AccountViewModel>();
            CreateMap<ImageUploadResult, Image>()
                .ForMember(i => i.IsMain, iur => iur.Ignore());
            CreateMap<Announcement, AnnouncementInputModel>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images.ToList()))
                .ForMember(dest => dest.MainImageUrl, opt => opt.MapFrom(src => src.Images.Single(i => i.IsMain).Url));
        }
    }
}
