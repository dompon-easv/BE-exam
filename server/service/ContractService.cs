using System.ComponentModel.DataAnnotations;
using infra.data;
using infra.Entities;
using LinqToDB;
using LinqToDB.Async;
using LinqToDB.Data;
using service.DTOs;

namespace service;

public interface IContractService
{
    Task<List<ContractResponseDto>> GetContractsAsync(Guid userId);
    Task<ContractResponseDto> CreateContractAsync(CreateContractDto dto);
    Task<bool> DeleteContractAsync(Guid id);
    Task<ContractResponseDto> UpdateContractAsync(Guid id, UpdateContractDto dto);
    decimal CountWorkHours(decimal fte);
}

public class ContractService(AppDataConnection db) : IContractService
{
    private static readonly decimal _legalFte = 37.0m; //? m
    
    public async Task<List<ContractResponseDto>> GetContractsAsync(Guid userId)
    {
        return await db.Contracts
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.ValidFrom)
            .Select(c => new ContractResponseDto(
            c.Id,
            c.UserId,
            c.Fte,
            c.ValidFrom,
            c.ValidTo,
            db.WorkSchedules
                .Where(w => w.ContractId == c.Id)
                .Select(s => new WorkScheduleResponseDto(
                    s.Id,
                    s.ContractId,
                    s.Weekday,
                    s.Hours)).ToList()
        )).ToListAsync();
    }

    public async Task<ContractResponseDto> CreateContractAsync(CreateContractDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(c => c.Id == dto.UserId);
        if (user == null) throw new KeyNotFoundException("User not found");

        if (dto.ValidTo.HasValue && dto.ValidTo.Value < dto.ValidFrom)
            throw new ValidationException("Valid to date cannot be earlier than Valid From.");

        var distinctDaysCount = dto.WorkSchedules
            .Select(s => s.Weekday)
            .Distinct().Count();
        if (distinctDaysCount != dto.WorkSchedules.Count) throw new ValidationException("Only one schedule per week day allowed");

        if (Math.Round(CountWorkHours(dto.Fte),2) != Math.Round(dto.WorkSchedules.Sum(s => s.Hours),2)) throw new ValidationException("Incorrect total number of hours per week");
        
        bool hasOverlap = await db.Contracts.AnyAsync(c=> c.UserId == dto.UserId &&
                                                          (!dto.ValidTo.HasValue || c.ValidFrom <= dto.ValidTo.Value) &&
                                                          (!c.ValidTo.HasValue || c.ValidTo.Value >= dto.ValidFrom));
        if(hasOverlap) throw new ValidationException("Only one active contract at a time allowed.");
        
        var contractId =  Guid.NewGuid();

        var contract = new Contract
        {
            Id = contractId,
            UserId = dto.UserId,
            Fte = dto.Fte,
            ValidFrom = dto.ValidFrom,
            ValidTo = dto.ValidTo
        };

        var schedules = dto.WorkSchedules.Select(s => new WorkSchedule
        {
            Id = Guid.NewGuid(),
            ContractId = contractId,
            Weekday = s.Weekday,
            Hours = s.Hours
        }).ToList();
        
        await using var transaction = await db.BeginTransactionAsync();
        await db.InsertAsync(contract);
        await db.BulkCopyAsync(schedules);
        await transaction.CommitAsync();

        return new ContractResponseDto(
            contract.Id,
            contract.UserId,
            contract.Fte,
            contract.ValidFrom,
            contract.ValidTo,
            schedules.Select(s => new WorkScheduleResponseDto(
                s.Id,
                s.ContractId,
                s.Weekday,
                s.Hours)
            ).ToList());
    }

    public async Task<bool> DeleteContractAsync(Guid id)
    {
        var contract = await db.Contracts.FirstOrDefaultAsync(c => c.Id == id);
        if (contract == null) throw new KeyNotFoundException("Contract not found");
        if(contract.ValidFrom <= DateOnly.FromDateTime(DateTime.Now)) throw new InvalidOperationException("You cannot delete a contract that is or was already active");
        
        await using var transaction = await db.BeginTransactionAsync();
        await db.WorkSchedules.Where(s => s.ContractId == id).DeleteAsync();
        await db.Contracts.Where(c => c.Id == id).DeleteAsync();
        await transaction.CommitAsync();
        return true;
        
    }

    public async Task<ContractResponseDto> UpdateContractAsync(Guid id, UpdateContractDto dto)
    {
        var today = DateOnly.FromDateTime(DateTime.Now);
        var contract = await db.Contracts.FirstOrDefaultAsync(c => c.Id == id);
        if (contract == null) throw new KeyNotFoundException("Contract not found");
        
        if(contract.ValidTo.HasValue && contract.ValidTo.Value < today) 
            throw new InvalidOperationException("You cannot update an expired contract.");
        
        if (dto.ValidTo.HasValue && dto.ValidTo.Value < dto.ValidFrom)
            throw new ValidationException("Valid to date cannot be earlier than Valid From.");
        
        bool isActive = contract.ValidFrom <= today;
        if (isActive)
        {
            if(dto.ValidFrom != contract.ValidFrom) throw new InvalidOperationException("Changing start date of an active contract not allowed.");
            if(dto.Fte != contract.Fte) throw new InvalidOperationException("Changing fte of an active contract not allowed.");
            
            var currentSchedules = await db.WorkSchedules.Where(s => s.ContractId == id).ToListAsync();
            bool scheduleChanged = dto.WorkSchedules.Count != currentSchedules.Count
                || dto.WorkSchedules.Any(incoming => !currentSchedules.Any(c => c.Weekday == incoming.Weekday && c.Hours == incoming.Hours));
            if(scheduleChanged) throw new InvalidOperationException("Schedules cannot be changed on active contract.");
        }
        else //inactive contract
        {
            var distinctDaysCount = dto.WorkSchedules
                .Select(s => s.Weekday)
                .Distinct().Count();
            if (distinctDaysCount != dto.WorkSchedules.Count) throw new ValidationException("Only one schedule per week day allowed");

            if (Math.Round(CountWorkHours(dto.Fte),2) != Math.Round(dto.WorkSchedules.Sum(s => s.Hours),2)) throw new ValidationException("Incorrect total number of hours per week");
        }
        
        bool hasOverlap = await db.Contracts.AnyAsync(c=> c.UserId == contract.UserId &&
                                                          c.Id != contract.Id &&
                                                          (!dto.ValidTo.HasValue || c.ValidFrom <= dto.ValidTo.Value) &&
                                                          (!c.ValidTo.HasValue || c.ValidTo.Value >= dto.ValidFrom));
        if(hasOverlap) throw new ValidationException("Only one active contract at a time allowed.");

        await using var transaction = await db.BeginTransactionAsync();

        if (isActive)
        {
            await db.Contracts.Where(c => c.Id == id)
                .Set(c => c.ValidTo, dto.ValidTo)
                .UpdateAsync();
            
            contract.ValidTo = dto.ValidTo;
        }
        else
        {
            await db.Contracts.Where(c => c.Id == id)
                .Set(c => c.Fte, dto.Fte)
                .Set(c => c.ValidFrom, dto.ValidFrom)
                .Set(c => c.ValidTo, dto.ValidTo)
                .UpdateAsync();
            
            await db.WorkSchedules.Where(s => s.ContractId == id).DeleteAsync();

            var newSchedules = dto.WorkSchedules.Select(s => new WorkSchedule
            {
                Id = Guid.NewGuid(),
                ContractId = id,
                Weekday = s.Weekday,
                Hours = s.Hours
            }).ToList();
            await db.BulkCopyAsync(newSchedules);
            contract.Fte = dto.Fte;
            contract.ValidFrom = dto.ValidFrom;
            contract.ValidTo = dto.ValidTo;
        }
        await transaction.CommitAsync();
        
        var updatedSchedules =  await db.WorkSchedules
            .Where(s => s.ContractId == id)
            .OrderBy(s => s.Weekday)
            .Select(s => new WorkScheduleResponseDto(
                s.Id,
                s.ContractId,
                s.Weekday,
                s.Hours))
            .ToListAsync();
        
        return new ContractResponseDto(
            contract.Id,
            contract.UserId,
            contract.Fte,
            contract.ValidFrom,
            contract.ValidTo,
            updatedSchedules);

    }

    public decimal CountWorkHours(decimal fte)
    {
        return fte * _legalFte;
    }
}