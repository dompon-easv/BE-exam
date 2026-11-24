using API;
using api.controllers;
using infra.data;
using infra.Entities;
using LinqToDB;
using service;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions<AppDataConnection>(
        new DataOptions().UseSQLite("Data Source=db.db"));

builder.Services.AddScoped<AppDataConnection>(_ => new AppDataConnection(options));

builder.Services.AddScoped<UserService>();
builder.Services.AddControllers();
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
        //db.CreateTable<User>(tableOptions: TableOptions.CreateIfNotExists);
        //I've moved this line to the seeder
       await DatabaseSeeder.SeedAsync(db);
}

app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();
