export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          agree_to_rules: boolean
          availability: string
          created_at: string | null
          email: string
          experience_level: Database["public"]["Enums"]["experience_level_enum"]
          first_name: string
          gamemaster_interest: Database["public"]["Enums"]["gamemaster_interest_enum"]
          id: string
          is_minor: boolean
          parent_email: string | null
          parent_first_name: string | null
          parent_phone: string | null
          parent_surname: string | null
          phone_number: string
          preferred_system: string
          surname: string
          updated_at: string | null
        }
        Insert: {
          agree_to_rules: boolean
          availability: string
          created_at?: string | null
          email: string
          experience_level: Database["public"]["Enums"]["experience_level_enum"]
          first_name: string
          gamemaster_interest: Database["public"]["Enums"]["gamemaster_interest_enum"]
          id?: string
          is_minor: boolean
          parent_email?: string | null
          parent_first_name?: string | null
          parent_phone?: string | null
          parent_surname?: string | null
          phone_number: string
          preferred_system: string
          surname: string
          updated_at?: string | null
        }
        Update: {
          agree_to_rules?: boolean
          availability?: string
          created_at?: string | null
          email?: string
          experience_level?: Database["public"]["Enums"]["experience_level_enum"]
          first_name?: string
          gamemaster_interest?: Database["public"]["Enums"]["gamemaster_interest_enum"]
          id?: string
          is_minor?: boolean
          parent_email?: string | null
          parent_first_name?: string | null
          parent_phone?: string | null
          parent_surname?: string | null
          phone_number?: string
          preferred_system?: string
          surname?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      game_favorites: {
        Row: {
          created_at: string
          game_id: string
          member_id: string
        }
        Insert: {
          created_at?: string
          game_id?: string
          member_id?: string
        }
        Update: {
          created_at?: string
          game_id?: string
          member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_favorites_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_favorites_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "game_favorites_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      game_registrations: {
        Row: {
          game_id: string
          id: string
          member_id: string
          registered_at: string
        }
        Insert: {
          game_id: string
          id?: string
          member_id: string
          registered_at?: string
        }
        Update: {
          game_id?: string
          id?: string
          member_id?: string
          registered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_game_registrations_games"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_game_registrations_members"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "fk_game_registrations_members"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      game_schedule: {
        Row: {
          created_at: string | null
          day_of_week: Database["public"]["Enums"]["day_of_week_enum"] | null
          deleted_at: string | null
          first_game_date: string
          game_id: string | null
          id: string
          interval: Database["public"]["Enums"]["game_interval_enum"]
          last_game_date: string | null
          location: string | null
          next_game_date: string | null
          status: Database["public"]["Enums"]["game_status_enum"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week_enum"] | null
          deleted_at?: string | null
          first_game_date: string
          game_id?: string | null
          id?: string
          interval: Database["public"]["Enums"]["game_interval_enum"]
          last_game_date?: string | null
          location?: string | null
          next_game_date?: string | null
          status?: Database["public"]["Enums"]["game_status_enum"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: Database["public"]["Enums"]["day_of_week_enum"] | null
          deleted_at?: string | null
          first_game_date?: string
          game_id?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["game_interval_enum"]
          last_game_date?: string | null
          location?: string | null
          next_game_date?: string | null
          status?: Database["public"]["Enums"]["game_status_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_game_schedule_games"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          gamemaster_id: string | null
          id: string
          max_seats: number | null
          system: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          gamemaster_id?: string | null
          id?: string
          max_seats?: number | null
          system?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          gamemaster_id?: string | null
          id?: string
          max_seats?: number | null
          system?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_games_members"
            columns: ["gamemaster_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "fk_games_members"
            columns: ["gamemaster_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      member_roles: {
        Row: {
          assigned_at: string
          id: string
          member_id: string
          role_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          member_id: string
          role_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          member_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_roles_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "member_roles_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string
          id: string
          is_admin: boolean
          is_minor: boolean
          phone: string | null
          provider: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email: string
          id?: string
          is_admin?: boolean
          is_minor?: boolean
          phone?: string | null
          provider: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string
          id?: string
          is_admin?: boolean
          is_minor?: boolean
          phone?: string | null
          provider?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          birthday: string | null
          created_at: string | null
          experience_level: Database["public"]["Enums"]["experience_level_enum"]
          given_name: string | null
          id: string
          phone: string | null
          surname: string | null
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          birthday?: string | null
          created_at?: string | null
          experience_level?: Database["public"]["Enums"]["experience_level_enum"]
          given_name?: string | null
          id: string
          phone?: string | null
          surname?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          birthday?: string | null
          created_at?: string | null
          experience_level?: Database["public"]["Enums"]["experience_level_enum"]
          given_name?: string | null
          id?: string
          phone?: string | null
          surname?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_members"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "fk_profiles_members"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      is_admin: {
        Row: {
          is_admin: boolean | null
          member_id: string | null
        }
        Insert: {
          is_admin?: boolean | null
          member_id?: string | null
        }
        Update: {
          is_admin?: boolean | null
          member_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_scheduled_games_with_counts: {
        Args: {
          member_id: string
        }
        Returns: {
          game_id: string
          game_name: string
          description: string
          system: string
          gamemaster_id: string
          gm_given_name: string
          gm_surname: string
          status: string
          first_game_date: string
          last_game_date: string
          user_id: string
          registered_at: string
          num_players: number
        }[]
      }
      get_upcoming_games_with_counts: {
        Args: {
          member_id: string
        }
        Returns: {
          game_id: string
          game_name: string
          description: string
          system: string
          gamemaster_id: string
          gm_given_name: string
          gm_surname: string
          status: string
          first_game_date: string
          last_game_date: string
          user_id: string
          registered_at: string
          num_players: number
        }[]
      }
      verify_user_password: {
        Args: {
          password: string
        }
        Returns: boolean
      }
    }
    Enums: {
      day_of_week_enum:
        | "sunday"
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
      experience_level_enum:
        | "new"
        | "novice"
        | "seasoned"
        | "player-gm"
        | "forever-gm"
      game_interval_enum:
        | "weekly"
        | "biweekly"
        | "monthly"
        | "yearly"
        | "custom"
      game_status_enum:
        | "active"
        | "scheduled"
        | "awaiting-players"
        | "full"
        | "completed"
        | "canceled"
      gamemaster_interest_enum: "yes" | "no" | "maybe"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
