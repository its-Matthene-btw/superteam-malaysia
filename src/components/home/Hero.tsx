"use client";

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import * as d3 from 'd3';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width: number, height: number, dpr: number, radius: number, globeCenterY: number;
    const projection = d3.geoOrthographic().clipAngle(90);

    const numStars = 35000; 
    const maxZ = 2500;
    let stars: { x: number; y: number; z: number; speed: number }[] = [];
    let scrollVelocity = 0;

    function initStars() {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * width * 45,
          y: (Math.random() - 0.5) * height * 45,
          z: Math.random() * maxZ,
          speed: 0.4 + Math.random() * 2.2
        });
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      radius = Math.min(width * 0.8, height * 0.8);
      if (width < 768) radius = width * 0.75;

      globeCenterY = (height / 2) + 450;

      canvas.width = width * dpr;
      canvas.height = (height + 1200) * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height + 1200}px`;
      context.scale(dpr, dpr);

      projection.translate([width / 2, globeCenterY]).scale(radius);
      initStars();
    }

    const handleScroll = () => {
      scrollVelocity += 0.45;
      scrollVelocity = Math.min(scrollVelocity, 18);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll);
    resize();

    let allDots: { lng: number; lat: number; isTwinkler: boolean; phase: number }[] = [];
    let landFeatures: any = null;

    const loadWorldData = async () => {
      try {
        const response = await fetch("https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json");
        landFeatures = await response.json();
        landFeatures.features.forEach((feature: any) => {
          const bounds = d3.geoBounds(feature);
          for (let lng = bounds[0][0]; lng <= bounds[1][0]; lng += 1.6) {
            for (let lat = bounds[0][1]; lat <= bounds[1][1]; lat += 1.6) {
              if (d3.geoContains(feature, [lng, lat])) {
                allDots.push({ 
                  lng, 
                  lat, 
                  isTwinkler: Math.random() > 0.96, 
                  phase: Math.random() * 10 
                });
              }
            }
          }
        });
      } catch (e) {
        console.error("Error loading globe data", e);
      }
    };

    let rotation = [0, -15];
    const timer = d3.timer(() => {
      rotation[0] += (0.12 + scrollVelocity * 0.18);
      projection.rotate(rotation as [number, number]);
      
      context.clearRect(0, 0, width, height + 1200);
      const time = Date.now();
      scrollVelocity *= 0.94;

      // 1. Star Rendering
      context.fillStyle = "#ffffff";
      stars.forEach(star => {
        star.z -= (star.speed + scrollVelocity * 6.5);
        if (star.z <= 1) star.z = maxZ;

        const px = (width / 2) + (star.x / star.z) * 1500;
        const py = globeCenterY + (star.y / star.z) * 1500;

        if (px >= -500 && px <= width + 500 && py >= -500 && py <= height + 1500) {
          const alpha = 1 - (star.z / maxZ);
          context.globalAlpha = alpha;
          context.beginPath();
          const starSize = (alpha * 4.5) + (scrollVelocity * 0.6);
          context.arc(px, py, starSize, 0, Math.PI * 2);
          context.fill();
        }
      });

      const currentScale = projection.scale();

      // 2. Globe Sphere
      context.globalAlpha = 1;
      context.beginPath();
      context.arc(width / 2, globeCenterY, currentScale, 0, 2 * Math.PI);
      
      const grad = context.createRadialGradient(width/2, globeCenterY, currentScale*0.7, width/2, globeCenterY, currentScale);
      grad.addColorStop(0, '#06020f');
      grad.addColorStop(1, '#0c031c');
      context.fillStyle = grad;
      context.fill();

      context.shadowBlur = 60 + (scrollVelocity * 20);
      context.shadowColor = '#9945FF';
      context.strokeStyle = 'rgba(153, 69, 255, 0.9)';
      context.lineWidth = 3;
      context.stroke();
      context.shadowBlur = 0;

      // 3. World Dots
      if (landFeatures) {
        allDots.forEach(dot => {
          const projected = projection([dot.lng, dot.lat]);
          if (projected) {
            const centerDist = Math.abs(projected[0] - width/2) / currentScale;
            const fade = Math.max(0, 1 - Math.pow(centerDist, 2.5));
            context.globalAlpha = fade;
            context.fillStyle = dot.isTwinkler && Math.sin(time*0.002 + dot.phase) > 0.9 ? "#ffffff" : "#7c2ce8";
            context.beginPath();
            context.arc(projected[0], projected[1], 1.2, 0, Math.PI * 2);
            context.fill();
          }
        });
      }
    });

    loadWorldData();

    return () => {
      timer.stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background radial gradient to fade the globe edge */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1a083a] via-black to-black opacity-80" />

      {/* Centered radial gradient "black box" for text focus - 75% to 0% transparency */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.75)_0%,_transparent_70%)]" />

      <div className="relative z-20 text-center max-w-4xl px-6 pointer-events-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold mb-6 leading-[1.1] tracking-tight text-white drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          Malaysia’s Home <br /> 
          <span className="hero-text-gradient">for Solana Builders</span>
        </h1>

        <p className="max-w-xl mx-auto text-lg text-[#a1a1aa] mb-10 leading-relaxed">
          Discover bounties, grants, events, and opportunities while building with the fastest growing Web3 ecosystem.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold h-12 px-8 rounded-full uppercase">
            JOIN NETWORK
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white uppercase tracking-wider text-xs font-bold">
            OPPORTUNITIES
          </Button>
        </div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} id="globe-canvas" className="block" />
      </div>
    </section>
  );
}