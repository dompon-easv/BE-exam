using LinqToDB.Mapping;

namespace infra.Entities;

[Table("vacation_agreements")]
public class VacationAgreements
{
    [PrimaryKey] 
    [Column("id")] 
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Column("title"), NotNull]
    public string Title { get; set; } = string.Empty;
    
    [Column("is_mandatory"), NotNull]
    public bool IsMandatory { get; set; } //is it mandatory by law (if it is, it can't be deactivated)
    
    [Column("is_offered"), NotNull]
    public bool IsOffered { get; set; }
}