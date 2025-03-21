export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      scraped_profiles: {
        Row: {
          id: string
          url: string
          full_name: string | null
          current_position: string | null
          company: string | null
          location: string | null
          skills: string[] | null
          created_at: string
          last_scraped: string
          next_scan_date: string | null
          scan_interval: number
          raw_data: Json | null
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          url: string
          full_name?: string | null
          current_position?: string | null
          company?: string | null
          location?: string | null
          skills?: string[] | null
          created_at?: string
          last_scraped?: string
          next_scan_date?: string | null
          scan_interval?: number
          raw_data?: Json | null
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          url?: string
          full_name?: string | null
          current_position?: string | null
          company?: string | null
          location?: string | null
          skills?: string[] | null
          created_at?: string
          last_scraped?: string
          next_scan_date?: string | null
          scan_interval?: number
          raw_data?: Json | null
          status?: string
          user_id?: string
        }
      }
    }
  }
}