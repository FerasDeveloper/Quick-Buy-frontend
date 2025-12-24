import { useState } from 'react';
import SideBar from '../Components/SideBar'
import { Outlet } from 'react-router-dom';
import './css/Shop.css'

export default function Shop(){

  const [isSidebarrOpen, setOpen] = useState(true);

  return (
    <div className="Shop">
      <SideBar isOpen={isSidebarrOpen} 
      toggleSidebar={() => setOpen(!isSidebarrOpen)} 
      />
      <div className={!isSidebarrOpen ? 'open' : ''} id='content-container'>
        <Outlet />
      </div>
    </div>
  )
}