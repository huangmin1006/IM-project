"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export default function PhysicsScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(true);
  const [airplanePosition, setAirplanePosition] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const spaceshipRef = useRef<THREE.Group | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // 初始化场景
  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 加载飞船模型
    const loader = new OBJLoader();
    const modelPath =
      process.env.NODE_ENV === "development"
        ? "/spaceship.obj" // 开发环境
        : "./spaceship.obj"; // 生产环境，使用相对于out/index.html的路径

    loader.load(
      modelPath,
      (object) => {
        // 为模型添加材质
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshPhongMaterial({
              color: 0x3366ff, // 蓝色
              shininess: 100,
              specular: 0x111111,
            });
          }
        });

        object.scale.set(0.002, 0.002, 0.002); // 保持缩放不变
        // 调整旋转角度：
        // x: Math.PI/2 让飞船从俯视转为正视
        // y: -Math.PI/2 让飞船向左旋转90度
        // z: Math.PI/2 让飞船头朝向屏幕里面
        object.rotation.set(-Math.PI / 2, Math.PI / 50, Math.PI / 2);
        scene.add(object);
        spaceshipRef.current = object;
      },
      undefined,
      (error: unknown) => {
        console.error("加载模型时出错:", error);
      }
    );

    // 创建粒子系统
    const particleCount = 2000; // 减少粒子数量，增加清晰度
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount); // 添加缩放属性
    velocitiesRef.current = velocities;

    for (let i = 0; i < particleCount; i++) {
      // 设置随机初始位置（从中心开始）
      const angle = Math.random() * Math.PI * 2;
      const radiusStart = Math.random() * 2; // 从接近中心的位置开始

      positions[i * 3] = Math.cos(angle) * radiusStart;
      positions[i * 3 + 1] = Math.sin(angle) * radiusStart;
      positions[i * 3 + 2] = -10 - Math.random() * 20; // 更近的初始位置

      // 设置速度（从中心向外扩散）
      const speed = 0.2 + Math.random() * 0.3;
      velocities[i * 3] = Math.cos(angle) * speed * 2;
      velocities[i * 3 + 1] = Math.sin(angle) * speed * 2;
      velocities[i * 3 + 2] = speed * 0.5; // 较小的z方向速度

      // 设置颜色（更亮的蓝色）
      const brightness = 0.7 + Math.random() * 0.3;
      colors[i * 3] = brightness * 0.2; // 更少的蓝色
      colors[i * 3 + 1] = brightness * 0.8; // 更多的青色
      colors[i * 3 + 2] = brightness; // 保持白色

      // 设置粒子大小
      scales[i] = 1.0 + Math.random() * 2.0;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
    particleGeometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(scales, 1)
    );

    // 创建自定义着色器材质
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float scale;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = scale * (30.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          float alpha = smoothstep(0.5, 0.2, dist);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particleSystemRef.current = particleSystem;

    // 添加光源
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // 立即渲染一次
    renderer.render(scene, camera);

    // 处理窗口大小变化
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // 处理键盘控制
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = false;
    };

    // 持续更新位置
    const updatePosition = () => {
      const moveSpeed = 0.1;
      if (keysPressed.current["ArrowUp"]) {
        setAirplanePosition((prev) => ({ ...prev, y: prev.y + moveSpeed }));
      }
      if (keysPressed.current["ArrowDown"]) {
        setAirplanePosition((prev) => ({ ...prev, y: prev.y - moveSpeed }));
      }
      if (keysPressed.current["ArrowLeft"]) {
        setAirplanePosition((prev) => ({ ...prev, x: prev.x - moveSpeed }));
      }
      if (keysPressed.current["ArrowRight"]) {
        setAirplanePosition((prev) => ({ ...prev, x: prev.x + moveSpeed }));
      }
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    const animationId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, []); // 只在组件挂载时运行一次

  // 更新飞船位置
  useEffect(() => {
    if (!spaceshipRef.current) return;
    spaceshipRef.current.position.x = airplanePosition.x;
    spaceshipRef.current.position.y = airplanePosition.y;
    spaceshipRef.current.position.z = airplanePosition.z;
  }, [airplanePosition]);

  // 粒子动画
  useEffect(() => {
    if (
      !isPlaying ||
      !sceneRef.current ||
      !cameraRef.current ||
      !rendererRef.current ||
      !particleSystemRef.current ||
      !velocitiesRef.current
    )
      return;

    const animate = () => {
      if (!isPlaying) return;

      animationFrameRef.current = requestAnimationFrame(animate);

      // 更新粒子位置
      const positions = particleSystemRef.current!.geometry.attributes.position
        .array as Float32Array;
      const velocities = velocitiesRef.current!;

      for (let i = 0; i < positions.length / 3; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        // 如果粒子移动太远，重置到中心
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        const distance = Math.sqrt(x * x + y * y);

        if (distance > 100 || z > 50) {
          const angle = Math.random() * Math.PI * 2;
          const radiusStart = Math.random() * 2;
          positions[i * 3] = Math.cos(angle) * radiusStart;
          positions[i * 3 + 1] = Math.sin(angle) * radiusStart;
          positions[i * 3 + 2] = -10 - Math.random() * 20;

          // 重新设置速度
          const speed = 0.2 + Math.random() * 0.3;
          velocities[i * 3] = Math.cos(angle) * speed * 2;
          velocities[i * 3 + 1] = Math.sin(angle) * speed * 2;
          velocities[i * 3 + 2] = speed * 0.5;
        }
      }

      particleSystemRef.current!.geometry.attributes.position.needsUpdate =
        true;

      // 更新着色器时间
      (
        particleSystemRef.current!.material as THREE.ShaderMaterial
      ).uniforms.time.value += 0.01;

      // 确保场景和相机存在
      if (sceneRef.current && cameraRef.current) {
        rendererRef.current!.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div ref={containerRef} className="w-full h-screen">
      <div className="absolute top-4 left-4 z-10 bg-black/50 p-4 rounded-lg text-white">
        <div className="mb-4">
          <label className="block mb-2">粒子速度: {speed}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          {isPlaying ? "暂停" : "播放"}
        </button>
      </div>
    </div>
  );
}
