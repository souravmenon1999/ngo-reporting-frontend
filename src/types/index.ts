export interface Report {
    ngo_id: string;
    month: string;
    people_helped: number;
    events_conducted: number;
    funds_utilized: number;
  }
  
  export interface DashboardData {
    total_ngos: number;
    total_people: number;
    total_events: number;
    total_funds: number;
  }
  