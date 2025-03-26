"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { useFrame, Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// 物理世界
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// 创建地面
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
groundBody.position.set(0, -10, 0);
world.addBody(groundBody);

// 创建边界墙
const wallShape = new CANNON.Box(new CANNON.Vec3(20, 20, 1));
const walls = [
  { position: [0, 0, -20], rotation: [0, 0, 0] },
  { position: [0, 0, 20], rotation: [0, Math.PI, 0] },
  { position: [-20, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [20, 0, 0], rotation: [0, -Math.PI / 2, 0] },
];

walls.forEach(({ position, rotation }) => {
  const wallBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: wallShape,
  });
  wallBody.position.set(position[0], position[1], position[2]);
  wallBody.quaternion.setFromEuler(rotation[0], rotation[1], rotation[2]);
  world.addBody(wallBody);
});

// 物理世界更新组件
const PhysicsWorld = () => {
  useFrame(() => {
    world.step(1 / 60);
  });
  return null;
};

// 星空组件
const Stars = ({ rotationSpeed }: { rotationSpeed: number }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const [particlesGeometry] = useState(() => {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 5000;

    const positionArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const sizeArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positionArray[i * 3] = x;
      positionArray[i * 3 + 1] = y;
      positionArray[i * 3 + 2] = z;

      const r = 0.6 + Math.random() * 0.4;
      const g = 0.7 + Math.random() * 0.3;
      const b = 0.9 + Math.random() * 0.1;

      colorArray[i * 3] = r;
      colorArray[i * 3 + 1] = g;
      colorArray[i * 3 + 2] = b;

      sizeArray[i] = Math.random() * 2;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizeArray, 1));

    return geometry;
  });

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += rotationSpeed;
      particlesRef.current.rotation.x += rotationSpeed * 0.3;
    }
  });

  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        vertexColors
        transparent
        alphaTest={0.01}
      />
    </points>
  );
};

// 射线检测组件
const ClickHandler = ({
  onAddBall,
}: {
  onAddBall: (position: THREE.Vector3) => void;
}) => {
  const { camera } = useThree();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersectionPoint = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
        onAddBall(intersectionPoint);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [camera, onAddBall]);

  return null;
};

// 物理小球组件
const Ball = ({ position }: { position: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<CANNON.Body | null>(null);

  // 创建一个随机浅色
  const getRandomPastelColor = () => {
    // 生成浅色：高R、G、B值，但不完全相同以产生变化
    const hue = Math.random() * 360; // 随机色相
    const saturation = 0.3 + Math.random() * 0.3; // 中低饱和度
    const lightness = 0.7 + Math.random() * 0.2; // 高亮度（使颜色浅）

    // 转换HSL为RGB
    return new THREE.Color().setHSL(hue / 360, saturation, lightness);
  };

  const [ballColor] = useState(() => getRandomPastelColor());

  useEffect(() => {
    if (!meshRef.current) return;

    const radius = 0.5;
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
      mass: 1,
      shape,
      position: new CANNON.Vec3(position.x, position.y, position.z),
    });
    world.addBody(body);
    bodyRef.current = body;

    return () => {
      if (bodyRef.current) {
        world.removeBody(bodyRef.current);
      }
    };
  }, [position]);

  useFrame(() => {
    if (meshRef.current && bodyRef.current) {
      meshRef.current.position.copy(
        new THREE.Vector3(
          bodyRef.current.position.x,
          bodyRef.current.position.y,
          bodyRef.current.position.z
        )
      );
      meshRef.current.quaternion.copy(
        new THREE.Quaternion(
          bodyRef.current.quaternion.x,
          bodyRef.current.quaternion.y,
          bodyRef.current.quaternion.z,
          bodyRef.current.quaternion.w
        )
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshPhongMaterial
        color={ballColor}
        shininess={100}
        emissive={ballColor.clone().multiplyScalar(0.2)}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// 场景组件
const Scene = ({
  rotationSpeed,
  balls,
  onAddBall,
}: {
  rotationSpeed: number;
  balls: THREE.Vector3[];
  onAddBall: (position: THREE.Vector3) => void;
}) => {
  return (
    <>
      <PhysicsWorld />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Stars rotationSpeed={rotationSpeed} />
      {balls.map((position, index) => (
        <Ball key={index} position={position} />
      ))}
      <OrbitControls />
      <ClickHandler onAddBall={onAddBall} />
    </>
  );
};

const PhysicsScene = () => {
  const [balls, setBalls] = useState<THREE.Vector3[]>([]);
  const [rotationSpeed, setRotationSpeed] = useState(0.001);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startY, setStartY] = useState(0);

  const handleAddBall = (position: THREE.Vector3) => {
    setBalls((prev) => [...prev, position]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      const deltaY = e.clientY - startY;
      const newSpeed = Math.max(
        0.0001,
        Math.min(0.01, rotationSpeed - deltaY * 0.0001)
      );
      setRotationSpeed(newSpeed);
      setStartY(e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <div
      className="w-full h-screen cursor-pointer bg-black"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Canvas
        camera={{ position: [0, 10, 30], fov: 75 }}
        style={{ background: "linear-gradient(to bottom, #000000, #050520)" }}
      >
        <color attach="background" args={["#050520"]} />
        <fog attach="fog" args={["#050520", 20, 60]} />
        <Scene
          rotationSpeed={rotationSpeed}
          balls={balls}
          onAddBall={handleAddBall}
        />
      </Canvas>
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded">
        <p>点击任意位置创建物理小球</p>
        <p>上下拖动鼠标控制星空旋转速度</p>
        <p>当前旋转速度: {rotationSpeed.toFixed(4)}</p>
        <p>小球数量: {balls.length}</p>
      </div>
    </div>
  );
};

export default PhysicsScene;
