
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
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          location: string | null
          frente_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_time: string
          end_time?: string | null
          location?: string | null
          frente_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          location?: string | null
          frente_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      frentes: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          image_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          image_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          orixa: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: string
          orixa?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          orixa?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_upcoming_events: {
        Args: {
          days_ahead: number
        }
        Returns: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          location: string | null
          frente_id: string | null
          created_at: string
          updated_at: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
