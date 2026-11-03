namespace SchoolManagement.Infrastructure.Identity;

public interface IIdentityManager
{
    Task<(bool Succeeded, User? User, IEnumerable<string> Errors)> CreateUserAsync(User user, string password);
    Task<(bool Succeeded, IEnumerable<string> Errors)> AddRoleAsync(string userId, string role);
    Task<bool> CheckCredentialsAsync(string username, string password);
    Task<bool> IsInRoleAsync(string userId, string role);
    Task<User?> FindByUserNameAsync(string username);
    IReadOnlyList<User> ListUsers();

    Task<(bool Succeeded, IEnumerable<string> Errors)> ChangePasswordAsync(
        string userId, string currentPassword, string newPassword);

    Task<IReadOnlyList<string>> GetRolesAsync(string userId);

    Task<(bool Succeeded, IEnumerable<string> Errors)> DeleteUserAsync(string userId);

    Task<(bool Succeeded, IEnumerable<string> Errors)> UpdateUserAsync(User user);
}