using SchoolManagement.Application.ApplicationServices.Maps_Dto.Explorer;
using SchoolManagement.Application.Common;

namespace SchoolManagement.Application.ApplicationServices.IServices;

public interface IExplorerService
{
    Task<Result<ExplorerTreeDto>> GetTreeAsync(CancellationToken cancellationToken = default);
}