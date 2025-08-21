"use server"
import { EmailInvite, Provider, SupabaseMemberResponse, SupabaseRoleListResponse } from "@/lib/types/custom";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { 
    AuthApiError,
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
import { 
    headers, 
//    cookies 
} from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import useToastStore from "@/store/toastStore";
import { jwtDecode, JwtPayload } from "jwt-decode";
import logger from '@/utils/logger';
import { ENVS } from "@/utils/constants/envs"
import { getURL } from "@/utils/helpers";

type JwtPayloadWithRoles = JwtPayload & { roles: string[] };
export const getInitialSession = async (): Promise<{ session: Session | null; user: User | null; error: AuthError | null }> => {
    const supabase = await createSupabaseServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session) {
        const jwt: JwtPayloadWithRoles = jwtDecode(session.access_token);
        const roles = jwt?.roles;
        const user = await getUser();
        if (user) session.user = user;
        session.user.user_metadata.roles = roles;
    }
    return { session, user: session?.user ?? null, error };
};

export const getUser = async (): Promise<User | null> => {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null
    // const { data: profile, error: profileError } = await supabase.from('profiles').select('*').limit(1).eq('id', user.id).maybeSingle() as unknown as SupabaseProfileResponse;
    // if (profileError) return null
    // const { data: roleData, error: roleError } = await supabase.from('member_roles').select('roles(id, name)').eq('member_id', user?.id) as unknown as SupabaseRoleListResponse;
    // if (roleError) return null
    const { data: member, error: memberError } = await supabase.from('members')
        .select(`
            *,
            profiles(
                given_name,
                surname,
                avatar,
                phone,
                bio,
                birthday,
                experience_level
            ),
            member_roles(
                roles(
                    id,
                    name
                )
            )`)
        .eq('id', user.id)
        .maybeSingle() as SupabaseMemberResponse;
    if (memberError) return null
    if (!member) return null
    const { profiles: profile, member_roles: roleData } = member
    let avatar_url = profile.avatar ?? user.user_metadata.avatar_url ?? null
    if (avatar_url && !avatar_url.startsWith('https://')) {
        avatar_url = supabase.storage.from('avatars').getPublicUrl(avatar_url).data.publicUrl;
    }
    user.user_metadata = {
        ...user.user_metadata,
        roles: roleData.map((role) => role.roles.name) ?? [],
        email: user.email ?? null,
        phone: profile.phone ?? null,
        given_name: profile.given_name ?? null,
        surname: profile.surname ?? null,
        avatar_url
    }
    return user
}

export const getUserRoles = async (): Promise<string[]> => {
    const supabase = await createSupabaseServerClient();
    const user = await getUser();
    if (!user) return []
    const { data: roleData, error: roleError } = await supabase.from('member_roles').select('roles(id, name)').eq('member_id', user?.id) as unknown as SupabaseRoleListResponse;
    if (roleError) {
        logger.error(roleError)
        if (roleError.message) throw new Error(roleError.message)
        else throw new Error("RoleQuery failed")
    }
    return roleData.map((role) => role.roles.name)
}

type ChangeEmailVariables = {
    oldEmail: string,
    newEmail: string,
    id: string
}
export async function sendChangeEmail({oldEmail, newEmail, id}: ChangeEmailVariables): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error: authUserError } = await supabase.auth.admin.updateUserById(id, { email: newEmail });
    if (authUserError) throw new Error(authUserError.message);
    await supabase.auth.admin.generateLink({
        type: 'email_change_new',
        email: oldEmail,
        newEmail: newEmail
    })
    const { error: memberError } = await supabase.from('members').update({ email: newEmail }).eq('id', id);
    if (memberError) throw new Error(memberError.message)    
}

export async function signOut(): Promise<{ error: AuthError | null }> {
    const supabase = await createSupabaseServerClient();
    // const cookieStore = await cookies()
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message)
    // useToastStore.getState().setToast('sign-out','success','You have been signed out!')
    // const accessToken = cookieStore.get('sb-access-token')
    // if (accessToken) cookieStore.set('sb-access-token', '', { expires: new Date(0) })
    revalidatePath('/', 'layout')
    redirect('/')
}

type OAuthOpts = {
  /** Where the provider should send the browser back to (your callback page) */
  redirectTo?: string;
  /** Where your callback should send the user next (e.g., /member/account) */
  postLoginRedirect?: string;
  /** Try to force provider re-consent / account picker (best-effort) */
  force?: boolean;
};

export async function signInWithProvider(
    provider: Provider,
    opts: OAuthOpts = {}
): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const postLogin = opts.postLoginRedirect ?? '/member/dashboard';
    const callbackUrl = (opts.redirectTo ?? getURL('/auth/callback')) + `?next=${encodeURIComponent(postLogin)}`;

    const credentials: SignInWithOAuthCredentials = {
        provider,
        options: {
            redirectTo: callbackUrl,
            // Some IdPs respect OIDC prompt; this is a safe best‑effort for “force”
            queryParams: opts.force ? { prompt: 'consent' } : undefined,
        },
    };

    const { data, error } = await supabase.auth.signInWithOAuth(credentials);

    if (error) {
        // log and bubble
        logger.error(error);
        throw new Error(error.message);
    }

    if (data?.url) {
        // Normal path: hand control to the provider
        redirect(data.url);
    }

    // Fallback: if no URL was returned (uncommon), go straight to the intended location
    redirect(postLogin);
}

export async function signInWithPassword(email: string, password: string, redirectUrl = '/member'): Promise<AuthTokenResponsePassword> {
    const supabase = await createSupabaseServerClient();
    const credentials: SignInWithPasswordCredentials = {
        email,
        password
    }
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw new Error(error.message)
    revalidatePath('/', 'layout')
    redirect(redirectUrl)
}

export async function signInWithPhone(phone: string): Promise<AuthOtpResponse> {
    const supabase = await createSupabaseServerClient();
    const credentials: SignInWithPasswordlessCredentials = {
        phone,
        options: {
            shouldCreateUser: false
        }
    }
    const { error } = await supabase.auth.signInWithOtp(credentials);
    if (error) {
        if (error instanceof AuthApiError && error.status === 422) {
            logger.error('Throwing new AuthApiError');
            throw new AuthApiError(error.message,  error.status, error.code);
        }
        throw new Error(error.message);
    }
    redirect(`/?phone-otp=true`)
}

export async function signInWithOTP(email: string): Promise<AuthOtpResponse> {
    const supabase = await createSupabaseServerClient();
    const origin = (await headers()).get("origin") || "";
    const credentials: SignInWithPasswordlessCredentials = {
        email,
        options: {
            shouldCreateUser: false,
            emailRedirectTo: `${origin}/member`
        }
    };
    
    const { error } = await supabase.auth.signInWithOtp(credentials);
    if (error) {
        if (error instanceof AuthApiError && error.status === 422) {
            logger.error('Throwing new AuthApiError');
            throw new AuthApiError(error.message,  error.status, error.code);
        }
        throw new Error(error.message);
    }
    useToastStore.getState().setToast('email-otp','success','Check your email for a login link!');
    redirect(`/?email-otp=true`)
}

export async function sendPasswordResetEmail(email: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message)
}

export async function sendInviteEmail({email, given_name, surname, is_minor}: EmailInvite): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
            given_name,
            surname,
            displayName: `${given_name} ${surname}`,
            is_minor
        },
        redirectTo: `${ENVS.NEXT_PUBLIC_SITE_URL}/login`
    });

    if (error) throw new Error(error.message)
}

export async function removeUser(id: string): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.admin.deleteUser(id, true);
    if (error) throw new Error(error.message)
}

export async function addRoles(user_id: string, roles: string[]): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const newRoles = roles.map((roleId: string) => ({
        member_id: user_id,
        role_id: roleId
    }))
    const { error } = await supabase.from('member_roles').insert(newRoles);
    if (error) throw new Error(error.message)
}

export async function removeRoles(user_id: string, roles: string[]): Promise<void> {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('member_roles')
        .delete()
        .in('role_id', roles)
        .eq('member_id', user_id);
    if (error) throw new Error(error.message)
}
