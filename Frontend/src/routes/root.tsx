import NavBar from '../component/NavBar';
import { Outlet } from 'react-router-dom';


export default function Root() {

  return (
    <>
    <NavBar />
    <section>
      <Outlet />
    </section>
    </>
  );
}