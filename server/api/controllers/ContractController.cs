using Microsoft.AspNetCore.Mvc;
using service;
using service.DTOs;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractsController(IContractService contractService) : ControllerBase
{
    [HttpGet(nameof(GetContracts))]
    public async Task<List<ContractResponseDto>> GetContracts(Guid userId)
    {
        return await contractService.GetContractsAsync(userId);
    }

    [HttpPost(nameof(CreateContract))]
    public async Task<ContractResponseDto> CreateContract(
        [FromBody] CreateContractDto dto)
    {
        return await contractService.CreateContractAsync(dto);
    }

    [HttpPut(nameof(UpdateContract))]
    public async Task<ContractResponseDto> UpdateContract(
        Guid id,
        [FromBody] UpdateContractDto dto)
    {
        return await contractService.UpdateContractAsync(id, dto);
    }

    [HttpDelete(nameof(DeleteContract))]
    public async Task<bool> DeleteContract(Guid id)
    {
        return await contractService.DeleteContractAsync(id);
    }
}