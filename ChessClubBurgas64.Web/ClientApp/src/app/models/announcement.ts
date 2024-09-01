export interface Announcement {
    id: string;
    date: Date | null;
    description: string;
    title: string;
    text: string;
}

export class AnnouncementFormValues
  {
    id?: string = undefined;
    title: string = '';
    description: string = '';
    date: Date | null = null;

	  constructor(announcement?: AnnouncementFormValues) {
      if (announcement) {
        this.id = announcement.id;
        this.title = announcement.title;
        this.description = announcement.description;
        this.date = announcement.date;
      }
    }

  }

  export class Announcement implements Announcement {
    constructor(init?: AnnouncementFormValues) {
      Object.assign(this, init);
    }
  }
