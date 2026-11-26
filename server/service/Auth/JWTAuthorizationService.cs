using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using infra.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace service.Auth;

public class JWTAuthorizationService(IConfiguration configuration) : IAuthorizationService
{

    public const string Issuer = "be-exam-api";
    public const string Audience = "be-exam-api";

    private readonly SymmetricSecurityKey _key = new(Encoding.UTF8.GetBytes(
        configuration["JwtSecret"] ?? throw new InvalidOperationException("JwtSecret is missing.")));
    
    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: new SigningCredentials(_key, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}