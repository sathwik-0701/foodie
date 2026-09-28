import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem('foodie_location') || 'Mumbai, Maharashtra';
  });

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const availableLocations = [
    'Mumbai, Maharashtra',
    'Bandra West, Mumbai',
    'Juhu, Mumbai',
    'Powai, Mumbai',
    'Bengaluru, Karnataka',
    'Delhi NCR, New Delhi',
    'Hyderabad, Telangana',
    'Pune, Maharashtra'
  ];

  const updateLocation = (loc) => {
    setSelectedLocation(loc);
    localStorage.setItem('foodie_location', loc);
    setLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider value={{
      selectedLocation,
      updateLocation,
      locationModalOpen,
      setLocationModalOpen,
      availableLocations
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
