import { create } from 'zustand';

interface AnnouncementStoreState {
    searchTerm: string;
    sortBy: string;
    dateFilter: string;
    setSearchTerm: (term: string) => void;
    setSortBy: (sort: string) => void;
    setDateFilter: (filter: string) => void;
    resetFilters: () => void;
}

export const useAnnouncementStore = create<AnnouncementStoreState>((set) => ({
    searchTerm: '',
    sortBy: 'date_desc',
    dateFilter: 'all',
    setSearchTerm: (term) => set({ searchTerm: term }),
    setSortBy: (sort) => set({ sortBy: sort }),
    setDateFilter: (filter) => set({ dateFilter: filter }),
    resetFilters: () => set({ searchTerm: '', sortBy: 'date_desc', dateFilter: 'all' }),
}));