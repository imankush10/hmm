"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollCanvas({
  imageCount = 230,
  imagePath = "/frames/frame",
  imageExtension = ".jpg",
  className = "",
  onLoadComplete = () => {},
  onLoadProgress = () => {},
}) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const frameIndexRef = useRef(0);

  // Preload all images
  useEffect(() => {
    console.log("Starting to load images...", {
      imageCount,
      imagePath,
      imageExtension,
    });

    let loadedCount = 0;

    const loadImage = (index) => {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          loadedCount++;
          const progress = (loadedCount / imageCount) * 100;
          console.log(
            `Loaded image ${
              index + 1
            }/${imageCount} - Progress: ${progress.toFixed(1)}%`
          );
          onLoadProgress(progress);
          resolve(img);
        };

        img.onerror = (error) => {
          console.error(`Failed to load image ${index + 1}:`, error);
          // Create a simple placeholder canvas instead of failing
          const canvas = document.createElement("canvas");
          canvas.width = 1920;
          canvas.height = 1080;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#333";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#666";
          ctx.font = "48px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            `Frame ${index + 1}`,
            canvas.width / 2,
            canvas.height / 2
          );

          loadedCount++;
          const progress = (loadedCount / imageCount) * 100;
          console.log(
            `Created placeholder for image ${
              index + 1
            }/${imageCount} - Progress: ${progress.toFixed(1)}%`
          );
          onLoadProgress(progress);
          resolve(canvas);
        };

        // Construct image path
        const paddedIndex = String(index + 1).padStart(4, "0");
        const imageSrc = `${imagePath}${paddedIndex}${imageExtension}`;
        console.log(`Loading image: ${imageSrc}`);
        img.src = imageSrc;
      });
    };

    // Load all images
    Promise.all(
      Array.from({ length: imageCount }, (_, index) => loadImage(index))
    )
      .then((loadedImages) => {
        console.log("All images loaded successfully!");
        imagesRef.current = loadedImages;
        setImagesLoaded(true);
        onLoadComplete();
      })
      .catch((error) => {
        console.error("Error loading images:", error);
      });
  }, [imageCount, imagePath, imageExtension, onLoadProgress, onLoadComplete]);

  // Handle scroll animation
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawFrame = () => {
      if (!imagesRef.current[frameIndexRef.current]) return;

      const img = imagesRef.current[frameIndexRef.current];

      // Clear canvas
      ctx.clearRect(
        0,
        0,
        canvas.width / window.devicePixelRatio,
        canvas.height / window.devicePixelRatio
      );

      // Calculate dimensions to cover the canvas while maintaining aspect ratio
      const canvasAspect =
        canvas.width /
        window.devicePixelRatio /
        (canvas.height / window.devicePixelRatio);
      const imgAspect = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspect > imgAspect) {
        drawWidth = canvas.width / window.devicePixelRatio;
        drawHeight = drawWidth / imgAspect;
        offsetX = 0;
        offsetY = (canvas.height / window.devicePixelRatio - drawHeight) / 2;
      } else {
        drawHeight = canvas.height / window.devicePixelRatio;
        drawWidth = drawHeight * imgAspect;
        offsetX = (canvas.width / window.devicePixelRatio - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    const handleScroll = () => {
      if (!imagesLoaded) return;

      // Get scroll progress (0 to 1)
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(Math.max(scrollTop / docHeight, 0), 1);

      // Map scroll progress to frame index
      const targetFrame = Math.floor(scrollProgress * (imageCount - 1));

      // Smooth frame transition
      if (targetFrame !== frameIndexRef.current) {
        frameIndexRef.current = targetFrame;
        drawFrame();
      }
    };

    // Initial draw
    drawFrame();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [imagesLoaded, imageCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full object-cover ${
        !imagesLoaded ? "opacity-0" : "opacity-100"
      } transition-opacity duration-500 ${className}`}
      style={{ display: "block" }}
    />
  );
}
