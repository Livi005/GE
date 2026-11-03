using SchoolManagement.Application.ApplicationServices.Maps_Dto.Student;
using SchoolManagement.Application.Common;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IStudentService : IBaseService<StudentDto, StudentResponseDto>
{
    Task<Result<StudentCreateResponseDto>> CreateWithUserAsync(
        StudentDto dto, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<StudentInfoBad>>> GetBadStudentsAsync(
        CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<StudentGradeDto>>> GetMyGradesAsync(
        string userName, CancellationToken cancellationToken = default);

    Task<Result<IReadOnlyList<StudentProfessorDto>>> GetMyProfessorsAsync(
        string userName, CancellationToken cancellationToken = default);
}