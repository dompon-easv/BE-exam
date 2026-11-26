using infra.data;
using LinqToDB.Async;
using service.Auth;
using service.DTOs;
using service.Security;

namespace service;

public class AuthService(
    AppDataConnection db,
    IPasswordHasher hasher,
    IAuthorizationService authorizationService)
{
    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(
            u => u.Email.ToLower() == dto.Email.Trim().ToLower());

        if (user == null || !hasher.VerifyHashedPassword(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }
        
        //placeholder for jwt
        string token = authorizationService.GenerateToken(user);

        return new AuthResponseDto(
            user.Id,
            user.Name,
            user.Email,
            user.Role,
            token);
    }
}