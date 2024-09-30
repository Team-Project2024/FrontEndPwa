import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const TTSAnimation = ({ isSpeaking }) => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [mesh, setMesh] = useState(null);
  const [wireframe, setWireframe] = useState(null);
  const animationIdRef = useRef(null);
  const idleSpeedRef = useRef(0.001); 
  let speedDirection = 1; 

  useEffect(() => {
    // 1. 씬, 카메라, 렌더러 초기화
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    const canvasSize = 400; 
    renderer.setSize(canvasSize, canvasSize);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // 2. 단순한 도형 (Icosahedron에서 Sphere로 변경, 분할을 5로 줄임)
    const geometry = new THREE.SphereGeometry(15, 8, 8); // 분할 수를 줄임

    // 3. 재질 적용
    const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const mesh = new THREE.Mesh(geometry, material);

    // 4. 와이어프레임 설정
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1, // 성능 최적화를 위해 linewidth 줄임
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    scene.add(mesh);
    scene.add(wireframe);
    camera.position.z = 50;

    // 상태 저장
    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setMesh(mesh);
    setWireframe(wireframe);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    let speed = idleSpeedRef.current;
    const animate = () => {
      if (mesh && wireframe && renderer && scene && camera) {
        if (isSpeaking) {
          speed += speedDirection * 0.001; 
          if (speed > 0.05) speedDirection = -1; // 더 느리게 설정
          if (speed < 0.01) speedDirection = 1; 
        } else {
          speed = idleSpeedRef.current;
        }

        // 도형 회전
        mesh.rotation.x += speed;
        mesh.rotation.y += speed;
        wireframe.rotation.x += speed;
        wireframe.rotation.y += speed;

        renderer.render(scene, camera);
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isSpeaking, mesh, wireframe, camera, renderer, scene]);

  return (
    <div className=" flex items-center justify-center max-w-xs max-h-xs  ">
      <div ref={mountRef} className="h-50 w-50" />{" "}
    </div>
  );
};

export default TTSAnimation;
