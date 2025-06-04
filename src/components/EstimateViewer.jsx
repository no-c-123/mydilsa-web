import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function EstimateViewer(){
    
    const mountRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#f0f0f0');
        
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // 1:1 aspect ratio
        camera.position.set(1.5, 1.5, 1.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(400, 400);
        const container = mountRef.current;
        container.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);

        const url = localStorage.getItem('exportPreview');

        if (!url) {
            setError(true);
            setLoading(false);
            return;
        }

        const loader = new GLTFLoader();
        loader.load( url , ( gltf ) => {
              const model = gltf.scene;
              scene.add(model);
      
              const animate = () => {
                requestAnimationFrame(animate);
                model.rotation.y += 0.01;
                renderer.render(scene, camera);
              };
              animate();
              setLoading(false);
            },
            undefined,
            () => {
              setError(true);
              setLoading(false);
            }
        );
        return () => {
            container.innerHTML = '';
        };
    }, [])
    

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Vista previa del modelo</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">
                Este es el modelo 3D que generaste. Está girando automáticamente para que puedas verlo desde todos los ángulos.
            </p>

            <div
                ref={mountRef}
                className="w-[400px] h-[400px] bg-gray-100 rounded-md flex items-center justify-center relative"
            >
                {loading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded-md">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-semibold z-10">
                        Error al cargar el modelo
                    </div>
                )}
            </div>
        </div>
    );
}
