using System.Linq.Expressions;
using SchoolManagement.Domain.Common;

namespace SchoolManagement.Infrastructure.Common.GenericInterface;

public interface IRepository<TEntity, in TId> where TEntity : class, IEntity
{
    Task<TEntity?> GetByIdAsync(TId id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TEntity>> ListAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TEntity>> ListAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
    Task<int> CountAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Devuelve una página de entidades filtrando por búsqueda y ordenando.
    /// Si <paramref name="search"/> es null/vacío, no filtra.
    /// </summary>
    Task<(IReadOnlyList<TEntity> Items, int TotalCount)> ListPagedAsync(
        int page,
        int pageSize,
        string? search = null,
        Expression<Func<TEntity, bool>>? filter = null,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descending = false,
        CancellationToken cancellationToken = default);

    Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default);
    void Update(TEntity entity);
    void Remove(TEntity entity);

    IQueryable<TEntity> Query();
}