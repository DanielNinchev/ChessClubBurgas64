using Application.Announcements.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        //string? currentUserId = null;
        CreateMap<Announcement, Announcement>();
        CreateMap<CreateAnnouncementDto, Announcement>();
        CreateMap<EditAnnouncementDto, Announcement>();
        CreateMap<Announcement, AnnouncementDto>();
    }
}
