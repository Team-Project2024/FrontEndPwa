import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const TTSAnimation = ({ isSpeaking }) => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [mesh, setMesh] = useState(null);
  const [wireframe, setWireframe] = useState(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    // Three.js 초기 설정
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // 배경 투명 설정
    mountRef.current.appendChild(renderer.domElement);

    // 기본 기하학 및 메쉬
    const geometry = new THREE.IcosahedronGeometry(16, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const mesh = new THREE.Mesh(geometry, material);

    // 와이어프레임 설정 (EdgeGeometry + LineBasicMaterial 사용)
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    scene.add(mesh);
    scene.add(wireframe);

    camera.position.z = 50;

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setMesh(mesh);
    setWireframe(wireframe);

    // 창 크기 변경 시 Three.js 설정을 업데이트
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    // 애니메이션을 시작/중지
    let scaleDirection = 1; // 확장 및 축소 방향
    let scaleSpeed = 0.01; // 크기 변화 속도
    let time = 0; // 시간 경과에 따른 크기 변화를 위한 변수

    if (isSpeaking && mesh && camera && renderer) {
      const animate = () => {
        // 메쉬 회전
        mesh.rotation.x += 0.02;
        mesh.rotation.y += 0.02;
        wireframe.rotation.x += 0.02;
        wireframe.rotation.y += 0.02;

        // 크기 조정
        time += 0.007; // 시간 증가
        const scaleValue = Math.abs(Math.sin(time)) + 0.3; // sin 함수로 0.5 ~ 1.5 범위에서 크기 변환
        mesh.scale.set(scaleValue, scaleValue, scaleValue); // x, y, z 축에 동일하게 크기 변환
        wireframe.scale.set(scaleValue, scaleValue, scaleValue); // 와이어프레임도 동일하게 변환

        // 렌더링
        renderer.render(scene, camera);
        animationIdRef.current = requestAnimationFrame(animate); // 애니메이션 ID를 ref로 저장
      };
      animate();
    } else {
      // TTS가 멈추면 애니메이션 중지
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null; // 애니메이션 ID 초기화
      }
    }
  }, [isSpeaking, mesh, wireframe, camera, renderer, scene]);

  return <div ref={mountRef} className="w-full h-64" />;
};

export default TTSAnimation;
