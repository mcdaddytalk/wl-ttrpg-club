"use server"
import { Provider, SupabaseProfileResponse, SupabaseRoleResponse } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { 
    AuthError,
    AuthOtpResponse,
    AuthTokenResponsePassword,
    // OAuthResponse,
    Session, 
    SignInWithOAuthCredentials, 
    SignInWithPasswordCredentials, 
    SignInWithPasswordlessCredentials, 
    User 
} from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import useToastStore from "@/store/toastStore";

export const getInitialSession = async (): Promise<{ session: Session | null; user: User | null }> => {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    return { session, user: session?.user ?? null };
};

type UserMetadata = {
    email: string | null;
    phone: string | null;
    firstName: string;
    surname: string;
    avatar_url: string;
}

export const getMetaData = async (): Promise<UserMetadata | null> => {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null
    const { data: profileData , error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id) as unknown as SupabaseProfileResponse;
    if (profileError) return null
    const profile = profileData[0];
    return {
        email: user?.email ?? null,
        phone: user?.phone ?? null,
        firstName: profile?.given_name ?? null,
        surname: profile?.surname ?? null,
        avatar_url: profile?.avatar ?? user?.user_metadata?.avatar_url ?? null
    }
}

export const getUser = async (): Promise<User | null> => {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null
    const { data: profileData , error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id) as unknown as SupabaseProfileResponse;
    if (profileError) return null
    const profile = profileData[0];
    const { data: roleData, error: roleError } = await supabase.from('member_roles').select('roles(name)').eq('member_id', user?.id) as unknown as SupabaseRoleResponse;
    if (roleError) return null
    let avatar_url = profile?.avatar ?? user?.user_metadata?.avatar_url ?? null
    if (avatar_url && !avatar_url.startsWith('https://')) {
        avatar_url = supabase.storage.from('avatars').getPublicUrl(avatar_url).data.publicUrl;
    }
    user.user_metadata = {
        ...user.user_metadata,
        roles: roleData.map((role) => role.roles.name) ?? [],
        email: user?.email ?? null,
        phone: profile?.phone ?? null,
        given_name: profile?.given_name ?? null,
        surname: profile?.surname ?? null,
        avatar_url
    }
    return user
}

export const getUserRoles = async (): Promise<string[]> => {
    const supabase = await createSupabaseServerClient();
    const user = await getUser();
    if (!user) return []
    const { data: roleData, error: roleError } = await supabase.from('member_roles').select('roles(name)').eq('member_id', user?.id) as unknown as SupabaseRoleResponse;
    if (roleError) {
        console.error(roleError)
        if (roleError.message) throw new Error(roleError.message)
        else throw new Error("RoleQuery failed")
    }
    return roleData.map((role) => role.roles.name)
}

export async function signOut(): Promise<{ error: AuthError | null }> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message)
    redirect('/')
}

export async function signInWithProvider(provider: Provider): Promise<void> {
    const supabase = await createSupabaseServerClient();
    // const origin = (await headers()).get("origin") ?? 'http://localhost:3000';
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    console.log('origin', origin)
    const credentials: SignInWithOAuthCredentials = {
        provider,
        options: {
            redirectTo: `${origin}/auth/callback`
        }
    }
    const { data, error } = await supabase.auth.signInWithOAuth(credentials);
    if (data.url) redirect(data.url)
    console.error(error);
    if (error) throw new Error(error.message)
    redirect('/member/dashboard')
}

export async function signInWithPassword(email: string, password: string): Promise<AuthTokenResponsePassword> {
    const supabase = await createSupabaseServerClient();
    const credentials: SignInWithPasswordCredentials = {
        email,
        password
    }
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw new Error(error.message)
    revalidatePath('/', 'layout')
    redirect('/member/dashboard')
}

export async function signInWithOTP(email: string): Promise<AuthOtpResponse> {
    const supabase = await createSupabaseServerClient();
    const origin = (await headers()).get("origin") || "";
    const credentials: SignInWithPasswordlessCredentials = {
        email,
        options: {
            shouldCreateUser: false,
            emailRedirectTo: `${origin}/member/dashboard`
        }
    };
    const { error } = await supabase.auth.signInWithOtp(credentials);
    if (error) throw new Error(error.message)
    else {
        useToastStore.getState().setToast('email-otp','success','Check your email for a login link!');
    }
    
    redirect(`/?email-otp=true`)
}