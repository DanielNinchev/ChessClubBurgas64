using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence;

public static class Seeder
{
    public static async Task SeedData(
        UserManager<Account> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        // Create roles
        string[] roles = ["Admin", "Teacher", "Student"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // Seed admin account if it doesn't exist
        var adminEmail = "daniel.ninchev@gmail.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new Account
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Daniel",
                MiddleName = "Borislavov",
                LastName = "Ninchev"
            };
            await userManager.CreateAsync(adminUser, "Test1234!");
        }

        // Assign Admin role to your account
        if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}