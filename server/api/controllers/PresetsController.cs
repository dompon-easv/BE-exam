using infra.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service;
using service.DTOs;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PresetsController(IPresetService presetService) : ControllerBase
{

    [HttpGet(nameof(GetAgreements))]
    public async Task<List<PresetDtos.VacationAgreementResponseDto>> GetAgreements()
    {
        return await presetService.GetAgreementAsync();
    }

    [HttpPost(nameof(CreateAgreement))]
    [Authorize(Roles = nameof(Role.SystemOwner))]
    public async Task<PresetDtos.VacationAgreementResponseDto> CreateAgreement(
        [FromBody] PresetDtos.CreateVacationAgreementDto dto)
    {
        return await presetService.CreateAgreementAsync(dto);
    }

    [HttpPut(nameof(UpdateAgreement))]
    [Authorize(Roles = nameof(Role.SystemOwner))]
    public async Task<bool> UpdateAgreement(
        Guid id, 
        [FromBody] PresetDtos.UpdateVacationAgreementDto dto)
    {
        return await presetService.UpdateAgreementAsync(id, dto);
    }

    [HttpDelete(nameof(DeleteAgreement))]
    [Authorize(Roles = nameof(Role.SystemOwner))]
    public async Task<bool> DeleteAgreement(Guid id)
    {
        return await presetService.DeleteAgreementAsync(id);
    }

    [HttpGet(nameof(GetClosedDays))]
    public async Task<List<PresetDtos.ClosedDayDto>> GetClosedDays()
    {
        return await presetService.GetClosedDayAsync();
    }

    [HttpPost(nameof(CreateClosedDay))]
    [Authorize(Roles = nameof(Role.SystemOwner))]
    public async Task<PresetDtos.ClosedDayDto> CreateClosedDay(
        [FromBody] PresetDtos.UpsertClosedDayDto dto)
    {
        return await presetService.CreateClosedDayAsync(dto);
    }

    [HttpPut(nameof(UpdateClosedDay))]
    [Authorize(Roles = nameof(Role.SystemOwner))]
    public async Task<bool> UpdateClosedDay(
        Guid id, 
        [FromBody] PresetDtos.UpsertClosedDayDto dto)
    {
        return await presetService.UpdateClosedDayAsync(id, dto);
    }

    [HttpDelete(nameof(DeleteClosedDay))]
    [Authorize(Roles = nameof(Role.SystemOwner))]
    public async Task<bool> DeleteClosedDay(Guid id)
    {
        return await presetService.DeleteClosedDayAsync(id);
    }
    
    [HttpPost(nameof(SyncHolidays))]
    [Authorize(Roles = nameof(Role.SystemOwner))]
    public async Task<int> SyncHolidays(int year, string countryCode = "DK")
    {
        return await presetService.SyncPublicHolidaysAsync(year, countryCode);
    }
}