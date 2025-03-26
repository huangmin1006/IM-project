"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const ParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationSpeed, setRotationSpeed] = useState(0.001);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);

    // 创建粒子系统
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 5000;

    const positionArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);
    const sizeArray = new Float32Array(particleCount);

    // 填充位置、颜色和大小数据
    for (let i = 0; i < particleCount; i++) {
      // 球形分布
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positionArray[i * 3] = x;
      positionArray[i * 3 + 1] = y;
      positionArray[i * 3 + 2] = z;

      // 随机颜色 - 以蓝白为主
      const r = 0.5 + Math.random() * 0.5;
      const g = 0.5 + Math.random() * 0.5;
      const b = 0.8 + Math.random() * 0.2;

      colorArray[i * 3] = r;
      colorArray[i * 3 + 1] = g;
      colorArray[i * 3 + 2] = b;

      // 随机大小
      sizeArray[i] = Math.random() * 2;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3)
    );
    particlesGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizeArray, 1)
    );

    // 创建材质
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.01,
    });

    // 创建点云
    const particleSystem = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particleSystem);

    // 窗口大小调整处理
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 动画循环
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // 旋转粒子系统
      particleSystem.rotation.y += rotationSpeed;
      particleSystem.rotation.x += rotationSpeed * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // 清理
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [rotationSpeed]);

  // 鼠标交互事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMouseDown) {
      const deltaY = e.clientY - startY;
      // 将鼠标移动转换为旋转速度变化
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsMouseDown(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isMouseDown) {
      const deltaY = e.touches[0].clientY - startY;
      const newSpeed = Math.max(
        0.0001,
        Math.min(0.01, rotationSpeed - deltaY * 0.0001)
      );
      setRotationSpeed(newSpeed);
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsMouseDown(false);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
        <p>上下拖动鼠标可以控制旋转速度</p>
        <p>当前旋转速度: {rotationSpeed.toFixed(4)}</p>
      </div>
    </div>
  );
};

export default ParticleSystem;
