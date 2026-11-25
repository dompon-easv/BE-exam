using LinqToDB.Mapping;

namespace infra.Entities;

[Table("contracts")]
public class Contract
{
    [PrimaryKey]
    [Column("id")]
    public Guid Id { get; set; } =  Guid.NewGuid();
    
    [Column("user_id"),  NotNull]
    public Guid UserId { get; set; }
    
    [Column("fte"),  NotNull]
    public decimal Fte { get; set; }
    
    [Column("valid_from"),  NotNull]
    public DateOnly ValidFrom { get; set; }
    
    [Column("valid_to"), Nullable] // defaults to null, used if the contract is indefinite
    public DateOnly? ValidTo { get; set; }

    [Association(ThisKey = nameof(Id), OtherKey = nameof(WorkSchedule.ContractId))]
    public List<WorkSchedule> WorkSchedules { get; set; } = new();
}