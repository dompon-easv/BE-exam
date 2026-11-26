using infra.data;
using LinqToDB;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace integrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbPath = Path.Combine(
        Path.GetTempPath(),
        $"be-exam-auth-test-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // Ensures JwtSecret exists even in CI (Release mode without appsettings.Development.json)     
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["JwtSecret"] = "TestOnlyJwtSecretKey_MustBeAtLeast32BytesLong!"
            });
        });
        
        // Replaces dev db.db with a temporary isolated SQLite file for this test run 
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<AppDataConnection>();

            var testOptions = new DataOptions<AppDataConnection>(
                new DataOptions().UseSQLite($"Data Souce ={_dbPath}"));

            services.AddScoped(_ => new AppDataConnection(testOptions));
        });
    }
    protected override void Dispose(bool disposing)                                                                                                                          
        {                                                                                                                                                                        
            base.Dispose(disposing);                                                                                                                                             
            if (disposing)                                                                                                                                                       
            {                                                                                                                                                                    
                SqliteConnection.ClearAllPools();                                                                                                                                
                if (File.Exists(_dbPath))                                                                                                                                        
                {                                                                                                                                                                
                    File.Delete(_dbPath);                                                                                                                                        
                }                                                                                                                                                                
            }                                                                                                                                                                    
        }                                                                                                                                                                        
    }       