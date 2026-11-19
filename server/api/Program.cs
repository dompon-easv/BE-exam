using api.controllers;
using infra.data;
using infra.Entities;
using LinqToDB;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions<AppDataConnection>(
        new DataOptions().UseSQLite("Data Source=db.db"));

builder.Services.AddScoped<AppDataConnection>(_ => new AppDataConnection(options));

builder.Services.AddScoped<UserService>();
builder.Services.AddControllers();


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

using (var scope = app.Services.CreateScope())
{
        var db = scope.ServiceProvider.GetRequiredService<AppDataConnection>();
        db.CreateTable<User>(tableOptions: TableOptions.CreateIfNotExists);
}

app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();
