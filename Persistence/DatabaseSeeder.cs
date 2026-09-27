using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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

    /// <summary>
    /// Applies the opponent's first move to the FEN to get the actual puzzle starting position.
    /// In the Lichess CSV, the FEN is BEFORE the opponent's last move,
    /// and Moves[0] is the opponent's move. The puzzle starts AFTER that move.
    /// </summary>
    private static (string fen, bool whiteToMove)? ApplyFirstMove(string fen, string firstMoveUci)
    {
        // Simple approach: determine who moves from FEN, flip the side
        // The actual FEN after applying the move requires a chess library.
        // For seeding, we'll use the FEN as-is and skip the first move in the solution.
        // The FEN's active color tells us who MADE the last move's opponent,
        // so after the opponent moves, it's the OTHER side's turn.

        var parts = fen.Split(' ');
        if (parts.Length < 2) return null;

        // In the CSV: FEN has side X to move, Moves[0] is X's move (the "setup" move)
        // After Moves[0], the puzzle solver (side Y) needs to find Moves[1], Moves[2], etc.
        var sideInFen = parts[1]; // 'w' or 'b'
        // After the opponent (sideInFen) moves, the solver is the OTHER side
        var whiteToMove = sideInFen == "b"; // if black was to move in FEN, white solves

        return (fen, whiteToMove);
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
    /// </summary>
    public static async Task SeedPuzzlesFromCSV(AppDbContext context, string csvPath, int count = 500)
    {
        if (await context.Puzzles.CountAsync() >= count)
        {
            Console.WriteLine($"Already have {await context.Puzzles.CountAsync()} puzzles, skipping seed.");
            return;
        }

        if (!File.Exists(csvPath))
        {
            Console.WriteLine($"Puzzle CSV not found at: {csvPath}");
            Console.WriteLine("Download from: https://database.lichess.org/#puzzles");
            return;
        }

        Console.WriteLine($"Seeding puzzles from {csvPath}...");

        var puzzles = new List<Puzzle>();
        var lineNumber = 0;

        using var reader = new StreamReader(csvPath);

        // Skip header
        await reader.ReadLineAsync();

        string? line;
        while ((line = await reader.ReadLineAsync()) != null && puzzles.Count < count)
        {
            lineNumber++;
            if (string.IsNullOrWhiteSpace(line)) continue;

            try
            {
                var columns = line.Split(',');
                if (columns.Length < 9) continue;

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
                    Solution = solutionMoves,
                    Difficulty = difficulty,
                    Points = points,
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

        for (var i = 0; i < ordered.Count; i++)
        {
            var p = ordered[i];

            var bulgarianCategory = _themeToCategoryMap.TryGetValue(p.Category, out var mapped)
                ? mapped
                : p.Category;

            var sideText = p.WhiteToMove ? "Белите" : "Черните";

            p.Number = i + 1;
            p.Description = $"{sideText} на ход. {bulgarianCategory}.";
            p.Category = bulgarianCategory;
        }

        context.Puzzles.AddRange(ordered);
        await context.SaveChangesAsync();

        Console.WriteLine($"Successfully seeded {ordered.Count} puzzles.");
    }
}