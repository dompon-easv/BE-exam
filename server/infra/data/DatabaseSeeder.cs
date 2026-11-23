using infra.Entities;
using LinqToDB;
using LinqToDB.Async;

namespace infra.data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDataConnection db)
        //we use a task to avoid bottlenecks while populating the database

    {
        db.CreateTable<User>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<VacationAgreements>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<VacationDetails>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<ClosedDays>(tableOptions: TableOptions.CreateIfNotExists);

        await SeedAgreementsAsync(db);
        await SeedClosedDaysAsync(db);
    }
    
    
    private static async Task SeedAgreementsAsync(AppDataConnection db)
    {
        if (await db.GetTable<VacationAgreements>().AnyAsync())
            return;

        // Atomic boundary: Agreement and its Details must commit together
        await using var transaction = await db.BeginTransactionAsync();

        // Statutory
        var holidayActId = Guid.NewGuid();
        await db.InsertAsync(new VacationAgreements
        {
            Id = holidayActId,
            Title = "The holiday Act",
            IsMandatory = true,
            IsOffered = true
        });

        await db.InsertAsync(new VacationDetails
        {
            Id = Guid.NewGuid(),
            AgreementId = holidayActId,
            Unit = "DAYS",
            Rate = 2.08m,
            EarningStartDay = 1,
            EarningStartMonth = 9,
            EarningEndDay = 31,
            EarningEndMonth = 8,
            EarningEndOffset = 1,
            UsageStartDay = 1,
            UsageStartMonth = 9,
            UsageEndDay = 31,
            UsageEndMonth = 12,
            UsageEndOffset = 1
        });

        // 6th Week
        var klAgreementId = Guid.NewGuid();
        await db.InsertAsync(new VacationAgreements
        {
            Id = klAgreementId,
            Title = "6th Week (Feriefridage)",
            IsMandatory = false,
            IsOffered = true
        });

        await db.InsertAsync(new VacationDetails
        {
            Id = Guid.NewGuid(),
            AgreementId = klAgreementId,
            Unit = "HOURS",
            Rate = 3.083m,
            EarningStartDay = 1,
            EarningStartMonth = 1,
            EarningEndDay = 31,
            EarningEndMonth = 12,
            EarningEndOffset = 0,
            UsageStartDay = 1,
            UsageStartMonth = 5,
            UsageEndDay = 30,
            UsageEndMonth = 4,
            UsageEndOffset = 1
        });

        await transaction.CommitAsync(); // we're using transaction here to ensure the data is whole
        //we dont want to have vacation policy inserted without details
    }

    private static async Task SeedClosedDaysAsync(AppDataConnection db)
    {
        if (await db.GetTable<ClosedDays>().AnyAsync())
            return;

        await db.InsertAsync(new ClosedDays
        {
            Id = Guid.NewGuid(),
            Date = new DateOnly(2026, 12, 24),
            Name = "Christmas Eve",
            IsManual = true
        });

        await db.InsertAsync(new ClosedDays
        {
            Id = Guid.NewGuid(),
            Date = new DateOnly(2026, 12, 31),
            Name = "New Year's Eve",
            IsManual = true
        }); //no transaction here - days do not depend on each other in anyy way
    }
}
