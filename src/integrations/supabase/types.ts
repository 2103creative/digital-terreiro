export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      banhos: {
        Row: {
          created_at: string
          criado_por: string
          descricao: string
          id: string
          imagem_url: string | null
          nome: string
          orixa_relacionado: string | null
          procedimento: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criado_por: string
          descricao: string
          id?: string
          imagem_url?: string | null
          nome: string
          orixa_relacionado?: string | null
          procedimento: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criado_por?: string
          descricao?: string
          id?: string
          imagem_url?: string | null
          nome?: string
          orixa_relacionado?: string | null
          procedimento?: string
          updated_at?: string
        }
        Relationships: []
      }
      ervas: {
        Row: {
          created_at: string
          criado_por: string
          descricao: string | null
          id: string
          imagem_url: string | null
          nome: string
          nome_cientifico: string | null
          orixa_relacionado: string | null
          updated_at: string
          usos: string | null
        }
        Insert: {
          created_at?: string
          criado_por: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome: string
          nome_cientifico?: string | null
          orixa_relacionado?: string | null
          updated_at?: string
          usos?: string | null
        }
        Update: {
          created_at?: string
          criado_por?: string
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          nome?: string
          nome_cientifico?: string | null
          orixa_relacionado?: string | null
          updated_at?: string
          usos?: string | null
        }
        Relationships: []
      }
      escalas_limpeza: {
        Row: {
          created_at: string
          criado_por: string
          data: string
          descricao: string | null
          id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criado_por: string
          data: string
          descricao?: string | null
          id?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criado_por?: string
          data?: string
          descricao?: string | null
          id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string
          criado_por: string
          data_fim: string
          data_inicio: string
          descricao: string | null
          frente_id: string | null
          id: string
          imagem_url: string | null
          local: string | null
          publico: boolean | null
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criado_por: string
          data_fim: string
          data_inicio: string
          descricao?: string | null
          frente_id?: string | null
          id?: string
          imagem_url?: string | null
          local?: string | null
          publico?: boolean | null
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criado_por?: string
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          frente_id?: string | null
          id?: string
          imagem_url?: string | null
          local?: string | null
          publico?: boolean | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_frente_id_fkey"
            columns: ["frente_id"]
            isOneToOne: false
            referencedRelation: "frentes"
            referencedColumns: ["id"]
          },
        ]
      }
      frentes: {
        Row: {
          cor: string | null
          created_at: string
          descricao: string
          icone: string | null
          id: string
          imagem_url: string | null
          subtitulo: string | null
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          cor?: string | null
          created_at?: string
          descricao: string
          icone?: string | null
          id?: string
          imagem_url?: string | null
          subtitulo?: string | null
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          cor?: string | null
          created_at?: string
          descricao?: string
          icone?: string | null
          id?: string
          imagem_url?: string | null
          subtitulo?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      ingredientes_banho: {
        Row: {
          banho_id: string
          created_at: string
          erva_id: string | null
          id: string
          outro_ingrediente: string | null
          quantidade: string | null
        }
        Insert: {
          banho_id: string
          created_at?: string
          erva_id?: string | null
          id?: string
          outro_ingrediente?: string | null
          quantidade?: string | null
        }
        Update: {
          banho_id?: string
          created_at?: string
          erva_id?: string | null
          id?: string
          outro_ingrediente?: string | null
          quantidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingredientes_banho_banho_id_fkey"
            columns: ["banho_id"]
            isOneToOne: false
            referencedRelation: "banhos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredientes_banho_erva_id_fkey"
            columns: ["erva_id"]
            isOneToOne: false
            referencedRelation: "ervas"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_compra: {
        Row: {
          comprado: boolean | null
          comprado_por: string | null
          created_at: string
          id: string
          lista_id: string
          nome: string
          quantidade: string | null
          unidade: string | null
        }
        Insert: {
          comprado?: boolean | null
          comprado_por?: string | null
          created_at?: string
          id?: string
          lista_id: string
          nome: string
          quantidade?: string | null
          unidade?: string | null
        }
        Update: {
          comprado?: boolean | null
          comprado_por?: string | null
          created_at?: string
          id?: string
          lista_id?: string
          nome?: string
          quantidade?: string | null
          unidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_compra_lista_id_fkey"
            columns: ["lista_id"]
            isOneToOne: false
            referencedRelation: "listas_compras"
            referencedColumns: ["id"]
          },
        ]
      }
      listas_compras: {
        Row: {
          concluida: boolean | null
          created_at: string
          criado_por: string
          data: string | null
          descricao: string | null
          id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          concluida?: boolean | null
          created_at?: string
          criado_por: string
          data?: string | null
          descricao?: string | null
          id?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          concluida?: boolean | null
          created_at?: string
          criado_por?: string
          data?: string | null
          descricao?: string | null
          id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      materiais_leitura: {
        Row: {
          arquivo_url: string | null
          autor: string | null
          conteudo: string | null
          created_at: string
          criado_por: string
          descricao: string | null
          frente_id: string | null
          id: string
          imagem_url: string | null
          publico: boolean | null
          titulo: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          autor?: string | null
          conteudo?: string | null
          created_at?: string
          criado_por: string
          descricao?: string | null
          frente_id?: string | null
          id?: string
          imagem_url?: string | null
          publico?: boolean | null
          titulo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          autor?: string | null
          conteudo?: string | null
          created_at?: string
          criado_por?: string
          descricao?: string | null
          frente_id?: string | null
          id?: string
          imagem_url?: string | null
          publico?: boolean | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "materiais_leitura_frente_id_fkey"
            columns: ["frente_id"]
            isOneToOne: false
            referencedRelation: "frentes"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens: {
        Row: {
          conteudo: string
          created_at: string
          criado_por: string
          destaque: boolean | null
          id: string
          imagem_url: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          criado_por: string
          destaque?: boolean | null
          id?: string
          imagem_url?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          criado_por?: string
          destaque?: boolean | null
          id?: string
          imagem_url?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      mensagens_chat: {
        Row: {
          conteudo: string
          created_at: string
          deletada: boolean | null
          id: string
          user_id: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          deletada?: boolean | null
          id?: string
          user_id: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          deletada?: boolean | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      participantes_limpeza: {
        Row: {
          concluida: boolean | null
          created_at: string
          escala_id: string
          id: string
          tarefa: string | null
          user_id: string
        }
        Insert: {
          concluida?: boolean | null
          created_at?: string
          escala_id: string
          id?: string
          tarefa?: string | null
          user_id: string
        }
        Update: {
          concluida?: boolean | null
          created_at?: string
          escala_id?: string
          id?: string
          tarefa?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participantes_limpeza_escala_id_fkey"
            columns: ["escala_id"]
            isOneToOne: false
            referencedRelation: "escalas_limpeza"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          data_iniciacao: string | null
          email: string
          id: string
          nome: string
          orixa: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          data_iniciacao?: string | null
          email: string
          id: string
          nome: string
          orixa?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          data_iniciacao?: string | null
          email?: string
          id?: string
          nome?: string
          orixa?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gerar_escala_limpeza: {
        Args: {
          data_escala: string
          ids_usuarios: string[]
          titulo_escala: string
        }
        Returns: string
      }
      get_proximos_eventos: {
        Args: { dias_a_frente?: number }
        Returns: {
          created_at: string
          criado_por: string
          data_fim: string
          data_inicio: string
          descricao: string | null
          frente_id: string | null
          id: string
          imagem_url: string | null
          local: string | null
          publico: boolean | null
          titulo: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "eventos"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "membro" | "visitante"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "membro", "visitante"],
    },
  },
} as const
