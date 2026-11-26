namespace infra.Entities;

using LinqToDB.Mapping;

[Table(Name = "users")]
public class User
{
    [PrimaryKey]
    [Column("id")]
    public Guid Id { get; set; }

    [Column(columnName: "name"), NotNull] 
    public string Name { get; set; } = string.Empty;

    [Column(columnName: "email"), NotNull] 
    public string Email { get; set; } = string.Empty;
    
    [Column(columnName: "password_hash"), NotNull]
    public string PasswordHash { get; set; } = string.Empty;
    
    
    [Column(columnName: "role"), NotNull] 
    public Role Role { get; set; }
}