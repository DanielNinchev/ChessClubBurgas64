using AutoMapper;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Web.DTOs;

namespace ChessClubBurgas64.Web
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterDto, Account>();
        }
    }
}
