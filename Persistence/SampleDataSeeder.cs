using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

/// <summary>
/// Development-only sample data. Each seeder tops its entity up to a maximum count,
/// so it is safe to run on every startup and never duplicates data.
/// </summary>
public static class SampleDataSeeder
{
    private const string Password = "Test1234!";
    private const int MaxTeachers = 3;
    private const int MaxStudents = 20;
    private const int MaxLessons = 20;
    private const int MaxAnnouncements = 20;

    // Fixed seed keeps the generated data identical between runs and machines
    private static readonly Random _random = new(64);

    private static readonly (string First, string Middle, string Last, string Specialization, string Bio)[] _teachers =
    [
        ("Живко", "Петров", "Жеков", "Дебюти и стратегия",
            "Треньор в клуба от над 20 години. Работи с деца от всички възрасти - от първите стъпки до републиканските финали."),
        ("Мария", "Иванова", "Стоянова", "Тактика и ендшпил",
            "Международен майстор при жените. Вярва, че всеки ендшпил може да бъде красив."),
    ];

    private static readonly (string First, string Middle, string Last)[] _students =
    [
        ("Георги", "Николов", "Иванов"),
        ("Елена", "Димитрова", "Петрова"),
        ("Никола", "Стефанов", "Георгиев"),
        ("Виктория", "Иванова", "Колева"),
        ("Мартин", "Христов", "Тодоров"),
        ("Александра", "Петрова", "Стоянова"),
        ("Калоян", "Георгиев", "Димитров"),
        ("Йоана", "Николаева", "Атанасова"),
        ("Даниел", "Василев", "Попов"),
        ("Мила", "Тодорова", "Николова"),
        ("Борис", "Атанасов", "Кръстев"),
        ("Габриела", "Стоянова", "Маринова"),
        ("Теодор", "Димитров", "Янев"),
        ("Сияна", "Колева", "Радева"),
        ("Кристиан", "Маринов", "Методиев"),
        ("Дария", "Радева", "Илиева"),
        ("Самуил", "Илиев", "Ангелов"),
        ("Ивайла", "Ангелова", "Желязкова"),
        ("Преслав", "Желязков", "Костов"),
    ];

    private static readonly string[] _schools =
    [
        "ОУ \"Христо Ботев\"", "СУ \"Добри Чинтулов\"", "ПМГ \"Акад. Никола Обрешков\"",
        "ОУ \"Братя Миладинови\"", "Английска езикова гимназия \"Гео Милев\"", "СУ \"Иван Вазов\"",
    ];

    private static readonly string[] _neighbourhoods =
    [
        "ж.к. Лазур", "ж.к. Славейков", "ж.к. Изгрев", "ж.к. Меден рудник", "кв. Сарафово", "Центъра",
    ];

    private static readonly string[] _lessonTopics =
    [
        "Основни матови схеми", "Вилка и двоен удар", "Свръзка и разсвръзване", "Шиш и рентгенова атака",
        "Открит шах и двоен шах", "Принципи на дебюта", "Италианска партия", "Сицилианска защита",
        "Дамски гамбит", "Пешечни ендшпили: опозиция", "Правилото на квадрата", "Топовни ендшпили: позиция на Лусена",
        "Топовни ендшпили: позиция на Филидор", "Атака срещу рокирания цар", "Жертва за инициатива",
        "Слаби полета и аванпости", "Планиране в мителшпила", "Разбор на партии от турнира",
        "Бърз шах: управление на времето", "Решаване на задачи на време",
    ];

    private static readonly (string Title, string Description, string Text)[] _announcements =
    [
        ("Коледен турнир за деца", "Традиционният коледен турнир ще се проведе в клуба.",
            "<p>Каним всички деца до 14 години на <strong>традиционния коледен турнир</strong>. Системата е швейцарска, 7 кръга, контрола 15 минути + 5 секунди на ход.</p><p>Всички участници получават награди!</p>"),
        ("Нов сезон на занятията", "Занятията за новия сезон започват от понеделник.",
            "<p>Новият сезон започва от понеделник. Графикът на групите е обявен в профилите на учениците.</p>"),
        ("Успех на държавното първенство", "Наши ученици спечелиха три медала.",
            "<p>Поздравления за нашите състезатели, които спечелиха <strong>един златен и два бронзови медала</strong> на държавното индивидуално първенство за юноши и девойки.</p>"),
        ("Симултанен сеанс с гросмайстор", "Гросмайстор ще изнесе сеанс на 20 дъски.",
            "<p>Гостуващ гросмайстор ще изнесе симултанен сеанс срещу 20 членове на клуба. Желаещите да се запишат при треньорите.</p>"),
        ("Летен шахматен лагер", "Записванията за летния лагер в Приморско започнаха.",
            "<p>Летният лагер ще се проведе в Приморско в продължение на 7 дни. Програмата включва по две тренировки дневно, турнир и много забавления на плажа.</p>"),
        ("Промяна в работното време", "Клубът ще работи с променено работно време през празниците.",
            "<p>По време на празниците клубът ще бъде затворен от 24 до 27 декември. Занятията се възобновяват на 28 декември.</p>"),
        ("Отборно първенство на Бургас", "Клубът ще участва с два отбора.",
            "<p>На предстоящото отборно първенство на областта ще участваме с <strong>два отбора</strong>. Съставите ще бъдат обявени след контролния турнир.</p>"),
        ("Блиц турнир всеки петък", "Всеки петък вечер - блиц турнир за всички членове.",
            "<p>От този месец всеки петък от 18:00 ч. организираме блиц турнир с контрола 3+2. Вход свободен за членове на клуба.</p>"),
        ("Нови шахматни задачи в сайта", "Добавихме 500 нови задачи от базата на Lichess.",
            "<p>В раздел <em>Задачи</em> вече има 500 нови задачи, подредени по категории и трудност. Решавайте и трупайте точки!</p>"),
        ("Шахмат в училище", "Стартира проект за шахмат в три бургаски училища.",
            "<p>Съвместно с общината стартираме проект за шахматни занимания в три бургаски училища. Треньорите на клуба ще водят часовете.</p>"),
        ("Международен турнир \"Бургас Оупън\"", "Регистрацията за турнира е отворена.",
            "<p>Регистрацията за международния турнир <strong>Бургас Оупън</strong> е отворена. Турнирът е с FIDE рейтинг и награден фонд.</p>"),
        ("Благодарим на нашите спонсори", "Нови шахматни часовници и дъски за клуба.",
            "<p>Благодарение на нашите спонсори клубът се сдоби с 15 нови електронни часовника и турнирни комплекти.</p>"),
        ("Родителска среща", "Среща с родителите на учениците от начинаещите групи.",
            "<p>Каним родителите на учениците от начинаещите групи на среща, на която ще обсъдим напредъка и плановете за сезона.</p>"),
        ("Шампион на клуба за годината", "Обявяваме победителя в годишната класация.",
            "<p>След 12 месечни турнира победителят в годишната класация на клуба е определен. Церемонията по награждаването ще бъде на коледното парти.</p>"),
        ("Онлайн турнир в Lichess", "Отборът на клуба в Lichess организира турнир всяка неделя.",
            "<p>Присъединете се към отбора на клуба в Lichess! Всяка неделя от 17:00 ч. играем арена турнир.</p>"),
        ("Нова група за възрастни", "Сформираме група за възрастни начинаещи.",
            "<p>По ваше желание сформираме група за възрастни, които искат да научат или да подобрят играта си. Занятията са веднъж седмично.</p>"),
        ("Лекция: Как да анализираме партиите си", "Открита лекция за всички членове.",
            "<p>Треньорите ще покажат как да анализирате собствените си партии с помощта на шахматни програми и без тях.</p>"),
        ("Резултати от пролетния турнир", "Вижте класирането от пролетния турнир.",
            "<p>Пролетният турнир събра 46 участници. Благодарим на всички за чудесната атмосфера и честитим на призьорите!</p>"),
        ("Шахматът и математиката", "Семинар за връзката между шахмата и логическото мислене.",
            "<p>Поканени сте на семинар, посветен на ползите от шахмата за развитието на логическото и математическото мислене при децата.</p>"),
        ("Членски внос за новия сезон", "Информация за членския внос.",
            "<p>Членският внос за новия сезон може да бъде платен при треньорите или по банков път. За братя и сестри има отстъпка.</p>"),
    ];

    public static async Task SeedAsync(UserManager<Account> userManager, AppDbContext context)
    {
        await SeedTeachers(userManager, context);
        await SeedStudents(userManager, context);
        await SeedLessons(context);
        await SeedAnnouncements(context);
    }

    private static async Task<Account?> CreateAccount(UserManager<Account> userManager,
        string email, string first, string middle, string last, string role)
    {
        if (await userManager.FindByEmailAsync(email) != null) return null;

        var account = new Account
        {
            UserName = email,
            Email = email,
            FirstName = first,
            MiddleName = middle,
            LastName = last,
            EmailConfirmed = true,
        };

        var result = await userManager.CreateAsync(account, Password);
        if (!result.Succeeded)
        {
            Console.WriteLine($"Could not seed {email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            return null;
        }

        await userManager.AddToRoleAsync(account, role);
        return account;
    }

    private static async Task SeedTeachers(UserManager<Account> userManager, AppDbContext context)
    {
        var existing = (await userManager.GetUsersInRoleAsync("Teacher")).Count;

        for (var i = 0; i < _teachers.Length && existing < MaxTeachers; i++)
        {
            var t = _teachers[i];
            var account = await CreateAccount(userManager, $"teacher{i + 2}@example.com", t.First, t.Middle, t.Last, "Teacher");
            if (account == null) continue;

            context.TeacherProfiles.Add(new TeacherProfile
            {
                AccountId = account.Id,
                Bio = t.Bio,
                Specialization = t.Specialization,
            });
            existing++;
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedStudents(UserManager<Account> userManager, AppDbContext context)
    {
        var existing = (await userManager.GetUsersInRoleAsync("Student")).Count;
        var teacherIds = await context.TeacherProfiles.OrderBy(t => t.Id).Select(t => t.Id).ToListAsync();

        for (var i = 0; i < _students.Length && existing < MaxStudents; i++)
        {
            var s = _students[i];
            var account = await CreateAccount(userManager, $"student{i + 2}@example.com", s.First, s.Middle, s.Last, "Student");
            if (account == null) continue;

            var age = _random.Next(7, 18);
            context.StudentProfiles.Add(new StudentProfile
            {
                AccountId = account.Id,
                BirthDate = DateTime.UtcNow.Date.AddYears(-age).AddDays(-_random.Next(0, 365)),
                School = _schools[_random.Next(_schools.Length)],
                Address = $"Бургас, {_neighbourhoods[_random.Next(_neighbourhoods.Length)]}",
                PhoneNumber = $"08{_random.Next(7, 10)} {_random.Next(100, 1000)} {_random.Next(100, 1000)}",
                DateOfJoiningClub = DateTime.UtcNow.Date.AddMonths(-_random.Next(1, 48)),
                ClubRating = _random.Next(800, 1900),
                FideRating = age >= 12 && _random.Next(3) == 0 ? _random.Next(1400, 2100) : null,
                PuzzlePoints = 0,
                IsFiled = _random.Next(4) != 0,
                TeacherId = teacherIds.Count > 0 ? teacherIds[i % teacherIds.Count] : null,
            });
            existing++;
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedLessons(AppDbContext context)
    {
        var existing = await context.Lessons.CountAsync();
        if (existing >= MaxLessons) return;

        var teachers = await context.TeacherProfiles
            .Include(t => t.Students)
            .OrderBy(t => t.Id)
            .ToListAsync();
        if (teachers.Count == 0) return;

        // Spread lessons across the past ~6 weeks and the next ~2 weeks, at 17:30 local club time
        var firstLesson = DateTime.UtcNow.Date.AddDays(-45).AddHours(14.5);

        for (var i = existing; i < MaxLessons; i++)
        {
            var teacher = teachers[i % teachers.Count];
            var start = firstLesson.AddDays(i * 3);
            var isPast = start < DateTime.UtcNow;

            var lesson = new Lesson
            {
                Topic = _lessonTopics[i % _lessonTopics.Length],
                StartingTime = start,
                Notes = isPast ? "Домашна работа: решете 5 задачи по темата." : null,
                TeacherId = teacher.Id,
            };

            foreach (var student in teacher.Students)
            {
                lesson.LessonStudents.Add(new LessonStudent
                {
                    LessonId = lesson.Id,
                    StudentId = student.Id,
                    IsPresent = isPast && _random.Next(5) != 0,
                });
            }

            context.Lessons.Add(lesson);
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedAnnouncements(AppDbContext context)
    {
        var existing = await context.Announcements.CountAsync();
        if (existing >= MaxAnnouncements) return;

        for (var i = existing; i < MaxAnnouncements; i++)
        {
            var a = _announcements[i % _announcements.Length];
            context.Announcements.Add(new Announcement
            {
                Title = a.Title,
                Description = a.Description,
                Text = a.Text,
                // Newest first: roughly one announcement per week going back in time
                Date = DateTime.UtcNow.AddDays(-7 * i - _random.Next(0, 5)).AddHours(-_random.Next(0, 10)),
            });
        }

        await context.SaveChangesAsync();
    }
}
