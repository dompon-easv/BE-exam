using infra.Entities;
using LinqToDB;
using LinqToDB.Data;

namespace infra.data;

public class AppDataConnection(DataOptions options) : DataConnection(options)
{
    public ITable<User> Users => this.GetTable<User>();
}