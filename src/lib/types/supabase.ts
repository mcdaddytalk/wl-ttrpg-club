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
      announcement_reads: {
        Row: {
          announcement_id: string
          member_id: string
          read_at: string | null
        }
        Insert: {
          announcement_id: string
          member_id: string
          read_at?: string | null
        }
        Update: {
          announcement_id?: string
          member_id?: string
          read_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_reads_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "announcement_reads_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          approved_by: string | null
          audience: string
          author_id: string | null
          body: string
          created_at: string | null
          deleted_at: string | null
          expires_at: string | null
          id: string
          notify_on_publish: boolean | null
          pinned: boolean | null
          published: boolean | null
          published_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          audience: string
          author_id?: string | null
          body: string
          created_at?: string | null
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          notify_on_publish?: boolean | null
          pinned?: boolean | null
          published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          audience?: string
          author_id?: string | null
          body?: string
          created_at?: string | null
          deleted_at?: string | null
          expires_at?: string | null
          id?: string
          notify_on_publish?: boolean | null
          pinned?: boolean | null
          published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "announcements_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_messages: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          message: string
          mode: Database["public"]["Enums"]["delivery_mode"] | null
          sender_id: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          message: string
          mode?: Database["public"]["Enums"]["delivery_mode"] | null
          sender_id?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          message?: string
          mode?: Database["public"]["Enums"]["delivery_mode"] | null
          sender_id?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_messages_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "broadcast_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_recipients: {
        Row: {
          created_at: string | null
          delivery_method: Database["public"]["Enums"]["delivery_mode"] | null
          delivery_status: Database["public"]["Enums"]["delivery_status"] | null
          error_message: string | null
          id: string
          message_id: string | null
          recipient_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_method?: Database["public"]["Enums"]["delivery_mode"] | null
          delivery_status?:
            | Database["public"]["Enums"]["delivery_status"]
            | null
          error_message?: string | null
          id?: string
          message_id?: string | null
          recipient_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_method?: Database["public"]["Enums"]["delivery_mode"] | null
          delivery_status?:
            | Database["public"]["Enums"]["delivery_status"]
            | null
          error_message?: string | null
          id?: string
          message_id?: string | null
          recipient_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "broadcast_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "broadcast_recipients_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
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
      game_invites: {
        Row: {
          accepted: boolean | null
          display_name: string | null
          expires_at: string | null
          external_email: string | null
          external_phone: string | null
          game_id: string | null
          gamemaster_id: string | null
          id: string
          invited_at: string | null
          invitee: string | null
          notified: boolean | null
        }
        Insert: {
          accepted?: boolean | null
          display_name?: string | null
          expires_at?: string | null
          external_email?: string | null
          external_phone?: string | null
          game_id?: string | null
          gamemaster_id?: string | null
          id?: string
          invited_at?: string | null
          invitee?: string | null
          notified?: boolean | null
        }
        Update: {
          accepted?: boolean | null
          display_name?: string | null
          expires_at?: string | null
          external_email?: string | null
          external_phone?: string | null
          game_id?: string | null
          gamemaster_id?: string | null
          id?: string
          invited_at?: string | null
          invitee?: string | null
          notified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "game_invites_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_invites_gamemaster_id_fkey"
            columns: ["gamemaster_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "game_invites_gamemaster_id_fkey"
            columns: ["gamemaster_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_invites_invitee_fkey"
            columns: ["invitee"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "game_invites_invitee_fkey"
            columns: ["invitee"]
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
          status: Database["public"]["Enums"]["registrant_status_enum"]
          status_note: string | null
          updated_by: string | null
        }
        Insert: {
          game_id: string
          id?: string
          member_id: string
          registered_at?: string
          status?: Database["public"]["Enums"]["registrant_status_enum"]
          status_note?: string | null
          updated_by?: string | null
        }
        Update: {
          game_id?: string
          id?: string
          member_id?: string
          registered_at?: string
          status?: Database["public"]["Enums"]["registrant_status_enum"]
          status_note?: string | null
          updated_by?: string | null
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
          {
            foreignKeyName: "game_registrations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "game_registrations_updated_by_fkey"
            columns: ["updated_by"]
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
          location_id: string | null
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
          location_id?: string | null
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
          location_id?: string | null
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
          {
            foreignKeyName: "game_schedule_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          cover_image: string
          created_at: string | null
          deleted_at: string | null
          description: string | null
          gamemaster_id: string | null
          id: string
          max_seats: number | null
          starting_seats: number | null
          system: string | null
          title: string
          updated_at: string
          updated_by: string | null
          visibility: string | null
        }
        Insert: {
          cover_image?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          gamemaster_id?: string | null
          id?: string
          max_seats?: number | null
          starting_seats?: number | null
          system?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          visibility?: string | null
        }
        Update: {
          cover_image?: string
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          gamemaster_id?: string | null
          id?: string
          max_seats?: number | null
          starting_seats?: number | null
          system?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          visibility?: string | null
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
      location_perms: {
        Row: {
          gamemaster_id: string
          id: string
          location_id: string
        }
        Insert: {
          gamemaster_id?: string
          id?: string
          location_id?: string
        }
        Update: {
          gamemaster_id?: string
          id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_perms_gamemaster_id_fkey"
            columns: ["gamemaster_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "location_perms_gamemaster_id_fkey"
            columns: ["gamemaster_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_perms_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          scope: Database["public"]["Enums"]["LocationScope"]
          type: Database["public"]["Enums"]["location_type"]
          updated_at: string | null
          url: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          scope?: Database["public"]["Enums"]["LocationScope"]
          type?: Database["public"]["Enums"]["location_type"]
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          scope?: Database["public"]["Enums"]["LocationScope"]
          type?: Database["public"]["Enums"]["location_type"]
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "locations_created_by_fkey"
            columns: ["created_by"]
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
          consent: boolean
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
          consent?: boolean
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
          consent?: boolean
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
      messages: {
        Row: {
          category: string | null
          content: string
          created_at: string
          deleted_at: string | null
          id: string
          is_archived: boolean
          is_read: boolean
          link_url: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_archived?: boolean
          is_read?: boolean
          link_url?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_archived?: boolean
          is_read?: boolean
          link_url?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "is_admin"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
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
      role_permissions: {
        Row: {
          function: Database["public"]["Enums"]["app_function"]
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role_id: string
        }
        Insert: {
          function: Database["public"]["Enums"]["app_function"]
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role_id: string
        }
        Update: {
          function?: Database["public"]["Enums"]["app_function"]
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
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
      clean_expired_invites: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      get_announcement_recipients: {
        Args: {
          audience: string
        }
        Returns: {
          id: string
          consent: boolean
        }[]
      }
      transfer_game_ownership: {
        Args: {
          game_id: string
          new_gamemaster_id: string
          old_gamemaster_id: string
        }
        Returns: undefined
      }
      verify_user_password: {
        Args: {
          password: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_function: "games" | "members" | "schedules" | "messages"
      app_permission: "create" | "read" | "update" | "delete"
      day_of_week_enum:
        | "sunday"
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
      delivery_mode: "email" | "sms" | "both"
      delivery_status: "pending" | "sent" | "failed"
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
        | "draft"
        | "active"
        | "scheduled"
        | "awaiting-players"
        | "full"
        | "completed"
        | "canceled"
      gamemaster_interest_enum: "yes" | "no" | "maybe"
      location_type: "vtt" | "discord" | "physical"
      LocationScope: "admin" | "gm" | "disabled"
      registrant_status_enum: "banned" | "approved" | "rejected" | "pending"
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
