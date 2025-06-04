import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function EstimateViewer(){
    const mountRef = useRef(null);

    useEffect(() => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#f0f0f0');

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(1.5, 1.5, 1.5);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);

        const loader = new GLTFLoader();
        const url = localStorage.getItem('exportPreview');
        loader.load(url, (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            const animate = () => {
                requestAnimationFrame(animate);
                model.rotation.y += 0.01; // Rotate the model for a simple animation
                renderer.render(scene, camera); 
            };
            animate();
        });

        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [])

    return (
        <div ref={mountRef} className="mt-4 w-[400px] h-[400px] rounded-lg shadow-lg"/>
    )
}
