using API.Middleware;
using Application.Announcements.Queries;
using Application.Announcements.Validators;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using Infrastructure.Email;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Persistence;
using Resend;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

    string connStr;

    if (env == "Development")
    {
        connStr = builder.Configuration.GetConnectionString("DefaultConnection")!;
    }
    else
    {
        var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

        connUrl = connUrl!.Replace("postgres://", string.Empty);
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

    options.UseNpgsql(connStr);
});
builder.Services.AddCors();
builder.Services.AddMediatR(x =>
{
    x.RegisterServicesFromAssemblyContaining<GetAnnouncementList.Handler>();
    x.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// Resend email - all singletons to avoid scoped resolution from MapIdentityApi
builder.Services.AddHttpClient<ResendClient>();
var resendApiToken = builder.Configuration["Resend:ApiToken"]!;
builder.Services.AddSingleton<IOptionsSnapshot<ResendClientOptions>>(
    new SingletonOptionsSnapshot<ResendClientOptions>(
        new ResendClientOptions { ApiToken = resendApiToken }));
builder.Services.AddSingleton<IResend>(sp =>
{
    var options = sp.GetRequiredService<IOptionsSnapshot<ResendClientOptions>>();
    var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
    var httpClient = httpClientFactory.CreateClient(nameof(ResendClient));
    return new ResendClient(options, httpClient);
});
builder.Services.AddSingleton<IEmailSender<Account>>(sp =>
{
    var resend = sp.GetRequiredService<IResend>();
    var config = sp.GetRequiredService<IConfiguration>();
    return new EmailSender(resend, config);
});

builder.Services.AddScoped<IUserAccessor, UserAccessor>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateAnnouncementValidator>();
builder.Services.AddTransient<ExceptionMiddleware>();
builder.Services.AddIdentityApiEndpoints<Account>(opt =>
{
    opt.User.RequireUniqueEmail = true;
    opt.SignIn.RequireConfirmedEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddSignInManager<SignInManager<Account>>();

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("IsChessClubAdmin", policy =>
    {
        policy.Requirements.Add(new IsChessClubAdminRequirement());
    });

builder.Services.AddTransient<IAuthorizationHandler, IsChessClubAdminRequirementHandler>();
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:5174"));

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapGroup("api").MapIdentityApi<Account>();

app.MapFallbackToFile("index.html");

// Seed data
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<AppDbContext>();
    var userManager = services.GetRequiredService<UserManager<Account>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

    try
    {
        await context.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Migration skipped - database may already be up to date.");
    }

    await DatabaseSeeder.SeedRoles(userManager, roleManager, context);

    var solutionRoot = Directory.GetParent(AppContext.BaseDirectory)!.Parent!.Parent!.Parent!.Parent!.FullName;
    var puzzleCsvPath = Path.Combine(solutionRoot, "Persistence", "lichess_db_puzzle.csv");

    await DatabaseSeeder.SeedPuzzlesFromCSV(context, puzzleCsvPath, count: 500);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during seeding.");
}

app.Run();

// Helper: wraps IOptionsSnapshot as a singleton
public class SingletonOptionsSnapshot<T>(T value) : IOptionsSnapshot<T> where T : class, new()
{
    public T Value => value;
    public T Get(string? name) => value;
}