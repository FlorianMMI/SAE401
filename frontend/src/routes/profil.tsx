import React, { useEffect, useState, useCallback } from 'react';
import ProfileHeader from '../Component/Profil_Header';
import ProfilData from '../Component/Profil_Data';


interface User {
  id: number;
  username: string;
  image?: string;
  localisation?: string;
  siteweb?: string;
  bio?: string;
}





export default function Profil() {
 
  
  return (
    <>
      <ProfileHeader   />
      <ProfilData />
    </>
  );
}
