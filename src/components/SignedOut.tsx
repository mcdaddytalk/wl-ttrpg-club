import UserButton from './UserButton'; // Import UserButton for signed-in users
import { User } from '@supabase/supabase-js';
import { getUser } from '@/server/authActions';

type SignedOutProps = {
    children: React.ReactNode;
}
const SignedOut: React.FC<SignedOutProps> = async ({children}) => {
  const user: User | null = await getUser();
  
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
