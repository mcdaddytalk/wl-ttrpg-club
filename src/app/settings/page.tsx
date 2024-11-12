import { getUser } from "@/server/authActions";

export default async function Settings() {
  const user = await getUser();

  
    
  return user ? <div>Welcome to the settings!</div> : <p>Loading...</p>;
}