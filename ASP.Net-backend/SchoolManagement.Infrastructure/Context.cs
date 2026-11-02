using System.Linq.Expressions;
using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Notifications;
using SchoolManagement.Domain.Relations;
using SchoolManagement.Infrastructure.Common.Tenant;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Infrastructure;

public class Context : IdentityDbContext<User>
{
    private readonly ITenantProvider _tenantProvider;

    public Context(DbContextOptions<Context> options, ITenantProvider tenantProvider)
        : base(options)
        => _tenantProvider = tenantProvider;

    // -------------------------------------------------------------
    // Propiedades usadas por GenericRepository (tenant-aware)
    // -------------------------------------------------------------
    public int? CurrentTenantId => _tenantProvider.InstitutionId;
    public bool IsSuperAdmin => _tenantProvider.IsSuperAdmin;

    /// <summary>
    /// Devuelve un IQueryable con el filtro multi-tenant aplicado.
    /// Se usa desde GenericRepository.Query().
    /// </summary>
    public IQueryable<T> Query<T>() where T : class
    {
        var set = Set<T>().AsQueryable();
        var tenantId = CurrentTenantId;

        if (tenantId is null || IsSuperAdmin)
            return set;

        var prop = typeof(T).GetProperty("IdInstitution", BindingFlags.Public | BindingFlags.Instance);
        if (prop is null || prop.PropertyType != typeof(int))
            return set;

        var parameter = Expression.Parameter(typeof(T), "e");
        var property = Expression.Property(parameter, prop);
        var constant = Expression.Constant(tenantId.Value);
        var equals = Expression.Equal(property, constant);
        var lambda = Expression.Lambda<Func<T, bool>>(equals, parameter);

        return set.Where(lambda);
    }

    // -------------------------------------------------------------
    // DbSets
    // -------------------------------------------------------------
    public DbSet<Institution> Institutions => Set<Institution>();

    public DbSet<Administrator> Administrators => Set<Administrator>();
    public DbSet<AuxiliaryMeans> AuxiliaryMeans => Set<AuxiliaryMeans>();
    public DbSet<ClassRoom> ClassRooms => Set<ClassRoom>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Maintenance> Maintenances => Set<Maintenance>();
    public DbSet<MaintenanceWorker> MaintenanceWorkers => Set<MaintenanceWorker>();
    public DbSet<Professor> Professors => Set<Professor>();
    public DbSet<ProfessorEvaluation> ProfessorEvaluations => Set<ProfessorEvaluation>();
    public DbSet<ProfessorPunishment> ProfessorsPunishments => Set<ProfessorPunishment>();
    public DbSet<Restriction> Restrictions => Set<Restriction>();
    public DbSet<Secretary> Secretaries => Set<Secretary>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<TechnologicalMeans> TechnologicalMeans => Set<TechnologicalMeans>();
    public DbSet<YearHead> YearHeads => Set<YearHead>();
    public DbSet<Schedule> Schedules => Set<Schedule>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<UserPreferences> UserPreferences => Set<UserPreferences>();

    public DbSet<ClassRoomRestriction> ClassRoomRestrictions => Set<ClassRoomRestriction>();
    public DbSet<ClassRoomTechMean> ClassRoomTechMeans => Set<ClassRoomTechMean>();
    public DbSet<ProfessorClassRoom> ProfessorClassRooms => Set<ProfessorClassRoom>();
    public DbSet<ProfessorStudentSubject> ProfessorStudentSubjects => Set<ProfessorStudentSubject>();
    public DbSet<ProfessorSubject> ProfessorSubjects => Set<ProfessorSubject>();
    public DbSet<ProfStudSubCourse> ProfStudSubCourses => Set<ProfStudSubCourse>();
    public DbSet<SecretaryProfessorStudentSubject> SecretaryProfessorStudentSubjects => Set<SecretaryProfessorStudentSubject>();
    public DbSet<StudentSubject> StudentSubjects => Set<StudentSubject>();
    public DbSet<SubjectAuxMean> SubjectAuxMeans => Set<SubjectAuxMean>();

    public DbSet<MeanNotification> MeanNotifications => Set<MeanNotification>();
    public DbSet<ProfessorNotification> ProfessorNotifications => Set<ProfessorNotification>();

    // -------------------------------------------------------------
    // Modelo
    // -------------------------------------------------------------
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Mean>().UseTptMappingStrategy();

        ApplySoftDeleteFilters(modelBuilder);
        ConfigureInstitutions(modelBuilder);
        ConfigureStudents(modelBuilder);
        ConfigureTenantRelations(modelBuilder);
        ConfigureNewEntities(modelBuilder);
        ConfigureExistingEntities(modelBuilder);
    }

    // -------------------------------------------------------------
    // SaveChanges: auto-set IdInstitution
    // -------------------------------------------------------------
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyTenantOnEntities();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        ApplyTenantOnEntities();
        return base.SaveChanges();
    }

    private void ApplyTenantOnEntities()
    {
        var tenantId = CurrentTenantId;
        if (tenantId is null || IsSuperAdmin) return;

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State != EntityState.Added) continue;

            var prop = entry.Entity.GetType().GetProperty("IdInstitution", BindingFlags.Public | BindingFlags.Instance);
            if (prop is null || prop.PropertyType != typeof(int)) continue;

            var current = (int)(prop.GetValue(entry.Entity) ?? 0);
            if (current == 0)
                prop.SetValue(entry.Entity, tenantId.Value);
        }
    }

    // -------------------------------------------------------------
    // Configuración de entidades
    // -------------------------------------------------------------

    private static void ConfigureInstitutions(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Institution>(e =>
        {
            e.HasKey(x => x.IdInstitution);
            e.Property(x => x.Name).IsRequired().HasMaxLength(128);
            e.Property(x => x.Domain).IsRequired().HasMaxLength(64);
            e.HasIndex(x => x.Domain).IsUnique();
            e.Property(x => x.Email).IsRequired().HasMaxLength(128);
            e.Property(x => x.Phone).HasMaxLength(32);
            e.Property(x => x.Plan).HasConversion<int>().IsRequired();
            e.Property(x => x.Status).HasConversion<int>().IsRequired();
        });
    }

    private static void ConfigureStudents(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>(e =>
        {
            e.HasKey(x => x.IdStud);
            e.Property(x => x.UserId).IsRequired().HasMaxLength(64);
            e.Property(x => x.Name1).IsRequired().HasMaxLength(64);
            e.Property(x => x.LastName1).IsRequired().HasMaxLength(64);
            e.Property(x => x.LastName2).HasMaxLength(64);
            e.Property(x => x.Gender).IsRequired().HasMaxLength(32);
            e.Property(x => x.DocType).IsRequired().HasMaxLength(16);
            e.Property(x => x.DocNumber).IsRequired().HasMaxLength(32);
            e.Property(x => x.Email).IsRequired().HasMaxLength(128);
            e.Property(x => x.Phone).IsRequired().HasMaxLength(32);
            e.Property(x => x.Address).IsRequired().HasMaxLength(256);
            e.Property(x => x.Level).IsRequired().HasMaxLength(32);
            e.Property(x => x.Grade).IsRequired().HasMaxLength(32);
            e.Property(x => x.Section).IsRequired().HasMaxLength(8);
            e.Property(x => x.AcademicYear).IsRequired().HasMaxLength(16);
            e.Property(x => x.InitialStatus).IsRequired().HasMaxLength(32);
            e.Property(x => x.Notes).HasMaxLength(512);
            e.Property(x => x.TutorName).HasMaxLength(128);
            e.Property(x => x.TutorPhone).HasMaxLength(32);
            e.Property(x => x.EmergencyContact).HasMaxLength(128);
            e.Property(x => x.IsActive).HasDefaultValue(true);

            e.HasIndex(x => new { x.IdInstitution, x.DocNumber }).IsUnique();

            e.HasOne(s => s.Course).WithMany(c => c.Students)
                .HasForeignKey(s => s.IdC).OnDelete(DeleteBehavior.Restrict);

            e.HasMany(s => s.Subjects).WithMany(sub => sub.Students)
                .UsingEntity<StudentSubject>(
                    j => j.HasOne(x => x.Subject).WithMany().HasForeignKey(x => x.IdSub),
                    j => j.HasOne(x => x.Student).WithMany().HasForeignKey(x => x.IdStud),
                    j =>
                    {
                        j.HasKey(x => x.IdStudSub);
                        j.Property(x => x.NJAbsents).HasDefaultValue(0);
                    });
        });
    }

    private static void ConfigureTenantRelations(ModelBuilder modelBuilder)
    {
        void Configure<T>() where T : class
        {
            modelBuilder.Entity<T>()
                .HasOne(typeof(Institution), "Institution")
                .WithMany()
                .HasForeignKey("IdInstitution")
                .OnDelete(DeleteBehavior.Restrict);
        }

        Configure<Administrator>();
        Configure<Professor>();
        Configure<Secretary>();
        Configure<Student>();
        Configure<Course>();
        Configure<Subject>();
        Configure<ClassRoom>();
        Configure<Mean>();
        Configure<Maintenance>();
        Configure<Restriction>();
        Configure<ProfessorPunishment>();
        Configure<MeanNotification>();
        Configure<ProfessorNotification>();
    }

    private static void ConfigureNewEntities(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MaintenanceWorker>(e =>
        {
            e.HasKey(x => x.IdMaint);
            e.Property(x => x.UserId).IsRequired().HasMaxLength(64);
            e.Property(x => x.NameMaint).IsRequired().HasMaxLength(64);
            e.HasOne(x => x.Institution).WithMany()
                .HasForeignKey(x => x.IdInstitution).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<YearHead>(e =>
        {
            e.HasKey(x => x.IdYearHead);
            e.Property(x => x.UserId).IsRequired().HasMaxLength(64);
            e.Property(x => x.NameYearHead).IsRequired().HasMaxLength(64);
            e.HasOne(x => x.Institution).WithMany()
                .HasForeignKey(x => x.IdInstitution).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ProfessorEvaluation>(e =>
        {
            e.HasKey(x => x.IdEval);
            e.Property(x => x.Rating).IsRequired();
            e.Property(x => x.Comment).HasMaxLength(512);
            e.HasOne(x => x.Professor).WithMany()
                .HasForeignKey(x => x.IdProf).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Student).WithMany()
                .HasForeignKey(x => x.IdStud).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Schedule>(e =>
        {
            e.HasKey(x => x.IdSchedule);
            e.Property(x => x.Day).HasConversion<int>().IsRequired();
            e.HasOne(x => x.Subject).WithMany()
                .HasForeignKey(x => x.IdSub).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Professor).WithMany()
                .HasForeignKey(x => x.IdProf).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.ClassRoom).WithMany()
                .HasForeignKey(x => x.IdClassR).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Attendance>(e =>
        {
            e.HasKey(x => x.IdAttendance);
            e.Property(x => x.Status).HasConversion<int>().IsRequired();
            e.HasIndex(x => new { x.IdSub, x.IdStud, x.Date }).IsUnique();
            e.HasOne(x => x.Subject).WithMany()
                .HasForeignKey(x => x.IdSub).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Student).WithMany()
                .HasForeignKey(x => x.IdStud).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Notification>(e =>
        {
            e.HasKey(x => x.IdNotification);
            e.Property(x => x.UserId).IsRequired().HasMaxLength(64);
            e.Property(x => x.SenderUserId).HasMaxLength(64);
            e.Property(x => x.Title).IsRequired().HasMaxLength(128);
            e.Property(x => x.Message).IsRequired().HasMaxLength(1024);
            e.Property(x => x.Type).HasConversion<int>().IsRequired();
            e.Property(x => x.Module).HasMaxLength(32);
        });

        modelBuilder.Entity<Reservation>(e =>
        {
            e.HasKey(x => x.IdReservation);
            e.HasOne(x => x.Professor).WithMany()
                .HasForeignKey(x => x.IdProf).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.ClassRoom).WithMany()
                .HasForeignKey(x => x.IdClassR).OnDelete(DeleteBehavior.Restrict);
            e.HasOne(x => x.Subject).WithMany()
                .HasForeignKey(x => x.IdSub).OnDelete(DeleteBehavior.Restrict);
            e.HasMany(x => x.Means).WithMany()
                .UsingEntity("ReservationTechnologicalMeans");
        });

        modelBuilder.Entity<AuditLog>(e =>
        {
            e.HasKey(x => x.IdLog);
            e.Property(x => x.UserId).IsRequired().HasMaxLength(64);
            e.Property(x => x.UserName).IsRequired().HasMaxLength(64);
            e.Property(x => x.Action).IsRequired().HasMaxLength(128);
            e.Property(x => x.Module).IsRequired().HasMaxLength(64);
            e.Property(x => x.Details).HasMaxLength(512);
            e.Property(x => x.Ip).HasMaxLength(64);
            e.Property(x => x.Type).HasConversion<int>().IsRequired();
        });

        modelBuilder.Entity<UserPreferences>(e =>
        {
            e.HasKey(x => x.IdPreferences);
            e.Property(x => x.UserId).IsRequired().HasMaxLength(64);
            e.HasIndex(x => x.UserId).IsUnique();
            e.Property(x => x.Theme).HasMaxLength(16);
        });
    }

    private static void ConfigureExistingEntities(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Administrator>(e =>
        {
            e.HasKey(x => x.AdminId);
            e.Property(x => x.AdminName).IsRequired().HasMaxLength(64);
            e.Property(x => x.UserId).IsRequired().HasMaxLength(64);
            e.Property(x => x.AdminSalary).IsRequired();
        });

        modelBuilder.Entity<Mean>(e =>
        {
            e.HasKey(x => x.IdMean);
            e.Property(x => x.NameMean).IsRequired().HasMaxLength(32);
            e.Property(x => x.State).IsRequired().HasMaxLength(32);
        });

        modelBuilder.Entity<AuxiliaryMeans>(e =>
            e.Property(x => x.Type).IsRequired().HasMaxLength(16));

        modelBuilder.Entity<ClassRoom>(e =>
        {
            e.HasKey(x => x.IdClassR);
            e.Property(x => x.Location).IsRequired();
            e.Property(x => x.Capacity).HasDefaultValue(30);

            e.HasMany(c => c.Restrictions).WithMany(r => r.ClassRooms)
                .UsingEntity<ClassRoomRestriction>(
                    j => j.HasOne(x => x.Restriction).WithMany().HasForeignKey(x => x.IdRest),
                    j => j.HasOne(x => x.ClassRoom).WithMany().HasForeignKey(x => x.IdClassRoom),
                    j => j.HasKey(x => x.IdClassRoomRest));

            e.HasMany(c => c.TechnologicalMeans).WithMany(t => t.ClassRooms)
                .UsingEntity<ClassRoomTechMean>(
                    j => j.HasOne(x => x.TechnologicalMeans).WithMany().HasForeignKey(x => x.IdTechMean),
                    j => j.HasOne(x => x.ClassRoom).WithMany().HasForeignKey(x => x.IdClassRoom),
                    j => j.HasKey(x => x.IdClassRoomTech));
        });

        modelBuilder.Entity<Course>(e =>
        {
            e.HasKey(x => x.IdC);
            e.Property(x => x.CourseName).IsRequired();
        });

        modelBuilder.Entity<Maintenance>(e =>
        {
            e.HasKey(x => x.IdM);
            e.Property(x => x.MaintenanceDate).IsRequired();
            e.Property(x => x.Cost).IsRequired();
            e.Property(x => x.TypeOfMean).HasConversion<int>().IsRequired();

            e.HasOne(x => x.AuxMean).WithMany(a => a.Maintenances)
                .HasForeignKey(x => x.IdAuxMean).IsRequired(false);
            e.HasOne(x => x.TechnologicalMean).WithMany(t => t.Maintenances)
                .HasForeignKey(x => x.IdTechMean).IsRequired(false);
        });

        modelBuilder.Entity<Professor>(e =>
        {
            e.HasKey(x => x.IdProf);
            e.Property(x => x.UserId).IsRequired().HasMaxLength(64);
            e.Property(x => x.NameProf).IsRequired().HasMaxLength(64);
            e.Property(x => x.Contract).IsRequired().HasMaxLength(20);
            e.Property(x => x.Spec).IsRequired().HasMaxLength(20);

            e.HasMany(p => p.ClassRooms).WithMany(c => c.Professors)
                .UsingEntity<ProfessorClassRoom>(
                    j => j.HasOne(x => x.ClassRoom).WithMany().HasForeignKey(x => x.IdClassR),
                    j => j.HasOne(x => x.Professor).WithMany().HasForeignKey(x => x.IdProf),
                    j => j.HasKey(x => x.IdProfClass));

            e.HasMany(p => p.Subjects).WithMany(s => s.Professors)
                .UsingEntity<ProfessorSubject>(
                    j => j.HasOne(x => x.Subject).WithMany().HasForeignKey(x => x.IdSub),
                    j => j.HasOne(x => x.Professor).WithMany().HasForeignKey(x => x.IdProf),
                    j => j.HasKey(x => x.IdProfSub));

            e.HasMany(p => p.StudentSubjects).WithMany(ss => ss.Professors)
                .UsingEntity<ProfessorStudentSubject>(
                    j => j.HasOne(x => x.StudentSubject).WithMany().HasForeignKey(x => x.IdStudSub),
                    j => j.HasOne(x => x.Professor).WithMany().HasForeignKey(x => x.IdProf),
                    j =>
                    {
                        j.HasKey(x => x.IdProfStudSub);
                        j.Property(x => x.StudentGrades).HasDefaultValue(0);
                    });
        });

        modelBuilder.Entity<ProfessorPunishment>(e =>
        {
            e.HasKey(x => x.IdPun);
            e.HasOne(x => x.Professor).WithMany().HasForeignKey(x => x.IdProf);
            e.Property(x => x.PunishmentDate).IsRequired();
        });

        modelBuilder.Entity<Restriction>(e =>
        {
            e.HasKey(x => x.IdRes);
            e.Property(x => x.NameRes).IsRequired().HasMaxLength(16);
        });

        modelBuilder.Entity<Secretary>(e =>
        {
            e.HasKey(x => x.IdS);
            e.Property(x => x.NameS).IsRequired().HasMaxLength(64);
            e.Property(x => x.UserId).IsRequired();

            e.HasMany(s => s.Evaluations).WithMany(pss => pss.Secretaries)
                .UsingEntity<SecretaryProfessorStudentSubject>(
                    j => j.HasOne(x => x.Evaluation).WithMany().HasForeignKey(x => x.IdProfStudSub),
                    j => j.HasOne(x => x.Secretary).WithMany().HasForeignKey(x => x.IdSec),
                    j => j.HasKey(x => x.IdSecProfStudSub));
        });

        modelBuilder.Entity<Subject>(e =>
        {
            e.HasKey(x => x.IdSub);
            e.Property(x => x.NameSub).IsRequired().HasMaxLength(16);
            e.Property(x => x.StudyProgram).IsRequired().HasMaxLength(20);
            e.Property(x => x.CourseLoad).IsRequired();

            e.HasOne(s => s.ClassRoom).WithMany(c => c.Subjects)
                .HasForeignKey(s => s.IdClassRoom).OnDelete(DeleteBehavior.Cascade);

            e.HasMany(s => s.AuxiliaryMeans).WithMany(a => a.Subjects)
                .UsingEntity<SubjectAuxMean>(
                    j => j.HasOne(x => x.AuxMean).WithMany().HasForeignKey(x => x.IdAuxMean),
                    j => j.HasOne(x => x.Subject).WithMany().HasForeignKey(x => x.IdSub),
                    j => j.HasKey(x => x.IdSubAuxMean));
        });

        modelBuilder.Entity<ProfStudSubCourse>(e =>
        {
            e.HasKey(x => x.IdProfStudSubCourse);
            e.HasOne(x => x.Professor).WithMany().HasForeignKey(x => x.IdProf).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Subject).WithMany().HasForeignKey(x => x.IdSub).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Student).WithMany().HasForeignKey(x => x.IdStud).OnDelete(DeleteBehavior.NoAction);
            e.HasOne(x => x.Course).WithMany().HasForeignKey(x => x.IdCourse).OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<MeanNotification>(e =>
        {
            e.HasKey(x => x.MeanNotId);
            e.Property(x => x.MeanName).IsRequired();
            e.Property(x => x.MeanType).IsRequired();
        });

        modelBuilder.Entity<ProfessorNotification>(e =>
        {
            e.HasKey(x => x.ProfNotId);
            e.Property(x => x.ProfName).IsRequired();
            e.HasOne(x => x.Professor).WithMany().HasForeignKey(x => x.IdProf);
        });
    }

    private static void ApplySoftDeleteFilters(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType)) continue;
            if (entityType.ClrType.IsAbstract) continue;
            if (entityType.BaseType != null && entityType.BaseType.ClrType == typeof(Mean)) continue;

            var parameter = Expression.Parameter(entityType.ClrType, "e");
            var body = Expression.Equal(
                Expression.Property(parameter, nameof(ISoftDeletable.IsDeleted)),
                Expression.Constant(false));
            var lambda = Expression.Lambda(body, parameter);
            modelBuilder.Entity(entityType.ClrType).HasQueryFilter(lambda);
        }
    }
}