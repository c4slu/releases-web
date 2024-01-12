// components/HeadphoneScene.tsx
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

const HeadphoneScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      4,
      window.innerWidth / window.innerHeight,
      10,
      100
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current!,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth - 200, window.innerHeight - 200);
    scene.background = null;

    // Adiciona uma luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Adiciona uma luz direcional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 50, 10).normalize();
    directionalLight.castShadow = true; // Habilita a capacidade de lançar sombras
    scene.add(directionalLight);

    const loader = new GLTFLoader();

    loader.load(
      "/headphone.glb",
      function (gltf) {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Ajusta a posição do objeto no centro da cena
            const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            // Calcula a escala para manter a proporção
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scale = 1 / maxDimension;

            gltf.scene.scale.set(scale, scale, scale);
            const panAnimation = () => {
              gsap.to(scene.rotation, {
                duration: 8, // Duração da animação em segundos
                y: Math.PI / 2, // Rotação completa (360 graus)
                ease: "linear", // Tipo de easing para uma transição suave
                repeat: -1, // Repetir uma vez (ida e volta)
                yoyo: true, // Inclui a volta suave
              });
            };

            // Inicia a animação de pan
            panAnimation();
          }
        });

        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    // Posicionamento e orientação inicial da câmera
    camera.position.z = 12;
    camera.position.y = 6;
    camera.position.x = 8;
    camera.lookAt(0, 0, 0);

    // Adiciona controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
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

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      // width={128}
      // height={128}
      className="border flex justify-center items-center"
    />
  );
};

export default HeadphoneScene;