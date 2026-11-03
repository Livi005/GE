using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Moq;
using SchoolManagement.Application.ApplicationServices.IServices;
using SchoolManagement.Application.ApplicationServices.Maps_Dto;
using SchoolManagement.Application.ApplicationServices.Maps_Dto.Dashboard;
using SchoolManagement.Application.Common;
using SchoolManagement.Domain.Common;
using SchoolManagement.Infrastructure.Identity;
using SchoolManagement.Infrastructure;

namespace SchoolManagement.Api.Tests;

public class ApiFactory : WebApplicationFactory<Program>
{
    // Exclusivamente para estas pruebas: nunca se usa una clave de la aplicación.
    private const string Secret = "GE-tests-only-signing-key-012345678901234567890123456789";
    public static string Token(string role, DateTime? expires = null) => new JwtSecurityTokenHandler().WriteToken(
        new JwtSecurityToken("ge-tests", "ge-tests", new[] { new Claim(ClaimTypes.Name, "vivi.test"), new Claim(ClaimTypes.Role, role) },
            expires: expires ?? DateTime.UtcNow.AddMinutes(5),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Secret)), SecurityAlgorithms.HmacSha256)));

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing"); // Evita InitializeDatabaseAsync de Development.
        builder.ConfigureServices(services =>
        {
            // Si una dependencia intenta usar la BD real, la prueba falla antes de conectarse.
            services.RemoveAll<Context>();
            services.AddScoped<Context>(_ => throw new InvalidOperationException("Las pruebas HTTP aisladas no pueden abrir una base de datos."));
            services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuer = true, ValidIssuer = "ge-tests", ValidateAudience = true, ValidAudience = "ge-tests",
                    ValidateLifetime = true, ValidateIssuerSigningKey = true, ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Secret))
                };
            });
            var identity = new Mock<IIdentityService>(MockBehavior.Strict);
            identity.Setup(x => x.CheckCredentialsAsync(It.IsAny<LoginDto>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync((LoginDto dto, CancellationToken _) => dto.Password == "Test-only-pass1" && dto.UserName is not null && Roles.All.Contains(dto.UserName)
                    ? (true, Token(dto.UserName), dto.UserName, "vivi.test", false, (int?)7, "light")
                    : (false, "", "", "", false, (int?)null, "light"));
            services.RemoveAll<IIdentityService>(); services.AddSingleton(identity.Object);
            var dashboard = new Mock<IDashboardService>(MockBehavior.Strict);
            dashboard.Setup(x => x.GetAdminDashboardAsync(It.IsAny<CancellationToken>())).ReturnsAsync(Result.Success(new AdminDashboardDto { TotalStudents = 23 }));
            dashboard.Setup(x => x.GetSecretaryDashboardAsync(It.IsAny<CancellationToken>())).ReturnsAsync(Result.Success(new SecretaryDashboardDto()));
            dashboard.Setup(x => x.GetMaintenanceDashboardAsync(It.IsAny<CancellationToken>())).ReturnsAsync(Result.Success(new MaintenanceDashboardDto()));
            dashboard.Setup(x => x.GetYearHeadDashboardAsync(It.IsAny<string>(), It.IsAny<CancellationToken>())).ReturnsAsync(Result.Success(new YearHeadDashboardDto()));
            dashboard.Setup(x => x.GetStudentDashboardAsync(It.IsAny<string>())).ReturnsAsync(Result.Success(new StudentDashboardDto()));
            dashboard.Setup(x => x.GetProfessorDashboardAsync(It.IsAny<string>())).ReturnsAsync(Result.Success(new ProfessorDashboardDto()));
            services.RemoveAll<IDashboardService>(); services.AddSingleton(dashboard.Object);
            services.RemoveAll<IIdentityManager>(); services.AddSingleton(Mock.Of<IIdentityManager>());
            services.RemoveAll<IAuditLogService>(); services.AddSingleton(Mock.Of<IAuditLogService>());
        });
    }
}
