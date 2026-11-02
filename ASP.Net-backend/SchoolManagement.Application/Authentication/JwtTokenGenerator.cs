using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.Authentication;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user, string role);

    /// <summary>
    /// Genera un token con claims extra: isDean e institutionId.
    /// </summary>
    string GenerateToken(User user, string role, bool isDean, int? institutionId);
}

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtSettings _settings;

    public JwtTokenGenerator(IOptions<JwtSettings> settings)
        => _settings = settings.Value;

    public string GenerateToken(User user, string role)
        => GenerateToken(user, role, isDean: false, institutionId: null);

    public string GenerateToken(User user, string role, bool isDean, int? institutionId)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Role, role),
            new("role", role),
            new("isDean", isDean ? "true" : "false")
        };

        if (institutionId.HasValue)
            claims.Add(new Claim("institutionId", institutionId.Value.ToString()));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_settings.ExpiryMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}