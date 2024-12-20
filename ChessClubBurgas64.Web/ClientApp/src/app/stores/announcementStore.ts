import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Pagination, PagingParams } from "../models/pagination";
import { Announcement, AnnouncementFormValues, Image } from "../models/announcement";
import { store } from "./store";
import { toast } from "react-toastify";

export default class AnnouncementStore {
    announcementRegistry = new Map<string, Announcement>();
    selectedAnnouncement?: Announcement = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);
    uploading = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.announcementRegistry.clear();
                this.loadAnnouncements();
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
                console.log('Key is appended:', key)
                params.append(key, (value as Date).toISOString())
            } else {
                console.log('Key is appended:', key)
                console.log('Value is appended:', value)

                params.append(key, value);
            }
        })
        return params;
    }

    get groupedAnnouncements() {
        return Object.entries(
            this.announcementsByDate.reduce((announcements, announcement) => {
                console.log(announcement.dateCreated)
                console.log("This is the announcement: ", announcement)
                const date = announcement.dateCreated!.toISOString().split('T')[0];
                announcements[date] = announcements[date] ? [...announcements[date], announcement] : [announcement];
                return announcements;
            }, {} as { [key: string]: Announcement[] })
        )
    }

    get announcementsByDate() {
        console.log('Announcements:', Array.from(this.announcementRegistry.values()))
        return Array.from(this.announcementRegistry.values()).sort((a, b) =>
            a.dateCreated!.getTime() - b.dateCreated!.getTime());
    }

    loadAnnouncements = async () => {
        this.loadingInitial = true;
        try {
            const result = await agent.Announcements.list(this.axiosParams);
            if(result.data && result.pagination){
                result.data.forEach(announcement => {
                    this.setAnnouncement(announcement);
                })
                this.setPagination(result.pagination);
                this.setLoadingInitial(false);
            }
            else{
                console.log('No data or pagination found in result!')
            }
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
        console.log('Announcement is:', announcement)
        announcement.dateCreated = new Date(announcement.dateCreated!);
        this.announcementRegistry.set(announcement.id, announcement);
    }

    private getAnnouncement = (id: string) => {
        return this.announcementRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createAnnouncement = async (announcement: AnnouncementFormValues, file: Blob) => {
        try {
            const response = await agent.Announcements.create(announcement, file);
            console.log('Form Data is: ', response)
            const newAnnouncement = response;
            console.log('New announcement is:', newAnnouncement)
            for (const image of response.images) {
                if (image.isMain) {
                    store.announcementStore.setImage(image.url);
                    announcement.mainImageUrl = image.url;
                    break;
                }
            }
            this.setAnnouncement(newAnnouncement);
            runInAction(() => this.selectedAnnouncement = newAnnouncement);
            return newAnnouncement
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

    uploadImage = async (file: any) => {
        this.uploading = true;
        try {
            const response = await agent.Announcements.uploadImage(file);
            const image = response.data;
            runInAction(() => {
                if (this.selectedAnnouncement) {
                    this.selectedAnnouncement.images?.push(image);
                    if (image.isMain && store.userStore.user) {
                        store.announcementStore.setImage(image.url);
                        this.selectedAnnouncement.mainImageUrl = image.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setImage = (image: string) => {
        if (this.selectedAnnouncement) this.selectedAnnouncement.mainImageUrl = image;
    }

    setMainImage = async (image: Image) => {
        this.loading = true;
        try {
            await agent.Announcements.setMainImage(image.id);
            runInAction(() => {
                if (this.selectedAnnouncement && this.selectedAnnouncement.images) {
                    this.selectedAnnouncement.images.find(a => a.isMain)!.isMain = false;
                    this.selectedAnnouncement.images.find(a => a.id === image.id)!.isMain = true;
                    this.selectedAnnouncement.mainImageUrl = image.url;
                    this.loading = false;
                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    deleteImage = async (image: Image) => {
        this.loading = true;
        try {
            await agent.Announcements.deleteMainImage(image.id);
            runInAction(() => {
                if (this.selectedAnnouncement) {
                    this.selectedAnnouncement.images = this.selectedAnnouncement.images?.filter(a => a.id !== image.id);
                    this.loading = false;
                }
            })
        } catch (error) {
            toast.error('Problem deleting photo');
            this.loading = false;
        }
    }

    clearSelectedAnnouncement = () => {
        this.selectedAnnouncement = undefined;
    }
}