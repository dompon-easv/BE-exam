using System.Text;
using API;
using infra.data;

using LinqToDB;
using service;
using service.Data;
using service.Security;

using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.Generation.Processors.Security;
using service.Auth;

var builder = WebApplication.CreateBuilder(args);

var options = new DataOptions<AppDataConnection>(
        new DataOptions().UseSQLite("Data Source=db.db"));
//infra/db
builder.Services.AddScoped<AppDataConnection>(_ => new AppDataConnection(options));

//security
builder.Services.AddSingleton<IPasswordHasher, Argon2PasswordHasher>();
builder.Services.AddScoped<IAuthorizationService, JWTAuthorizationService>();

var jwtSecret = builder.Configuration["JwtSecret"]
        ?? throw new InvalidOperationException("JwtSecret is missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                        ValidateIssuer = true,
                        ValidIssuer = JWTAuthorizationService.Issuer,
                        ValidateAudience = true,
                        ValidAudience = JWTAuthorizationService.Audience,
                        ClockSkew = TimeSpan.Zero,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
                };
        });

builder.Services.AddAuthorization();




//services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();

// Configure JSON serializer to emit string enum values instead of numbers   
builder.Services.AddControllers().AddJsonOptions(options =>
{
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddExceptionHandler<MyExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IPresetService, PresetService>();


builder.Services.AddOpenApiDocument(document =>
{
        document.AddSecurity("bearer", Enumerable.Empty<string>(), new OpenApiSecurityScheme
        {
                Type = OpenApiSecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                Description = "Paster the JWT returned from /login"
        });
        
        document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("bearer"));
});
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

app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
        var db = scope.ServiceProvider.GetRequiredService<AppDataConnection>();
        var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();
        //db.CreateTable<User>(tableOptions: TableOptions.CreateIfNotExists);
        //I've moved this line to the seeder
        await DatabaseSeeder.SeedAsync(db, hasher);
}

app.MapControllers();
app.Run();

public partial class Program
{
        
}
