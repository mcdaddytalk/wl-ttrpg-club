"use client"

import useSession from '@/utils/supabase/use-session';
import UserButton from './UserButton'; // Import UserButton for signed-in users
import { User } from '@supabase/supabase-js';

type SignedOutProps = {
    children: React.ReactNode;
}
const SignedOut: React.FC<SignedOutProps> = ({children}) => {
  //const user: User | null = await getUser();
  const session = useSession();
  const user: User = (session?.user as User) ?? {};
// logger.log(`USER`, user);
// logger.log('SESSION', session);
  return (
    <div className="app-container">
        {session && user ? (
            <UserButton user={user}/>
        ) : (
            <>
            {children}
            </>
        )}
    </div>
  );
};

export default SignedOut;
