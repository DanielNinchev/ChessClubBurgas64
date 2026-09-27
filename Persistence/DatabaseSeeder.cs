using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ZstdSharp;

namespace Persistence;

public static class DatabaseSeeder
{
    // Theme → Bulgarian category mapping
    private static readonly Dictionary<string, string> _themeToCategoryMap = new(StringComparer.OrdinalIgnoreCase)
    {
        ["mateIn1"] = "Мат в 1 ход",
        ["mateIn2"] = "Мат в 2 хода",
        ["mateIn3"] = "Мат в 3 хода",
        ["mateIn4"] = "Мат в 4 хода",
        ["mateIn5"] = "Мат в 5 хода",
        ["fork"] = "Вилка",
        ["pin"] = "Свръзка",
        ["skewer"] = "Шиш",
        ["discoveredAttack"] = "Разкрита атака",
        ["doubleCheck"] = "Двоен шах",
        ["sacrifice"] = "Жертва",
        ["deflection"] = "Отклонение",
        ["attraction"] = "Привличане",
        ["clearance"] = "Разчистване",
        ["zugzwang"] = "Цугцванг",
        ["endgame"] = "Ендшпил",
        ["middlegame"] = "Мителшпил",
        ["opening"] = "Дебют",
        ["pawnEndgame"] = "Пешечен ендшпил",
        ["rookEndgame"] = "Топовен ендшпил",
        ["bishopEndgame"] = "Офицерски ендшпил",
        ["knightEndgame"] = "Конски ендшпил",
        ["queenEndgame"] = "Дамски ендшпил",
        ["queenRookEndgame"] = "Ендшпил дама и топ",
        ["promotion"] = "Промоция",
        ["underPromotion"] = "Слаба промоция",
        ["trappedPiece"] = "Хванат фигура",
        ["hangingPiece"] = "Висяща фигура",
        ["backRankMate"] = "Мат на последна линия",
        ["smotheredMate"] = "Задушен мат",
        ["castling"] = "Рокада",
        ["kingsideAttack"] = "Атака на царския фланг",
        ["queensideAttack"] = "Атака на дамския фланг",
        ["intermezzo"] = "Междинен ход",
        ["quietMove"] = "Тих ход",
        ["xRayAttack"] = "Рентгенова атака",
        ["defensiveMove"] = "Защитен ход",
        ["interferenceMove"] = "Интерференция",
        ["capstone"] = "Тактика",
        ["advantage"] = "Материално предимство",
        ["crushing"] = "Разгромяваща позиция",
        ["mate"] = "Мат",
        ["short"] = "Кратка задача",
        ["long"] = "Дълга задача",
        ["oneMove"] = "Един ход",
        ["veryLong"] = "Много дълга задача",
        ["master"] = "Майсторска задача",
        ["masterVsMaster"] = "Майстор срещу майстор",
        ["superGM"] = "Супер гросмайстор",
    };

    private static string MapDifficulty(int rating)
    {
        return rating switch
        {
            < 1200 => "Лесна",
            < 1800 => "Средна",
            _ => "Трудна",
        };
    }

    private static int MapPoints(int rating)
    {
        return rating switch
        {
            < 1000 => 5,
            < 1200 => 10,
            < 1400 => 15,
            < 1600 => 20,
            < 1800 => 25,
            < 2000 => 30,
            < 2200 => 40,
            _ => 50,
        };
    }

    private static string MapCategory(string themes)
    {
        var themeList = themes.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        string[] priorityOrder =
        [
            "mateIn1", "mateIn2", "mateIn3", "mateIn4", "mateIn5",
            "backRankMate", "smotheredMate",
            "fork", "pin", "skewer", "discoveredAttack", "doubleCheck",
            "sacrifice", "deflection", "attraction", "clearance",
            "promotion", "underPromotion", "zugzwang", "intermezzo",
            "quietMove", "xRayAttack", "trappedPiece", "hangingPiece",
            "endgame", "middlegame", "opening",
        ];

        foreach (var priorityTheme in priorityOrder)
        {
            if (themeList.Contains(priorityTheme, StringComparer.OrdinalIgnoreCase))
                return priorityTheme; // returns English key for enum ordering
        }

        // Fallback: return first theme that EXISTS in the enum
        foreach (var theme in themeList)
        {
            if (Enum.TryParse<CategoryEnum>(theme, ignoreCase: true, out _))
                return theme;
        }

        // Final fallback — maps to CategoryEnum.opening (last safe value)
        return "opening";
    }

    public static async Task SeedRoles(UserManager<Account> userManager, RoleManager<IdentityRole> roleManager, AppDbContext context)
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
                LastName = "Ninchev",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(adminUser, "Test1234!");
        }

        var teacherUserEmail = "teacher@example.com";
        var teacherUser = await userManager.FindByEmailAsync(teacherUserEmail);
        if (teacherUser == null)
        {
            teacherUser = new Account
            {
                UserName = teacherUserEmail,
                Email = teacherUserEmail,
                FirstName = "Zhelcho",
                MiddleName = "Ivanov",
                LastName = "Zhelev",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(teacherUser, "Test1234!");
        }

        var studentUserEmail = "student@example.com";
        var studentUser = await userManager.FindByEmailAsync(studentUserEmail);
        if (studentUser == null)
        {
            studentUser = new Account
            {
                UserName = studentUserEmail,
                Email = studentUserEmail,
                FirstName = "Ivan",
                MiddleName = "Petrov",
                LastName = "Dimitrov",
                EmailConfirmed = true,
            };
            await userManager.CreateAsync(studentUser, "Test1234!");
        }

        if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
        if (!await userManager.IsInRoleAsync(teacherUser, "Teacher"))
        {
            await userManager.AddToRoleAsync(teacherUser, "Teacher");
        }
        if (!await userManager.IsInRoleAsync(studentUser, "Student"))
        {
            await userManager.AddToRoleAsync(studentUser, "Student");
        }

        // Seed TeacherProfile for teacher user
        var teacherProfile = await context.TeacherProfiles
            .FirstOrDefaultAsync(tp => tp.AccountId == teacherUser.Id);
        if (teacherProfile == null)
        {
            teacherProfile = new TeacherProfile
            {
                Id = Guid.NewGuid().ToString(),
                AccountId = teacherUser.Id,
            };
            context.TeacherProfiles.Add(teacherProfile);
            await context.SaveChangesAsync();
        }

        // Seed StudentProfile for student user
        var studentProfile = await context.StudentProfiles
            .FirstOrDefaultAsync(sp => sp.AccountId == studentUser.Id);
        if (studentProfile == null)
        {
            studentProfile = new StudentProfile
            {
                Id = Guid.NewGuid(),
                AccountId = studentUser.Id,
                TeacherId = teacherProfile.Id,
            };
            context.StudentProfiles.Add(studentProfile);
            await context.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Seeds puzzles from the Lichess puzzle CSV.
    /// CSV format: PuzzleId,FEN,Moves,Rating,RatingDeviation,Popularity,NbPlays,Themes,GameUrl,OpeningTags
    /// Accepts either the plain .csv or the .csv.zst archive as downloaded from Lichess;
    /// the archive is decompressed on the fly, so only the lines actually read are unpacked.
    /// </summary>
    /// <summary>
    /// Yields the columns of every data row of the Lichess puzzle CSV (plain or .zst), skipping the header.
    /// </summary>
    private static async IAsyncEnumerable<string[]> ReadCsvRows(string csvPath)
    {
        await using var fileStream = File.OpenRead(csvPath);
        await using Stream csvStream = csvPath.EndsWith(".zst", StringComparison.OrdinalIgnoreCase)
            ? new DecompressionStream(fileStream)
            : fileStream;
        using var reader = new StreamReader(csvStream);

        await reader.ReadLineAsync(); // header

        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (string.IsNullOrWhiteSpace(line)) continue;
            var columns = line.Split(',');
            if (columns.Length >= 9) yield return columns;
        }
    }

    /// <summary>
    /// Puzzles seeded before the Rating column existed get their Lichess rating back by matching
    /// position + setup move against the CSV. They came from its first rows, so the scan stops early.
    /// </summary>
    private static async Task BackfillRatings(AppDbContext context, string csvPath)
    {
        var missing = await context.Puzzles
            .Where(p => p.Rating == null && p.PreviousMove != null)
            .ToListAsync();
        if (missing.Count == 0) return;

        var byKey = missing
            .GroupBy(p => $"{p.Fen}|{p.PreviousMove}")
            .ToDictionary(g => g.Key, g => g.ToList());

        var scanned = 0;
        await foreach (var columns in ReadCsvRows(csvPath))
        {
            if (byKey.Count == 0 || ++scanned > 100_000) break;

            var setupMove = columns[2].Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
            if (byKey.Remove($"{columns[1]}|{setupMove}", out var matches) && int.TryParse(columns[3], out var rating))
            {
                foreach (var puzzle in matches) puzzle.Rating = rating;
            }
        }

        await context.SaveChangesAsync();
        Console.WriteLine($"Backfilled ratings for {missing.Count(p => p.Rating != null)} of {missing.Count} puzzles.");
    }

    public static async Task SeedPuzzlesFromCSV(AppDbContext context, string csvPath, int count = 500)
    {
        // Puzzles seeded before PreviousMove existed kept Lichess's pre-setup-move FEN but lost the setup move,
        // leaving the opponent to move and the puzzle unsolvable. Drop them so they are reseeded correctly.
        var broken = (await context.Puzzles.Where(p => p.PreviousMove == null).ToListAsync())
            .Where(p => p.Fen.Split(' ').ElementAtOrDefault(1) != (p.WhiteToMove ? "w" : "b"))
            .ToList();
        if (broken.Count > 0)
        {
            Console.WriteLine($"Removing {broken.Count} puzzles seeded without their setup move...");
            context.Puzzles.RemoveRange(broken);
            await context.SaveChangesAsync();
        }

        if (!File.Exists(csvPath))
        {
            Console.WriteLine($"Puzzle CSV not found at: {csvPath}");
            Console.WriteLine("Download from: https://database.lichess.org/#puzzles");
            return;
        }

        await BackfillRatings(context, csvPath);

        if (await context.Puzzles.CountAsync() >= count)
        {
            Console.WriteLine($"Already have {await context.Puzzles.CountAsync()} puzzles, skipping seed.");
            return;
        }

        Console.WriteLine($"Seeding puzzles from {csvPath}...");

        var puzzles = new List<Puzzle>();
        var lineNumber = 0;
        var needed = count - await context.Puzzles.CountAsync();

        await foreach (var columns in ReadCsvRows(csvPath))
        {
            if (puzzles.Count >= needed) break;
            lineNumber++;

            try
            {
                var puzzleId = columns[0];
                var fen = columns[1];
                var moves = columns[2];     // space-separated UCI moves
                var rating = int.Parse(columns[3]);
                var themes = columns[7];

                var moveList = moves.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                if (moveList.Length < 2) continue; // Need at least setup move + 1 solution move

                // First move is the opponent's "setup" move; the rest are the solution
                var setupMove = moveList[0];
                var solutionMoves = string.Join(" ", moveList.Skip(1));

                // Determine who solves
                var fenParts = fen.Split(' ');
                if (fenParts.Length < 2) continue;
                var sideToMoveInFen = fenParts[1];
                // The side in FEN makes the setup move; after that, the OTHER side solves
                var whiteToMove = sideToMoveInFen == "b";
                var category = MapCategory(themes);
                var difficulty = MapDifficulty(rating);
                var points = MapPoints(rating);
                var sideToMove = whiteToMove ? "Белите" : "Черните";
                var description = $"{sideToMove} на ход. {category}.";

                puzzles.Add(new Puzzle
                {
                    Id = Guid.NewGuid(),
                    Number = 0, // assigned later in the ordering loop
                    Description = string.Empty,
                    Fen = fen,
                    PreviousMove = setupMove,
                    Solution = solutionMoves,
                    Difficulty = difficulty,
                    Points = points,
                    Rating = rating,
                    WhiteToMove = whiteToMove,
                    Category = category,
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Skipping line {lineNumber}: {ex.Message}");
            }
        }

        Console.WriteLine($"Parsed {puzzles.Count} puzzles. Saving to database...");

        // Order by enum value (category priority), then by points
        var ordered = puzzles
            .OrderBy(p => Enum.TryParse<CategoryEnum>(p.Category, ignoreCase: true, out var e) ? (int)e : 999)
            .ThenBy(p => p.Points)
            .ToList();

        var firstNumber = (await context.Puzzles.MaxAsync(p => (int?)p.Number) ?? 0) + 1;

        for (var i = 0; i < ordered.Count; i++)
        {
            var p = ordered[i];

            var bulgarianCategory = _themeToCategoryMap.TryGetValue(p.Category, out var mapped)
                ? mapped
                : p.Category;

            var sideText = p.WhiteToMove ? "Белите" : "Черните";

            p.Number = firstNumber + i;
            p.Description = $"{sideText} на ход. {bulgarianCategory}.";
            p.Category = bulgarianCategory;
        }

        context.Puzzles.AddRange(ordered);
        await context.SaveChangesAsync();

        Console.WriteLine($"Successfully seeded {ordered.Count} puzzles.");
    }
}