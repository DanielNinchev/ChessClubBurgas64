export interface Announcement {
    id: string;
    title: string;
    dateCreated: Date | null;
    description: string;
    text: string;
    mainPhotoUrl: string;
}

export class AnnouncementFormValues
  {
    id?: string = undefined;
    title: string = '';
    dateCreated: Date | null = null;
    description: string = '';
    text: string = '';
    mainPhotoUrl: string = '';

	  constructor(announcement?: AnnouncementFormValues) {
      if (announcement) {
        this.id = announcement.id;
        this.title = announcement.title;
        this.description = announcement.description;
        this.dateCreated = announcement.dateCreated;
        this.text = announcement.text;
        this.mainPhotoUrl = announcement.mainPhotoUrl;
      }
    }
  }

  export class Announcement implements Announcement {
    constructor(init?: AnnouncementFormValues) {
      Object.assign(this, init);
    }
  }
