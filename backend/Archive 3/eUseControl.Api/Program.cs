using System.Security.Claims;
using System.Text;
using EUseControl.DataAccess.Context;
using eUseControl.BussinessLogic.Core;
using eUseControl.BussinessLogic.Functions.Auth;
using eUseControl.BussinessLogic.Functions.ContentItems;
using eUseControl.BussinessLogic.Functions.LoginLogs;
using eUseControl.BussinessLogic.Functions.ServiceBookings;
using eUseControl.BussinessLogic.Functions.ServiceCategories;
using eUseControl.BussinessLogic.Functions.ServiceImages;
using eUseControl.BussinessLogic.Functions.Services;
using eUseControl.BussinessLogic.Functions.ServiceTimeSlots;
using eUseControl.BussinessLogic.Functions.SpecialistReviews;
using eUseControl.BussinessLogic.Functions.Specialists;
using eUseControl.BussinessLogic.Functions.SpecialistWorkSchedules;
using eUseControl.BussinessLogic.Functions.Users;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "https://localhost:5173",
                "http://127.0.0.1:5173",
                "https://127.0.0.1:5173",
                "http://localhost:5174",
                "https://localhost:5174",
                "http://127.0.0.1:5174",
                "https://127.0.0.1:5174")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<UserContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "eUseControl API", Version = "v1" });
    c.CustomSchemaIds(type => type.Name); // Используем просто имя класса. Если будут дубликаты, Swagger сам скажет об этом.
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Введите JWT-токен в формате Bearer {token}"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IRegisterFlow, RegisterFlow>();
builder.Services.AddScoped<IUserFlow, UserFlow>();
builder.Services.AddScoped<ISpecialistFlow, SpecialistFlow>();
builder.Services.AddScoped<ISpecialistReviewFlow, SpecialistReviewFlow>();
builder.Services.AddScoped<ISpecialistWorkScheduleFlow, SpecialistWorkScheduleFlow>();
builder.Services.AddScoped<IServiceFlow, ServiceFlow>();
builder.Services.AddScoped<IServiceCategoryFlow, ServiceCategoryFlow>();
builder.Services.AddScoped<IServiceBookingFlow, ServiceBookingFlow>();
builder.Services.AddScoped<IServiceTimeSlotFlow, ServiceTimeSlotFlow>();
builder.Services.AddScoped<IServiceImageFlow, ServiceImageFlow>();
builder.Services.AddScoped<ILoginLogFlow, LoginLogFlow>();
builder.Services.AddScoped<IContentItemFlow, ContentItemFlow>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("AllowAll");
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "eUseControl API V1");
    c.RoutePrefix = "swagger";
});

app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/", () => Results.Redirect("/swagger"));
app.MapControllers();

app.Run();
