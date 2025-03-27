import React, { useEffect, useState, useCallback } from 'react';
import { useLoaderData } from 'react-router-dom';
import { fetchuser } from '../lib/loaders';
import ProfileHeader from '../Component/Profil_Header';
import ProfilData from '../Component/Profil_Data';
import Avatar from '../assets/Avatar.svg';

export async function fetchMessageIds() {
  try {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch('http://localhost:8080/api/getidmessage', {
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching message IDs:', error);
    throw error;
  }
}




export async function loader() {
  return fetchMessageIds()
    .then(async data => {
      console.log(data.user.id);
      let id = data.user.id;
      const datas = await fetchuser(id);
      console.log('ceci est user', datas);
      return datas; // initial posts array (or null)
    });
 
}

interface User {
  id: number;
  username: string;
  image?: string;
  localisation?: string;
  siteweb?: string;
  bio?: string;
}




export default function Profil() {
  const user = useLoaderData() as User;
  console.log('user:', user.username);
  return (
    <>
      <ProfileHeader 
        avatar={user.image || Avatar}
      />
      <ProfilData 
        username={user.username}
        bio={user.bio || 'Aucune description'}
        siteweb={user.siteweb || 'Aucun site web'}
        localisation={user.localisation || 'Aucune localisation'}
      />

      <div className="w-3/4 h-px bg-[var(--color-warmrasberry)] my-5 mx-auto" />

      
    </>
  );
}
