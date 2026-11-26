using infra.Entities;

namespace service.Auth;

public interface IAuthorizationService
{
    string GenerateToken(User user);
}