using Microsoft.AspNetCore.Mvc.Filters;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Domain.Common;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Api.Middleware;

public class AuditLogFilter : IAsyncActionFilter
{
    private readonly IAuditLogService _auditLogService;
    private readonly IIdentityManager _identityManager;

    public AuditLogFilter(IAuditLogService auditLogService, IIdentityManager identityManager)
    {
        _auditLogService = auditLogService;
        _identityManager = identityManager;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var method = context.HttpContext.Request.Method;
        if (method is not ("POST" or "PUT" or "DELETE"))
        {
            await next();
            return;
        }

        var executedContext = await next();

        // Solo loguear si la acción fue exitosa (2xx)
        var statusCode = (executedContext.Result as Microsoft.AspNetCore.Mvc.ObjectResult)?.StatusCode
                         ?? 200;
        if (statusCode < 200 || statusCode >= 300) return;

        try
        {
            var userName = context.HttpContext.User?.Identity?.Name;
            if (string.IsNullOrWhiteSpace(userName)) return;

            var user = await _identityManager.FindByUserNameAsync(userName);
            if (user is null) return;

            var controller = context.RouteData.Values["controller"]?.ToString() ?? "Unknown";
            var action = context.RouteData.Values["action"]?.ToString() ?? "Unknown";
            var path = context.HttpContext.Request.Path.ToString();

            await _auditLogService.LogAsync(
                user.Id,
                userName,
                $"{method} {action}",
                controller,
                path,
                context.HttpContext.Connection.RemoteIpAddress?.ToString(),
                "Info");
        }
        catch
        {
            // No romper la request si falla el log
        }
    }
}