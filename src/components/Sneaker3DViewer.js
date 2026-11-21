"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  RotateCw,
  Sparkles,
  Plus,
  Minus,
  RotateCcw,
  Info,
  Layers,
  Compass
} from "lucide-react";
import { sounds } from "@/lib/audio";

export default function Sneaker3DViewer({
  colorway = {
    primaryHex: "#10b981",
    secondaryHex: "#065f46",
    accentHex: "#34d399",
    soleHex: "#f0fdf4"
  },
  interactive = true,
  height = "540px"
}) {
  const containerRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [activeAngle, setActiveAngle] = useState("isometric");

  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  const cameraAngles = {
    isometric: { pos: [1.6, 0.7, 1.8], label: "3D Angle" },
    side: { pos: [0, 0.1, 2.2], label: "Lateral Side" },
    top: { pos: [0, 2.4, 0.2], label: "Top Aero" },
    sole: { pos: [0, -2.1, 0.3], label: "Outsole Grip" },
    heel: { pos: [-2.0, 0.3, 0], label: "Heel Capsule" }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf4fbf7, 0.03);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(1.6, 0.7, 1.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.minDistance = 0.3;
    controls.maxDistance = 5.0;
    controls.zoomSpeed = 1.2;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa7f3d0, 1.8);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x34d399, 1.4);
    rimLight.position.set(0, -3, -5);
    scene.add(rimLight);

    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    gradient.addColorStop(0, "rgba(5, 150, 105, 0.45)");
    gradient.addColorStop(0.5, "rgba(16, 185, 129, 0.15)");
    gradient.addColorStop(1, "rgba(244, 251, 247, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.55;
    scene.add(shadowMesh);

    const loader = new GLTFLoader();
    loader.load(
      "/models/sneaker.glb",
      (gltf) => {
        const shoe = gltf.scene;

        const box = new THREE.Box3().setFromObject(shoe);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        shoe.position.x = -center.x;
        shoe.position.y = -center.y;
        shoe.position.z = -center.z;

        const pivotGroup = new THREE.Group();
        pivotGroup.add(shoe);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 2.4;
        const scaleFactor = targetSize / maxDim;
        pivotGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
        pivotGroup.position.set(0, 0, 0);

        shoe.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            if (node.material) {
              node.material.roughness = 0.45;
              node.material.metalness = 0.15;
            }
          }
        });

        modelRef.current = pivotGroup;
        scene.add(pivotGroup);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.warn("GLTF Load error", err);
        setIsLoading(false);
      }
    );

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (modelRef.current) {
        modelRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.03;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!modelRef.current) return;
    const targetColor = new THREE.Color(colorway.primaryHex);
    modelRef.current.traverse((node) => {
      if (node.isMesh && node.material) {
        if (node.material.name?.toLowerCase().includes("upper") || !node.material.name) {
          node.material.color.lerp(targetColor, 0.4);
        }
      }
    });
  }, [colorway]);

  useEffect(() => {
    if (!modelRef.current) return;
    modelRef.current.traverse((node) => {
      if (node.isMesh && node.material) {
        node.material.wireframe = isWireframe;
      }
    });
  }, [isWireframe]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const setCameraAngle = (angleKey) => {
    sounds.playSwoop();
    setActiveAngle(angleKey);
    setAutoRotate(false);
    const target = cameraAngles[angleKey];
    if (target && cameraRef.current && controlsRef.current) {
      const [x, y, z] = target.pos;
      cameraRef.current.position.set(x, y, z);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoomIn = () => {
    sounds.playClick();
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    camera.position.multiplyScalar(0.75);
    controlsRef.current.update();
  };

  const handleZoomOut = () => {
    sounds.playClick();
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    camera.position.multiplyScalar(1.25);
    controlsRef.current.update();
  };

  const handleReset = () => {
    sounds.playClick();
    setCameraAngle("isometric");
  };

  const toggleWireframe = () => {
    sounds.playTechBeep();
    setIsWireframe(!isWireframe);
  };

  const toggleAutoRotate = () => {
    sounds.playClick();
    setAutoRotate(!autoRotate);
  };

  const hotspots = [
    {
      id: "foam",
      label: "ArearsFoam Matrix",
      detail: "Supercritical nitrogen-infused core yielding 82% mechanical energy return.",
      positionClass: "bottom-20 left-12 md:left-24"
    },
    {
      id: "carbon",
      label: "Kinetic Carbon Plate",
      detail: "Full-length 3K dual-weave carbon shank tuned for max propulsion.",
      positionClass: "bottom-28 right-12 md:right-28"
    },
    {
      id: "knit",
      label: "AeroKnit Jacquard",
      detail: "Micro-vented seamless athletic knit engineered for zero friction.",
      positionClass: "top-16 left-12 md:left-28"
    }
  ];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-white border border-emerald-100 group select-none shadow-xl shadow-emerald-950/5">
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing transition-opacity duration-700"
      />

      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
            Centering High-Res 3D Model...
          </span>
        </div>
      )}

      {interactive && (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button
            onClick={handleZoomIn}
            className="p-2.5 rounded-2xl border border-emerald-200 bg-white/90 hover:bg-emerald-50 text-emerald-900 font-bold transition-all shadow-sm backdrop-blur-md"
            title="Zoom In (Close-Up Macro)"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2.5 rounded-2xl border border-emerald-200 bg-white/90 hover:bg-emerald-50 text-emerald-900 font-bold transition-all shadow-sm backdrop-blur-md"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-2xl border border-emerald-200 bg-white/90 hover:bg-emerald-50 text-gray-700 hover:text-emerald-900 transition-all shadow-sm backdrop-blur-md"
            title="Reset Angle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleWireframe}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all backdrop-blur-md ${
              isWireframe
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/25"
                : "bg-white/90 border-emerald-200 text-gray-700 hover:text-emerald-800 shadow-sm"
            }`}
            title="Toggle Wireframe CAD Mode"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">CAD Wireframe</span>
          </button>

          <button
            onClick={toggleAutoRotate}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all backdrop-blur-md ${
              autoRotate
                ? "bg-emerald-100 border-emerald-300 text-emerald-800 shadow-sm"
                : "bg-white/90 border-emerald-200 text-gray-700 hover:text-emerald-800 shadow-sm"
            }`}
            title="Toggle 360 Auto-Rotation"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">360° Orbit</span>
          </button>
        </div>
      )}

      {interactive && !isLoading && (
        <div className="absolute inset-0 pointer-events-none">
          {hotspots.map((h) => (
            <div key={h.id} className={`absolute ${h.positionClass} pointer-events-auto`}>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveHotspot(activeHotspot === h.id ? null : h.id);
                }}
                className={`relative group/btn p-2 rounded-full border transition-all duration-300 ${
                  activeHotspot === h.id
                    ? "bg-emerald-600 border-emerald-400 text-white scale-110 shadow-lg shadow-emerald-600/30"
                    : "bg-white/95 border-emerald-300 text-emerald-800 hover:border-emerald-500 hover:scale-105 shadow-sm"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </button>

              {activeHotspot === h.id && (
                <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
                    <Info className="w-3 h-3" />
                    {h.label}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{h.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {interactive && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/95 border border-emerald-200 backdrop-blur-xl shadow-lg">
          {Object.entries(cameraAngles).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setCameraAngle(key)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                activeAngle === key
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none text-xs text-emerald-900 font-bold bg-white/90 px-3 py-1.5 rounded-full border border-emerald-200 backdrop-blur-md shadow-sm">
        <Compass className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
        <span>Macro Zoom Enabled (Scroll / Pinch)</span>
      </div>
    </div>
  );
}
