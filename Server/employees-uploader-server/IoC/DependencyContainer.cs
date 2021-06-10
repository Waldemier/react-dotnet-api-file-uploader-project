using System;
using Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IoC
{
    public static class DependencyContainer
    {
        public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration) =>
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), p => p.MigrationsAssembly("Data"))
            );

        public static void ConfigureCors(this IServiceCollection services) =>
            services.AddCors(options => options.AddPolicy("ApplicationCorsPolicy", policy =>
            {
                policy.WithOrigins("http://localhost:3000/");
                policy.AllowAnyHeader();
                policy.AllowAnyMethod();
            }));
    }
}
