import { getUser } from "@/server/authActions";

export default async function AdminDashboard() {
  const user = await getUser();

  
    
  return user ? <div>Welcome to the Admin dashboard!</div> : <p>Loading...</p>;
}