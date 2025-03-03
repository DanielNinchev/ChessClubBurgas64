namespace Application.Core;

public class PaginationParams<TCursor>
{
    private const int _maxPageSize = 50;
    public TCursor? Cursor { get; set; }
    private int _pageSize = 3;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > _maxPageSize) ? _maxPageSize : value;
    }
}
