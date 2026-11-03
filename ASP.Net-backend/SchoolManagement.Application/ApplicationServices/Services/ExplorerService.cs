using Microsoft.EntityFrameworkCore;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Explorer;
using SchoolManagement.Application.Common;
using SchoolManagement.Infrastructure.Common.GenericInterface;

namespace SchoolManagement.Application.ApplicationServices.Services;

public class ExplorerService : IExplorerService
{
    private readonly IUnitOfWork _unitOfWork;

    public ExplorerService(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result<ExplorerTreeDto>> GetTreeAsync(CancellationToken cancellationToken = default)
    {
        // Cursos
        var courses = await _unitOfWork.Repository<Domain.Entities.Course>().Query()
            .ToListAsync(cancellationToken);

        // Asignaturas
        var subjects = await _unitOfWork.Repository<Domain.Entities.Subject>().Query()
            .ToListAsync(cancellationToken);

        // Estudiantes
        var students = await _unitOfWork.Repository<Domain.Entities.Student>().Query()
            .ToListAsync(cancellationToken);

        // Inscripciones estudiante-asignatura
        var studentSubjects = await _unitOfWork.Repository<Domain.Relations.StudentSubject>().Query()
            .ToListAsync(cancellationToken);

        // Notas
        var grades = await _unitOfWork.Repository<Domain.Relations.ProfessorStudentSubject>().Query()
            .Select(p => new { p.StudentSubject.IdStud, p.StudentSubject.IdSub, p.StudentGrades })
            .ToListAsync(cancellationToken);

        // Profesores
        var professors = await _unitOfWork.Repository<Domain.Entities.Professor>().Query()
            .ToListAsync(cancellationToken);

        // Ratings
        var ratings = await _unitOfWork.Repository<Domain.Entities.ProfessorEvaluation>().Query()
            .GroupBy(e => e.IdProf)
            .Select(g => new { IdProf = g.Key, Avg = g.Average(e => e.Rating) })
            .ToListAsync(cancellationToken);
        var ratingById = ratings.ToDictionary(r => r.IdProf, r => (double)r.Avg);

        var tree = new ExplorerTreeDto();

        foreach (var course in courses)
        {
            var courseDto = new ExplorerCourseDto
            {
                IdC = course.IdC,
                CourseName = course.CourseName
            };

            var courseStudents = students.Where(s => s.IdC == course.IdC).ToList();
            var courseStudentIds = courseStudents.Select(s => s.IdStud).ToHashSet();

            foreach (var subject in subjects)
            {
                var subjectStudents = studentSubjects
                    .Where(ss => ss.IdSub == subject.IdSub && courseStudentIds.Contains(ss.IdStud))
                    .ToList();

                if (subjectStudents.Count == 0) continue;

                var subjectDto = new ExplorerSubjectDto
                {
                    IdSub = subject.IdSub,
                    NameSub = subject.NameSub,
                    StudyProgram = subject.StudyProgram
                };

                foreach (var ss in subjectStudents)
                {
                    var student = courseStudents.FirstOrDefault(s => s.IdStud == ss.IdStud);
                    if (student is null) continue;

                    var studentGrades = grades
                        .Where(g => g.IdStud == ss.IdStud && g.IdSub == ss.IdSub)
                        .Select(g => g.StudentGrades)
                        .ToList();
                    var avg = studentGrades.Count == 0 ? 0 : Math.Round(studentGrades.Average(), 2);

                    var age = DateTime.UtcNow.Year - student.BirthDate.Year;
                    if (student.BirthDate.Date > DateTime.UtcNow.AddYears(-age)) age--;

                    subjectDto.Students.Add(new ExplorerStudentDto
                    {
                        IdStud = student.IdStud,
                        FullName = $"{student.Name1} {student.LastName1}".Trim(),
                        Age = age,
                        Absences = ss.NJAbsents,
                        Average = avg
                    });
                }

                if (subjectDto.Students.Count > 0)
                    courseDto.Subjects.Add(subjectDto);
            }

            if (courseDto.Subjects.Count > 0)
                tree.Courses.Add(courseDto);
        }

        // Profesores
        foreach (var prof in professors)
        {
            tree.Professors.Add(new ExplorerProfessorDto
            {
                IdProf = prof.IdProf,
                Name = prof.NameProf,
                Spec = prof.Spec,
                Salary = prof.Salary,
                AverageRating = ratingById.TryGetValue(prof.IdProf, out var r) ? Math.Round(r, 1) : 0,
                Experience = prof.LaboralExperience
            });
        }

        return Result.Success(tree);
    }
}