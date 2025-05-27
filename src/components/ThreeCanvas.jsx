import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import '../styles/ThreeCanvasStyles.css';

export default function ThreeCanvas() {
  const mountRef = useRef(null);
  const cubeRef = useRef();
  const sceneRef = useRef();

  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [depth, setDepth] = useState(1);
  const [shape, setShape] = useState('box');
  const [prompt, setPrompt] = useState('');

  function createShape(type) {
    const material = new THREE.MeshStandardMaterial({ color: '#007ACC' });

    if (type === 'box') {
      return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    }

    if (type === 'panel') {
      return new THREE.Mesh(new THREE.BoxGeometry(width, 0.2, depth), material);
    }

    if (type === 'l') {
      const group = new THREE.Group();

      const partA = new THREE.Mesh(
        new THREE.BoxGeometry(width / 2, height, depth),
        material
      );
      partA.position.x = -width / 4;

      const partB = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth / 2),
        material
      );
      partB.position.z = -depth / 4;

      group.add(partA);
      group.add(partB);
      return group;
    }

    return new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  }

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#777');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.target.set(0, 0, 0);
    controls.update();

    const gridHelper = new THREE.GridHelper(100, 100);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const shapeMesh = createShape(shape);
    shapeMesh.position.y = height / 2;
    cubeRef.current = shapeMesh;
    scene.add(shapeMesh);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      if (cubeRef.current?.rotation) {
        cubeRef.current.rotation.x += 0.01;
        cubeRef.current.rotation.y += 0.01;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    if (cubeRef.current) sceneRef.current.remove(cubeRef.current);
    const newMesh = createShape(shape);
    newMesh.position.y = shape === 'panel' ? 0.1 : height / 2;
    cubeRef.current = newMesh;
    sceneRef.current.add(newMesh);
  }, [width, height, depth, shape]);

  function handleExport() {
    const exporter = new GLTFExporter();
    exporter.parse(
      cubeRef.current,
      function (result) {
        const blob = new Blob(
          [result instanceof ArrayBuffer ? result : JSON.stringify(result)],
          { type: 'application/octet-stream' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'model.glb';
        a.click();
        URL.revokeObjectURL(url);
      },
      { binary: true }
    );
  }

  function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const contents = e.target.result;
      const loader = new GLTFLoader();
      loader.parse(contents, '', (gltf) => {
        if (cubeRef.current) {
          sceneRef.current.remove(cubeRef.current);
        }
        cubeRef.current = gltf.scene;
        cubeRef.current.position.y = 0.5;
        sceneRef.current.add(cubeRef.current);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  async function generateShapeFromPrompt() {
    const res = await fetch('/api/generate-shape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

    const shapeData = await res.json();

    if (shapeData?.type) setShape(shapeData.type);
    if (shapeData?.width) setWidth(shapeData.width);
    if (shapeData?.height) setHeight(shapeData.height);
    if (shapeData?.depth) setDepth(shapeData.depth);
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mountRef}
        style={{ width: '100%', height: '100vh', backgroundColor: 'black' }}
      />

      <div className="absolute top-4 left-4 z-10 flex flex-col gap-6 bg-transparent text-white">
        <div className="dropdown">
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            className="select"
          >
            <option value="box">Box</option>
            <option value="panel">Flat Panel</option>
            <option value="l">L-Shape</option>
          </select>
        </div>

        {[{ label: 'Width', value: width, setter: setWidth },
          { label: 'Height', value: height, setter: setHeight },
          { label: 'Depth', value: depth, setter: setDepth }].map(({ label, value, setter }) => (
          <div key={label} className="flex flex-col">
            <label className="mb-1 font-semibold">
              {label} (m): {value.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={value}
              onChange={(e) => setter(parseFloat(e.target.value))}
              className="h-2 bg-gradient-to-r from-[#007ACC] to-[#3B4B63] rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          {/* Export Button */}
          <button onClick={handleExport} className="btn-minimal">
            Export .glb
          </button>

          {/* Import Button (with hidden input) */}
          <label className="btn-minimal cursor-pointer relative overflow-hidden">
            Import .glb
            <input
              type="file"
              accept=".glb,.gltf"
              onChange={handleImport}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Prompt input for AI shape generation */}
        <div className="flex flex-col gap-2 mt-2">
          <textarea
            placeholder="Describe the shape you want..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="p-2 text-sm text-black rounded border border-gray-300"
            rows={3}
          />
          <button
            onClick={generateShapeFromPrompt}
            className="btn-minimal"
          >
            Generate Shape
          </button>
        </div>
      </div>
    </div>
  );
}
