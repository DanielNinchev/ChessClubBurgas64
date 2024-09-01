import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Pagination, PagingParams } from "../models/pagination";
import { Announcement, AnnouncementFormValues } from "../models/announcement";

export default class AnnouncementStore {
    announcementRegistry = new Map<string, Announcement>();
    selectedAnnouncement?: Announcement = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.announcementRegistry.clear();
                this.loadActivities();
            }
        )
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            })
        }
        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;
        }
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString())
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString())
            } else {
                params.append(key, value);
            }
        })
        return params;
    }

    get groupedActivities() {
        return Object.entries(
            this.announcementsByDate.reduce((announcements, announcement) => {
                const date = announcement.date!.toISOString().split('T')[0];
                announcements[date] = announcements[date] ? [...announcements[date], announcement] : [announcement];
                return announcements;
            }, {} as { [key: string]: Announcement[] })
        )
    }

    get announcementsByDate() {
        return Array.from(this.announcementRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const result = await agent.Announcements.list(this.axiosParams);
            result.data.forEach(announcement => {
                this.setAnnouncement(announcement);
            })
            this.setPagination(result.pagination);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    loadAnnouncement = async (id: string) => {
        let announcement = this.getAnnouncement(id);
        if (announcement) {
            this.selectedAnnouncement = announcement;
            return announcement;
        }
        else {
            this.setLoadingInitial(true);
            try {
                announcement = await agent.Announcements.details(id);
                this.setAnnouncement(announcement);
                runInAction(() => this.selectedAnnouncement = announcement);
                this.setLoadingInitial(false);
                return announcement;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setAnnouncement = (announcement: Announcement) => {
        announcement.date = new Date(announcement.date!);
        this.announcementRegistry.set(announcement.id, announcement);
    }

    private getAnnouncement = (id: string) => {
        return this.announcementRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createAnnouncement = async (announcement: AnnouncementFormValues) => {
        try {
            await agent.Announcements.create(announcement);
            const newAnnouncement = new Announcement(announcement);
            this.setAnnouncement(newAnnouncement);
            runInAction(() => this.selectedAnnouncement = newAnnouncement);
        } catch (error) {
            console.log(error);
        }
    }

    updateAnnouncement = async (announcement: AnnouncementFormValues) => {
        try {
            await agent.Announcements.update(announcement);
            runInAction(() => {
                if (announcement.id) {
                    let updatedAnnouncement = { ...this.getAnnouncement(announcement.id), ...announcement };
                    this.announcementRegistry.set(announcement.id, updatedAnnouncement as Announcement);
                    this.selectedAnnouncement = updatedAnnouncement as Announcement;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteAnnouncement = async (id: string) => {
        this.loading = true;
        try {
            await agent.Announcements.delete(id);
            runInAction(() => {
                this.announcementRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}