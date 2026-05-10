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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      email_log: {
        Row: {
          created_at: string
          error: string | null
          id: string
          order_id: string | null
          status: string
          to_email: string
          type: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          order_id?: string | null
          status?: string
          to_email: string
          type: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          order_id?: string | null
          status?: string
          to_email?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          id: string
          notes: string | null
          payment_provider: string | null
          product_id: string
          provider_ref: string | null
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          id?: string
          notes?: string | null
          payment_provider?: string | null
          product_id: string
          provider_ref?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          id?: string
          notes?: string | null
          payment_provider?: string | null
          product_id?: string
          provider_ref?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          billing: Database["public"]["Enums"]["billing_cycle"]
          course_access_url: string | null
          created_at: string
          description: string
          download_path: string | null
          features: Json
          id: string
          image_url: string | null
          name: string
          price_usd: number
          slug: string
          sort_order: number
          tagline: string | null
          telegram_invite_url: string | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          billing?: Database["public"]["Enums"]["billing_cycle"]
          course_access_url?: string | null
          created_at?: string
          description?: string
          download_path?: string | null
          features?: Json
          id?: string
          image_url?: string | null
          name: string
          price_usd: number
          slug: string
          sort_order?: number
          tagline?: string | null
          telegram_invite_url?: string | null
          type: Database["public"]["Enums"]["product_type"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          billing?: Database["public"]["Enums"]["billing_cycle"]
          course_access_url?: string | null
          created_at?: string
          description?: string
          download_path?: string | null
          features?: Json
          id?: string
          image_url?: string | null
          name?: string
          price_usd?: number
          slug?: string
          sort_order?: number
          tagline?: string | null
          telegram_invite_url?: string | null
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      billing_cycle: "one_time" | "monthly" | "quarterly" | "lifetime"
      order_status: "pending" | "paid" | "failed" | "refunded" | "cancelled"
      product_type: "bot" | "signal" | "course"
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
      billing_cycle: ["one_time", "monthly", "quarterly", "lifetime"],
      order_status: ["pending", "paid", "failed", "refunded", "cancelled"],
      product_type: ["bot", "signal", "course"],
    },
  },
} as const
