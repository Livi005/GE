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

        // Usuarios por rol (password fija: Admin123!)
        var superAdmin       = await SeedUserWithRoleAsync("superadmin",          Roles.SuperAdmin,   null);
        var director         = await SeedUserWithRoleAsync("director.juan.gomez", Roles.Director,     institution);
        var maintenance      = await SeedUserWithRoleAsync("mantenimiento.pedro.lopez", Roles.Maintenance, institution);
        var secretary        = await SeedUserWithRoleAsync("secretaria.ana.ruiz", Roles.Secretary,    institution);
        var profDean         = await SeedUserWithRoleAsync("prof.juan.gomez",     Roles.Professor,    institution);
        var prof2            = await SeedUserWithRoleAsync("prof.maria.lopez",    Roles.Professor,    institution);
        var prof3            = await SeedUserWithRoleAsync("prof.carlos.diaz",    Roles.Professor,    institution);
        var yearHead         = await SeedUserWithRoleAsync("jefe.maria.soto",     Roles.YearHead,     institution);
        var stud1            = await SeedUserWithRoleAsync("alumno.pedro.torres", Roles.Student,      institution);
        var stud2            = await SeedUserWithRoleAsync("alumno.ana.ruiz",     Roles.Student,      institution);
        var stud3            = await SeedUserWithRoleAsync("alumno.luis.soto",    Roles.Student,      institution);

        // Perfiles
        var directorProfile  = await SeedDirectorProfileAsync(director, institution, "Juan Gomez");
        var maintProfile     = await SeedMaintenanceProfileAsync(maintenance, institution, "Pedro Lopez");
        var secProfile       = await SeedSecretaryProfileAsync(secretary, institution, "Ana Ruiz");
        var profDeanProfile  = await SeedProfessorProfileAsync(profDean, institution, "Juan Gomez", spec: "Matemáticas", isDean: true);
        var prof2Profile     = await SeedProfessorProfileAsync(prof2, institution, "Maria Lopez", spec: "Física", isDean: false);
        var prof3Profile     = await SeedProfessorProfileAsync(prof3, institution, "Carlos Diaz", spec: "Química", isDean: false);
        var yearHeadProfile  = await SeedYearHeadProfileAsync(yearHead, institution, "Maria Soto");

        var course           = await SeedCourseAsync(institution);
        var classRoom        = await SeedClassRoomAsync(institution);
        var subject          = await SeedSubjectAsync(institution, classRoom, "Matemáticas", "1ro", "A");
        var subject2         = await SeedSubjectAsync(institution, classRoom, "Física", "1ro", "A");

        var stud1Profile     = await SeedStudentProfileAsync(stud1, institution, course, "Pedro", "Torres");
        var stud2Profile     = await SeedStudentProfileAsync(stud2, institution, course, "Ana", "Ruiz");
        var stud3Profile     = await SeedStudentProfileAsync(stud3, institution, course, "Luis", "Soto");

        // Relaciones profesor-asignatura
        await LinkProfessorSubjectAsync(profDeanProfile, subject);
        await LinkProfessorSubjectAsync(prof2Profile, subject2);
        await LinkProfessorSubjectAsync(prof3Profile, subject2);

        // Relaciones estudiante-asignatura
        await LinkStudentSubjectAsync(stud1Profile, subject);
        await LinkStudentSubjectAsync(stud2Profile, subject);
        await LinkStudentSubjectAsync(stud3Profile, subject);
        await LinkStudentSubjectAsync(stud1Profile, subject2);
        await LinkStudentSubjectAsync(stud2Profile, subject2);
        await LinkStudentSubjectAsync(stud3Profile, subject2);

        // Notas
        await SeedGradesAsync(profDeanProfile, subject, stud1Profile, stud2Profile, stud3Profile);
        await SeedGradesAsync(prof2Profile, subject2, stud1Profile, stud2Profile, stud3Profile);

        // Asistencias (5 días, todos presentes salvo un ausente)
        await SeedAttendanceAsync(subject, stud1Profile, stud2Profile, stud3Profile);
        await SeedAttendanceAsync(subject2, stud1Profile, stud2Profile, stud3Profile);

        // Horario
        await SeedScheduleAsync(subject, profDeanProfile, classRoom);
        await SeedScheduleAsync(subject2, prof2Profile, classRoom);

        // Medios
        var techMean = await SeedTechMeanAsync(institution);
        var auxMean  = await SeedAuxMeanAsync(institution);
        await LinkClassRoomTechMeanAsync(classRoom, techMean);
        await LinkSubjectAuxMeanAsync(subject, auxMean);

        // Evaluaciones de profesores por parte de estudiantes
        await SeedProfessorEvaluationsAsync(profDeanProfile, stud1Profile, stud2Profile, stud3Profile);
        await SeedProfessorEvaluationsAsync(prof2Profile, stud1Profile, stud2Profile);

        // Notificaciones
        await SeedNotificationsAsync(director, secretary, profDean, stud1);

        // Auditoría
        await SeedAuditLogAsync(director, superAdmin);

        await _context.SaveChangesAsync();

        _logger.LogInformation("✅ Seed completo. Usuarios de prueba con password: {Password}", DemoPassword);
    }

    // -------------------------------------------------------------
    // Roles
    // -------------------------------------------------------------
    private async Task SeedRolesAsync()
    {
        foreach (var role in Roles.All)
        {
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    // -------------------------------------------------------------
    // Institución
    // -------------------------------------------------------------
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
    // Usuarios + Roles
    // -------------------------------------------------------------
    private async Task<User> SeedUserWithRoleAsync(string userName, string role, Institution? institution)
    {
        var existing = await _userManager.FindByNameAsync(userName);
        if (existing is not null) return existing;

        var user = new User { UserName = userName, Email = $"{userName}@lyra.local" };
        var result = await _userManager.CreateAsync(user, DemoPassword);
        if (!result.Succeeded)
            throw new InvalidOperationException(
                $"No se pudo crear {userName}: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        await _userManager.AddToRoleAsync(user, role);
        return user;
    }

    // -------------------------------------------------------------
    // Perfiles
    // -------------------------------------------------------------
    private async Task<Administrator> SeedDirectorProfileAsync(User user, Institution institution, string name)
    {
        var existing = await _context.Administrators.FirstOrDefaultAsync(a => a.UserId == user.Id);
        if (existing is not null) return existing;

        var entity = new Administrator
        {
            UserId = user.Id,
            AdminName = name,
            AdminSalary = 5000,
            IdInstitution = institution.IdInstitution
        };
        _context.Administrators.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<MaintenanceWorker> SeedMaintenanceProfileAsync(User user, Institution institution, string name)
    {
        var existing = await _context.MaintenanceWorkers.FirstOrDefaultAsync(m => m.UserId == user.Id);
        if (existing is not null) return existing;

        var entity = new MaintenanceWorker
        {
            UserId = user.Id,
            NameMaint = name,
            SalaryMaint = 2500,
            IdInstitution = institution.IdInstitution
        };
        _context.MaintenanceWorkers.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<Secretary> SeedSecretaryProfileAsync(User user, Institution institution, string name)
    {
        var existing = await _context.Secretaries.FirstOrDefaultAsync(s => s.UserId == user.Id);
        if (existing is not null) return existing;

        var entity = new Secretary
        {
            UserId = user.Id,
            NameS = name,
            SalaryS = 3000,
            IdInstitution = institution.IdInstitution
        };
        _context.Secretaries.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<Professor> SeedProfessorProfileAsync(
        User user, Institution institution, string name, string spec, bool isDean)
    {
        var existing = await _context.Professors.FirstOrDefaultAsync(p => p.UserId == user.Id);
        if (existing is not null) return existing;

        var entity = new Professor
        {
            UserId = user.Id,
            NameProf = name,
            Contract = "Tiempo Completo",
            Spec = spec,
            Salary = 4000,
            IsDean = isDean,
            LaboralExperience = 8,
            UseAuxMean = false,
            IdInstitution = institution.IdInstitution
        };
        _context.Professors.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<YearHead> SeedYearHeadProfileAsync(User user, Institution institution, string name)
    {
        var existing = await _context.YearHeads.FirstOrDefaultAsync(y => y.UserId == user.Id);
        if (existing is not null) return existing;

        var entity = new YearHead
        {
            UserId = user.Id,
            NameYearHead = name,
            IdInstitution = institution.IdInstitution
        };
        _context.YearHeads.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<Student> SeedStudentProfileAsync(
        User user, Institution institution, Course course, string name, string lastName)
    {
        var existing = await _context.Students.FirstOrDefaultAsync(s => s.UserId == user.Id);
        if (existing is not null) return existing;

        var entity = new Student
        {
            UserId = user.Id,
            Name1 = name,
            LastName1 = lastName,
            BirthDate = new DateTime(2010, 1, 1),
            Gender = "Masculino",
            DocType = "DNI",
            DocNumber = $"{Random.Shared.Next(10_000_000, 99_999_999)}",
            Email = $"{user.UserName}@lyra.local",
            Phone = "+53 5555-0000",
            Address = "Calle Falsa 123",
            Level = "Secundaria",
            Grade = "1ro",
            Section = "A",
            AdmissionDate = DateTime.UtcNow.AddYears(-1),
            AcademicYear = "2024-2025",
            InitialStatus = "Nuevo",
            TutorName = "Tutor Legal",
            TutorPhone = "+53 5555-1111",
            EmergencyContact = "Contacto Emergencia",
            IsActive = true,
            IdC = course.IdC,
            IdInstitution = institution.IdInstitution
        };
        _context.Students.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // -------------------------------------------------------------
    // Entidades base
    // -------------------------------------------------------------
    private async Task<Course> SeedCourseAsync(Institution institution)
    {
        var existing = await _context.Courses.FirstOrDefaultAsync(c => c.IdInstitution == institution.IdInstitution);
        if (existing is not null) return existing;

        var entity = new Course
        {
            CourseName = "2024-2025",
            IdInstitution = institution.IdInstitution
        };
        _context.Courses.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<ClassRoom> SeedClassRoomAsync(Institution institution)
    {
        var existing = await _context.ClassRooms.FirstOrDefaultAsync(c => c.IdInstitution == institution.IdInstitution);
        if (existing is not null) return existing;

        var entity = new ClassRoom
        {
            Location = "Aula 101",
            Capacity = 30,
            IsAviable = true,
            IdInstitution = institution.IdInstitution
        };
        _context.ClassRooms.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<Subject> SeedSubjectAsync(
        Institution institution, ClassRoom classRoom, string name, string grade, string section)
    {
        var existing = await _context.Subjects
            .FirstOrDefaultAsync(s => s.IdInstitution == institution.IdInstitution && s.NameSub == name);
        if (existing is not null) return existing;

        var entity = new Subject
        {
            NameSub = name,
            StudyProgram = grade,
            CourseLoad = 4,
            IdClassRoom = classRoom.IdClassR,
            IdInstitution = institution.IdInstitution
        };
        _context.Subjects.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<TechnologicalMeans> SeedTechMeanAsync(Institution institution)
    {
        var existing = await _context.TechnologicalMeans.FirstOrDefaultAsync(t => t.IdInstitution == institution.IdInstitution);
        if (existing is not null) return existing;

        var entity = new TechnologicalMeans
        {
            NameMean = "Proyector Epson",
            State = "Bueno",
            IsAviable = true,
            IsActive = true,
            IdInstitution = institution.IdInstitution
        };
        _context.TechnologicalMeans.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    private async Task<AuxiliaryMeans> SeedAuxMeanAsync(Institution institution)
    {
        var existing = await _context.AuxiliaryMeans.FirstOrDefaultAsync(a => a.IdInstitution == institution.IdInstitution);
        if (existing is not null) return existing;

        var entity = new AuxiliaryMeans
        {
            NameMean = "Pizarra Blanca",
            State = "Bueno",
            Type = "Pizarra",
            IsAviable = true,
            IsActive = true,
            IdInstitution = institution.IdInstitution
        };
        _context.AuxiliaryMeans.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    // -------------------------------------------------------------
    // Relaciones
    // -------------------------------------------------------------
    private async Task LinkProfessorSubjectAsync(Professor professor, Subject subject)
    {
        var exists = await _context.ProfessorSubjects
            .AnyAsync(ps => ps.IdProf == professor.IdProf && ps.IdSub == subject.IdSub);
        if (exists) return;

        _context.ProfessorSubjects.Add(new ProfessorSubject
        {
            IdProf = professor.IdProf,
            IdSub = subject.IdSub
        });
        await _context.SaveChangesAsync();
    }

    private async Task LinkStudentSubjectAsync(Student student, Subject subject)
    {
        var exists = await _context.StudentSubjects
            .AnyAsync(ss => ss.IdStud == student.IdStud && ss.IdSub == subject.IdSub);
        if (exists) return;

        _context.StudentSubjects.Add(new StudentSubject
        {
            IdStud = student.IdStud,
            IdSub = subject.IdSub,
            NJAbsents = 0
        });
        await _context.SaveChangesAsync();
    }

    private async Task LinkClassRoomTechMeanAsync(ClassRoom classRoom, TechnologicalMeans techMean)
    {
        var exists = await _context.ClassRoomTechMeans
            .AnyAsync(c => c.IdClassRoom == classRoom.IdClassR && c.IdTechMean == techMean.IdMean);
        if (exists) return;

        _context.ClassRoomTechMeans.Add(new ClassRoomTechMean
        {
            IdClassRoom = classRoom.IdClassR,
            IdTechMean = techMean.IdMean
        });
        await _context.SaveChangesAsync();
    }

    private async Task LinkSubjectAuxMeanAsync(Subject subject, AuxiliaryMeans auxMean)
    {
        var exists = await _context.SubjectAuxMeans
            .AnyAsync(s => s.IdSub == subject.IdSub && s.IdAuxMean == auxMean.IdMean);
        if (exists) return;

        _context.SubjectAuxMeans.Add(new SubjectAuxMean
        {
            IdSub = subject.IdSub,
            IdAuxMean = auxMean.IdMean
        });
        await _context.SaveChangesAsync();
    }

    // -------------------------------------------------------------
    // Notas, asistencia, horario
    // -------------------------------------------------------------
    private async Task SeedGradesAsync(
        Professor professor, Subject subject, params Student[] students)
    {
        var random = new Random(42);
        foreach (var student in students)
        {
            var ss = await _context.StudentSubjects
                .FirstOrDefaultAsync(x => x.IdStud == student.IdStud && x.IdSub == subject.IdSub);
            if (ss is null) continue;

            var exists = await _context.ProfessorStudentSubjects
                .AnyAsync(p => p.IdProf == professor.IdProf && p.IdStudSub == ss.IdStudSub);
            if (exists) continue;

            _context.ProfessorStudentSubjects.Add(new ProfessorStudentSubject
            {
                IdProf = professor.IdProf,
                IdStudSub = ss.IdStudSub,
                StudentGrades = random.Next(6, 11) // 0–10
            });
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedAttendanceAsync(Subject subject, params Student[] students)
    {
        var today = DateTime.UtcNow.Date;
        for (var i = 0; i < 5; i++) 
        { 
            var date = today.AddDays(-i);
            foreach (var student in students)
            {
                var exists = await _context.Attendances
                    .AnyAsync(a => a.IdSub == subject.IdSub && a.IdStud == student.IdStud && a.Date == date);
                if (exists) continue;

                _context.Attendances.Add(new Attendance
                {
                    IdSub = subject.IdSub,
                    IdStud = student.IdStud,
                    Date = date,
                    Status = AttendanceStatus.Present
                });
            }
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedScheduleAsync(Subject subject, Professor professor, ClassRoom classRoom)
    {
        var exists = await _context.Schedules
            .AnyAsync(s => s.IdSub == subject.IdSub && s.IdProf == professor.IdProf);
        if (exists) return;

        _context.Schedules.AddRange(
            new Schedule
            {
                IdSub = subject.IdSub,
                IdProf = professor.IdProf,
                IdClassR = classRoom.IdClassR,
                Day = DayOfWeek.Monday,
                StartTime = new TimeSpan(8, 0, 0),
                EndTime = new TimeSpan(9, 30, 0)
            },
            new Schedule
            {
                IdSub = subject.IdSub,
                IdProf = professor.IdProf,
                IdClassR = classRoom.IdClassR,
                Day = DayOfWeek.Wednesday,
                StartTime = new TimeSpan(10, 0, 0),
                EndTime = new TimeSpan(11, 30, 0)
            }
        );
        await _context.SaveChangesAsync();
    }

    // -------------------------------------------------------------
    // Evaluaciones
    // -------------------------------------------------------------
    private async Task SeedProfessorEvaluationsAsync(
        Professor professor, params Student[] students)
    {
        var random = new Random(7);
        foreach (var student in students)
        {
            var exists = await _context.ProfessorEvaluations
                .AnyAsync(e => e.IdProf == professor.IdProf && e.IdStud == student.IdStud);
            if (exists) continue;

            _context.ProfessorEvaluations.Add(new ProfessorEvaluation
            {
                IdProf = professor.IdProf,
                IdStud = student.IdStud,
                Rating = random.Next(3, 6),
                Comment = "Buen docente"
            });
        }
        await _context.SaveChangesAsync();
    }

    // -------------------------------------------------------------
    // Notificaciones y auditoría
    // -------------------------------------------------------------
    private async Task SeedNotificationsAsync(params User[] users)
    {
        foreach (var user in users)
        {
            var exists = await _context.Notifications.AnyAsync(n => n.UserId == user.Id);
            if (exists) continue;

            _context.Notifications.AddRange(
                new Notification
                {
                    UserId = user.Id,
                    Title = "Bienvenido a LYRA",
                    Message = "Tu cuenta ha sido creada exitosamente.",
                    Type = NotificationType.Success,
                    Module = "system"
                },
                new Notification
                {
                    UserId = user.Id,
                    Title = "Reunión de claustro",
                    Message = "La reunión de claustro será el viernes a las 15:00.",
                    Type = NotificationType.Info,
                    Module = "events"
                }
            );
        }
        await _context.SaveChangesAsync();
    }

    private async Task SeedAuditLogAsync(params User[] users)
    {
        var random = new Random(11);
        foreach (var user in users)
        {
            var exists = await _context.AuditLogs.AnyAsync(a => a.UserId == user.Id);
            if (exists) continue;

            _context.AuditLogs.Add(new AuditLog
            {
                UserId = user.Id,
                UserName = user.UserName ?? "unknown",
                Action = "Login",
                Module = "Auth",
                Details = "Inicio de sesión correcto",
                Ip = $"192.168.0.{random.Next(1, 255)}",
                Type = AuditLogType.Success
            });
        }
        await _context.SaveChangesAsync();
    }
}