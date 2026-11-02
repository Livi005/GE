using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace SchoolManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    Name = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    UserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: true),
                    SecurityStamp = table.Column<string>(type: "longtext", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "longtext", nullable: true),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetime", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    IdLog = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    UserName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Action = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false),
                    Module = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Details = table.Column<string>(type: "varchar(512)", maxLength: 512, nullable: true),
                    Ip = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.IdLog);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Institutions",
                columns: table => new
                {
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false),
                    Domain = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Email = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false),
                    Phone = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    Plan = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Institutions", x => x.IdInstitution);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    IdNotification = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    SenderUserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true),
                    Title = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false),
                    Message = table.Column<string>(type: "varchar(1024)", maxLength: 1024, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Module = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: true),
                    IsRead = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.IdNotification);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserPreferences",
                columns: table => new
                {
                    IdPreferences = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Theme = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false),
                    EmailNotifications = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    MaintenanceAlerts = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreferences", x => x.IdPreferences);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<string>(type: "varchar(255)", nullable: false),
                    ClaimType = table.Column<string>(type: "longtext", nullable: true),
                    ClaimValue = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false),
                    ClaimType = table.Column<string>(type: "longtext", nullable: true),
                    ClaimValue = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "varchar(255)", nullable: false),
                    ProviderKey = table.Column<string>(type: "varchar(255)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "longtext", nullable: true),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false),
                    RoleId = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false),
                    LoginProvider = table.Column<string>(type: "varchar(255)", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", nullable: false),
                    Value = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Administrators",
                columns: table => new
                {
                    AdminId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    AdminName = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    AdminSalary = table.Column<int>(type: "int", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Administrators", x => x.AdminId);
                    table.ForeignKey(
                        name: "FK_Administrators_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ClassRooms",
                columns: table => new
                {
                    IdClassR = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IsAviable = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Location = table.Column<string>(type: "longtext", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false, defaultValue: 30),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassRooms", x => x.IdClassR);
                    table.ForeignKey(
                        name: "FK_ClassRooms_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    IdC = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    CourseName = table.Column<string>(type: "longtext", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.IdC);
                    table.ForeignKey(
                        name: "FK_Courses_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MaintenanceWorkers",
                columns: table => new
                {
                    IdMaint = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    NameMaint = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    SalaryMaint = table.Column<int>(type: "int", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaintenanceWorkers", x => x.IdMaint);
                    table.ForeignKey(
                        name: "FK_MaintenanceWorkers_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Mean",
                columns: table => new
                {
                    IdMean = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IsAviable = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    NameMean = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    State = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mean", x => x.IdMean);
                    table.ForeignKey(
                        name: "FK_Mean_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MeanNotifications",
                columns: table => new
                {
                    MeanNotId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdMean = table.Column<int>(type: "int", nullable: false),
                    MeanName = table.Column<string>(type: "longtext", nullable: false),
                    MeanType = table.Column<string>(type: "longtext", nullable: false),
                    BeenSended = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MeanNotifications", x => x.MeanNotId);
                    table.ForeignKey(
                        name: "FK_MeanNotifications_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Restrictions",
                columns: table => new
                {
                    IdRes = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    NameRes = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Restrictions", x => x.IdRes);
                    table.ForeignKey(
                        name: "FK_Restrictions_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Secretaries",
                columns: table => new
                {
                    IdS = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "longtext", nullable: false),
                    NameS = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    SalaryS = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Secretaries", x => x.IdS);
                    table.ForeignKey(
                        name: "FK_Secretaries_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "YearHeads",
                columns: table => new
                {
                    IdYearHead = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    NameYearHead = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YearHeads", x => x.IdYearHead);
                    table.ForeignKey(
                        name: "FK_YearHeads_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    IdSub = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NameSub = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false),
                    StudyProgram = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CourseLoad = table.Column<int>(type: "int", nullable: false),
                    IdClassRoom = table.Column<int>(type: "int", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.IdSub);
                    table.ForeignKey(
                        name: "FK_Subjects_ClassRooms_IdClassRoom",
                        column: x => x.IdClassRoom,
                        principalTable: "ClassRooms",
                        principalColumn: "IdClassR",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Subjects_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    IdStud = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Name1 = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    LastName1 = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    LastName2 = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: true),
                    BirthDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Gender = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    DocType = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false),
                    DocNumber = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    Email = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: false),
                    Phone = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    Address = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false),
                    Level = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    Grade = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    Section = table.Column<string>(type: "varchar(8)", maxLength: 8, nullable: false),
                    AdmissionDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    AcademicYear = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false),
                    InitialStatus = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false),
                    Notes = table.Column<string>(type: "varchar(512)", maxLength: 512, nullable: true),
                    TutorName = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: true),
                    TutorPhone = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: true),
                    EmergencyContact = table.Column<string>(type: "varchar(128)", maxLength: 128, nullable: true),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IdC = table.Column<int>(type: "int", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.IdStud);
                    table.ForeignKey(
                        name: "FK_Students_Courses_IdC",
                        column: x => x.IdC,
                        principalTable: "Courses",
                        principalColumn: "IdC",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Students_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuxiliaryMeans",
                columns: table => new
                {
                    IdMean = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuxiliaryMeans", x => x.IdMean);
                    table.ForeignKey(
                        name: "FK_AuxiliaryMeans_Mean_IdMean",
                        column: x => x.IdMean,
                        principalTable: "Mean",
                        principalColumn: "IdMean",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TechnologicalMeans",
                columns: table => new
                {
                    IdMean = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechnologicalMeans", x => x.IdMean);
                    table.ForeignKey(
                        name: "FK_TechnologicalMeans_Mean_IdMean",
                        column: x => x.IdMean,
                        principalTable: "Mean",
                        principalColumn: "IdMean",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ClassRoomRestrictions",
                columns: table => new
                {
                    IdClassRoomRest = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdClassRoom = table.Column<int>(type: "int", nullable: false),
                    IdRest = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassRoomRestrictions", x => x.IdClassRoomRest);
                    table.ForeignKey(
                        name: "FK_ClassRoomRestrictions_ClassRooms_IdClassRoom",
                        column: x => x.IdClassRoom,
                        principalTable: "ClassRooms",
                        principalColumn: "IdClassR",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassRoomRestrictions_Restrictions_IdRest",
                        column: x => x.IdRest,
                        principalTable: "Restrictions",
                        principalColumn: "IdRes",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Attendances",
                columns: table => new
                {
                    IdAttendance = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdSub = table.Column<int>(type: "int", nullable: false),
                    IdStud = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attendances", x => x.IdAttendance);
                    table.ForeignKey(
                        name: "FK_Attendances_Students_IdStud",
                        column: x => x.IdStud,
                        principalTable: "Students",
                        principalColumn: "IdStud",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Attendances_Subjects_IdSub",
                        column: x => x.IdSub,
                        principalTable: "Subjects",
                        principalColumn: "IdSub",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Professors",
                columns: table => new
                {
                    IdProf = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    NameProf = table.Column<string>(type: "varchar(64)", maxLength: 64, nullable: false),
                    Contract = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Spec = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Salary = table.Column<int>(type: "int", nullable: false),
                    IsDean = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    LaboralExperience = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    UseAuxMean = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false),
                    StudentIdStud = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Professors", x => x.IdProf);
                    table.ForeignKey(
                        name: "FK_Professors_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Professors_Students_StudentIdStud",
                        column: x => x.StudentIdStud,
                        principalTable: "Students",
                        principalColumn: "IdStud");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "StudentSubjects",
                columns: table => new
                {
                    IdStudSub = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdStud = table.Column<int>(type: "int", nullable: false),
                    IdSub = table.Column<int>(type: "int", nullable: false),
                    NJAbsents = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentSubjects", x => x.IdStudSub);
                    table.ForeignKey(
                        name: "FK_StudentSubjects_Students_IdStud",
                        column: x => x.IdStud,
                        principalTable: "Students",
                        principalColumn: "IdStud",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentSubjects_Subjects_IdSub",
                        column: x => x.IdSub,
                        principalTable: "Subjects",
                        principalColumn: "IdSub",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SubjectAuxMeans",
                columns: table => new
                {
                    IdSubAuxMean = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdSub = table.Column<int>(type: "int", nullable: false),
                    IdAuxMean = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubjectAuxMeans", x => x.IdSubAuxMean);
                    table.ForeignKey(
                        name: "FK_SubjectAuxMeans_AuxiliaryMeans_IdAuxMean",
                        column: x => x.IdAuxMean,
                        principalTable: "AuxiliaryMeans",
                        principalColumn: "IdMean",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubjectAuxMeans_Subjects_IdSub",
                        column: x => x.IdSub,
                        principalTable: "Subjects",
                        principalColumn: "IdSub",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ClassRoomTechMeans",
                columns: table => new
                {
                    IdClassRoomTech = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdClassRoom = table.Column<int>(type: "int", nullable: false),
                    IdTechMean = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassRoomTechMeans", x => x.IdClassRoomTech);
                    table.ForeignKey(
                        name: "FK_ClassRoomTechMeans_ClassRooms_IdClassRoom",
                        column: x => x.IdClassRoom,
                        principalTable: "ClassRooms",
                        principalColumn: "IdClassR",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ClassRoomTechMeans_TechnologicalMeans_IdTechMean",
                        column: x => x.IdTechMean,
                        principalTable: "TechnologicalMeans",
                        principalColumn: "IdMean",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Maintenances",
                columns: table => new
                {
                    IdM = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    MaintenanceDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Cost = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TypeOfMean = table.Column<int>(type: "int", nullable: false),
                    IdAuxMean = table.Column<int>(type: "int", nullable: true),
                    IdTechMean = table.Column<int>(type: "int", nullable: true),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maintenances", x => x.IdM);
                    table.ForeignKey(
                        name: "FK_Maintenances_AuxiliaryMeans_IdAuxMean",
                        column: x => x.IdAuxMean,
                        principalTable: "AuxiliaryMeans",
                        principalColumn: "IdMean");
                    table.ForeignKey(
                        name: "FK_Maintenances_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Maintenances_TechnologicalMeans_IdTechMean",
                        column: x => x.IdTechMean,
                        principalTable: "TechnologicalMeans",
                        principalColumn: "IdMean");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuxiliaryMeansProfessor",
                columns: table => new
                {
                    AuxiliaryMeansIdMean = table.Column<int>(type: "int", nullable: false),
                    ProfessorsIdProf = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuxiliaryMeansProfessor", x => new { x.AuxiliaryMeansIdMean, x.ProfessorsIdProf });
                    table.ForeignKey(
                        name: "FK_AuxiliaryMeansProfessor_AuxiliaryMeans_AuxiliaryMeansIdMean",
                        column: x => x.AuxiliaryMeansIdMean,
                        principalTable: "AuxiliaryMeans",
                        principalColumn: "IdMean",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AuxiliaryMeansProfessor_Professors_ProfessorsIdProf",
                        column: x => x.ProfessorsIdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProfessorClassRooms",
                columns: table => new
                {
                    IdProfClass = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    IdClassR = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorClassRooms", x => x.IdProfClass);
                    table.ForeignKey(
                        name: "FK_ProfessorClassRooms_ClassRooms_IdClassR",
                        column: x => x.IdClassR,
                        principalTable: "ClassRooms",
                        principalColumn: "IdClassR",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorClassRooms_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProfessorEvaluations",
                columns: table => new
                {
                    IdEval = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    IdStud = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "varchar(512)", maxLength: 512, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorEvaluations", x => x.IdEval);
                    table.ForeignKey(
                        name: "FK_ProfessorEvaluations_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorEvaluations_Students_IdStud",
                        column: x => x.IdStud,
                        principalTable: "Students",
                        principalColumn: "IdStud",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProfessorNotifications",
                columns: table => new
                {
                    ProfNotId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    ProfName = table.Column<string>(type: "longtext", nullable: false),
                    BeenSended = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorNotifications", x => x.ProfNotId);
                    table.ForeignKey(
                        name: "FK_ProfessorNotifications_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProfessorNotifications_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProfessorsPunishments",
                columns: table => new
                {
                    IdPun = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    PunishmentDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IdInstitution = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorsPunishments", x => x.IdPun);
                    table.ForeignKey(
                        name: "FK_ProfessorsPunishments_Institutions_IdInstitution",
                        column: x => x.IdInstitution,
                        principalTable: "Institutions",
                        principalColumn: "IdInstitution",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProfessorsPunishments_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProfessorSubjects",
                columns: table => new
                {
                    IdProfSub = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    IdSub = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorSubjects", x => x.IdProfSub);
                    table.ForeignKey(
                        name: "FK_ProfessorSubjects_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorSubjects_Subjects_IdSub",
                        column: x => x.IdSub,
                        principalTable: "Subjects",
                        principalColumn: "IdSub",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProfStudSubCourses",
                columns: table => new
                {
                    IdProfStudSubCourse = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    IdStud = table.Column<int>(type: "int", nullable: false),
                    IdSub = table.Column<int>(type: "int", nullable: false),
                    IdCourse = table.Column<int>(type: "int", nullable: false),
                    Evaluation = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfStudSubCourses", x => x.IdProfStudSubCourse);
                    table.ForeignKey(
                        name: "FK_ProfStudSubCourses_Courses_IdCourse",
                        column: x => x.IdCourse,
                        principalTable: "Courses",
                        principalColumn: "IdC");
                    table.ForeignKey(
                        name: "FK_ProfStudSubCourses_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf");
                    table.ForeignKey(
                        name: "FK_ProfStudSubCourses_Students_IdStud",
                        column: x => x.IdStud,
                        principalTable: "Students",
                        principalColumn: "IdStud");
                    table.ForeignKey(
                        name: "FK_ProfStudSubCourses_Subjects_IdSub",
                        column: x => x.IdSub,
                        principalTable: "Subjects",
                        principalColumn: "IdSub");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    IdReservation = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    IdClassR = table.Column<int>(type: "int", nullable: false),
                    IdSub = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.IdReservation);
                    table.ForeignKey(
                        name: "FK_Reservations_ClassRooms_IdClassR",
                        column: x => x.IdClassR,
                        principalTable: "ClassRooms",
                        principalColumn: "IdClassR",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reservations_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Reservations_Subjects_IdSub",
                        column: x => x.IdSub,
                        principalTable: "Subjects",
                        principalColumn: "IdSub",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    IdSchedule = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdSub = table.Column<int>(type: "int", nullable: false),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    IdClassR = table.Column<int>(type: "int", nullable: false),
                    Day = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.IdSchedule);
                    table.ForeignKey(
                        name: "FK_Schedules_ClassRooms_IdClassR",
                        column: x => x.IdClassR,
                        principalTable: "ClassRooms",
                        principalColumn: "IdClassR",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Schedules_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Schedules_Subjects_IdSub",
                        column: x => x.IdSub,
                        principalTable: "Subjects",
                        principalColumn: "IdSub",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProfessorStudentSubjects",
                columns: table => new
                {
                    IdProfStudSub = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdProf = table.Column<int>(type: "int", nullable: false),
                    IdStudSub = table.Column<int>(type: "int", nullable: false),
                    StudentGrades = table.Column<float>(type: "float", nullable: false, defaultValue: 0f)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfessorStudentSubjects", x => x.IdProfStudSub);
                    table.ForeignKey(
                        name: "FK_ProfessorStudentSubjects_Professors_IdProf",
                        column: x => x.IdProf,
                        principalTable: "Professors",
                        principalColumn: "IdProf",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfessorStudentSubjects_StudentSubjects_IdStudSub",
                        column: x => x.IdStudSub,
                        principalTable: "StudentSubjects",
                        principalColumn: "IdStudSub",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ReservationTechnologicalMeans",
                columns: table => new
                {
                    MeansIdMean = table.Column<int>(type: "int", nullable: false),
                    ReservationIdReservation = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationTechnologicalMeans", x => new { x.MeansIdMean, x.ReservationIdReservation });
                    table.ForeignKey(
                        name: "FK_ReservationTechnologicalMeans_Reservations_ReservationIdRese~",
                        column: x => x.ReservationIdReservation,
                        principalTable: "Reservations",
                        principalColumn: "IdReservation",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReservationTechnologicalMeans_TechnologicalMeans_MeansIdMean",
                        column: x => x.MeansIdMean,
                        principalTable: "TechnologicalMeans",
                        principalColumn: "IdMean",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SecretaryProfessorStudentSubjects",
                columns: table => new
                {
                    IdSecProfStudSub = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    IdSec = table.Column<int>(type: "int", nullable: false),
                    IdProfStudSub = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SecretaryProfessorStudentSubjects", x => x.IdSecProfStudSub);
                    table.ForeignKey(
                        name: "FK_SecretaryProfessorStudentSubjects_ProfessorStudentSubjects_I~",
                        column: x => x.IdProfStudSub,
                        principalTable: "ProfessorStudentSubjects",
                        principalColumn: "IdProfStudSub",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SecretaryProfessorStudentSubjects_Secretaries_IdSec",
                        column: x => x.IdSec,
                        principalTable: "Secretaries",
                        principalColumn: "IdS",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Administrators_IdInstitution",
                table: "Administrators",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_IdStud",
                table: "Attendances",
                column: "IdStud");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_IdSub_IdStud_Date",
                table: "Attendances",
                columns: new[] { "IdSub", "IdStud", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AuxiliaryMeansProfessor_ProfessorsIdProf",
                table: "AuxiliaryMeansProfessor",
                column: "ProfessorsIdProf");

            migrationBuilder.CreateIndex(
                name: "IX_ClassRoomRestrictions_IdClassRoom",
                table: "ClassRoomRestrictions",
                column: "IdClassRoom");

            migrationBuilder.CreateIndex(
                name: "IX_ClassRoomRestrictions_IdRest",
                table: "ClassRoomRestrictions",
                column: "IdRest");

            migrationBuilder.CreateIndex(
                name: "IX_ClassRooms_IdInstitution",
                table: "ClassRooms",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_ClassRoomTechMeans_IdClassRoom",
                table: "ClassRoomTechMeans",
                column: "IdClassRoom");

            migrationBuilder.CreateIndex(
                name: "IX_ClassRoomTechMeans_IdTechMean",
                table: "ClassRoomTechMeans",
                column: "IdTechMean");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_IdInstitution",
                table: "Courses",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_Institutions_Domain",
                table: "Institutions",
                column: "Domain",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Maintenances_IdAuxMean",
                table: "Maintenances",
                column: "IdAuxMean");

            migrationBuilder.CreateIndex(
                name: "IX_Maintenances_IdInstitution",
                table: "Maintenances",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_Maintenances_IdTechMean",
                table: "Maintenances",
                column: "IdTechMean");

            migrationBuilder.CreateIndex(
                name: "IX_MaintenanceWorkers_IdInstitution",
                table: "MaintenanceWorkers",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_Mean_IdInstitution",
                table: "Mean",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_MeanNotifications_IdInstitution",
                table: "MeanNotifications",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorClassRooms_IdClassR",
                table: "ProfessorClassRooms",
                column: "IdClassR");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorClassRooms_IdProf",
                table: "ProfessorClassRooms",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorEvaluations_IdProf",
                table: "ProfessorEvaluations",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorEvaluations_IdStud",
                table: "ProfessorEvaluations",
                column: "IdStud");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorNotifications_IdInstitution",
                table: "ProfessorNotifications",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorNotifications_IdProf",
                table: "ProfessorNotifications",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_Professors_IdInstitution",
                table: "Professors",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_Professors_StudentIdStud",
                table: "Professors",
                column: "StudentIdStud");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorsPunishments_IdInstitution",
                table: "ProfessorsPunishments",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorsPunishments_IdProf",
                table: "ProfessorsPunishments",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorStudentSubjects_IdProf",
                table: "ProfessorStudentSubjects",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorStudentSubjects_IdStudSub",
                table: "ProfessorStudentSubjects",
                column: "IdStudSub");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorSubjects_IdProf",
                table: "ProfessorSubjects",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_ProfessorSubjects_IdSub",
                table: "ProfessorSubjects",
                column: "IdSub");

            migrationBuilder.CreateIndex(
                name: "IX_ProfStudSubCourses_IdCourse",
                table: "ProfStudSubCourses",
                column: "IdCourse");

            migrationBuilder.CreateIndex(
                name: "IX_ProfStudSubCourses_IdProf",
                table: "ProfStudSubCourses",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_ProfStudSubCourses_IdStud",
                table: "ProfStudSubCourses",
                column: "IdStud");

            migrationBuilder.CreateIndex(
                name: "IX_ProfStudSubCourses_IdSub",
                table: "ProfStudSubCourses",
                column: "IdSub");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_IdClassR",
                table: "Reservations",
                column: "IdClassR");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_IdProf",
                table: "Reservations",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_IdSub",
                table: "Reservations",
                column: "IdSub");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationTechnologicalMeans_ReservationIdReservation",
                table: "ReservationTechnologicalMeans",
                column: "ReservationIdReservation");

            migrationBuilder.CreateIndex(
                name: "IX_Restrictions_IdInstitution",
                table: "Restrictions",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_IdClassR",
                table: "Schedules",
                column: "IdClassR");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_IdProf",
                table: "Schedules",
                column: "IdProf");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_IdSub",
                table: "Schedules",
                column: "IdSub");

            migrationBuilder.CreateIndex(
                name: "IX_Secretaries_IdInstitution",
                table: "Secretaries",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_SecretaryProfessorStudentSubjects_IdProfStudSub",
                table: "SecretaryProfessorStudentSubjects",
                column: "IdProfStudSub");

            migrationBuilder.CreateIndex(
                name: "IX_SecretaryProfessorStudentSubjects_IdSec",
                table: "SecretaryProfessorStudentSubjects",
                column: "IdSec");

            migrationBuilder.CreateIndex(
                name: "IX_Students_IdC",
                table: "Students",
                column: "IdC");

            migrationBuilder.CreateIndex(
                name: "IX_Students_IdInstitution_DocNumber",
                table: "Students",
                columns: new[] { "IdInstitution", "DocNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_IdStud",
                table: "StudentSubjects",
                column: "IdStud");

            migrationBuilder.CreateIndex(
                name: "IX_StudentSubjects_IdSub",
                table: "StudentSubjects",
                column: "IdSub");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectAuxMeans_IdAuxMean",
                table: "SubjectAuxMeans",
                column: "IdAuxMean");

            migrationBuilder.CreateIndex(
                name: "IX_SubjectAuxMeans_IdSub",
                table: "SubjectAuxMeans",
                column: "IdSub");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_IdClassRoom",
                table: "Subjects",
                column: "IdClassRoom");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_IdInstitution",
                table: "Subjects",
                column: "IdInstitution");

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_UserId",
                table: "UserPreferences",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_YearHeads_IdInstitution",
                table: "YearHeads",
                column: "IdInstitution");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Administrators");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Attendances");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "AuxiliaryMeansProfessor");

            migrationBuilder.DropTable(
                name: "ClassRoomRestrictions");

            migrationBuilder.DropTable(
                name: "ClassRoomTechMeans");

            migrationBuilder.DropTable(
                name: "Maintenances");

            migrationBuilder.DropTable(
                name: "MaintenanceWorkers");

            migrationBuilder.DropTable(
                name: "MeanNotifications");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "ProfessorClassRooms");

            migrationBuilder.DropTable(
                name: "ProfessorEvaluations");

            migrationBuilder.DropTable(
                name: "ProfessorNotifications");

            migrationBuilder.DropTable(
                name: "ProfessorsPunishments");

            migrationBuilder.DropTable(
                name: "ProfessorSubjects");

            migrationBuilder.DropTable(
                name: "ProfStudSubCourses");

            migrationBuilder.DropTable(
                name: "ReservationTechnologicalMeans");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "SecretaryProfessorStudentSubjects");

            migrationBuilder.DropTable(
                name: "SubjectAuxMeans");

            migrationBuilder.DropTable(
                name: "UserPreferences");

            migrationBuilder.DropTable(
                name: "YearHeads");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Restrictions");

            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "TechnologicalMeans");

            migrationBuilder.DropTable(
                name: "ProfessorStudentSubjects");

            migrationBuilder.DropTable(
                name: "Secretaries");

            migrationBuilder.DropTable(
                name: "AuxiliaryMeans");

            migrationBuilder.DropTable(
                name: "Professors");

            migrationBuilder.DropTable(
                name: "StudentSubjects");

            migrationBuilder.DropTable(
                name: "Mean");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "ClassRooms");

            migrationBuilder.DropTable(
                name: "Institutions");
        }
    }
}
