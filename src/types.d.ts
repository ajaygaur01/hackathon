interface Hackathon {
    id: string;
    name: string;
    website: string;
    start: string;
    end: string;
    createdAt: string;
    logo: string | null;
    banner: string | null ;
    city: string | null;
    state: string | null;
    country: string | null;
    countryCode: string | null;
    latitude: number | null;
    longitude: number | null;
    virtual: boolean;
    hybrid: boolean;
    mlhAssociated: boolean;
    apac: boolean;
  }
  
  interface HackathonCardProps {
    hackathon: Hackathon;
  }