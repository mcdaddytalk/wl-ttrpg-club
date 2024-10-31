// lib/types/supabase.ts
export type Database = {
    public: {
      Tables: {
        members: { Row: { id: string; email: string; created_at: string } };
        profiles: { Row: { id: string; firstName: string; surname: string; bio: string; avatar_url: string; phone: string | null; birthday: string | null; member_id: string } };
        roles: { Row: { id: number; name: string } };
        member_roles: { Row: { id: string; member_id: string; role_id: number } };
        games: { Row: { id: string; title: string; description: string; gm_member_id: string; created_at: string } };
        game_registrations: { Row: { id: string; game_id: string; member_id: string } };
      };
    };
  };
  
export type Provider = 'google' | 'discord';  