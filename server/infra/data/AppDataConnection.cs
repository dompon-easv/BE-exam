using infra.Entities;
using LinqToDB;
using LinqToDB.Data;

namespace infra.data;

public class AppDataConnection : DataConnection
{
    public AppDataConnection(DataOptions<AppDataConnection> options) : base(options.Options)
    {
    }

    public ITable<User> Users => this.GetTable<User>();
    public ITable<VacationAgreement> VacationAgreements => this.GetTable<VacationAgreement>();
    public ITable<VacationDetail> VacationDetails => this.GetTable<VacationDetail>();
    public ITable<ClosedDay> ClosedDays => this.GetTable<ClosedDay>();
}