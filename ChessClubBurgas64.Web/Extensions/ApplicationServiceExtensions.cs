﻿using ChessClubBurgas64.Infrastructure.Security;
using FluentValidation.AspNetCore;
using FluentValidation;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using ChessClubBurgas64.Data;
using Microsoft.EntityFrameworkCore;
using ChessClubBurgas64.Infrastructure.Contracts;
using Infrastructure.Images;
using ChessClubBurgas64.Web.Core;
using ChessClubBurgas64.Web.Services.Contracts;
using ChessClubBurgas64.Web.Services;

namespace ChessClubBurgas64.Web.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
           IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddDbContext<AppDbContext>(options =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connStr;

                // Depending on if in development or production, use either FlyIO
                // connection string, or development connection string from env var.
                if (env == "Development")
                {
                    // Use connection string from file.
                    connStr = config.GetConnectionString("DefaultConnection");
                }
                else
                {
                    // Use connection string provided at runtime by Flyio.
                    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                    // Parse connection URL to connection string for Npgsql
                    connUrl = connUrl.Replace("postgres://", string.Empty);
                    var pgUserPass = connUrl.Split("@")[0];
                    var pgHostPortDb = connUrl.Split("@")[1];
                    var pgHostPort = pgHostPortDb.Split("/")[0];
                    var pgDb = pgHostPortDb.Split("/")[1];
                    var pgUser = pgUserPass.Split(":")[0];
                    var pgPass = pgUserPass.Split(":")[1];
                    var pgHost = pgHostPort.Split(":")[0];
                    var pgPort = pgHostPort.Split(":")[1];

                    connStr = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
                }

                // Whether the connection string came from the local development configuration file
                // or from the environment variable from FlyIO, use it to set up your DbContext.
                options.UseNpgsql(connStr);
            });
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:5173");
                });
            });
            //services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>();
            services.AddHttpContextAccessor();
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IImageAccessor, ImageAccessor>();
            services.AddTransient<IAnnouncementsService, AnnouncementsService>();
            services.AddTransient<IPuzzlesService, PuzzlesService>();
            //services.AddSignalR();

            return services;
        }
    }
}
