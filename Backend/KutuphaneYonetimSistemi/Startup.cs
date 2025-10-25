using KutuphaneYonetimSistemi.Common;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;
using Npgsql;
using System.Data;
using JWT;

namespace KutuphaneYonetimSistemi
{
    public class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(builder =>
            {
                builder.AddConsole(); // Konsola log yazma
                builder.AddDebug();   // Debug logları
                builder.SetMinimumLevel(LogLevel.Debug); // Log seviyesini Debug'a ayarla
                builder.Services.AddAuthentication(options =>
                {

                }); // Authentication servisini ekle

            });

            string? connectionString = Configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new Exception("Connection string 'DefaultConnection' is not configured.");

            }

            services.AddSingleton(new DbHelper(connectionString));

            services.AddSingleton<IDbConnection>(sp => new NpgsqlConnection(connectionString));


            services.AddCors(options =>
            {
                options.AddPolicy("MyPolicy", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .WithExposedHeaders("Content-Disposition");
                });
            });

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Kutuphane Yonetim Sistemi API",
                    Version = "v1",
                    Description = "Kutuphane Yonetim Sistemi"
                });
                c.AddSecurityDefinition("Token", new OpenApiSecurityScheme
                {
                    Description = "Token",
                    Name = "token",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });

                c.AddSecurityDefinition("user_id", new OpenApiSecurityScheme
                {
                    Description = "User id",
                    Name = "User_id",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Token"
                            }
                        },
                        new List<string>()
                    }
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "user_id"
                            }
                        },
                        new List<string>()
                    }
                });
            });
            //services.AddMemoryCache();
            //services.Configure<IpRateLimitOptions>(Configuration.GetSection("IpRateLimiting"));
            //services.AddInMemoryRateLimiting();
            //services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Kutuphane Yonetim Sistemi API v1");
                    c.RoutePrefix = "swagger";
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();


            if (!Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "Upload")))
            {
                Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "Upload"));
            }

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Upload")),
                RequestPath = new PathString ("/" + "Upload")
            });

                

            app.UseCors("MyPolicy");

            app.UseRouting();
            app.UseAuthorization();
            app.UseAuthentication();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                
            });

        }
    }
}
