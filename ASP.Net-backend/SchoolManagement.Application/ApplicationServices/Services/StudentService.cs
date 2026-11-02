using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Student;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Common;
using SchoolManagement.Domain.Entities;
using SchoolManagement.Domain.Relations;
using SchoolManagement.Infrastructure.Common.GenericInterface;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class StudentService
    : BaseService<Student, StudentDto, StudentResponseDto>, IStudentService
{
    private readonly IUserRegistrationService _userRegistration;
    private readonly IValidationService _validation;
    private readonly IAverageCalculator _average;
    private readonly IIdentityManager _identityManager;

    public StudentService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        ILogger<StudentService> logger,
        IUserRegistrationService userRegistration,
        IValidationService validation,
        IAverageCalculator average,
        IIdentityManager identityManager)   
        : base(unitOfWork, mapper, logger)
    {
        _userRegistration = userRegistration;
        _validation = validation;
        _average = average;
        _identityManager = identityManager;   
    }


    public override Task<Result<StudentResponseDto>> CreateAsync(
        StudentDto dto, CancellationToken cancellationToken = default)
        => throw new NotSupportedException("Usa CreateWithUserAsync para crear un estudiante.");

        public async Task<Result<StudentCreateResponseDto>> CreateWithUserAsync(
        StudentDto dto, CancellationToken cancellationToken = default)
    {
        if (!_validation.IsValidName(dto.Name1))
            return Result.Failure<StudentCreateResponseDto>(Error.Validation("Name1 es requerido."));

        if (!_validation.IsValidName(dto.LastName1))
            return Result.Failure<StudentCreateResponseDto>(Error.Validation("LastName1 es requerido."));

        if (string.IsNullOrWhiteSpace(dto.Email))
            return Result.Failure<StudentCreateResponseDto>(Error.Validation("Email es requerido."));

        if (string.IsNullOrWhiteSpace(dto.DocNumber))
            return Result.Failure<StudentCreateResponseDto>(Error.Validation("DocNumber es requerido."));

        var course = await UnitOfWork.Repository<Course>().GetByIdAsync(dto.IdC, cancellationToken);
        if (course is null)
            return Result.NotFound<StudentCreateResponseDto>("Course", dto.IdC);

        try
        {
            var (user, password) = await _userRegistration.RegisterUserAsync(
                Roles.Student, dto.Name1, dto.LastName1, course.IdInstitution, cancellationToken);

            var entity = Mapper.Map<Student>(dto);
            entity.UserId = user.Id;
            entity.Course = course;
            entity.IdC = course.IdC;
            entity.IdInstitution = course.IdInstitution;

            await Repository.AddAsync(entity, cancellationToken);
            await UnitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success(new StudentCreateResponseDto
            {
                Id = entity.IdStud,
                IdC = entity.IdC,
                Student = Mapper.Map<StudentDto>(entity),
                UserName = user.UserName ?? string.Empty,
                Password = password
            });
        }
        catch (InvalidOperationException ex)
        {
            Logger.LogError(ex, "Error creando estudiante {Name}", dto.Name1);
            return Result.Failure<StudentCreateResponseDto>(Error.Failure(ex.Message));
        }
    }

        public override async Task<Result<StudentResponseDto>> UpdateAsync(
        int id, StudentDto dto, CancellationToken cancellationToken = default)
    {
        if (!_validation.IsValidName(dto.Name1))
            return Result.Failure<StudentResponseDto>(Error.Validation("Name1 es requerido."));

        if (!_validation.IsValidName(dto.LastName1))
            return Result.Failure<StudentResponseDto>(Error.Validation("LastName1 es requerido."));

        var entity = await Repository.GetByIdAsync(id, cancellationToken);
        if (entity is null)
            return Result.NotFound<StudentResponseDto>("Student", id);

        var course = await UnitOfWork.Repository<Course>().GetByIdAsync(dto.IdC, cancellationToken);
        if (course is null)
            return Result.NotFound<StudentResponseDto>("Course", dto.IdC);

        Mapper.Map(dto, entity);
        entity.Course = course;
        entity.IdC = course.IdC;
        Repository.Update(entity);
        await UnitOfWork.SaveChangesAsync(cancellationToken);

        return Result.Success(Mapper.Map<StudentResponseDto>(entity));
    }

        public async Task<Result<IReadOnlyList<StudentInfoBad>>> GetBadStudentsAsync(
        CancellationToken cancellationToken = default)
    {
        var students = await Repository.ListAsync(cancellationToken);
        var result = new List<StudentInfoBad>();

        foreach (var student in students)
        {
            var studentSubjects = await UnitOfWork.Repository<StudentSubject>().Query()
                .Where(ss => ss.IdStud == student.IdStud)
                .ToListAsync(cancellationToken);

            var badSubjectsCount = 0;
            foreach (var ss in studentSubjects)
            {
                var grades = await UnitOfWork.Repository<ProfessorStudentSubject>().Query()
                    .Where(pss => pss.IdStudSub == ss.IdStudSub)
                    .Select(pss => pss.StudentGrades)
                    .ToListAsync(cancellationToken);

                var avg = _average.GetAverage(grades);
                if (avg >= 0 && avg < 5) badSubjectsCount++; // 0–10 → <5 = bajo
            }

            if (badSubjectsCount < 2) continue;

            var professorEvals = await UnitOfWork.Repository<ProfStudSubCourse>().Query()
                .Where(e => e.IdStud == student.IdStud && e.IdCourse == student.IdC)
                .Select(e => e.Evaluation)
                .ToListAsync(cancellationToken);

            var courseName = (await UnitOfWork.Repository<Course>()
                .GetByIdAsync(student.IdC, cancellationToken))?.CourseName ?? string.Empty;

            var fullName = $"{student.Name1} {student.LastName1}".Trim();

            result.Add(new StudentInfoBad
            {
                StudentId = student.IdStud,
                StudentName = fullName,
                Curso = courseName,
                ProfessorsAvarageEvaluation = _average.GetAverage(professorEvals)
            });
        }

        return Result.Success<IReadOnlyList<StudentInfoBad>>(result);
    }

    public async Task<Result<IReadOnlyList<StudentGradeDto>>> GetMyGradesAsync(
        string userName, CancellationToken cancellationToken = default)
    {
        var user = await _identityManager.FindByUserNameAsync(userName);
        if (user is null)
            return Result.NotFound<IReadOnlyList<StudentGradeDto>>("User", userName);

        var student = await UnitOfWork.Repository<Student>().Query()
            .FirstOrDefaultAsync(s => s.UserId == user.Id, cancellationToken);
        if (student is null)
            return Result.NotFound<IReadOnlyList<StudentGradeDto>>("Student", userName);

        var grades = await UnitOfWork.Repository<ProfessorStudentSubject>().Query()
            .Include(pss => pss.StudentSubject).ThenInclude(ss => ss.Subject)
            .Include(pss => pss.Professor)
            .Where(pss => pss.StudentSubject.IdStud == student.IdStud)
            .Select(pss => new StudentGradeDto
            {
                IdSub = pss.StudentSubject.IdSub,
                SubjectName = pss.StudentSubject.Subject.NameSub,
                Grade = pss.StudentGrades,
                TeacherName = pss.Professor.NameProf
            })
            .ToListAsync(cancellationToken);

        return Result.Success<IReadOnlyList<StudentGradeDto>>(grades);
    }
}