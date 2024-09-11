import React, { useEffect, useRef, useCallback } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import debounce from 'lodash.debounce';  

const containerStyle = {
  width: '100%',
  height: '500px',
  touchAction: 'none',
  position: 'relative'
};

function MapComponent({ coordinates, onClose }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const polylineRef = useRef(null);


  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_APPKEY}&autoload=false&libraries=services,clusterer,drawing`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
       
        setTimeout(() => {
          initializeMap();
        }, 200); 
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  
  const handleResize = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      setTimeout(() => {
        map.relayout();  
        map.setCenter(new window.kakao.maps.LatLng(coordinates[0].lat, coordinates[0].lng));  
      }, 100);  
    }
  }, [coordinates]);

  
  useEffect(() => {
    const debouncedResize = debounce(handleResize, 300);  

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [handleResize]);

  
  const initializeMap = useCallback(() => {
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) {
      console.error('Map container not loaded');
      return;
    }

    const mapOption = {
      center: new window.kakao.maps.LatLng(coordinates[0].lat, coordinates[0].lng),
      level: 4  
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    mapRef.current = map;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(pos.lat, pos.lng),
            title: '현재위치'
          });

          new window.kakao.maps.CustomOverlay({
            map: map,
            position: new window.kakao.maps.LatLng(pos.lat, pos.lng),
            content: '<div style="padding:5px; background:#50627F; border-radius:4px; color:white; text-align:center;">현재위치</div>',
            xAnchor: 0.46,
            yAnchor: 2.7
          });

          renderMarkers(map, pos);  
        },
        () => {
          console.error("Geolocation error");
        }
      );
    }
  }, [coordinates]);


  const renderMarkers = useCallback((map, pos) => {
    coordinates.forEach(location => {
      const marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(location.lat, location.lng),
        title: location.locationName
      });

      new window.kakao.maps.CustomOverlay({
        map: map,
        position: new window.kakao.maps.LatLng(location.lat, location.lng),
        content: `<div style="padding:5px; background:#50627F; border-radius:4px; color:white; text-align:center;">${location.name}</div>`,
        xAnchor: 0.46,
        yAnchor: 2.7
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        getWalkingDirection(pos, location);
      });
    });
  }, [coordinates]);

 
  const getWalkingDirection = useCallback(async (start, end) => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);  
      polylineRef.current = null;
    }

    const REST_API_KEY = process.env.REACT_APP_KAKAO_RESTAPIKEY;
    const url = 'https://apis-navi.kakaomobility.com/v1/directions';
    const headers = {
      Authorization: `KakaoAK ${REST_API_KEY}`,
      'Content-Type': 'application/json'
    };

    const queryParams = new URLSearchParams({
      origin: `${start.lng},${start.lat}`,
      destination: `${end.lng},${end.lat}`,
      travelMode: 'WALKING'
    });

    const requestUrl = `${url}?${queryParams}`;

    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const linePath = [];
        data.routes[0].sections[0].roads.forEach(router => {
          router.vertexes.forEach((vertex, index) => {
            if (index % 2 === 0) {
              linePath.push(new window.kakao.maps.LatLng(router.vertexes[index + 1], router.vertexes[index]));
            }
          });
        });

        const polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: '#FFAE00',
          strokeOpacity: 0.7,
          strokeStyle: 'solid'
        });

        polyline.setMap(mapRef.current);
        polylineRef.current = polyline;
      } else {
        throw new Error("No routes found.");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  return (
    <Dialog open={true} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <div className='font-gmarket font-bold'>
          마커클릭시 경로안내
        </div>
      </DialogTitle>
      <DialogContent>
        <div>
          <div id="map" ref={mapContainerRef} style={containerStyle}></div>
        </div>
      </DialogContent>
      <DialogActions className="p-4 dark:bg-gray-800 bg-gray-100">
        <button 
          onClick={onClose}
          className="py-2.5 px-5 me-2 mb-2 text-sm  text-gray-900 focus:outline-none bg-gray-200 rounded-full border
           border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100
           dark:focus:ring-gray-700 dark:bg-gray-800
            dark:text-white dark:border-gray-600
             dark:hover:text-white dark:hover:bg-gray-700 font-gmarket font-bold justify-end ">닫기</button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(MapComponent);
