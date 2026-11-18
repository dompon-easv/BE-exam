namespace infra.Entities;

using LinqToDB.Mapping;

[Table(Name = "Users")]
public class User
{
    [PrimaryKey, Identity]
    public Guid Id { get; set; }

    [Column(Name = "Name"), NotNull] 
    public string Name { get; set; } = string.Empty;

}