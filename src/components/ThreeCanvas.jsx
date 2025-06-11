import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three-stdlib';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three';
import '../styles/ThreeCanvasStyles.css';
import TourGuide from './TourGuide.jsx';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

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

    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 2);
    scene.add(light);

    let loader = new GLTFLoader();
    let model;
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene;
      scene.add(model);
      animate();
    });

    function animate() {
      requestAnimationFrame(animate);
      if (model) model.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    return () => {
      renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = '';
    };
  }, [modelUrl, width, height]);

  return <div ref={mountRef} style={{ width, height }} />;
}

export default function ThreeCanvas() {

  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const cubeRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const transformControlsRef = useRef();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [transformMode, setTransformMode] = useState('translate');
  const [addPieceDropdownOpen, setAddPieceDropdownOpen] = useState(false);
 
  const [selectedObject, setSelectedObject] = useState(null);
  const selectedObjectRef = useRef(null);
  const isDraggingRef = useRef(false);
  const controlsRef = useRef();
  const floorRef = useRef();

  const selectionStart = useRef(null);
  const selectionBox = useRef(null); // HTML div for the visual box
  const [multiSelected, setMultiSelected] = useState([]);
  const isBoxSelecting = useRef(false);
  const [materialType, setMaterialType] = useState('Metal');

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const [showTransformControls, setShowTransformControls] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);

  const [position, setPosition] = useState({ x: 0, y: 0.5, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 });

  const positionRef = useRef(position);
  const rotationRef = useRef(rotation);
  const scaleRef = useRef(scale);

  const keysPressed = useRef({});
  const velocity = 0.1;

  function createCube() {
    const material = new THREE.MeshStandardMaterial({ color: '#888' });
    return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  }

  function createTableSkeleton() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: '#888' });

    const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const topGeometry = new THREE.BoxGeometry(1, 0.1, 1);

    const positions = [
      [-0.45, 0.5, -0.45],
      [ 0.45, 0.5, -0.45],
      [-0.45, 0.5,  0.45],
      [ 0.45, 0.5,  0.45]
    ];

    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(legGeometry, material.clone());
      leg.name = `leg${i + 1}`;
      leg.position.set(...positions[i]);
      group.add(leg);
    }

    const top = new THREE.Mesh(topGeometry, material.clone());
    top.name = 'top';
    top.position.set(0, 1, 0);
    group.add(top);

    group.name = 'table';
    return group;
  }

  function createBarandal({ width = 2, height = 1, postSpacing = 0.5 } = {}) {
    const group = new THREE.Group();
    const postMaterial = createMaterialType('Metal');
  
    const postCount = Math.floor(width / postSpacing);
    const actualSpacing = width / postCount;
  
    for (let i = 0; i <= 4; i++) {
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, height, 0.05),
        postMaterial.clone()
      );
      post.position.set(i * 0.5, height / 2, 0);
      group.add(post);
    }
  
    const topBar = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.05, 0.05),
      postMaterial.clone()
    );
    topBar.position.set(width / 2, height, 0);
    group.add(topBar);
  
    const midBar = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.05, 0.05),
      postMaterial.clone()
    );
    midBar.position.set(width / 2, height / 2, 0);
    group.add(midBar);
  
    group.name = "barandal";
    return centerPivot(group);
  } 

  function createPorton() {
    const group = new THREE.Group();
    const material = createMaterialType('Metal');
  
    const frameThickness = 0.05;
    const width = 2, height = 1.5;
  
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(width, frameThickness, frameThickness), material.clone());
    frameTop.position.set(width / 2, height, 0);
    group.add(frameTop);
  
    const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(width, frameThickness, frameThickness), material.clone());
    frameBottom.position.set(width / 2, 0, 0);
    group.add(frameBottom);
  
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, height, frameThickness), material.clone());
    frameLeft.position.set(0, height / 2, 0);
    group.add(frameLeft);
  
    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, height, frameThickness), material.clone());
    frameRight.position.set(width, height / 2, 0);
    group.add(frameRight);
  
    for (let i = 0.2; i < width; i += 0.2) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.02, height - 0.1, 0.02), material.clone());
      bar.position.set(i, height / 2, 0);
      group.add(bar);
    }
  
    group.name = 'porton';
    return centerPivot(group);
  }
  

  function resetTransform(){
    if (!selectedObject) return;

    selectedObject.position.set(0, 0.5, 0);
    selectedObject.rotation.set(0, 0, 0);
    selectedObject.scale.set(1, 1, 1);

    setPosition({ x: 0, y: 0.5, z: 0 });
    setRotation({ x: 0, y: 0, z: 0 });
    setScale({ x: 1, y: 1, z: 1 });

    highlightObjects(multiSelected, true)
    setMultiSelected([]);
  }

  function centerCameraOnSelected(){
    const camera = cameraRef.current;
    if (!selectedObject || !camera) return;

    const objectPos = selectedObject.position.clone();
    const offset = new THREE.Vector3(3, 3, 3);

    camera.position.copy(objectPos).add(offset);
    camera.lookAt(objectPos);

    if (controlsRef.current) {
      controlsRef.current.target.copy(objectPos);
      controlsRef.current.update();
    }

  }

  function deleteSelectedObject() {
    if (!selectedObject || !sceneRef.current) return;

    sceneRef.current.remove(selectedObject);
    transformControlsRef.current.detach();
    setSelectedObject(null);
    selectedObjectRef.current = null; // ← this is the fix
  }

  function ungroupTempGroup() {
    const current = selectedObjectRef.current;
    if (current && current.type === 'Group' && current.userData?.tempGroup) {
      while (current.children.length > 0) {
        sceneRef.current.attach(current.children[0]);
      }
      sceneRef.current.remove(current);
    }
  }

  function centerPivot(group) {
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
  
    group.traverse((child) => {
      if (child.isMesh) {
        child.position.sub(center);
      }
    });
  
    return group;
  }

  const handleExport = () => {
    const exporter = new GLTFExporter();

    // Create a group for export and add only user-created objects
    const exportGroup = new THREE.Group();
    sceneRef.current.children.forEach(obj => {
      if (
        obj.type === 'GridHelper' ||
        obj.type === 'AxesHelper' ||
        obj.type === 'TransformControls' ||
        obj.name === 'floor' ||
        obj.userData.unselectable
      ) {
        return;
      }
      exportGroup.add(obj.clone(true));
    });

    exporter.parse(
      exportGroup,
      async (result) => {
        // result is a JSON object with references to a .bin file
        const gltfJson = JSON.stringify(result, null, 2);
        const gltfFileName = `model-${Date.now()}.gltf`;
        const binFileName = gltfJson.match(/"uri":\s*"([^"]+\.bin)"/);
        let binBlob = null;
        let binName = null;

        // Find the .bin file in the result (if any)
        if (binFileName && binFileName[1]) {
          binName = binFileName[1];
          // The GLTFExporter stores the .bin data in result.buffers[0].uri as a base64 string
          const binBase64 = result.buffers && result.buffers[0] && result.buffers[0].uri;
          if (binBase64 && binBase64.startsWith('data:')) {
            const base64Data = binBase64.split(',')[1];
            const binArray = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
            binBlob = new Blob([binArray], { type: 'application/octet-stream' });
          }
        }

        // Upload .gltf
        const { error: gltfError } = await supabase.storage
          .from('models')
          .upload(gltfFileName, new Blob([gltfJson], { type: 'application/json' }), { upsert: true });
        if (gltfError) {
          alert('Error uploading .gltf: ' + gltfError.message);
          return;
        }

        // Upload .bin (if present)
        if (binBlob && binName) {
          const { error: binError } = await supabase.storage
            .from('models')
            .upload(binName, binBlob, { upsert: true });
          if (binError) {
            alert('Error uploading .bin: ' + binError.message);
            return;
          }
        }

        // Generate signed URL for .gltf
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('models')
          .createSignedUrl(gltfFileName, 60 * 60);
        if (signedUrlError) {
          alert('Error creating signed URL: ' + signedUrlError.message);
          return;
        }
        const signedUrl = signedUrlData.signedUrl;
        localStorage.setItem('exportPreview', signedUrl);
        window.location.href = '/estimate';
      },
      { binary: false, embedImages: true }
    );
  };

  function createMaterialType(type) {
    
    const loader = new TextureLoader();

    switch (type) {
      case 'Metal':
        return new THREE.MeshStandardMaterial({
          map: loader.load('/textures/metal.jpg'),
          metalness: 0.8,
          roughness: 0.2,
        });
      case 'Wood':
        return new THREE.MeshStandardMaterial({
          map: loader.load('/textures/wood.jpeg'),
          roughness: 0.7,
        });

      case 'Plastic':
        return new THREE.MeshStandardMaterial({
          map: loader.load('/textures/plastic.jpg'),
          roughness: 0.4 
        });

      default:
        return new THREE.MeshStandardMaterial({
          color: '#ccc',
          roughness: 0.5,
        });
    }
  }

  function clearSelection() {
    transformControlsRef.current?.detach();
    highlightObjects(multiSelected, false);
    setSelectedObject(null);
    selectedObjectRef.current = null;
    setMultiSelected([]);
  }

  function highlightObjects(objects, highlight = true) {
    objects.forEach((obj) => {
      if (obj.isMesh) {
        if (highlight) {
          obj.originalColor = obj.material.color.clone(); // Save original
          obj.material.color.set('#00ffff'); // Cyan when selected
        } else {
          if (obj.originalColor) {
            obj.material.color.copy(obj.originalColor); // Restore original
          } else {
            obj.material.color.set('#888'); // Default gray fallback
          }
        }
      }
    });
  }

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('showTransformControls');
    if (stored !== null) {
      setShowTransformControls(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showTransformControls', JSON.stringify(showTransformControls));
    }
  }, [showTransformControls]); 

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
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    const cube = createCube();
    cubeRef.current = cube;
    cube.position.set(position.x, position.y, position.z);
    cube.rotation.set(
      THREE.MathUtils.degToRad(rotation.x),
      THREE.MathUtils.degToRad(rotation.y),
      THREE.MathUtils.degToRad(rotation.z)
    );
    cube.scale.set(scale.x, scale.y, scale.z);
    scene.add(cube);

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.setTranslationSnap(snapEnabled ? 1 : null);
    if (showTransformControls) {
      transformControls.attach(cube); // initial default
      scene.add(transformControls);
      setSelectedObject(cube); // track it as default
      selectedObjectRef.current = cube;
    }

    transformControlsRef.current = transformControls;

    renderer.domElement.addEventListener('pointerdown', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);

      if (e.shiftKey) {
        selectionStart.current = { x: e.clientX, y: e.clientY };
        selectionBox.current.style.left = `${e.clientX}px`;
        selectionBox.current.style.top = `${e.clientY}px`;
        selectionBox.current.style.width = '0px';
        selectionBox.current.style.height = '0px';
        selectionBox.current.classList.remove('hidden');
        controls.enabled = false;
        return;
      }

      const meshes = sceneRef.current.children.flatMap(obj =>
        obj.type === 'Group' ? obj.children : obj
      ).filter(obj => obj.isMesh && !obj.userData.unselectable);

      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length === 0) {
        clearSelection();
        return;
      }

      let selected = intersects[0].object;
      while (selected.parent && selected.parent !== sceneRef.current) {
        selected = selected.parent;
      }
      if (!selected || selected.userData.unselectable) return;

      if (e.ctrlKey) {
        const alreadySelected = multiSelected.includes(selected);
        const updated = alreadySelected
          ? multiSelected.filter(obj => obj !== selected)
          : [...multiSelected, selected];

        ungroupTempGroup();
        highlightObjects(multiSelected, false);
        highlightObjects(updated, true);
        setMultiSelected(updated);

        if (updated.length === 1) {
          transformControlsRef.current.attach(updated[0]);
          setSelectedObject(updated[0]);
          selectedObjectRef.current = updated[0];
        } else {
          const group = new THREE.Group();
          group.userData.tempGroup = true;
          updated.forEach(obj => {
            const pos = new THREE.Vector3();
            obj.getWorldPosition(pos);
            const quat = new THREE.Quaternion();
            obj.getWorldQuaternion(quat);
            sceneRef.current.attach(obj);
            group.add(obj);
            obj.position.copy(pos);
            obj.quaternion.copy(quat);
          });
          const box = new THREE.Box3().setFromObject(group);
          const center = new THREE.Vector3();
          box.getCenter(center);
          group.position.copy(center);
          group.children.forEach(child => child.position.sub(center));
          sceneRef.current.add(group);
          transformControlsRef.current.attach(group);
          setSelectedObject(group);
          selectedObjectRef.current = group;
        }
      } else {
        ungroupTempGroup();
        highlightObjects(multiSelected, false);
        setMultiSelected([]);
        if (selectedObjectRef.current) highlightObjects([selectedObjectRef.current], false);
        highlightObjects([selected], true);
        transformControlsRef.current.attach(selected);
        setSelectedObject(selected);
        selectedObjectRef.current = selected;
      }
    });

    renderer.domElement.addEventListener('pointermove', (e) => {
      if (!selectionStart.current) return;
      const dx = e.clientX - selectionStart.current.x;
      const dy = e.clientY - selectionStart.current.y;
    
      selectionBox.current.style.left = `${Math.min(e.clientX, selectionStart.current.x)}px`;
      selectionBox.current.style.top = `${Math.min(e.clientY, selectionStart.current.y)}px`;
      selectionBox.current.style.width = `${Math.abs(dx)}px`;
      selectionBox.current.style.height = `${Math.abs(dy)}px`;
    });

    renderer.domElement.addEventListener('pointerup', (e) => {
      
      if (!selectionStart.current) return;

      const box = selectionBox.current.getBoundingClientRect();
      const left = box.left;
      const top = box.top;
      const right = left + box.width;
      const bottom = top + box.height;

      const selected = [];

      const meshes = sceneRef.current.children.flatMap(obj =>
        obj.type === 'Group' ? obj.children : obj
      ).filter(obj => obj.isMesh && !obj.userData.unselectable);

      meshes.forEach((obj) => {
        const vector = new THREE.Vector3();
        obj.getWorldPosition(vector);
        vector.project(cameraRef.current);

        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

        if (x >= left && x <= right && y >= top && y <= bottom) {
          let root = obj;
          while (root.parent && root.parent.type !== 'Scene') {
            root = root.parent;
          }
          if (!selected.includes(root)) {
            selected.push(root);
          }
        }
      });

      if (selected.length > 0) {
        const tempGroup = new THREE.Group();
        selected.forEach(obj => {
          sceneRef.current.attach(obj); // remove from parent
          tempGroup.add(obj);           // add to group
        });
        sceneRef.current.add(tempGroup);

        highlightObjects(multiSelected, false);
        highlightObjects(selected, true);
        setMultiSelected(selected);
        setSelectedObject(tempGroup);
        selectedObjectRef.current = tempGroup;
        transformControlsRef.current.attach(tempGroup);
      }

      selectionBox.current.classList.add('hidden');
      selectionStart.current = null;
      isBoxSelecting.current = false;
      controls.enabled = true;
    });

    transformControls.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
      isDraggingRef.current = event.value;
    });

    transformControls.addEventListener('objectChange', () => {
      const obj = selectedObjectRef.current;
      if (!obj) return;
    
      const pos = obj.position;
      const rot = obj.rotation;
      const scl = obj.scale;
    
      setPosition({ x: pos.x, y: pos.y, z: pos.z });
      setRotation({
        x: THREE.MathUtils.radToDeg(rot.x),
        y: THREE.MathUtils.radToDeg(rot.y),
        z: THREE.MathUtils.radToDeg(rot.z),
      });
      setScale({ x: scl.x, y: scl.y, z: scl.z });
    });

    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.DoubleSide })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.name = 'floor';
    floor.userData.unselectable = true;
    floor.layers.set(1);
    scene.add(floor);
    floorRef.current = floor;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const direction = new THREE.Vector3();
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const speed = velocity * delta * 60;

      if (selectedObjectRef.current && !isDraggingRef.current) {
        const obj = selectedObjectRef.current;
        let moved = false;
        if (keysPressed.current['ArrowUp']) {
          obj.position.z -= speed;
          moved = true;
        }
        if (keysPressed.current['ArrowDown']) {
          obj.position.z += speed;
          moved = true;
        }
        if (keysPressed.current['ArrowLeft']) {
          obj.position.x -= speed;
          moved = true;
        }
        if (keysPressed.current['ArrowRight']) {
          obj.position.x += speed;
          moved = true;
        }

        if (moved) {
          setPosition({
            x: obj.position.x,
            y: obj.position.y,
            z: obj.position.z,
          });
        }
      }

      renderer.render(scene, cameraRef.current)
    };
    animate();


    return () => {
      mountRef.current.removeChild(renderer.domElement);
      scene.remove(transformControls);
      transformControls.dispose();
    };

    
  }, []);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.code] = true;
  
      // Activate selection mode when Shift+E is pressed
      if (e.code === 'KeyE' && e.shiftKey) {
        document.body.style.cursor = 'crosshair'; // Optional visual cue
      }
    };
  
    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;
  
      // Reset cursor when Shift or E is released
      if (e.code === 'ShiftLeft' || e.code === 'KeyE') {
        document.body.style.cursor = '';
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  

  useEffect(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(transformMode);
      
    }
  }, [transformMode])

  useEffect(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setTranslationSnap(snapEnabled ? 0.5 : null);
    }
  }, [ snapEnabled ])
  

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100vh',}} />
  
      <div className="absolute top-4 left-4 z-10 p-4 bg-white bg-opacity-90 rounded shadow text-black w-80">
        <div className="dropdown mb-4">
          <div
            className="select-selected cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
              {dropdownOpen ? (
                <span className="pt-3 block">Cerrar Transform</span>
              ) : (
                <span>Abrir Transform</span>
              )}
          </div>
          {dropdownOpen && (
            <div className="mt-2 p-2 text-white">
              {['x', 'y', 'z'].map((axis) => (
                <div
                  key={`pos-${axis}`}
                >
                  Location {axis.toUpperCase()}:
                  <input
                    type="number"
                    value={position[axis]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setPosition(prev => ({ ...prev, [axis]: val }));
                      if (selectedObject) selectedObject.position[axis] = val;
                    }}
                    className="border px-4 py-1 w-full rounded mb-2 text-black"
                  />
                </div>
              ))}
              {['x', 'y', 'z'].map((axis) => (
                <div 
                key={`rot-${axis}`}>
                  Rotation {axis.toUpperCase()} (°):
                  <input
                    type="number"
                    value={rotation[axis]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setRotation(prev => ({ ...prev, [axis]: val }));
                      if (selectedObject) selectedObject.rotation[axis] = THREE.MathUtils.degToRad(val);
                    }}
                    className="border px-2 py-1 w-full rounded mb-2 text-black"
                  />
                </div>
              ))}
              {['x', 'y', 'z'].map((axis) => (
                <div key={`scale-${axis}`}>
                  Scale {axis.toUpperCase()}:
                  <input
                    type="number"
                    step="0.01"
                    value={scale[axis]}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setScale(prev => ({ ...prev, [axis]: val }));
                      if (selectedObject) selectedObject.scale[axis] = val;
                    }}
                    className="border px-2 py-1 w-full rounded mb-2 text-black"
                  />
                </div>
              ))}
              <div className="mb-2">
                <label className="block mb-1 font-semibold">Modo de Transformación</label>
                <select
                  value={transformMode}
                  onChange={(e) => setTransformMode(e.target.value)}
                  className="border px-2 py-1 rounded w-full text-black"
                >
                  <option value="translate">Mover</option>
                  <option value="scale">Escalar</option>
                  <option value="rotate">Rotar</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Material</label>
                <select 
                  value={materialType} 
                  onChange={(e) => {
                    const type = e.target.value;
                    setMaterialType(type);
                    const mat = createMaterialType(type);
                    const obj = selectedObjectRef.current;

                    if ( obj ) {
                      obj.traverse((child) =>{
                        if (child.isMesh) child.material = mat;
                      })
                    }
                  }}
                  className="border px-2 py-1 rounded w-full text-black"
                >
                  <option value="Metal">Metal</option>
                  <option value="Wood">Wood</option>
                  <option value="Plastic">Plastic</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <button
         id='resetTransformBtn'
          className="mt-2 bg-gray-700 text-white px-3 py-1 rounded w-full"
          onClick={resetTransform}
        >
          Resetear a default
        </button>

        <button
          id='clearSelectionBtn'
          onClick={() => {
            clearSelection();
          }}
          className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded w-full"
        >
          ❌ Deseleccionar Todo
        </button>

        <button
          id='snapToggleBtn'
          onClick={() => setSnapEnabled((prev) => !prev)}
          className='mt-2 bg-gray-700 text-white px-3 py-1 rounded w-full'
        >
          {snapEnabled ? 'Desactivar Snap a Cuadricula' : 'Activar Snap a Cuadricula'}
        </button>

        <button
          id='selectedCenterBtn'
          className="mt-2 bg-gray-700 text-white px-3 py-1 rounded w-full"
          onClick={centerCameraOnSelected}
        >
          Center Camera on Object
        </button>

          <button
            id="toggleTransformControlsBtn"
            onClick={() => {
              setShowTransformControls((prev) => {
                const newVal = !prev;
                if (!newVal && transformControlsRef.current) {
                  transformControlsRef.current.detach(); // hide
                } else if (newVal && transformControlsRef.current && selectedObject) {
                  transformControlsRef.current.attach(selectedObject); // reattach to last selected object
                }
                return newVal;
              });
            }}
            className="mt-2 bg-gray-700 text-white px-3 py-1 rounded w-full"
          >
          {showTransformControls ? 'Ocultar Gizmo' : 'Mostrar Gizmo'}
          </button>
          <div className="dropdown mt-4">
            <div
              id="addPieceBtn"
              className="select-selected cursor-pointer"
              onClick={() => setAddPieceDropdownOpen((prev) => !prev)}
            >
              {addPieceDropdownOpen ? (
                <span className="pt-3 block">Cerrar Agregar Piezas</span>
              ) : (
                <span>Agregar Piezas</span>
              )}
            </div>

            {addPieceDropdownOpen && (
              <div className="mt-2 p-2 text-white">
                
                {/* 🪑 Add Table */}
                <button
                  id='addTableBtn'
                  className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded mb-2 w-full text-left"
                  onClick={() => {
                    clearSelection();

                    const table = createTableSkeleton();
                    table.position.set(0, 0, 0);
                    sceneRef.current.add(table);

                    highlightObjects([table], true);
                    selectedObjectRef.current = table;
                    setSelectedObject(table);
                    setMultiSelected([table]);
                    transformControlsRef.current.attach(table);
                  }}
                >
                  🪑 Agregar Mesa de PTR
                </button>

                {/* 🚪 Add Porton */}
                <button
                  id='addPortonBtn'
                  className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded mb-2 w-full text-left"
                  onClick={() => {
                    clearSelection();

                    const porton = createPorton();
                    porton.position.set(0, 0, 0);
                    sceneRef.current.add(porton);

                    highlightObjects([porton], true);
                    selectedObjectRef.current = porton;
                    setSelectedObject(porton);
                    setMultiSelected([porton]);
                    transformControlsRef.current.attach(porton);
                  }}
                >
                  🚪 Agregar Portón
                </button>

                {/* 🛠️ Add Barandal */}
                <button
                  id='addBarandalBtn'
                  className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded mb-2 w-full text-left"
                  onClick={() => {
                    clearSelection();

                    const barandal = createBarandal();
                    barandal.position.set(0, 0.5, 0);
                    sceneRef.current.add(barandal);

                    highlightObjects([barandal], true);
                    selectedObjectRef.current = barandal;
                    setSelectedObject(barandal);
                    setMultiSelected([barandal]);
                    transformControlsRef.current.attach(barandal);
                  }}
                >
                  🛠️ Agregar Barandal
                </button>
              </div>
            )}
          </div>
        <button
          id="deleteObjectBtn"
          onClick={() => {
            if (confirm("¿Estás seguro de eliminar este objeto?")) {
              deleteSelectedObject();
            }
          }}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded w-full"
        >
          🗑️ Eliminar Objeto
        </button>

        <div className="w-full flex justify-center">
          <button
            id="exportBtn"
            onClick={handleExport}
            className="btn-4 mt-4 cursor-pointer group/download flex gap-2 px-8 py-4 bg-blue-600 text-[#f1f1f1] rounded-3xl hover:bg-opacity-80 font-semibold shadow-xl active:shadow-inner transition-all duration-300 relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height="24px"
              width="24px"
            >
              <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                stroke="#f1f1f1"
                d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
              ></path>
            </svg>
            Exportar
          </button>
        </div>

      </div>
      <div
        ref={selectionBox}
        className="absolute border border-blue-400 bg-blue-400 bg-opacity-20 hidden z-50 pointer-events-none"
      />

      <div className="absolute top-4 right-4 z-10 p-3 bg-white bg-opacity-90 rounded shadow text-black text-sm">
        <p className="font-semibold mb-1">Controles</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click izquierdo: seleccionar</li>
          <li>Ctrl + Click: selección múltiple</li>
          <li>Shift + arrastrar: cuadro de selección</li>
          <li>Click derecho: mover cámara</li>
          <li>Flechas: mover objeto</li>
        </ul>
      </div>
      <TourGuide />
    </div>

    
  );
}