export interface Announcement {
    id: string;
    title: string;
    dateCreated: Date | null;
    dateUpdated: Date | null;
    description: string;
    text: string;
    mainImageUrl: string;
    images: Image[]
}

export class AnnouncementFormValues
{
  id?: string = undefined;
  title: string = '';
  description: string = '';
  text: string = '';
  mainImageUrl: string = '';
  
  constructor(announcement?: AnnouncementFormValues) {
    if (announcement) {
      this.id = announcement.id;
      this.title = announcement.title;
      this.description = announcement.description;
      this.text = announcement.text;
      this.mainImageUrl = announcement.mainImageUrl;
    }
  }
}

export class Announcement implements Announcement {
  constructor(init?: AnnouncementFormValues) {
    Object.assign(this, init);
  }
}

export interface Image {
  id: string;
  url: string;
  isMain: boolean;
}
