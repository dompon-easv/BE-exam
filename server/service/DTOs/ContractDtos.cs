using System.ComponentModel.DataAnnotations;

namespace service.DTOs;

public class ContractDtos
{

    public record CreateContractDto(
        [Required(ErrorMessage = "User is required")]
        Guid UserId,
        [Required(ErrorMessage = "FTE is required"), Range(0.01, 2, ErrorMessage = "FTE must be between 0.01 and 2.0")]
        decimal Fte,
        [Required(ErrorMessage = "Validity start is required")]
        DateOnly ValidFrom,
        DateOnly? ValidTo,
        [MinLength(1, ErrorMessage = "At least 1 working day is required")]
        List<WorkScheduleDto.UpsertWorkScheduleDto> WorkSchedules

    );

    public record ContractResponseDto(
        Guid Id,
        Guid UserId,
        decimal Fte,
        DateOnly ValidFrom,
        DateOnly? ValidTo,
        List<WorkScheduleDto.WorkScheduleResponseDto> WorkSchedules
    );

    public record UpdateContractDto(
        [Required(ErrorMessage = "FTE is required"), Range(0.01, 2, ErrorMessage = "FTE must be between 0.01 and 2.0")]
        decimal Fte,
        [Required(ErrorMessage = "Validity start is required")]
        DateOnly ValidFrom,
        DateOnly? ValidTo,
        [MinLength(1, ErrorMessage = "At least 1 working day is required")]
        List<WorkScheduleDto.UpsertWorkScheduleDto> WorkSchedules
    );
}