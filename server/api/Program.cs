using API;
using infra.data;

using LinqToDB;
using service;
using service.Data;
using service.Security;

using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions<AppDataConnection>(
        new DataOptions().UseSQLite("Data Source=db.db"));
//infra/db
builder.Services.AddScoped<AppDataConnection>(_ => new AppDataConnection(options));

//security
builder.Services.AddSingleton<IPasswordHasher, Argon2PasswordHasher>();



//services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddControllers();

// Configure JSON serializer to emit string enum values instead of numbers   
builder.Services.AddControllers().AddJsonOptions(options =>
{
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddExceptionHandler<MyExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IPresetService, PresetService>();


builder.Services.AddOpenApiDocument();
builder.Services.AddCors(options =>
{
        options.AddPolicy("AllowClient", policy =>
        {
                policy.WithOrigins("http://localhost:3000", "https://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
        });
});

var app = builder.Build();

app.UseCors("AllowClient");
app.UseOpenApi();
app.UseSwaggerUi();
app.UseExceptionHandler();

using (var scope = app.Services.CreateScope())
{
        var db = scope.ServiceProvider.GetRequiredService<AppDataConnection>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        //db.CreateTable<User>(tableOptions: TableOptions.CreateIfNotExists);
        //I've moved this line to the seeder
        await DatabaseSeeder.SeedAsync(db, hasher);
}

app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();
