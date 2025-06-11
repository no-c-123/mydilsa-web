import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function ModelPreview3D({ modelUrl, width = 120, height = 120 }) {
  const mountRef = useRef();

  useEffect(() => {
    if (!modelUrl) return;
    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 2);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    let light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(2, 2, 2);
    scene.add(light);

    let loader = new GLTFLoader();
    let model, group;
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene;

      // Center and scale the model
      group = new THREE.Group();
      group.add(model);

      // Compute bounding box and center
      const box = new THREE.Box3().setFromObject(group);
      const center = new THREE.Vector3();
      box.getCenter(center);
      group.position.sub(center);

      // Scale to fit
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.2 / maxDim; // 1.2 = padding
      group.scale.setScalar(scale);

      scene.add(group);

      // Camera distance
      camera.position.set(0, 0, 2.2);
      camera.lookAt(0, 0, 0);

      animate();
    });

    function animate() {
      requestAnimationFrame(animate);
      if (group) group.rotation.y += 0.005;
      renderer.render(scene, camera);
    }

    return () => {
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [modelUrl, width, height]);

  return <div ref={mountRef} style={{ width, height }} />;
}