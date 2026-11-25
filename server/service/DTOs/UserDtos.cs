using infra.Entities;

namespace service.DTOs;

    public record CreateUserRequestDto(
        string Name,
        string Email,
        string Password,
        Role Role);

    public record UpdateUserRequestDto(
        string Name,
        string Email,
        Role role);

    public record UserResponseDto(
        Guid id,
        string Name,
        string Email,
        Role role);
        