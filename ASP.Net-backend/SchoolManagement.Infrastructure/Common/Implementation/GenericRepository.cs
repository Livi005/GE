using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SchoolManagement.Domain.Common;
using SchoolManagement.Infrastructure.Common.GenericInterface;

namespace SchoolManagement.Infrastructure.Common.Implementation;

public class GenericRepository<TEntity, TId> : IRepository<TEntity, TId>
    where TEntity : class, IEntity
{
    private readonly DbSet<TEntity> _dbSet;
    private readonly Context _context;

    public GenericRepository(Context context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    /// <summary>
    /// Query base que YA aplica el filtro multi-tenant del lado del servidor.
    /// </summary>
    private IQueryable<TEntity> QueryWithTenant() => _context.Query<TEntity>();

    public async Task<TEntity?> GetByIdAsync(TId id, CancellationToken cancellationToken = default)
    {
        var entity = await _dbSet.FindAsync(new object?[] { id }, cancellationToken);
        if (entity is null) return null;

        // Validación de tenant: si la entidad tiene IdInstitution y el usuario no es SuperAdmin,
        // comprobar que coincide.
        var prop = typeof(TEntity).GetProperty("IdInstitution");
        if (prop is not null && prop.PropertyType == typeof(int))
        {
            var tenantId = _context.CurrentTenantId;
            if (tenantId is not null && !_context.IsSuperAdmin)
            {
                var value = (int)prop.GetValue(entity)!;
                if (value != tenantId.Value) return null;
            }
        }

        return entity;
    }

    public async Task<IReadOnlyList<TEntity>> ListAsync(CancellationToken cancellationToken = default)
        => await QueryWithTenant().AsNoTracking().ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<TEntity>> ListAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default)
        => await QueryWithTenant().AsNoTracking().Where(predicate).ToListAsync(cancellationToken);

    public Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        => QueryWithTenant().AsNoTracking().AnyAsync(predicate, cancellationToken);

    public Task<int> CountAsync(CancellationToken cancellationToken = default)
        => QueryWithTenant().AsNoTracking().CountAsync(cancellationToken);

    public async Task<(IReadOnlyList<TEntity> Items, int TotalCount)> ListPagedAsync(
        int page,
        int pageSize,
        string? search = null,
        Expression<Func<TEntity, bool>>? filter = null,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descending = false,
        CancellationToken cancellationToken = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        IQueryable<TEntity> query = QueryWithTenant().AsNoTracking();

        if (filter is not null)
            query = query.Where(filter);

        var total = await query.CountAsync(cancellationToken);

        if (orderBy is not null)
            query = descending ? query.OrderByDescending(orderBy) : query.OrderBy(orderBy);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    public async Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        // Auto-set IdInstitution si la entidad lo requiere y el usuario no es SuperAdmin
        var prop = typeof(TEntity).GetProperty("IdInstitution");
        if (prop is not null && prop.PropertyType == typeof(int))
        {
            var current = (int)prop.GetValue(entity)!;
            if (current == 0)
            {
                var tenantId = _context.CurrentTenantId;
                if (tenantId is not null && !_context.IsSuperAdmin)
                {
                    prop.SetValue(entity, tenantId.Value);
                }
            }
        }

        await _dbSet.AddAsync(entity, cancellationToken);
        return entity;
    }

    public async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
    {
        foreach (var e in entities)
            await AddAsync(e, cancellationToken);
    }

    public void Update(TEntity entity) => _dbSet.Update(entity);
    
    public void Remove(TEntity entity)
    {
        if (entity is ISoftDeletable softDeletable)
        {
            softDeletable.IsDeleted = true;
    
            // Asegurar que la entidad está siendo trackeada
            var entry = _context.Entry(entity);
            if (entry.State == EntityState.Detached)
            {
                _dbSet.Attach(entity);
                entry = _context.Entry(entity);
            }
            entry.State = EntityState.Modified;
            entry.Property(nameof(ISoftDeletable.IsDeleted)).IsModified = true;
        }
        else
        {
            _dbSet.Remove(entity);
        }
    }

    public IQueryable<TEntity> Query() => QueryWithTenant();
}