import Teams from '../ui/Team';
import { useLoaderData } from 'react-router-dom';
import { fetchOurTeams } from '../lib/loaders';



export async function loader() {
  const teamdata = await fetchOurTeams('sales');
  return teamdata;
}

export default function Team() {
  const data = useLoaderData();
  return (
    <>
      
      <Teams {...useLoaderData()} />
      
      
    </>
    );
}
