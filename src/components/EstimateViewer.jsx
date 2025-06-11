import '../styles/ContactoFormulario.css';
import * as THREE from "three";
import emailjs from '@emailjs/browser';
import { supabase } from "../lib/supabaseClient";
import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

export default function EstimateViewer() {
  const mountRef = useRef(null);
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Prefill user data from Supabase Auth


  // 3D Viewer Effect
  useEffect(() => {
    if (!modelUrl) return;
    let renderer, scene, camera, model, animationId;
    const CANVAS_SIZE = 600;
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#f0f0f0");
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 3);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(CANVAS_SIZE, CANVAS_SIZE);
    mountRef.current.appendChild(renderer.domElement);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const loadModel = async () => {
      try {
        let extSource = fileName || modelUrl;
        let ext = '';
        if (extSource) {
          ext = extSource.slice(extSource.lastIndexOf('.')).toLowerCase();
        }
        let loader;
        switch (ext) {
          case '.gltf':
          case '.glb':
            loader = new GLTFLoader(); break;
          case '.obj': loader = new OBJLoader(); break;
          case '.fbx': loader = new FBXLoader(); break;
          case '.stl': loader = new STLLoader(); break;
          default:
            setError(true); setLoading(false); return;
        }
        const result = await new Promise((resolve, reject) => {
          loader.load(
            modelUrl,
            (result) => resolve(result),
            undefined,
            (error) => reject(error)
          );
        });
        if (result.scene) model = result.scene;
        else if (result.isMesh) model = result;
        else model = result;
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        const modelBox = new THREE.Box3().setFromObject(model);
        const modelCenter = new THREE.Vector3();
        modelBox.getCenter(modelCenter);
        model.position.sub(modelCenter);
        const group = new THREE.Group();
        group.add(model);
        const sphere = new THREE.Sphere();
        new THREE.Box3().setFromObject(group).getBoundingSphere(sphere);
        group.position.sub(sphere.center);
        const maxDim = sphere.radius * 2;
        const scale = 2 / maxDim;
        group.scale.setScalar(scale);
        const distance = sphere.radius / Math.sin((camera.fov * Math.PI) / 360);
        camera.position.set(2.4, 2, distance * 2.2);
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        if (!model.material) {
          model.material = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.5, roughness: 0.5 });
        }
        scene.add(group);
        setLoading(false);
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          if (group) group.rotation.y += 0.01;
          renderer.render(scene, camera);
        };
        animate();
      } catch (err) {
        setError(true); setLoading(false);
      }
    };
    loadModel();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [modelUrl, fileName]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        setUserName(user.user_metadata?.full_name || user.user_metadata?.name || '');
      }
    };
    getUser();
  }, []);

  // Drag and drop logic
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const validTypes = ['.gltf', '.glb', '.obj', '.fbx', '.stl'];
    if (!validTypes.includes(ext)) {
      alert('Formato no soportado');
      return;
    }
    setModelUrl(URL.createObjectURL(file));
    setFileName(file.name);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setModelUrl(URL.createObjectURL(file));
    setFileName(file.name);
  };

  // EmailJS + Supabase form submit
  const sendEmail = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormSuccess(null);
    setFormError(null);
    const formData = new FormData(form.current);
    const message = formData.get('message');
    const file = formData.get('attachment');
    let attachment_url = null;
    // Upload file to Supabase if present
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const filePath = `contact_attachments/${Date.now()}_${userName}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);
      if (uploadError) {
        setFormError('Error al subir el archivo adjunto.');
        setFormLoading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);
      attachment_url = publicUrlData.publicUrl;
    }
    // Store in Supabase
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert([{ from_name: userName, from_email: userEmail, message, attachment_url }]);
    if (insertError) {
      setFormError('Error al guardar el mensaje.');
      setFormLoading(false);
      return;
    }
    // Send with EmailJS
    emailjs.sendForm(
      'service_m804eco',
      'template_3eftr76',
      form.current,
      '4N3fYRT40a_qjMe25'
    ).then(() => {
      setFormSuccess('Mensaje enviado con éxito');
      setFormLoading(false);
      form.current.reset();
    }, (error) => {
      setFormError('Hubo un error al enviar el mensaje, intenta de nuevo');
      setFormLoading(false);
      console.log(error);
    });
  };

  return (
    <section className="w-full min-h-[80vh] rounded-lg bg-white py-24 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* LEFT: Contact Form */}
      <section className="space-y-12 h-[100%] justify-center items-center border rounded-lg shadow-md p-6 bg-gray-50 w-full">
        <h1 className='text-2xl sm:text-3xl'>Si tienes dudas, envía un correo.</h1>
        <form ref={form} onSubmit={sendEmail} className="space-y-10">
          {/* Nombre */}
          <div className="wave-group w-full">
            <input
              required
              type="text"
              name="from_name"
              className="input w-full"
              value={userName}
              onChange={e => setUserName(e.target.value)}
            />
            <span className="bar"></span>
            <label className="label">
              {'Nombre'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>{char}</span>
              ))}
            </label>
          </div>
          {/* Correo */}
          <div className="wave-group w-full">
            <input
              required
              type="email"
              name="from_email"
              className="input w-full"
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
            />
            <span className="bar"></span>
            <label className="label">
              {'Correo'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>{char}</span>
              ))}
            </label>
          </div>
          {/* Mensaje */}
          <div className="wave-group w-full">
            <textarea required rows="5" name="message" className="input w-full" />
            <span className="bar"></span>
            <label className="label">
              {'Mensaje'.split('').map((char, i) => (
                <span key={i} className="label-char" style={{ '--index': i }}>{char}</span>
              ))}
            </label>
          </div>
          {/* Mensajes de éxito/error */}
          {formSuccess && <div className="text-green-600 text-center font-semibold">{formSuccess}</div>}
          {formError && <div className="text-red-600 text-center font-semibold">{formError}</div>}
          {/* Botón */}
          <div className="text-center">
            <button type="submit" disabled={formLoading} className="bg-mydilsa-accent text-white px-8 py-3 rounded-md font-semibold shadow hover:bg-mydilsa-dark transition disabled:opacity-60">
              {formLoading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </div>
        </form>
      </section>
      {/* RIGHT: Drag-and-drop or 3D Preview */}
      <section className="flex flex-col items-center justify-center w-full">
        {!modelUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center bg-gray-100 transition relative cursor-pointer w-[90%] h-[600px] ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
            onDrop={handleDrop}
            onClick={() => document.getElementById('model-upload-input').click()}
          >
            <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16.5V9.75m0 0l3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775A5.25 5.25 0 0115.573 8.395a3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <p className="text-lg text-gray-600">Arrastra y suelta tu modelo 3D aquí o haz clic para subirlo</p>
            <p className="text-xs text-gray-400">Formatos soportados: .gltf, .glb, .obj, .fbx, .stl</p>
            <input
              id="model-upload-input"
              type="file"
              accept=".gltf,.glb,.obj,.fbx,.stl"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2">Vista previa del modelo</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Este es el modelo 3D que cargaste. Está girando automáticamente para que puedas verlo desde todos los ángulos.
            </p>
            <div
              ref={mountRef}
              className="w-[600px] h-[600px] bg-gray-100 rounded-md flex items-center justify-center relative"
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
            <button
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              onClick={() => { setModelUrl(null); setFileName(null); }}
            >
              Cargar otro modelo
            </button>
          </div>
        )}
      </section>
    </section>
  );
}