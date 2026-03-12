
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width: number, height: number, centerX: number, centerY: number, radius: number;

    const calculateLayout = () => {
      const container = canvas.parentElement;
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      
      if (window.innerWidth <= 768) {
        centerX = width / 2;
        centerY = height / 2;
        radius = Math.min(width, height) * 0.45;
      } else if (window.innerWidth <= 1200) {
        centerX = width / 2;
        centerY = height; 
        radius = Math.min(width * 0.5, height * 0.8);
      } else {
        centerX = width;
        centerY = height * 0.5;
        radius = Math.max(width * 0.5, height) / 1.3;
      }

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.scale(dpr, dpr);
    };

    calculateLayout();

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([centerX, centerY])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);
    let landFeatures: any;
    const allDots: any[] = [];

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: any[] = [];
      const bounds = d3.geoBounds(feature);
      const stepSize = dotSpacing * 0.08;

      for (let lng = bounds[0][0]; lng <= bounds[1][0]; lng += stepSize) {
        for (let lat = bounds[0][1]; lat <= bounds[1][1]; lat += stepSize) {
          if (d3.geoContains(feature, [lng, lat])) {
            dots.push([lng, lat]);
          }
        }
      }
      return dots;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      const currentScale = projection.scale();
      const scaleFactor = currentScale / (radius || 1);

      context.beginPath();
      context.arc(centerX, centerY, currentScale, 0, 2 * Math.PI);
      context.fillStyle = '#050505';
      context.fill();
      context.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      context.lineWidth = 1.5 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        context.fillStyle = '#9945FF';
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (projected && projected[0] >= 0 && projected[0] <= width && projected[1] >= 0 && projected[1] <= height) {
            context.beginPath();
            context.arc(projected[0], projected[1], 1.5 * scaleFactor, 0, 2 * Math.PI);
            context.fill();
          }
        });
      }
    };

    d3.json('https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json')
      .then(data => {
        landFeatures = data;
        (landFeatures as any).features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat }));
        });
        render();
      });

    const rotation = [0, 0];
    const timer = d3.timer(() => {
      rotation[0] += 0.2;
      projection.rotate(rotation as [number, number]);
      render();
    });

    const handleResize = () => {
      calculateLayout();
      projection.scale(radius).translate([centerX, centerY]);
      render();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      timer.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing opacity-80" />;
}
