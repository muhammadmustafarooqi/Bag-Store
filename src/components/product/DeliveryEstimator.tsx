'use client';

import { useState } from 'react';
import { FiTruck, FiMapPin, FiCalendar } from 'react-icons/fi';

const DELIVERY_ZONES = [
  { city: 'Karachi', days: '1-2 business days' },
  { city: 'Lahore', days: '2-3 business days' },
  { city: 'Islamabad', days: '2-3 business days' },
  { city: 'Rawalpindi', days: '2-3 business days' },
  { city: 'Faisalabad', days: '2-3 business days' },
  { city: 'Multan', days: '2-3 business days' },
  { city: 'Peshawar', days: '3-4 business days' },
  { city: 'Quetta', days: '2-3 business days' },
  { city: 'Other Cities (Sindh)', days: '2-3 business days' },
  { city: 'Other Cities (Punjab)', days: '3-4 business days' },
  { city: 'Other Cities (KPK/Balochistan)', days: '4-5 business days' }
];

export function DeliveryEstimator() {
  const [selectedCity, setSelectedCity] = useState('');

  const getEstimatedDate = (daysStr: string) => {
    // Parse the min and max days
    const matches = daysStr.match(/(\d+)-(\d+)/);
    if (!matches) return '';
    
    const minDays = parseInt(matches[1]);
    const maxDays = parseInt(matches[2]);
    
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;
  };

  const selectedZone = DELIVERY_ZONES.find(z => z.city === selectedCity);

  return (
    <div className="p-5 border border-[rgba(200,169,110,0.2)] bg-[#1a1815] mb-6">
      <div className="flex items-center gap-3 mb-4">
        <FiTruck className="text-xl" style={{ color: '#c8a96e' }} />
        <h3 className="font-semibold text-lg tracking-wide" style={{ color: '#f0e4ce' }}>
          Delivery Estimator
        </h3>
      </div>
      
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiMapPin style={{ color: '#7a6a54' }} />
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full pl-10 pr-4 py-3 appearance-none outline-none border border-[rgba(200,169,110,0.2)] bg-[#0f0e0c] text-sm focus:border-[#c8a96e] transition-colors"
          style={{ color: selectedCity ? '#f0e4ce' : '#7a6a54' }}
        >
          <option value="" disabled>Select your city...</option>
          {DELIVERY_ZONES.map(zone => (
            <option key={zone.city} value={zone.city} style={{ color: '#f0e4ce', background: '#0f0e0c' }}>
              {zone.city}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-4 w-4" style={{ color: '#7a6a54' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {selectedZone && (
        <div className="p-4 bg-[rgba(200,169,110,0.05)] border border-[rgba(200,169,110,0.1)] flex items-start gap-3 animate-fadeIn">
          <FiCalendar className="mt-1 flex-shrink-0" style={{ color: '#c8a96e' }} />
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a6a54' }}>Estimated Arrival</p>
            <p className="font-medium text-sm mb-1" style={{ color: '#f0e4ce' }}>
              {getEstimatedDate(selectedZone.days)}
            </p>
            <p className="text-xs" style={{ color: '#7a6a54' }}>
              ({selectedZone.days})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
