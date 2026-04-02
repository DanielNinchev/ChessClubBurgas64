import { makeAutoObservable } from 'mobx';

export default class AnnouncementStore {
    // Existing properties used by useAnnouncements
    filter = 'all';
    startDate: string | null = null;

    // New properties for sidebar filtering/sorting
    searchTerm = '';
    sortBy = 'date_desc';
    dateFilter = 'all';

    constructor() {
        makeAutoObservable(this);
    }

    // Existing setters
    setFilter = (filter: string) => {
        this.filter = filter;
    };

    setStartDate = (date: string | null) => {
        this.startDate = date;
    };

    // New setters for sidebar
    setSearchTerm = (term: string) => {
        this.searchTerm = term;
    };

    setSortBy = (sort: string) => {
        this.sortBy = sort;
    };

    setDateFilter = (dateFilter: string) => {
        this.dateFilter = dateFilter;
    };

    resetFilters = () => {
        this.searchTerm = '';
        this.sortBy = 'date_desc';
        this.dateFilter = 'all';
    };
}
