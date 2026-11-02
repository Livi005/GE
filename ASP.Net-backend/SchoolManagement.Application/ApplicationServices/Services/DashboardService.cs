using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Relations;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityManager _identityManager;

    public DashboardService(IUnitOfWork unitOfWork, IIdentityManager identityManager)
    {
        _unitOfWork = unitOfWork;
        _identityManager = identityManager;
    }

        public async Task<Result<StudentDashboardDto>> GetStudentDashboardAsync(string userName)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null) return Result.NotFound<StudentDashboardDto>("User", userName);

        var student = await _unitOfWork.Repository<Student>().Query()
            .Include(s => s.Course)
            .FirstOrDefaultAsync(s => s.UserId == user.Id);

        if (student is null) return Result.NotFound<StudentDashboardDto>("Student", userName);

        var grades = await _unitOfWork.Repository<ProfessorStudentSubject>().Query()
            .Include(pss => pss.StudentSubject).ThenInclude(ss => ss.Subject)
            .Where(pss => pss.StudentSubject.IdStud == student.IdStud)
            .Select(pss => new GradeSummaryDto
            {
                SubjectName = pss.StudentSubject.Subject.NameSub,
                Grade = pss.StudentGrades
            }).ToListAsync();

        var fullName = $"{student.Name1} {student.LastName1}".Trim();

        return Result.Success(new StudentDashboardDto
        {
            StudentName = fullName,
            CourseName = student.Course?.CourseName ?? "Sin curso",
            Grades = grades
        });
    }

    public async Task<Result<ProfessorDashboardDto>> GetProfessorDashboardAsync(string userName)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null) return Result.NotFound<ProfessorDashboardDto>("User", userName);

        var professor = await _unitOfWork.Repository<Professor>().Query()
            .FirstOrDefaultAsync(p => p.UserId == user.Id);

        if (professor is null) return Result.NotFound<ProfessorDashboardDto>("Professor", userName);

        // Contamos sus asignaturas
        var totalSubjects = await _unitOfWork.Repository<ProfessorSubject>().Query()
            .CountAsync(ps => ps.IdProf == professor.IdProf);

        // Contamos estudiantes únicos en sus asignaturas
        var subjectIds = await _unitOfWork.Repository<ProfessorSubject>().Query()
            .Where(ps => ps.IdProf == professor.IdProf)
            .Select(ps => ps.IdSub)
            .ToListAsync();

        var totalStudents = await _unitOfWork.Repository<StudentSubject>().Query()
            .Where(ss => subjectIds.Contains(ss.IdSub))
            .Select(ss => ss.IdStud)
            .Distinct()
            .CountAsync();

        // Contamos cuántas notas le faltan poner (ejemplo: alumnos sin nota en sus materias)
        var pendingGrades = await _unitOfWork.Repository<StudentSubject>().Query()
            .Where(ss => subjectIds.Contains(ss.IdSub))
            .Where(ss => !_unitOfWork.Repository<ProfessorStudentSubject>().Query()
                .Any(pss => pss.IdStudSub == ss.IdStudSub && pss.IdProf == professor.IdProf))
            .CountAsync();

        return Result.Success(new ProfessorDashboardDto
        {
            ProfessorName = professor.NameProf,
            TotalSubjects = totalSubjects,
            TotalStudents = totalStudents,
            PendingGrades = pendingGrades
        });
    }

    public async Task<Result<IReadOnlyList<ClassRoomAvailabilityDto>>> GetAvailableClassRoomsAsync()
    {
        var availableRooms = await _unitOfWork.Repository<ClassRoom>().Query()
            .Where(c => c.IsAviable && !c.IsDeleted)
            .Select(c => new ClassRoomAvailabilityDto
            {
                IdClassR = c.IdClassR,
                Location = c.Location
            }).ToListAsync();

        return Result.Success<IReadOnlyList<ClassRoomAvailabilityDto>>(availableRooms);
    }

        // ---------- Dashboard Director ----------
    public async Task<Result<AdminDashboardDto>> GetAdminDashboardAsync(
        CancellationToken cancellationToken = default)
    {
        var totalStudents = await _unitOfWork.Repository<Student>().Query()
            .CountAsync(s => s.IsActive && !s.IsDeleted, cancellationToken);
        var totalProfessors = await _unitOfWork.Repository<Professor>().Query()
            .CountAsync(p => !p.IsDeleted, cancellationToken);
        var totalSubjects = await _unitOfWork.Repository<Subject>().Query()
            .CountAsync(s => !s.IsDeleted, cancellationToken);
        var totalRooms = await _unitOfWork.Repository<ClassRoom>().Query()
            .CountAsync(c => !c.IsDeleted, cancellationToken);

        // Asistencia semanal: contar Present vs total por día (últimos 7 días)
        var today = DateTime.UtcNow.Date;
        var start = today.AddDays(-6);
        var attendances = await _unitOfWork.Repository<Attendance>().Query()
            .Where(a => a.Date >= start && a.Date <= today)
            .ToListAsync(cancellationToken);

        var weekly = new List<WeeklyAttendanceDto>();
        var dayLabels = new[] { "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom" };

        for (var i = 0; i < 7; i++)
        {
            var date = start.AddDays(i).Date;
            var dayOfWeek = dayLabels[(int)date.DayOfWeek == 0 ? 6 : (int)date.DayOfWeek - 1];
            var dayRecords = attendances.Where(a => a.Date.Date == date).ToList();
            var value = dayRecords.Count == 0
                ? 0
                : (int)Math.Round(dayRecords.Count(a => a.Status == AttendanceStatus.Present) * 100.0 / dayRecords.Count);
            weekly.Add(new WeeklyAttendanceDto { Day = dayOfWeek, Value = value });
        }

        // Notificaciones recientes (máx 5)
        var notifications = await _unitOfWork.Repository<Notification>().Query()
            .OrderByDescending(n => n.CreatedAt)
            .Take(5)
            .Select(n => new NotificationBriefDto
            {
                Id = n.IdNotification,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type.ToString(),
                CreatedAt = n.CreatedAt,
                IsRead = n.IsRead
            })
            .ToListAsync(cancellationToken);

        // Alumnos en riesgo: contar por promedio de notas
        var pss = await _unitOfWork.Repository<ProfessorStudentSubject>().Query()
            .Select(p => new { p.StudentSubject.IdStud, p.StudentGrades })
            .ToListAsync(cancellationToken);

        var grouped = pss.GroupBy(x => x.IdStud)
            .Select(g => new
            {
                IdStud = g.Key,
                Avg = g.Average(x => x.StudentGrades)
            }).ToList();

        var high = grouped.Count(x => x.Avg < 4);
        var medium = grouped.Count(x => x.Avg >= 4 && x.Avg < 6);
        var low = grouped.Count(x => x.Avg >= 6 && x.Avg < 7);
        var totalRisk = high + medium;

        return Result.Success(new AdminDashboardDto
        {
            TotalStudents = totalStudents,
            TotalProfessors = totalProfessors,
            TotalSubjects = totalSubjects,
            TotalRooms = totalRooms,
            WeeklyAttendance = weekly,
            Notifications = notifications,
            Events = new List<EventBriefDto>(),
            RiskStudents = new RiskStudentsDto
            {
                High = high,
                Medium = medium,
                Low = low,
                Total = totalRisk
            }
        });
    }

    // ---------- Dashboard Secretaría ----------
    public async Task<Result<SecretaryDashboardDto>> GetSecretaryDashboardAsync(
        CancellationToken cancellationToken = default)
    {
        var oneMonthAgo = DateTime.UtcNow.AddMonths(-1).Date;
        var newStudents = await _unitOfWork.Repository<Student>().Query()
            .CountAsync(s => s.AdmissionDate >= oneMonthAgo && !s.IsDeleted, cancellationToken);

        var notifications = await _unitOfWork.Repository<Notification>().Query()
            .OrderByDescending(n => n.CreatedAt)
            .Take(5)
            .Select(n => new NotificationBriefDto
            {
                Id = n.IdNotification,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type.ToString(),
                CreatedAt = n.CreatedAt,
                IsRead = n.IsRead
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new SecretaryDashboardDto
        {
            NewEnrollments = newStudents,
            PendingTrámites = 0,   // se poblará cuando exista módulo de trámites
            NewStudents = newStudents,
            Notifications = notifications,
            UpcomingDeadlines = new List<EventBriefDto>()
        });
    }

        // ---------- Dashboard Maintenance ----------
    public async Task<Result<MaintenanceDashboardDto>> GetMaintenanceDashboardAsync(
        CancellationToken cancellationToken = default)
    {
        var totalClassRooms = await _unitOfWork.Repository<ClassRoom>().Query()
            .CountAsync(c => !c.IsDeleted, cancellationToken);
        var totalTechMeans = await _unitOfWork.Repository<TechnologicalMeans>().Query()
            .CountAsync(t => !t.IsDeleted, cancellationToken);
        var totalAuxMeans = await _unitOfWork.Repository<AuxiliaryMeans>().Query()
            .CountAsync(a => !a.IsDeleted, cancellationToken);

        var maintenances = await _unitOfWork.Repository<Maintenance>().Query()
            .OrderByDescending(m => m.MaintenanceDate)
            .Take(10)
            .ToListAsync(cancellationToken);

        var totalMaintenances = await _unitOfWork.Repository<Maintenance>().Query()
            .CountAsync(cancellationToken);

        var recent = maintenances.Select(m => new MaintenanceBriefDto
        {
            Id = m.IdM,
            MeanName = m.AuxMean?.NameMean ?? m.TechnologicalMean?.NameMean ?? "—",
            Type = m.TypeOfMean.ToString(),
            Date = m.MaintenanceDate,
            Cost = m.Cost
        }).ToList();

        return Result.Success(new MaintenanceDashboardDto
        {
            TotalClassRooms = totalClassRooms,
            TotalTechMeans = totalTechMeans,
            TotalAuxMeans = totalAuxMeans,
            TotalMaintenances = totalMaintenances,
            PendingMaintenances = 0,
            RecentMaintenances = recent
        });
    }

    // ---------- Dashboard YearHead ----------
    public async Task<Result<YearHeadDashboardDto>> GetYearHeadDashboardAsync(
        string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null) return Result.NotFound<YearHeadDashboardDto>("User", userName);

        var yearHead = await _unitOfWork.Repository<YearHead>().Query()
            .FirstOrDefaultAsync(y => y.UserId == user.Id, cancellationToken);
        if (yearHead is null) return Result.NotFound<YearHeadDashboardDto>("YearHead", userName);

        var courses = await _unitOfWork.Repository<Course>().Query()
            .ToListAsync(cancellationToken);
        var totalSubjects = await _unitOfWork.Repository<Subject>().Query()
            .CountAsync(s => !s.IsDeleted, cancellationToken);

        var courseDtos = new List<YearHeadCourseDto>();
        foreach (var course in courses)
        {
            var studentCount = await _unitOfWork.Repository<Student>().Query()
                .CountAsync(s => s.IdC == course.IdC && !s.IsDeleted, cancellationToken);
            courseDtos.Add(new YearHeadCourseDto
            {
                IdC = course.IdC,
                CourseName = course.CourseName,
                StudentCount = studentCount
            });
        }

        var totalStudents = courseDtos.Sum(c => c.StudentCount);

        return Result.Success(new YearHeadDashboardDto
        {
            YearHeadName = yearHead.NameYearHead,
            TotalCourses = courses.Count,
            TotalSubjects = totalSubjects,
            TotalStudents = totalStudents,
            Courses = courseDtos
        });
    }
}