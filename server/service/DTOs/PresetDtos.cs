namespace service.DTOs;

public class PresetDtos
{
    //for returning joined agreement and details
    public record VacationAgreementResponseDto(
    Guid Id,
    string Title,
    bool IsMandatory,
    bool IsOffered,
    VacationDetailDto? Details);

    
    //nested above
    public record VacationDetailDto(
        Guid Id,
        string? Unit,
        decimal? Rate,
        int? EarningStartDay,
        int? EarningStartMonth,
        int? EarningEndDay,
        int? EarningEndMonth,
        int? EarningEndOffset,
        int? UsageStartDay,
        int? UsageStartMonth,
        int? UsageEndDay,
        int? UsageEndMonth,
        int? UsageEndOffset
    );

    //in case the company introduces a brand new policy or the law changes
    public record CreateVacationAgreementDto(
        string Title,
        bool IsMandatory,
        string? Unit,
        decimal? Rate,
        int? EarningStartDay,
        int? EarningStartMonth,
        int? EarningEndDay,
        int? EarningEndMonth,
        int? EarningEndOffset,
        int? UsageStartDay,
        int? UsageStartMonth,
        int? UsageEndDay,
        int? UsageEndMonth,
        int? UsageEndOffset
    );

    //if the company changes their policy on existing vacation agreements
    public record UpdateVacationAgreementDto(
        string Title,
        bool IsOffered,
        string? Unit,
        decimal? Rate,
        int? EarningStartDay,
        int? EarningStartMonth,
        int? EarningEndDay,
        int? EarningEndMonth,
        int? EarningEndOffset,
        int? UsageStartDay,
        int? UsageStartMonth,
        int? UsageEndDay,
        int? UsageEndMonth,
        int? UsageEndOffset
    );


    public record ClosedDayDto(
        Guid Id,
        DateOnly Date,
        string Name,
        bool IsManual
    );

    
    //for adding a new one and updating an existing one manually
    public record UpsertClosedDayDto(
        DateOnly Date,
        string Name
    );

    //for response from the Nager API
    public record NagerHolidayDto(
        DateOnly Date,
        string LocalName,
        string Name,
        string CountryCode,
        bool Fixed
    );


}