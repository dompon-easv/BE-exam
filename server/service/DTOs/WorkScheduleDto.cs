using System.ComponentModel.DataAnnotations;

namespace service.DTOs;

    public record WorkScheduleResponseDto(
        Guid Id,
        Guid ContractId,
        int Weekday,
        decimal Hours
        );

    public record UpsertWorkScheduleDto(
        [Range(1, 7, ErrorMessage = "Weekday must be 1 (Monday) to 7 (Sunday)")]
        int Weekday,

        [Range(0.25, 24.0, ErrorMessage = "Shift lenght must be between 0.25 and 24 hours")]
        decimal Hours
    );
