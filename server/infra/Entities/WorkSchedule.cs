using LinqToDB.Mapping;

namespace infra.Entities;

[Table("work_schedules")]
public class WorkSchedule
{
    [PrimaryKey] 
    [Column("id")] 
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Column("contract_id"), NotNull]
    public Guid ContractId { get; set; }
    
    [Column("weekday"), NotNull]
    public int Weekday { get; set; } //Sunday is 7 to match ISO standard
    
    [Column("hours"), NotNull]
    public decimal Hours { get; set; }
}