using System.ComponentModel.DataAnnotations;
using infra.data;
using infra.Entities;
using LinqToDB;
using LinqToDB.Async;
using service.DTOs;
using service.Security;

namespace service;

public class UserService(AppDataConnection db, IPasswordHasher hasher)
{

    public async Task<List<UserResponseDto>> GetUsersAsync()
    {
        return await db.Users
            .Select(u => new UserResponseDto(u.Id, u.Name, u.Email, u.Role))
            .ToListAsync();
    }

    public async Task<UserResponseDto> CreateUserAsync(CreateUserRequestDto dto)
    {
        string normalisedEmail = dto.Email.Trim().ToLower();
        if (!normalisedEmail.EndsWith("@businessesbjerg.com", StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException("Error must belong to the @businessesbjerg.com domain"); 
        }

        bool exists = await db.Users.AnyAsync(u => u.Email.ToLower() == normalisedEmail);
        if (exists)
        {
            throw new ValidationException($"A user with email '{dto.Email} already exists");
        }
        if (dto.Role == Role.SystemOwner && await db.Users.AnyAsync(u => u.Role == Role.SystemOwner))                                                           
        {                                                                                                                                                       
            throw new ValidationException("Only one System Owner is permitted in the organization.");                                                     
        } 
        
        if (dto.Role == Role.Accountant && await db.Users.AnyAsync(u => u.Role == Role.Accountant))                                                             
        {                                                                                                                                                       
            throw new ValidationException("Only one Accountant is permitted in the organization.");                
        }

        string hashedPassword = hasher.HashAndSaltPassword(dto.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Email = normalisedEmail,
            PasswordHash = hashedPassword,
            Role = dto.Role
        };

        await db.InsertAsync(user);

        return new UserResponseDto(user.Id, user.Name, user.Email, user.Role);


    }
}