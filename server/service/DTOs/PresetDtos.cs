using System.ComponentModel.DataAnnotations;

namespace service.DTOs;

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
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 100 characters")]
        string Title,
        
        bool IsMandatory,
        
        [Required(ErrorMessage = "Unit is required")]
        [RegularExpression(@"(?i)^(Hours|Days)$", ErrorMessage = "Unit must be either Hours or Days")]
        string? Unit,
        
        [Range(0.01, 1000.0, ErrorMessage = "Rate must be between 0.01 and 1000.0")]
        decimal? Rate,
        
        [Range(1, 31, ErrorMessage = "Day must be between 1 and 31.")]
        int? EarningStartDay,
        
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        int? EarningStartMonth,
        
        [Range(1, 31, ErrorMessage = "Day must be between 1 and 31.")]
        int? EarningEndDay,
        
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        int? EarningEndMonth,
        int? EarningEndOffset,
        
        [Range(1, 31, ErrorMessage = "Day must be between 1 and 31.")]
        int? UsageStartDay,
        
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        int? UsageStartMonth,
        
        [Range(1, 31, ErrorMessage = "Day must be between 1 and 31.")]
        int? UsageEndDay,
        
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        int? UsageEndMonth,
        int? UsageEndOffset
    );

    //if the company changes their policy on existing vacation agreements
    public record UpdateVacationAgreementDto(
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Title must be between 2 and 100 characters.")]
        string Title,
        bool IsOffered,
        bool IsMandatory,
        
        [Required(ErrorMessage = "Unit is required.")]
        [RegularExpression("^(Hours|Days)$", ErrorMessage = "Unit must be either Hours or Days.")]
        string? Unit,
        
        [Range(0.01, 1000.0, ErrorMessage = "Rate must be greater than 0.")]
        decimal? Rate,
        
        [Range(1, 31, ErrorMessage = "Day must be between 1 and 31.")]
        int? EarningStartDay,
        
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        int? EarningStartMonth,
        
        [Range(1, 31, ErrorMessage = "Day must be between 1 and 31.")]
        int? EarningEndDay,
        
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        int? EarningEndMonth,
        int? EarningEndOffset,
        
        [Range(1, 31, ErrorMessage = "Day must be between 1 and 31.")]
        int? UsageStartDay,
        
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
        int? UsageStartMonth,
        
        [Range(1, 31, ErrorMessage = "Day must be between 1 and 31.")]
        int? UsageEndDay,
        
        [Range(1, 12, ErrorMessage = "Month must be between 1 and 12.")]
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
        [Required(ErrorMessage = "Date is required.")]
        DateOnly Date,
        
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters")]
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