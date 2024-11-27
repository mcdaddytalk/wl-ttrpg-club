"use client"

import UserButton from './UserButton'; // Import UserButton for signed-in users
import { User } from '@supabase/supabase-js';
import useSession from "@/utils/supabase/use-session";

type SignedOutProps = {
    children: React.ReactNode;
}
const SignedOut: React.FC<SignedOutProps> = ({children}) => {
  //const user: User | null = await getUser();
  const session = useSession();
  const user: User = (session?.user as User) ?? null;
  // console.log(`SIGNED OUT USER:`, user)
  return (
    <div className="app-container">
        {user ? (
            <UserButton />
        ) : (
            <>
            {children}
            </>
        )}
    </div>
  );
};

export default SignedOut;
