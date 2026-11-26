using Microsoft.AspNetCore.Mvc;
using service;
using service.DTOs;

namespace api.controllers;

[ApiController]
[Route("api/controller")]
public class AuthController(AuthService authService) : ControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]   
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginRequestDto dto)
    {
        try
        {
            var result = await authService.LoginAsync(dto);
            return Ok(result);

        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
}