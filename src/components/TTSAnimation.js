import React, { useRef, useEffect ,useState } from "react";
import * as THREE from "three";
const TTSAnimation = ({ isSpeaking }) => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [mesh, setMesh] = useState(null);
  const [wireframe, setWireframe] = useState(null);
  const animationIdRef = useRef(null);
  const idleSpeedRef = useRef(0.001); // idle motion speed
  let speedDirection = 1; // Controls speed increase or decrease
  useEffect(() => {
    // Initial Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      1,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const canvasSize = 600; // Increase canvas size to 400x400
    renderer.setSize(canvasSize, canvasSize);
    renderer.setClearColor(0x000000, 0); // Set transparent background
    mountRef.current.appendChild(renderer.domElement);
    // Mesh and wireframe setup
    const geometry = new THREE.IcosahedronGeometry(20, 5);
    const positionAttribute = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      const offset = 0.2; // 구부러진 정도를 조절하는 값
      vertex.x += (Math.random() - 0.5) * offset;
      vertex.y += (Math.random() - 0.5) * offset;
      vertex.z += (Math.random() - 0.5) * offset;
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positionAttribute.needsUpdate = true; // 업데이트가 필요함을 알림
    const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const mesh = new THREE.Mesh(geometry, material);
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 32,
    });
    const wireframe = new THREE.LineSegments(
      wireframeGeometry,
      wireframeMaterial
    );
    scene.add(mesh);
    scene.add(wireframe);
    camera.position.z = 50;
    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setMesh(mesh);
    setWireframe(wireframe);
    // Update Three.js settings on window resize
  
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
   
    let speed = idleSpeedRef.current; // Start with idle speed
    const animate = () => {
      if (mesh && wireframe && renderer && scene && camera) {
        if (isSpeaking) {
          // Rotation speed control based on speaking state
          speed += speedDirection * 0.001; // Adjust speed
          // Speed limits for increase and decrease
          if (speed > 0.1) speedDirection = -1; // Reverse when reaching max speed
          if (speed < 0.02) speedDirection = 1; // Reverse when reaching min speed
        } else {
          // Idle motion with slow constant rotation
          speed = idleSpeedRef.current; // Slow rotation
        }
        // Apply rotation to mesh and wireframe
        mesh.rotation.x += speed;
        mesh.rotation.y += speed;
        wireframe.rotation.x += speed;
        wireframe.rotation.y += speed;
        // Render the scene
        renderer.render(scene, camera);
      }
      // Request the next frame for smooth animation
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
    <div className="animate-bounce flex items-center justify-center max-w-xs max-h-xs  ">
      <div ref={mountRef} className="h-50 w-50" />{" "}
      {/* Increased to 96x96 for larger display */}
    </div>
  );
};
export default TTSAnimation;