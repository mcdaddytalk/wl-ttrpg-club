import { getUser } from "@/server/authActions";

export default async function Calendar() {
  const user = await getUser();

  
    
  return (
    <div>
      <h1>Calendar</h1>
      <p>Coming Soon!</p>
      { user ? <div>Users will see something different!</div> : null }  
    </div>
  )
}