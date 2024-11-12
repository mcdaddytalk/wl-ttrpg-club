import { getUser } from "@/server/authActions";

export default async function GamesDashboard() {
  const user = await getUser();

  
    
  return user ? <div>Welcome to the games dashboard!</div> : <p>Loading...</p>;
}