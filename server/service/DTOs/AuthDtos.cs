using infra.Entities;

namespace service.DTOs;

    public record LoginRequestDto(
        string Email,
        string Password)
        ;

    public record AuthResponseDto(
        Guid id,
        string Name,
        string Email,
        Role Role,
        string Token ); //jwt
