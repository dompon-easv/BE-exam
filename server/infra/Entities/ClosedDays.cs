using LinqToDB.Mapping;

namespace infra.Entities;

[Table("closed_days")]
public class ClosedDays
{
    [PrimaryKey]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Column("date"), NotNull]
    public DateOnly Date { get; set; }
    
    [Column("name"), NotNull]
    public string Name { get; set; } = string.Empty;

    [Column("is_manual")] public bool IsManual { get; set; } = false;

}