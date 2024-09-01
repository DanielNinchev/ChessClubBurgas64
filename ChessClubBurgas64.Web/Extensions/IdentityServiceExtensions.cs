﻿using ChessClubBurgas64.Data;
using ChessClubBurgas64.Data.Models;
using ChessClubBurgas64.Infrastructure.Security;
using ChessClubBurgas64.Web.Services;
using ChessClubBurgas64.Web.Services.Contracts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ChessClubBurgas64.Web.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
                opt.User.RequireUniqueEmail = true;
            }).AddEntityFrameworkStores<AppDbContext>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                    opt.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.AddAuthorizationBuilder()
                .AddPolicy("IsChessClubAdmin", policy =>
                {
                    policy.Requirements.Add(new IsChessClubAdminRequirement());
                });

            services.AddTransient<IAuthorizationHandler, IsChessClubAdminRequirementHandler>();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}