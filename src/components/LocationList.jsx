import React from 'react';
import { locations } from '../data/playerData';

const LocationList = ({ player, onLocationSelect }) => {
  return (
    <div>
      {Object.keys(locations).map(locationName => {
        const location = locations[locationName];
        const canChangeLocation =
          player.wealth >= location.cost &&
          (!location.requiresClassDependency || location.classDependencies.includes(player.className));

        return (
          <div key={locationName} className="location-item">
            <button
              onClick={() => onLocationSelect(locationName, location.cost)}
              disabled={!canChangeLocation}
            >
              {locationName} - Cost: {location.cost} coins
            </button>
            {location.requiresClassDependency && (
              <div>Available Classes: {location.classDependencies.join(', ')}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LocationList;
