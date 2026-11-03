using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Notifications;
using SchoolManagement.Domain.Relations;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Infrastructure;

public static class InitializerExtensions
{
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var initializer = scope.ServiceProvider.GetRequiredService<ContextInitializer>();
        await initializer.InitializeAsync();
        await initializer.SeedAsync();
    }
}

public class ContextInitializer
{
    private const string DemoPassword = "Admin123!";

    private readonly Context _context;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ILogger<ContextInitializer> _logger;

    public ContextInitializer(
        Context context,
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<ContextInitializer> logger)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        try { await _context.Database.MigrateAsync(); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try { await TrySeedAsync(); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while seeding the database.");
            throw;
        }
    }

    // -------------------------------------------------------------
    // SEED PRINCIPAL
    // -------------------------------------------------------------
    private async Task TrySeedAsync()
    {
        await SeedRolesAsync();
        var institution = await SeedInstitutionAsync();

        // ---------- Usuarios base ----------
        var superAdmin = await SeedUserAsync("superadmin", Roles.SuperAdmin, DemoPassword);
        var director = await SeedUserAsync("director.juan.gomez", Roles.Director, DemoPassword);
        var maintenance = await SeedUserAsync("mantenimiento.pedro.lopez", Roles.Maintenance, DemoPassword);
        var secretary = await SeedUserAsync("secretaria.ana.ruiz", Roles.Secretary, DemoPassword);
        var yearHeadUser = await SeedUserAsync("jefe.maria.soto", Roles.YearHead, DemoPassword);

        // ---------- Perfiles de staff ----------
        await SeedDirectorAsync(director, institution, "Juan Gomez");
        await SeedMaintenanceAsync(maintenance, institution, "Pedro Lopez");
        await SeedSecretaryAsync(secretary, institution, "Ana Ruiz");
        await SeedYearHeadAsync(yearHeadUser, institution, "Maria Soto");

        // ---------- Cursos (3) ----------
        var courses = await SeedCoursesAsync(institution);

        // ---------- Aulas (5) ----------
        var classRooms = await SeedClassRoomsAsync(institution);

        // ---------- Asignaturas (6) ----------
        var subjects = await SeedSubjectsAsync(institution, classRooms);

        // ---------- Profesores (5) ----------
        var professors = await SeedProfessorsAsync(institution, subjects);

        // ---------- Estudiantes (15) ----------
        var students = await SeedStudentsAsync(institution, courses);

        // ---------- Medios ----------
        var techMeans = await SeedTechMeansAsync(institution);
        var auxMeans = await SeedAuxMeansAsync(institution);

        // ---------- Relaciones ----------
        await SeedClassRoomTechMeansAsync(classRooms, techMeans);
        await SeedSubjectAuxMeansAsync(subjects, auxMeans);
        await SeedProfessorSubjectsAsync(professors, subjects);
        await SeedStudentSubjectsAsync(students, subjects);
        await SeedProfessorStudentSubjectsAsync(professors, students, subjects);
        await SeedSchedulesAsync(subjects, professors, classRooms);
        await SeedAttendancesAsync(subjects, students);
        await SeedProfessorEvaluationsAsync(professors, students);
        await SeedNotificationsAsync(director, secretary, professors, students);
        await SeedAuditLogsAsync(director, superAdmin, secretary);

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "✅ Seed completo. Usuarios de prueba con password: {Password}. " +
            "Cursos: {Courses}, Aulas: {Rooms}, Asignaturas: {Subjects}, Profesores: {Profs}, Estudiantes: {Studs}",
            DemoPassword, courses.Count, classRooms.Count, subjects.Count, professors.Count, students.Count);
    }

    // -------------------------------------------------------------
    // Roles e institución
    // -------------------------------------------------------------
    private async Task SeedRolesAsync()
    {
        foreach (var role in Roles.All)
        {
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    private async Task<Institution> SeedInstitutionAsync()
    {
        var existing = await _context.Institutions.FirstOrDefaultAsync(i => i.Domain == "lyra.local");
        if (existing is not null) return existing;

        var institution = new Institution
        {
            Name = "Colegio LYRA",
            Domain = "lyra.local",
            Email = "contacto@lyra.local",
            Phone = "+53 5555-1234",
            Plan = InstitutionPlan.Premium,
            Status = InstitutionStatus.Active
        };
        _context.Institutions.Add(institution);
        await _context.SaveChangesAsync();
        return institution;
    }

    // -------------------------------------------------------------
    // Usuarios
    // -------------------------------------------------------------
    private async Task<User> SeedUserAsync(string userName, string role, string password)
    {
        var existing = await _userManager.FindByNameAsync(userName);
        if (existing is not null) return existing;

        var user = new User { UserName = userName, Email = $"{userName}@lyra.local" };
        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            throw new InvalidOperationException(
                $"No se pudo crear {userName}: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        await _userManager.AddToRoleAsync(user, role);
        return user;
    }

    // -------------------------------------------------------------
    // Normalización de nombres para UserName
    // -------------------------------------------------------------
    private static string NormalizeUserName(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "x";

        var decomposed = value.Normalize(System.Text.NormalizationForm.FormD);
        var filtered = new string(decomposed
            .Where(c => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c)
                        != System.Globalization.UnicodeCategory.NonSpacingMark)
            .Where(char.IsLetterOrDigit)
            .ToArray());

        return string.IsNullOrWhiteSpace(filtered) ? "x" : filtered.ToLowerInvariant();
    }

    // -------------------------------------------------------------
    // Perfiles
    // -------------------------------------------------------------
    private async Task SeedDirectorAsync(User user, Institution institution, string name)
    {
        if (await _context.Administrators.AnyAsync(a => a.UserId == user.Id)) return;
        _context.Administrators.Add(new Administrator
        {
            UserId = user.Id,
            AdminName = name,
            AdminSalary = 5000,
            IdInstitution = institution.IdInstitution
        });
        await _context.SaveChangesAsync();
    }

    private async Task SeedMaintenanceAsync(User user, Institution institution, string name)
    {
        if (await _context.MaintenanceWorkers.AnyAsync(m => m.UserId == user.Id)) return;
        _context.MaintenanceWorkers.Add(new MaintenanceWorker
        {
            UserId = user.Id,
            NameMaint = name,
            SalaryMaint = 2500,
            IdInstitution = institution.IdInstitution
        });
        await _context.SaveChangesAsync();
    }

    private async Task SeedSecretaryAsync(User user, Institution institution, string name)
    {
        if (await _context.Secretaries.AnyAsync(s => s.UserId == user.Id)) return;
        _context.Secretaries.Add(new Secretary
        {
            UserId = user.Id,
            NameS = name,
            SalaryS = 3000,
            IdInstitution = institution.IdInstitution
        });
        await _context.SaveChangesAsync();
    }

    private async Task SeedYearHeadAsync(User user, Institution institution, string name)
    {
        if (await _context.YearHeads.AnyAsync(y => y.UserId == user.Id)) return;
        _context.YearHeads.Add(new YearHead
        {
            UserId = user.Id,
            NameYearHead = name,
            IdInstitution = institution.IdInstitution
        });
        await _context.SaveChangesAsync();
    }

    // -------------------------------------------------------------
    // Cursos
    // -------------------------------------------------------------
    private async Task<List<Course>> SeedCoursesAsync(Institution institution)
    {
        var existing = await _context.Courses
            .Where(c => c.IdInstitution == institution.IdInstitution)
            .ToListAsync();
        if (existing.Count >= 3) return existing;

        var names = new[] { "2023-2024", "2024-2025", "2025-2026" };
        foreach (var name in names)
        {
            if (existing.Any(c => c.CourseName == name)) continue;
            _context.Courses.Add(new Course
            {
                CourseName = name,
                IdInstitution = institution.IdInstitution
            });
        }
        await _context.SaveChangesAsync();
        return await _context.Courses
            .Where(c => c.IdInstitution == institution.IdInstitution)
            .ToListAsync();
    }

    // -------------------------------------------------------------
    // Aulas (5)
    // -------------------------------------------------------------
    private async Task<List<ClassRoom>> SeedClassRoomsAsync(Institution institution)
    {
        var existing = await _context.ClassRooms
            .Where(c => c.IdInstitution == institution.IdInstitution)
            .ToListAsync();
        if (existing.Count >= 5) return existing;

        var rooms = new[]
        {
            new { Location = "Aula 101", Capacity = 30 },
            new { Location = "Aula 102", Capacity = 28 },
            new { Location = "Laboratorio 201", Capacity = 20 },
            new { Location = "Laboratorio 202", Capacity = 20 },
            new { Location = "Biblioteca", Capacity = 50 }
        };

        foreach (var room in rooms)
        {
            if (existing.Any(c => c.Location == room.Location)) continue;
            _context.ClassRooms.Add(new ClassRoom
            {
                Location = room.Location,
                Capacity = room.Capacity,
                IsAviable = true,
                IdInstitution = institution.IdInstitution
            });
        }
        await _context.SaveChangesAsync();
        return await _context.ClassRooms
            .Where(c => c.IdInstitution == institution.IdInstitution)
            .ToListAsync();
    }

    // -------------------------------------------------------------
    // Asignaturas (6)
    // -------------------------------------------------------------
    private async Task<List<Subject>> SeedSubjectsAsync(
        Institution institution, List<ClassRoom> classRooms)
    {
        var existing = await _context.Subjects
            .Where(s => s.IdInstitution == institution.IdInstitution)
            .ToListAsync();
        if (existing.Count >= 6) return existing;

        var defs = new[]
        {
            new { Name = "Matemáticas", Program = "1ro", Load = 4 },
            new { Name = "Física", Program = "1ro", Load = 3 },
            new { Name = "Química", Program = "2do", Load = 3 },
            new { Name = "Historia", Program = "2do", Load = 2 },
            new { Name = "Lengua", Program = "1ro", Load = 4 },
            new { Name = "Inglés", Program = "1ro", Load = 3 }
        };

        for (int i = 0; i < defs.Length; i++)
        {
            var def = defs[i];
            if (existing.Any(s => s.NameSub == def.Name)) continue;
            var room = classRooms[i % classRooms.Count];
            _context.Subjects.Add(new Subject
            {
                NameSub = def.Name,
                StudyProgram = def.Program,
                CourseLoad = def.Load,
                IdClassRoom = room.IdClassR,
                IdInstitution = institution.IdInstitution
            });
        }
        await _context.SaveChangesAsync();
        return await _context.Subjects
            .Where(s => s.IdInstitution == institution.IdInstitution)
            .ToListAsync();
    }

    // -------------------------------------------------------------
    // Profesores (5)
    // -------------------------------------------------------------
    private async Task<List<Professor>> SeedProfessorsAsync(
        Institution institution, List<Subject> subjects)
    {
        var existing = await _context.Professors
            .Where(p => p.IdInstitution == institution.IdInstitution)
            .ToListAsync();
        if (existing.Count >= 5) return existing;

        var defs = new[]
        {
            new { User = "prof.juan.gomez", Name = "Juan Gomez", Spec = "Matemáticas", IsDean = true },
            new { User = "prof.maria.lopez", Name = "Maria Lopez", Spec = "Física", IsDean = false },
            new { User = "prof.carlos.diaz", Name = "Carlos Diaz", Spec = "Química", IsDean = false },
            new { User = "prof.laura.perez", Name = "Laura Perez", Spec = "Historia", IsDean = false },
            new { User = "prof.diego.ramirez", Name = "Diego Ramirez", Spec = "Inglés", IsDean = false }
        };

        foreach (var def in defs)
        {
            var user = await _userManager.FindByNameAsync(def.User);
            if (user is null)
            {
                user = await SeedUserAsync(def.User, Roles.Professor, DemoPassword);
            }

            if (existing.Any(p => p.UserId == user.Id)) continue;

            _context.Professors.Add(new Professor
            {
                UserId = user.Id,
                NameProf = def.Name,
                Contract = "Tiempo Completo",
                Spec = def.Spec,
                Salary = 4000,
                IsDean = def.IsDean,
                LaboralExperience = 8,
                UseAuxMean = false,
                IdInstitution = institution.IdInstitution
            });
        }
        await _context.SaveChangesAsync();
        return await _context.Professors
            .Where(p => p.IdInstitution == institution.IdInstitution)
            .ToListAsync();
    }

    // -------------------------------------------------------------
    // Estudiantes (15) — CON NORMALIZACIÓN
    // -------------------------------------------------------------
    private async Task<List<Student>> SeedStudentsAsync(
        Institution institution, List<Course> courses)
    {
        var existing = await _context.Students
            .Where(s => s.IdInstitution == institution.IdInstitution)
            .ToListAsync();
        if (existing.Count >= 15) return existing;

        var firstNames = new[] { "Pedro", "Ana", "Luis", "Lucía", "Jorge", "Carla", "Miguel", "Sofía", "Andrés", "Valeria", "Diego", "Camila", "Mateo", "Isabella", "Daniel" };
        var lastNames = new[] { "Torres", "Ruiz", "Soto", "Martínez", "García", "Rodríguez", "Pérez", "Sánchez", "Ramírez", "Cruz", "Flores", "Morales", "Ortiz", "Gómez", "Díaz" };

        for (int i = 0; i < firstNames.Length; i++)
        {
            // NORMALIZAR: sin tildes, minúsculas, solo letras/dígitos
            var normalizedFirst = NormalizeUserName(firstNames[i]);
            var normalizedLast = NormalizeUserName(lastNames[i]);
            var userName = $"alumno.{normalizedFirst}.{normalizedLast}";

            var user = await _userManager.FindByNameAsync(userName);
            if (user is null)
            {
                user = await SeedUserAsync(userName, Roles.Student, DemoPassword);
            }

            if (existing.Any(s => s.UserId == user.Id)) continue;

            var course = courses[i % courses.Count];

            _context.Students.Add(new Student
            {
                UserId = user.Id,
                Name1 = firstNames[i],
                LastName1 = lastNames[i],
                LastName2 = null,
                BirthDate = new DateTime(2010, (i % 12) + 1, (i % 28) + 1),
                Gender = i % 2 == 0 ? "Masculino" : "Femenino",
                DocType = "DNI",
                DocNumber = $"DNI{Guid.NewGuid():N}".Substring(0, 12),
                Email = $"{userName}@lyra.local",
                Phone = $"+53 5555-{i:D4}",
                Address = $"Calle {i + 1}, Ciudad",
                Level = "Secundaria",
                Grade = ((i % 3) + 1) + "ro",
                Section = i % 2 == 0 ? "A" : "B",
                AdmissionDate = DateTime.UtcNow.AddMonths(-(i + 1)),
                AcademicYear = course.CourseName,
                InitialStatus = "Nuevo",
                TutorName = $"Tutor {lastNames[i]}",
                TutorPhone = $"+53 5555-9{i:D3}",
                EmergencyContact = $"Emergencia {lastNames[i]}",
                IsActive = true,
                IdC = course.IdC,
                IdInstitution = institution.IdInstitution
            });
        }
        await _context.SaveChangesAsync();
        return await _context.Students
            .Where(s => s.IdInstitution == institution.IdInstitution)
            .ToListAsync();
    }

    // -------------------------------------------------------------
    // Medios
    // -------------------------------------------------------------
    private async Task<List<TechnologicalMeans>> SeedTechMeansAsync(Institution institution)
    {
        var existing = await _context.TechnologicalMeans
            .Where(t => t.IdInstitution == institution.IdInstitution)
            .ToListAsync();
        if (existing.Count >= 3) return existing;

        var names = new[] { "Proyector Epson", "PC de escritorio", "Tablet Samsung" };
        foreach (var name in names)
        {
            if (existing.Any(t => t.NameMean == name)) continue;
            _context.TechnologicalMeans.Add(new TechnologicalMeans
            {
                NameMean = name,
                State = "Bueno",
                IsAviable = true,
                IsActive = true,
                IdInstitution = institution.IdInstitution
            });
        }
        await _context.SaveChangesAsync();
        return await _context.TechnologicalMeans
            .Where(t => t.IdInstitution == institution.IdInstitution)
            .ToListAsync();
    }

    private async Task<List<AuxiliaryMeans>> SeedAuxMeansAsync(Institution institution)
    {
        var existing = await _context.AuxiliaryMeans
            .Where(a => a.IdInstitution == institution.IdInstitution)
            .ToListAsync();
        if (existing.Count >= 3) return existing;

        var defs = new[]
        {
            new { Name = "Pizarra Blanca", Type = "Pizarra" },
            new { Name = "Marcador", Type = "Marcador" },
            new { Name = "Borrador", Type = "Borrador" }
        };
        foreach (var def in defs)
        {
            if (existing.Any(a => a.NameMean == def.Name)) continue;
            _context.AuxiliaryMeans.Add(new AuxiliaryMeans
            {
                NameMean = def.Name,
                State = "Bueno",
                Type = def.Type,
                IsAviable = true,
                IsActive = true,
                IdInstitution = institution.IdInstitution
            });
        }
        await _context.SaveChangesAsync();
        return await _context.AuxiliaryMeans
            .Where(a => a.IdInstitution == institution.IdInstitution)
            .ToListAsync();
    }

    // -------------------------------------------------------------
    // Relaciones N:N
    // -------------------------------------------------------------
    private async Task SeedClassRoomTechMeansAsync(
        List<ClassRoom> classRooms, List<TechnologicalMeans> means)
    {
        if (await _context.ClassRoomTechMeans.AnyAsync()) return;
        for (int i = 0; i < Math.Min(classRooms.Count, means.Count); i++)
        {
            _context.ClassRoomTechMeans.Add(new ClassRoomTechMean
            {
                IdClassRoom = classRooms[i].IdClassR,
                IdTechMean = means[i].IdMean
            });
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedSubjectAuxMeansAsync(
        List<Subject> subjects, List<AuxiliaryMeans> means)
    {
        if (await _context.SubjectAuxMeans.AnyAsync()) return;
        for (int i = 0; i < Math.Min(subjects.Count, means.Count); i++)
        {
            _context.SubjectAuxMeans.Add(new SubjectAuxMean
            {
                IdSub = subjects[i].IdSub,
                IdAuxMean = means[i].IdMean
            });
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedProfessorSubjectsAsync(
        List<Professor> professors, List<Subject> subjects)
    {
        if (await _context.ProfessorSubjects.AnyAsync()) return;
        for (int i = 0; i < subjects.Count; i++)
        {
            var professor = professors[i % professors.Count];
            _context.ProfessorSubjects.Add(new ProfessorSubject
            {
                IdProf = professor.IdProf,
                IdSub = subjects[i].IdSub
            });
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedStudentSubjectsAsync(
        List<Student> students, List<Subject> subjects)
    {
        if (await _context.StudentSubjects.AnyAsync()) return;
        foreach (var student in students)
        {
            var taken = subjects.OrderBy(_ => Guid.NewGuid()).Take(3).ToList();
            foreach (var subject in taken)
            {
                _context.StudentSubjects.Add(new StudentSubject
                {
                    IdStud = student.IdStud,
                    IdSub = subject.IdSub,
                    NJAbsents = 0
                });
            }
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedProfessorStudentSubjectsAsync(
        List<Professor> professors, List<Student> students, List<Subject> subjects)
    {
        if (await _context.ProfessorStudentSubjects.AnyAsync()) return;

        var professorSubjects = await _context.ProfessorSubjects.ToListAsync();
        var studentSubjects = await _context.StudentSubjects.ToListAsync();
        var random = new Random(42);

        foreach (var ps in professorSubjects)
        {
            var matching = studentSubjects.Where(ss => ss.IdSub == ps.IdSub).ToList();
            foreach (var ss in matching)
            {
                if (await _context.ProfessorStudentSubjects
                    .AnyAsync(p => p.IdProf == ps.IdProf && p.IdStudSub == ss.IdStudSub))
                    continue;

                _context.ProfessorStudentSubjects.Add(new ProfessorStudentSubject
                {
                    IdProf = ps.IdProf,
                    IdStudSub = ss.IdStudSub,
                    StudentGrades = random.Next(5, 11)
                });
            }
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedSchedulesAsync(
        List<Subject> subjects, List<Professor> professors, List<ClassRoom> classRooms)
    {
        if (await _context.Schedules.AnyAsync()) return;

        var days = new[] { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday };
        var times = new[] { new TimeSpan(8, 0, 0), new TimeSpan(10, 0, 0), new TimeSpan(14, 0, 0) };

        for (int i = 0; i < subjects.Count; i++)
        {
            var subject = subjects[i];
            var professor = professors[i % professors.Count];
            var room = classRooms[i % classRooms.Count];

            for (int j = 0; j < 2; j++)
            {
                _context.Schedules.Add(new Schedule
                {
                    IdSub = subject.IdSub,
                    IdProf = professor.IdProf,
                    IdClassR = room.IdClassR,
                    Day = days[(i + j) % days.Length],
                    StartTime = times[(i + j) % times.Length],
                    EndTime = times[(i + j) % times.Length].Add(TimeSpan.FromMinutes(90))
                });
            }
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedAttendancesAsync(
        List<Subject> subjects, List<Student> students)
    {
        if (await _context.Attendances.AnyAsync()) return;

        var random = new Random(7);
        var today = DateTime.UtcNow.Date;

        for (int d = 0; d < 5; d++)
        {
            var date = today.AddDays(-d);
            if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday) continue;

            foreach (var student in students)
            {
                var studentSubjects = await _context.StudentSubjects
                    .Where(ss => ss.IdStud == student.IdStud)
                    .ToListAsync();

                foreach (var ss in studentSubjects)
                {
                    var status = random.Next(0, 10) < 9
                        ? AttendanceStatus.Present
                        : (random.Next(0, 2) == 0 ? AttendanceStatus.Absent : AttendanceStatus.Late);

                    _context.Attendances.Add(new Attendance
                    {
                        IdSub = ss.IdSub,
                        IdStud = student.IdStud,
                        Date = date,
                        Status = status
                    });
                }
            }
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedProfessorEvaluationsAsync(
        List<Professor> professors, List<Student> students)
    {
        if (await _context.ProfessorEvaluations.AnyAsync()) return;

        var random = new Random(11);
        var comments = new[]
        {
            "Excelente docente, explica muy bien.",
            "Muy claro en sus explicaciones.",
            "Podría mejorar la dinámica de clase.",
            "Buen manejo de la asignatura.",
            "Los ejercicios son muy útiles."
        };

        foreach (var student in students)
        {
            var chosen = professors.OrderBy(_ => Guid.NewGuid()).Take(2).ToList();
            foreach (var prof in chosen)
            {
                if (await _context.ProfessorEvaluations
                    .AnyAsync(e => e.IdProf == prof.IdProf && e.IdStud == student.IdStud))
                    continue;

                _context.ProfessorEvaluations.Add(new ProfessorEvaluation
                {
                    IdProf = prof.IdProf,
                    IdStud = student.IdStud,
                    Rating = random.Next(3, 6),
                    Comment = comments[random.Next(comments.Length)],
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                });
            }
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedNotificationsAsync(
        User director, User secretary, List<Professor> professors, List<Student> students)
    {
        if (await _context.Notifications.AnyAsync()) return;

        await AddNotification(director.Id, "Bienvenido a LYRA", "Tu cuenta ha sido creada exitosamente.", NotificationType.Success, "system");
        await AddNotification(director.Id, "Reunión de claustro", "La reunión de claustro será el viernes a las 15:00.", NotificationType.Info, "events");
        await AddNotification(director.Id, "Reporte mensual disponible", "El reporte de octubre ya está disponible.", NotificationType.Info, "reports");

        await AddNotification(secretary.Id, "Bienvenido a LYRA", "Tu cuenta ha sido creada exitosamente.", NotificationType.Success, "system");
        await AddNotification(secretary.Id, "Nuevas matrículas pendientes", "Hay 3 matrículas pendientes de revisión.", NotificationType.Warning, "enrollments");

        foreach (var prof in professors)
        {
            var user = await _userManager.FindByIdAsync(prof.UserId);
            if (user is null) continue;
            await AddNotification(user.Id, "Bienvenido a LYRA", "Tu cuenta ha sido creada exitosamente.", NotificationType.Success, "system");
            await AddNotification(user.Id, "Notas pendientes", "Tienes notas pendientes de calificar.", NotificationType.Warning, "grades");
        }

        foreach (var student in students)
        {
            var user = await _userManager.FindByIdAsync(student.UserId);
            if (user is null) continue;
            await AddNotification(user.Id, "Bienvenido a LYRA", "Tu cuenta ha sido creada exitosamente.", NotificationType.Success, "system");
            await AddNotification(user.Id, "Calificaciones disponibles", "Ya puedes consultar tus calificaciones del mes.", NotificationType.Info, "grades");
        }
    }

    private async Task AddNotification(string userId, string title, string message, NotificationType type, string module)
    {
        _context.Notifications.Add(new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            Module = module,
            IsRead = false,
            CreatedAt = DateTime.UtcNow.AddMinutes(-new Random().Next(1, 1440))
        });
        await _context.SaveChangesAsync();
    }

    private async Task SeedAuditLogsAsync(
        User director, User superAdmin, User secretary)
    {
        if (await _context.AuditLogs.AnyAsync()) return;

        var random = new Random(17);
        var actions = new[] { "Login", "Create", "Update", "Delete", "View" };
        var modules = new[] { "Auth", "Students", "Professors", "Subjects", "ClassRooms", "Grades", "Attendance" };

        var users = new[] { director, superAdmin, secretary };
        foreach (var user in users)
        {
            for (int i = 0; i < 5; i++)
            {
                _context.AuditLogs.Add(new AuditLog
                {
                    UserId = user.Id,
                    UserName = user.UserName ?? "unknown",
                    Action = actions[random.Next(actions.Length)],
                    Module = modules[random.Next(modules.Length)],
                    Details = $"Acción de prueba {i + 1}",
                    Ip = $"192.168.0.{random.Next(1, 255)}",
                    Date = DateTime.UtcNow.AddHours(-random.Next(1, 72)),
                    Type = AuditLogType.Info
                });
            }
        }
        await _context.SaveChangesAsync();
    }
}