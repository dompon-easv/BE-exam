using Microsoft.AspNetCore.Mvc;
using service;
using service.DTOs;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PresetsController(IPresetService presetService) : ControllerBase
{

    [HttpGet(nameof(GetAgreements))]
    public async Task<List<VacationAgreementResponseDto>> GetAgreements()
    {
        return await presetService.GetAgreementAsync();
    }

    [HttpPost(nameof(CreateAgreement))]
    public async Task<VacationAgreementResponseDto> CreateAgreement(
        [FromBody] CreateVacationAgreementDto dto)
    {
        return await presetService.CreateAgreementAsync(dto);
    }

    [HttpPut(nameof(UpdateAgreement))]
    public async Task<bool> UpdateAgreement(
        Guid id, 
        [FromBody] UpdateVacationAgreementDto dto)
    {
        return await presetService.UpdateAgreementAsync(id, dto);
    }

    [HttpDelete(nameof(DeleteAgreement))]
    public async Task<bool> DeleteAgreement(Guid id)
    {
        return await presetService.DeleteAgreementAsync(id);
    }

    [HttpGet(nameof(GetClosedDays))]
    public async Task<List<ClosedDayDto>> GetClosedDays()
    {
        return await presetService.GetClosedDayAsync();
    }

    [HttpPost(nameof(CreateClosedDay))]
    public async Task<ClosedDayDto> CreateClosedDay(
        [FromBody] UpsertClosedDayDto dto)
    {
        return await presetService.CreateClosedDayAsync(dto);
    }

    [HttpPut(nameof(UpdateClosedDay))]
    public async Task<bool> UpdateClosedDay(
        Guid id, 
        [FromBody] UpsertClosedDayDto dto)
    {
        return await presetService.UpdateClosedDayAsync(id, dto);
    }

    [HttpDelete(nameof(DeleteClosedDay))]
    public async Task<bool> DeleteClosedDay(Guid id)
    {
        return await presetService.DeleteClosedDayAsync(id);
    }
    
    [HttpPost(nameof(SyncHolidays))]
    public async Task<int> SyncHolidays(int year, string countryCode = "DK")
    {
        return await presetService.SyncPublicHolidaysAsync(year, countryCode);
    }
}