import React, { useState, useEffect } from 'react';
import { IUnit, IContentItem } from '../interfaces/types';

interface SidebarProps {
  units: IUnit[];
  onSubunitClick: (subunitContent: IContentItem[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ units, onSubunitClick }) => {
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');

  useEffect(() => {
    fetch('/api/logo')
      .then((response) => response.json())
      .then((data) => setLogoUrl(data.url))
      .catch((error) => console.error('Error fetching logo:', error));
  }, []);

  const toggleUnit = (unitId: string) => {
    setExpandedUnitId(expandedUnitId === unitId ? null : unitId);
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-4">
        {logoUrl && <img src={logoUrl} alt="Logo" className="h-16 w-16 mx-auto" />}
      </div>
      <div className="overflow-y-auto py-4 px-3 flex-1">
        {units.map((unit) => (
          <div key={unit.id}>
            <button onClick={() => toggleUnit(unit.id)} className="flex justify-between items-center p-2 w-full text-left text-white rounded-md hover:bg-gray-700">
              <span>{unit.name}</span>
              <span>{expandedUnitId === unit.id ? '-' : '+'}</span>
            </button>
            {expandedUnitId === unit.id && (
              <div className="pl-4">
                {unit.subunits.map((subunit) => (
                  <button key={subunit.id} onClick={() => onSubunitClick(subunit.content)} className="block w-full text-left px-4 py-1 text-gray-300 hover:bg-gray-700">
                    {subunit.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
