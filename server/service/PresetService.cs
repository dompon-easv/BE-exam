using infra.data;
using infra.Entities;
using LinqToDB;
using LinqToDB.Async;
using service.DTOs;
using System.Net.Http.Json;

namespace service;

public interface IPresetService
{
    Task<List<VacationAgreementResponseDto>> GetAgreementAsync();
    Task<VacationAgreementResponseDto> CreateAgreementAsync(CreateVacationAgreementDto dto);
    Task<bool> UpdateAgreementAsync(Guid id, UpdateVacationAgreementDto dto);
    Task<bool> DeleteAgreementAsync(Guid id);
    
    Task<List<ClosedDayDto>> GetClosedDayAsync();
    Task<ClosedDayDto> CreateClosedDayAsync(UpsertClosedDayDto dto);
    Task<bool> UpdateClosedDayAsync(Guid id, UpsertClosedDayDto dto);
    Task<bool> DeleteClosedDayAsync(Guid id);
    Task<int> SyncPublicHolidaysAsync(int year, string countryCode = "DK");
}

public class PresetService(AppDataConnection db, HttpClient httpClient) : IPresetService
{
    public async Task<List<VacationAgreementResponseDto>> GetAgreementAsync()
    {
        return await db.VacationAgreements.Select(a => new VacationAgreementResponseDto(
            a.Id,
            a.Title,
            a.IsMandatory,
            a.IsOffered,
            db.VacationDetails.Where(d => d.AgreementId == a.Id)
                .Select(d => new VacationDetailDto(
                    d.Id,
                    d.Unit,
                    d.Rate,
                    d.EarningStartDay,
                    d.EarningStartMonth,
                    d.EarningEndDay,
                    d.EarningEndMonth,
                    d.EarningEndOffset,
                    d.UsageStartDay,
                    d.UsageStartMonth,
                    d.UsageEndDay,
                    d.UsageEndMonth,
                    d.UsageEndOffset)).FirstOrDefault()
        )).ToListAsync();
    }

    public async Task<VacationAgreementResponseDto> CreateAgreementAsync(CreateVacationAgreementDto dto)
    {
        var agreementId = Guid.NewGuid();
        var detailId = Guid.NewGuid();

        var agreement = new VacationAgreement
        {
            Id = agreementId,
            Title = dto.Title.Trim(),
            IsMandatory = dto.IsMandatory,
            IsOffered = true
        };

        var detail = new VacationDetail
        {
            Id = detailId,
            AgreementId = agreementId,
            Unit = dto.Unit,
            Rate = dto.Rate,
            EarningStartDay = dto.EarningStartDay,
            EarningStartMonth = dto.EarningStartMonth,
            EarningEndDay = dto.EarningEndDay,
            EarningEndMonth = dto.EarningEndMonth,
            EarningEndOffset = dto.EarningEndOffset,
            UsageStartDay = dto.UsageStartDay,
            UsageStartMonth = dto.UsageStartMonth,
            UsageEndDay = dto.UsageEndDay,
            UsageEndMonth = dto.UsageEndMonth,
            UsageEndOffset = dto.UsageEndOffset
        };
        
        await using var transaction = await db.BeginTransactionAsync();
        await db.InsertAsync(agreement);
        await db.InsertAsync(detail);
        await transaction.CommitAsync();

        return new VacationAgreementResponseDto(
            agreement.Id,
            agreement.Title,
            agreement.IsMandatory,
            agreement.IsOffered,
            new VacationDetailDto(
                detail.Id,
                detail.Unit,
                detail.Rate,
                detail.EarningStartDay,
                detail.EarningStartMonth,
                detail.EarningEndDay,
                detail.EarningEndMonth,
                detail.EarningEndOffset,
                detail.UsageStartDay,
                detail.UsageStartMonth,
                detail.UsageEndDay,
                detail.UsageEndMonth,
                detail.UsageEndOffset));
    }

    public async Task<bool> UpdateAgreementAsync(Guid id, UpdateVacationAgreementDto dto)
    {
        var agreement = await db.VacationAgreements.FirstOrDefaultAsync(a => a.Id == id);
        if (agreement == null) throw new KeyNotFoundException("Vacation Agreement not found");

        if (agreement.IsMandatory && !dto.IsOffered)
        {
            throw new InvalidOperationException("Mandatory vacation - has to be offered");
        }
        await using var transaction = await db.BeginTransactionAsync();

        await db.VacationAgreements.Where(a => a.Id == id)
            .Set(a => a.Title, dto.Title)
            .Set(a => a.IsOffered, dto.IsOffered)
            .Set(a => a.IsMandatory, dto.IsMandatory)
            .UpdateAsync();

        await db.VacationDetails.Where(d => d.AgreementId == id)
            .Set(d => d.Unit, dto.Unit)
            .Set(d => d.Rate, dto.Rate)
            .Set(d => d.EarningStartDay, dto.EarningStartDay)
            .Set(d => d.EarningStartMonth, dto.EarningStartMonth)
            .Set(d => d.EarningEndDay, dto.EarningEndDay)
            .Set(d => d.EarningEndMonth, dto.EarningEndMonth)
            .Set(d => d.EarningEndOffset, dto.EarningEndOffset)
            .Set(d => d.UsageStartDay, dto.UsageStartDay)
            .Set(d => d.UsageStartMonth, dto.UsageStartMonth)
            .Set(d => d.UsageEndDay, dto.UsageEndDay)
            .Set(d => d.UsageEndMonth, dto.UsageEndMonth)
            .Set(d => d.UsageEndOffset, dto.UsageEndOffset)
            .UpdateAsync();
        
        await transaction.CommitAsync();
        return true;
    }

    public async Task<bool> DeleteAgreementAsync(Guid id)
    {
        var agreement = await db.VacationAgreements.FirstOrDefaultAsync(a => a.Id == id);
        if (agreement == null) throw new KeyNotFoundException("Vacation Agreement not found");
        
        if (agreement.IsMandatory) throw new InvalidOperationException("Mandatory vacation - has to be offered");
        
        await using var transaction = await db.BeginTransactionAsync();
        await db.VacationDetails.Where(d => d.AgreementId == id).DeleteAsync();
        await db.VacationAgreements.Where(a => a.Id == id).DeleteAsync();
        await transaction.CommitAsync();
        return true;
    }

    public async Task<List<ClosedDayDto>> GetClosedDayAsync()
    {
        return await db.ClosedDays.OrderBy(d => d.Date)
            .Select(d => new ClosedDayDto(d.Id, d.Date, d.Name, d.IsManual))
            .ToListAsync();
    }

    public async Task<ClosedDayDto> CreateClosedDayAsync(UpsertClosedDayDto dto)
    {
        var newDay = new ClosedDay
        {
            Id = Guid.NewGuid(),
            Date = dto.Date,
            Name = dto.Name,
            IsManual = true
        };
        
        await db.InsertAsync(newDay);
        return new ClosedDayDto(newDay.Id, newDay.Date, newDay.Name, newDay.IsManual);
    }

    public async Task<bool> UpdateClosedDayAsync(Guid id, UpsertClosedDayDto dto)
    {
        var day = await db.ClosedDays.FirstOrDefaultAsync(d => d.Id == id);
        
        if (day == null) throw new KeyNotFoundException("Closed day not found");
        if (!day.IsManual) throw new InvalidOperationException("official bank holiday cannot be edited");
        
        await db.ClosedDays.Where(d => d.Id == id)
            .Set(d => d.Date, dto.Date)
            .Set(d => d.Name, dto.Name)
            .UpdateAsync();

        return true;
    }

    public async Task<bool> DeleteClosedDayAsync(Guid id)
    {
        var day = await db.ClosedDays.FirstOrDefaultAsync(d => d.Id == id);
        if (day == null) throw new KeyNotFoundException("Closed day not found");
        
        if (!day.IsManual) throw new InvalidOperationException("official bank holiday cannot be deleted");
        
        await db.ClosedDays.Where(d => d.Id == id).DeleteAsync();
        return true;
    }

    public async Task<int> SyncPublicHolidaysAsync(int year, string countryCode = "DK")
    {
        var url = $"https://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}";
        var holidays = await httpClient.GetFromJsonAsync<List<NagerHolidayDto>>(url);

        if (holidays == null || holidays.Count == 0) return 0;
        
        var existingDates = (await db.ClosedDays.Where(d => d.Date.Year == year)
            .Select(d => d.Date).ToListAsync()).ToHashSet();

        var insertedCount = 0;
        await using var transaction = await db.BeginTransactionAsync();

        foreach (var holiday in holidays)
        {
            if (!existingDates.Contains(holiday.Date))
            {
                await db.InsertAsync(new ClosedDay
                {
                    Id = Guid.NewGuid(),
                    Date = holiday.Date,
                    Name = holiday.Name,
                    IsManual = false
                });
                insertedCount++;
            }
        }

        await transaction.CommitAsync();
        return insertedCount;
    }
}