using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using infra.Entities;
using Microsoft.Extensions.Configuration;
using service.Auth;
using service.Security;

namespace integrationTests;

public class AuthTests
{
    [Fact]
    public void HashAndSaltPassword_GenerateUniqueSalts_VerifiesCorrectPassword()
    {
        var hasher = new Argon2PasswordHasher();

        var hash1 = hasher.HashAndSaltPassword("Test1234");
        var hash2 = hasher.HashAndSaltPassword("Test1234");
        
        Assert.NotEqual(hash1,hash2);
        Assert.True(hasher.VerifyHashedPassword("Test1234", hash1));
        Assert.False(hasher.VerifyHashedPassword("WrongPassword", hash2));
    }

    [Fact]
    public void GenerateToken_IncludesClaimsIssuerAudienceExpiry()
    {
        var config = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["JwtSecret"] = "TestOnlyJwtSecretKey_MustBeAtLeast32BytesLong"
        })
            .Build();

        var jwtService = new JWTAuthorizationService(config);
        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "Anna Jensen",
            Email = "anna.jensen@businessesbjerg.com",
            Role = Role.Employee
        };

        var tokenString = jwtService.GenerateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);
        
        Assert.Equal(JWTAuthorizationService.Issuer, jwt.Issuer);
        Assert.Contains(JWTAuthorizationService.Audience, jwt.Audiences);
        Assert.Equal(user.Id.ToString(), jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        Assert.Equal(user.Email, jwt.Claims.First(c => c.Type == ClaimTypes.Email).Value);
        Assert.Equal(user.Name, jwt.Claims.First(c => c.Type == ClaimTypes.Name).Value);
        Assert.Equal(nameof(Role.Employee), jwt.Claims.First(c=> c.Type ==ClaimTypes.Role).Value);
        Assert.True(jwt.ValidTo > DateTime.UtcNow.AddMinutes(55));
    }
}
