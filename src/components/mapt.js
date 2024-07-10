import React, { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const containerStyle = {
  width: '100%',
  height: '500px',
  touchAction: 'none'
};

const center = {
  lat: 36.738876,
  lng: 127.076777
};

const shops = [

    {
      name: '곱창일번지',
      location: { lat: 36.74109403387714 ,lng: 127.0759635548942 }
    },
    {
      name: '역전할머니맥주',
      location: { lat: 36.74118199668762 ,lng: 127.07580129024419 }
    },
    {
      name: '동막골',
      location: { lat: 36.741499844634966 ,lng: 127.07548249714063 }
    },
    {
      name: '호아성',
      location: { lat: 36.741437457070454 ,lng: 127.07438516132859 }
    },
  {
      name: '브로시스비어카페',
      location: { lat: 36.74158059090505 ,lng: 127.07603961211161}
    },
  {
      name: '에브리24',
      location: { lat: 36.741242868683855 ,lng: 127.07572857186122 }
    },
  {
      name: '알콜사무소',
      location: { lat: 36.741287962120744,lng: 127.0756698337012}
    },
  {
      name: '디퍼플',
      location: { lat: 36.74046764746469, lng: 127.07613088573125 }
    },
  
  {
      name: '태주호프',
      location: { lat:36.74014516790239, lng: 127.07664280680994  }
    },
  
  {
      name: '촌댁맥주',
      location: { lat: 36.73978941936338 ,lng: 127.07634014920303 }
    },
  
  ];


function Mapt() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=be141563e112c338388bddf4c91021a0&autoload=false&libraries=services,clusterer,drawing`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (open) {
          initializeMap();
        }
      });
    };
  }, [open]);

  const initializeMap = () => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const mapOption = {
      center: new window.kakao.maps.LatLng(center.lat, center.lng),
      level: 4
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    mapRef.current = map;
    map.setDraggable(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(pos);
          map.setCenter(new window.kakao.maps.LatLng(pos.lat, pos.lng));

          const currentMarker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(pos.lat, pos.lng),
            title: '현재위치'
          });

          const currentInfoWindow = new window.kakao.maps.InfoWindow({
            content: '<div style="padding:5px;">현재 위치</div>',
            removable: true
          });
          currentInfoWindow.open(map, currentMarker);

          shops.forEach(shop => {
            const marker = new window.kakao.maps.Marker({
              map: map,
              position: new window.kakao.maps.LatLng(shop.location.lat, shop.location.lng),
              content: shop.name,
             
            });
            const infoWindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;">${shop.name}</div>`,
              removable: false
            });
            infoWindow.open(map, marker);

            window.kakao.maps.event.addListener(marker, 'click', () => {
              setSelectedShop(shop.location);
              getWalkingDirection(pos, shop.location);
            });
          });
        },
        () => {
          console.error("Error fetching current location");
        }
      );
    } else {
      shops.forEach(shop => {
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: new window.kakao.maps.LatLng(shop.location.lat, shop.location.lng),
          title: shop.name
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          setSelectedShop(shop.location);
          getWalkingDirection(center, shop.location);
        });
      });
    }
  };

  const getWalkingDirection = async (start, end) => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const REST_API_KEY = '433206fe20fb2209acb47d181e711602';
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
        throw new Error(`HTTP error! Status: ${response.status}`);
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

        const totalDuration = data.routes[0].summary.duration;
        setDuration(totalDuration);
      } else {
        throw new Error("No routes found");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMapOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    setDuration(null);
  };

  return (
    <div>
      <div>
        <h2>가게목록</h2>
        <ul>
          {shops.map((shop, index) => (
            <li key={index}>
              {shop.name}
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={handleMapOpen}>지도 열기</Button>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>가게 위치 보기</DialogTitle>
        <DialogContent>
          {open && (
            <div>
              <div id="map" style={containerStyle}></div>
             <h2>마커를 클릭시 경로안내를 확인할수있습니다</h2>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default React.memo(Mapt);
