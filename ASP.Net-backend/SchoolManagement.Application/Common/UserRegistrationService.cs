using SchoolManagement.Infrastructure.Identity;

namespace SchoolManagement.Application.Common;

public interface IUserRegistrationService
{
    Task<(User User, string Password)> RegisterUserAsync(
        string role,
        string name,
        string lastName,
        int? institutionId,
        CancellationToken cancellationToken = default);
}

public class UserRegistrationService : IUserRegistrationService
{
    private readonly IIdentityManager _identityManager;
    private static readonly Random _random = new();
    private const string PasswordChars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

    public UserRegistrationService(IIdentityManager identityManager)
        => _identityManager = identityManager;

    public async Task<(User User, string Password)> RegisterUserAsync(
        string role,
        string name,
        string lastName,
        int? institutionId,
        CancellationToken cancellationToken = default)
    {
        var userName = BuildUserName(role, name, lastName);
        var password = GeneratePassword(12);

        var user = new User
        {
            UserName = userName,
            Email = $"{userName}@lyra.local"
        };

        var (succeeded, created, errors) = await _identityManager.CreateUserAsync(user, password);
        if (!succeeded || created is null)
            throw new InvalidOperationException(
                $"No se pudo crear el usuario: {string.Join(", ", errors)}");

        var (roleOk, roleErrors) = await _identityManager.AddRoleAsync(created.Id, role);
        if (!roleOk)
            throw new InvalidOperationException(
                $"No se pudo asignar el rol: {string.Join(", ", roleErrors)}");

        return (created, password);
    }

    /// <summary>
    /// Convención: <c>rol.nombre.apellido</c>, minúsculas, sin tildes, sin espacios.
    /// Ej: prof.juan.gomez, alumno.pedro.torres, jefe.maria.soto.
    /// </summary>
    public static string BuildUserName(string role, string name, string lastName)
    {
        var prefix = role switch
        {
            "SuperAdmin"   => "superadmin",
            "Director"     => "director",
            "Maintenance"  => "mantenimiento",
            "Secretary"    => "secretaria",
            "Professor"    => "prof",
            "Student"      => "alumno",
            "YearHead"     => "jefe",
            _              => "user"
        };

        var n = Normalize(name);
        var l = Normalize(lastName);
        return $"{prefix}.{n}.{l}".ToLowerInvariant();
    }

    private static string Normalize(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return "x";

        var decomposed = value.Normalize(System.Text.NormalizationForm.FormD);
        var filtered = new string(decomposed
            .Where(c => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c)
                        != System.Globalization.UnicodeCategory.NonSpacingMark)
            .Where(char.IsLetterOrDigit)
            .ToArray());
        return string.IsNullOrWhiteSpace(filtered) ? "x" : filtered.ToLowerInvariant();
    }

    private static string GeneratePassword(int length)
    {
        var chars = new char[length];
        for (int i = 0; i < length; i++)
            chars[i] = PasswordChars[_random.Next(PasswordChars.Length)];

        chars[0] = 'A';
        chars[1] = 'a';
        chars[2] = '1';
        chars[3] = '!';

        return new string(chars);
    }
}