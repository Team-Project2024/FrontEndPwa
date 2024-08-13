import React, { useEffect, useRef, useState } from "react";
import { FaTrashAlt } from "react-icons/fa"; // 삭제 아이콘을 위해 추가

const center = {
  lat: 36.73648571494852,
  lng: 127.07450913712498,
};

export default function Location() {
  const mapContainer = useRef(null);
  const [position, setPosition] = useState(center);
  const [placeName, setPlaceName] = useState("");
  const [placeB, setPlaceB] = useState([]);

  useEffect(() => {
    const { kakao } = window;
    const mapOption = {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: 3,
    };

    const map = new kakao.maps.Map(mapContainer.current, mapOption);

    const marker = new kakao.maps.Marker({
      position: map.getCenter(),
    });
    marker.setMap(map);

    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      const latlng = mouseEvent.latLng;

      marker.setPosition(latlng);

      setPosition({
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      });
    });
  }, []);

  const setLocation = () => {
    setPlaceB([...placeB, { lat: position.lat, lng: position.lng, name: placeName }]);
    setPlaceName(""); 
  };

  const deleteLocation = (index) => {
    const newPlaceB = [...placeB];
    newPlaceB.splice(index, 1);
    setPlaceB(newPlaceB);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-gmarket text-3xl md:text-6xl font-bold mt-8 sm:mt-0 mb-4 sm:mb-8 text-center">
        위치정보 추가
      </h1>

      <div
        id="map"
        ref={mapContainer}
        style={{
          width: "100%",
          height: "700px",
        }}
      ></div>

      <div className="flex">
        <h2 className="font-gmarket">
          지도를 클릭해 마커를 놓은 다음 장소명을 적어 등록해주세요!
        </h2>
      </div>
      <div className="mt-2">
        <input
          id="username"
          type="text"
          placeholder="장소명"
          onChange={(e) => setPlaceName(e.target.value)}
          value={placeName}
          required
          className="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset pl-3 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />

        <button onClick={setLocation} className="ml-4 py-3 px-6 bg-indigo-600 text-white rounded-md">
          등록
        </button>
      </div>

      {placeB.length > 0 && (
        <div className="bg-gray-100 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] p-4 md:p-8 w-full max-w-xl mx-auto mt-4 mb-20 md:mt-8">
          <h2 className="font-gmarket text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">리스트</h2>
          {placeB.map((place, index) => (
            <div
              key={index}
              className="mb-4 md:mb-6 p-4 md:p-6 hover:scale-105 bg-white border-2 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] border-dashed border-gray-400"
            >
              <div className="flex flex-col justify-between items-center">
              
                <span className="font-bold text-xl md:text-2xl mb-2 font-gmarket">{place.name}</span>
              </div>
              <div className="flex flex-row justify-end">
                <button
                  onClick={() => deleteLocation(index)}
                  className="text-xl md:text-2xl text-red-500 hover:text-red-600 cursor-pointer ml-2"
                >
                  <FaTrashAlt className="mr-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
