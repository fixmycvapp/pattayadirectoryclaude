export interface Event {
  _id: string;
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  price: number;
  priceCategory: string;
  images: string[];
  imageUrl?: string;
  organizer?: string;
  views: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventDetail extends Event {
  latitude?: number;
  longitude?: number;
  videoUrl?: string;
  ticketUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  capacity?: number;
  attendees?: number;
  tags?: string[];
  status?: string;
}

export interface Location {
  _id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface FilterParams {
  type?: string;
  location?: string;
  priceCategory?: string;
  search?: string;
  sort?: string;
  limit?: number;
  page?: number;
}