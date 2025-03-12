import Pricing from '../ui/Pricing';
import { fetchPricingData } from '../lib/loaders'; 
import { useLoaderData } from 'react-router-dom';

export async function loader() {
  const pricingdata = await fetchPricingData();
  return pricingdata;
}

export default function buy() {
  const data = useLoaderData();
  return (
    <>
      
      <Pricing {...data} />
      
      
    </>
    );
}
