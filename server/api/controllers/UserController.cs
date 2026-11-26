using System.ComponentModel.DataAnnotations;
using infra.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service;
using service.DTOs;

namespace api.controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController(UserService service) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = $"{nameof(Role.Accountant)},{nameof(Role.SystemOwner)}")]
    [ProducesResponseType(typeof(List<UserResponseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<UserResponseDto>>> GetUsers()
    {
        var users = await service.GetUsersAsync();
        return Ok(users);
    }

    [HttpPost]         
    [Authorize(Roles = nameof(Role.SystemOwner))]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)] public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] CreateUserRequestDto dto)
    {
        try
        {
            var createdUser = await service.CreateUserAsync(dto);
            return StatusCode(StatusCodes.Status201Created, createdUser);
        }
        catch (ValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

}