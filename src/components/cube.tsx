// components/HeadphoneScene.tsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';

const HeadphoneScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadTexture = (texturePath: string) => {
    const textureLoader = new THREE.TextureLoader();
    return textureLoader.load(texturePath);
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(1, 1, 1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, alpha: true });

    renderer.setSize(250, 250);
    scene.background = null;

    // Adiciona uma luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Adiciona uma luz direcional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const loader = new GLTFLoader();

    loader.load('/headphone.glb', function (gltf) {
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child as THREE.Mesh;
          const textureLoader = new THREE.TextureLoader();

          renderer.toneMapping = THREE.ACESFilmicToneMapping;

          // const material = new THREE.MeshStandardMaterial({
          //   map: loadTexture('/baseColor.png'),
          //   normalMap: loadTexture('/normal.png'),
          //   roughnessMap: loadTexture('/roughness.png'),
          //   metalness: 0.1,
          //   roughness: 0.1,
          //   transparent: true,
          //   opacity: 1,
          // });

          // mesh.material = material;

          // Ajusta a posição do objeto no centro da cena
          const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          gltf.scene.position.sub(center);

          // Adiciona rotação ao modelo usando GSAP
          gsap.to(child.rotation, { duration: 10, z: Math.PI * 2, ease: 'linear', repeat: -1 });
        }
      });

      scene.add(gltf.scene);
    }, undefined, function (error) {
      console.error(error);
    });

    // Posicionamento e orientação inicial da câmera
    camera.position.z = 15;
    camera.lookAt(0, 0, 0);

    // Adiciona controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.enableZoom = false;

    const animate = () => {
      requestAnimationFrame(animate);

      // Atualiza os controles de órbita
      controls.update();

      // Renderiza a cena
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = 1;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default HeadphoneScene;
