"use client"

import UserButton from './UserButton'; // Import UserButton for signed-in users
import { useAuth } from '@/hooks/useAuth';

type SignedOutProps = {
    children: React.ReactNode;
}
const SignedOut: React.FC<SignedOutProps> = ({children}) => {
  //const user: User | null = await getUser();
  const { user, session } = useAuth();
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
