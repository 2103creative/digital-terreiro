
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
      users: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          orixa: string | null
          iniciacao_date: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          orixa?: string | null
          iniciacao_date?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          orixa?: string | null
          iniciacao_date?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      frentes: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          description: string
          image_url: string | null
          type: string
          icons: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          description: string
          image_url?: string | null
          type: string
          icons?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string | null
          description?: string
          image_url?: string | null
          type?: string
          icons?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          image_url: string | null
          frente_id: string | null
          created_by: string
          is_public: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          image_url?: string | null
          frente_id?: string | null
          created_by: string
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          image_url?: string | null
          frente_id?: string | null
          created_by?: string
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      reading_materials: {
        Row: {
          id: string
          title: string
          author: string | null
          description: string | null
          content: string | null
          file_url: string | null
          image_url: string | null
          frente_id: string | null
          created_by: string
          is_public: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author?: string | null
          description?: string | null
          content?: string | null
          file_url?: string | null
          image_url?: string | null
          frente_id?: string | null
          created_by: string
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string | null
          description?: string | null
          content?: string | null
          file_url?: string | null
          image_url?: string | null
          frente_id?: string | null
          created_by?: string
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          is_pinned: boolean | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          is_pinned?: boolean | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          is_pinned?: boolean | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      cleaning_schedules: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      cleaning_participants: {
        Row: {
          id: string
          schedule_id: string
          user_id: string
          task: string | null
          created_at: string
        }
        Insert: {
          id?: string
          schedule_id: string
          user_id: string
          task?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          schedule_id?: string
          user_id?: string
          task?: string | null
          created_at?: string
        }
      }
      shopping_lists: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string | null
          is_completed: boolean | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date?: string | null
          is_completed?: boolean | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string | null
          is_completed?: boolean | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      shopping_items: {
        Row: {
          id: string
          list_id: string
          name: string
          quantity: number | null
          is_purchased: boolean | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          name: string
          quantity?: number | null
          is_purchased?: boolean | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          name?: string
          quantity?: number | null
          is_purchased?: boolean | null
          created_by?: string | null
          created_at?: string
        }
      }
      herbs: {
        Row: {
          id: string
          name: string
          scientific_name: string | null
          description: string | null
          uses: string | null
          image_url: string | null
          related_orixa: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          scientific_name?: string | null
          description?: string | null
          uses?: string | null
          image_url?: string | null
          related_orixa?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          scientific_name?: string | null
          description?: string | null
          uses?: string | null
          image_url?: string | null
          related_orixa?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      ritual_baths: {
        Row: {
          id: string
          name: string
          description: string
          procedure: string
          related_orixa: string | null
          image_url: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          procedure: string
          related_orixa?: string | null
          image_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          procedure?: string
          related_orixa?: string | null
          image_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      bath_ingredients: {
        Row: {
          id: string
          bath_id: string
          herb_id: string | null
          other_ingredient: string | null
          quantity: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bath_id: string
          herb_id?: string | null
          other_ingredient?: string | null
          quantity?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bath_id?: string
          herb_id?: string | null
          other_ingredient?: string | null
          quantity?: string | null
          created_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          content: string
          user_id: string
          is_deleted: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          is_deleted?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          is_deleted?: boolean | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_upcoming_events: {
        Args: {
          days_ahead?: number
        }
        Returns: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          image_url: string | null
          frente_id: string | null
          created_by: string
          is_public: boolean | null
          created_at: string
          updated_at: string
        }[]
      }
      generate_cleaning_schedule: {
        Args: {
          schedule_title: string
          schedule_date: string
          user_ids: string[]
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
