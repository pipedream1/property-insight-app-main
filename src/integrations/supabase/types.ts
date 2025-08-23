export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          created_at: string
          email: string | null
          erf_no: string | null
          id: string
          mobile: string | null
          name: string | null
          street_name: string | null
          street_number: string | null
          surname: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          erf_no?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          street_name?: string | null
          street_number?: string | null
          surname?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          erf_no?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          street_name?: string | null
          street_number?: string | null
          surname?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      inspections: {
        Row: {
          comment: string | null
          component_name: string
          component_type: string
          condition: string
          created_at: string
          id: string
          inspection_date: string
          inspector_name: string | null
          photo_taken: boolean | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          comment?: string | null
          component_name: string
          component_type: string
          condition: string
          created_at?: string
          id?: string
          inspection_date?: string
          inspector_name?: string | null
          photo_taken?: boolean | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string | null
          component_name?: string
          component_type?: string
          condition?: string
          created_at?: string
          id?: string
          inspection_date?: string
          inspector_name?: string | null
          photo_taken?: boolean | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      location_tracks: {
        Row: {
          accuracy: number | null
          altitude: number | null
          created_at: string | null
          heading: number | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          accuracy?: number | null
          altitude?: number | null
          created_at?: string | null
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          accuracy?: number | null
          altitude?: number | null
          created_at?: string | null
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      maintenance_photos: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          latitude: number
          longitude: number
          maintenance_task_id: string | null
          photo_url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          maintenance_task_id?: string | null
          photo_url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          maintenance_task_id?: string | null
          photo_url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_photos_maintenance_task_id_fkey"
            columns: ["maintenance_task_id"]
            isOneToOne: false
            referencedRelation: "maintenance_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_tasks: {
        Row: {
          completed_at: string | null
          component_name: string | null
          component_type: string
          created_at: string
          description: string
          id: string
          inspection_id: number | null
          priority: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          component_name?: string | null
          component_type: string
          created_at?: string
          description: string
          id?: string
          inspection_id?: number | null
          priority?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          component_name?: string | null
          component_type?: string
          created_at?: string
          description?: string
          id?: string
          inspection_id?: number | null
          priority?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tasks_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "property_components"
            referencedColumns: ["id"]
          },
        ]
      }
      pdf_chunks: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          source_file: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          source_file?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          source_file?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          property_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          property_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          property_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      property_components: {
        Row: {
          comment: string | null
          component_name: string | null
          component_type: string | null
          condition: string | null
          created_at: string
          date: string | null
          id: number
          photo_taken: boolean | null
          photo_url: string | null
        }
        Insert: {
          comment?: string | null
          component_name?: string | null
          component_type?: string | null
          condition?: string | null
          created_at?: string
          date?: string | null
          id?: number
          photo_taken?: boolean | null
          photo_url?: string | null
        }
        Update: {
          comment?: string | null
          component_name?: string | null
          component_type?: string | null
          condition?: string | null
          created_at?: string
          date?: string | null
          id?: number
          photo_taken?: boolean | null
          photo_url?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          data: Json | null
          file_url: string | null
          id: number
          month: string | null
          name: string | null
          status: string | null
          type: string | null
          year: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          file_url?: string | null
          id?: number
          month?: string | null
          name?: string | null
          status?: string | null
          type?: string | null
          year?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          file_url?: string | null
          id?: number
          month?: string | null
          name?: string | null
          status?: string | null
          type?: string | null
          year?: string | null
        }
        Relationships: []
      }
      reservoir_readings: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          percentage_full: number
          reading_date: string
          updated_at: string
          water_level: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          percentage_full: number
          reading_date?: string
          updated_at?: string
          water_level: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          percentage_full?: number
          reading_date?: string
          updated_at?: string
          water_level?: number
        }
        Relationships: []
      }
      water_readings: {
        Row: {
          comment: string | null
          component_name: string | null
          component_type: string | null
          created_at: string | null
          date: string
          id: number
          photo_taken: boolean | null
          photo_url: string | null
          reading: number | null
        }
        Insert: {
          comment?: string | null
          component_name?: string | null
          component_type?: string | null
          created_at?: string | null
          date: string
          id?: number
          photo_taken?: boolean | null
          photo_url?: string | null
          reading?: number | null
        }
        Update: {
          comment?: string | null
          component_name?: string | null
          component_type?: string | null
          created_at?: string | null
          date?: string
          id?: number
          photo_taken?: boolean | null
          photo_url?: string | null
          reading?: number | null
        }
        Relationships: []
      }
      whatsapp_config: {
        Row: {
          api_key: string
          auto_response: string | null
          created_at: string | null
          enable_auto_responder: boolean | null
          id: number
          phone_number: string
          webhook_url: string
        }
        Insert: {
          api_key: string
          auto_response?: string | null
          created_at?: string | null
          enable_auto_responder?: boolean | null
          id: number
          phone_number: string
          webhook_url: string
        }
        Update: {
          api_key?: string
          auto_response?: string | null
          created_at?: string | null
          enable_auto_responder?: boolean | null
          id?: number
          phone_number?: string
          webhook_url?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: string
          created_at: string | null
          direction: string
          from_name: string | null
          from_number: string
          id: string
          status: string | null
          to_number: string
        }
        Insert: {
          content: string
          created_at?: string | null
          direction: string
          from_name?: string | null
          from_number: string
          id?: string
          status?: string | null
          to_number: string
        }
        Update: {
          content?: string
          created_at?: string | null
          direction?: string
          from_name?: string | null
          from_number?: string
          id?: string
          status?: string | null
          to_number?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      user_role: "owner" | "management" | "resident"
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
      user_role: ["owner", "management", "resident"],
    },
  },
} as const
