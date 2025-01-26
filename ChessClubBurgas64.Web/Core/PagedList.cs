using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T, U> : List<U>
    {
        public PagedList(IEnumerable<U> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public static async Task<PagedList<T, U>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize, IMapper mapper)
        {
            var count = await source.CountAsync();
            var items = await source
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => mapper.Map<U>(x))
                .ToListAsync();

            return new PagedList<T, U>(items, count, pageNumber, pageSize);
        }
    }
}
