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
            //.ForMember(d => d.HostDisplayName, o => o.MapFrom(s =>
            //    s.Attendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName))
            //.ForMember(d => d.HostId, o => o.MapFrom(s =>
            //    s.Attendees.FirstOrDefault(x => x.IsHost)!.User.Id));
        //CreateMap<Student, UserProfile>()
        //    .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
        //    .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
        //    .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl))
        //    .ForMember(d => d.Id, o => o.MapFrom(s => s.User.Id))
        //    .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.User.Followers.Count))
        //    .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.User.Followings.Count))
        //    .ForMember(d => d.Following, o => o.MapFrom(s => 
        //        s.User.Followers.Any(x => x.Observer.Id == currentUserId)));
        //CreateMap<Account, UserProfile>()
        //    .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
        //    .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
        //    .ForMember(d => d.Following, o => o.MapFrom(s => 
        //        s.Followers.Any(x => x.Observer.Id == currentUserId)));
        //CreateMap<Comment, CommentDto>()
        //    .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
        //    .ForMember(d => d.UserId, o => o.MapFrom(s => s.User.Id))
        //    .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl));
        //CreateMap<Announcement, UserActivityDto>();
    }
}
