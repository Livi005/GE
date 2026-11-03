using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Xunit;
namespace SchoolManagement.Api.Tests;

public class AuthHttpTests : IClassFixture<ApiFactory>
{
    private readonly ApiFactory factory;
    public AuthHttpTests(ApiFactory factory) => this.factory = factory;
    [Fact]
    public async Task Invalid_login_returns_401_with_message()
    {
        using var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/identity/login", new { userName = "Student", password = "incorrect" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.False(string.IsNullOrWhiteSpace(body.GetProperty("message").GetString()));
    }
    [Theory]
    [InlineData("Student", "/dashboard/student/vivi.test")]
    [InlineData("Professor", "/dashboard/professor/vivi.test")]
    [InlineData("Director", "/dashboard/admin")]
    [InlineData("Secretary", "/dashboard/secretary")]
    [InlineData("Maintenance", "/dashboard/maintenance")]
    [InlineData("YearHead", "/dashboard/yearhead/vivi.test")]
    [InlineData("SuperAdmin", "/dashboard/admin")]
    public async Task Login_token_opens_allowed_dashboard(string role, string path)
    {
        using var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/identity/login", new { userName = role, password = "Test-only-pass1" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(role, body.GetProperty("role").GetString());
        Assert.Equal("vivi.test", body.GetProperty("userName").GetString());
        Assert.Equal(7, body.GetProperty("institutionId").GetInt32());
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", body.GetProperty("token").GetString());
        Assert.Equal(HttpStatusCode.OK, (await client.GetAsync(path)).StatusCode);
    }
    [Theory]
    [InlineData("/dashboard/admin")][InlineData("/dashboard/student/vivi.test")]
    [InlineData("/dashboard/professor/vivi.test")][InlineData("/dashboard/secretary")]
    [InlineData("/dashboard/maintenance")][InlineData("/dashboard/yearhead/vivi.test")]
    public async Task Anonymous_cannot_open_dashboard(string path)
    {
        using var client = factory.CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync(path)).StatusCode);
    }
    [Theory]
    [InlineData("Student", "/dashboard/admin")]
    [InlineData("Professor", "/dashboard/maintenance")]
    [InlineData("Maintenance", "/dashboard/secretary")]
    [InlineData("YearHead", "/dashboard/student/vivi.test")]
    public async Task Wrong_role_returns_403(string role, string path)
    {
        using var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiFactory.Token(role));
        Assert.Equal(HttpStatusCode.Forbidden, (await client.GetAsync(path)).StatusCode);
    }
    [Fact]
    public async Task Expired_token_returns_401()
    {
        using var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiFactory.Token("Director", DateTime.UtcNow.AddMinutes(-1)));
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/dashboard/admin")).StatusCode);
    }
    [Fact]
    public async Task Dashboard_returns_plain_camelCase_DTO()
    {
        using var client = factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiFactory.Token("Director"));
        var response = await client.GetAsync("/dashboard/admin");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(23, body.GetProperty("totalStudents").GetInt32());
        Assert.False(body.TryGetProperty("value", out _));
    }
}
