import React, { useEffect, useRef, useState } from "react";
import "./App.css"; // Add your styling here

const Carousel3D = () => {
  const containerRef = useRef(null);
  const carouselRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currentMousePos, setCurrentMousePos] = useState(0);
  const [lastMousePos, setLastMousePos] = useState(0);
  const [moveTo, setMoveTo] = useState(0);
  const [lastMoveTo, setLastMoveTo] = useState(0);

  const lerp = (a, b, n) => n * (a - b) + b;

  const distanceZ = (widthElement, length, gap) => {
    return widthElement / 2 / Math.tan(Math.PI / length) + gap;
  };

  const calculateHeight = (z) => {
    const t = Math.atan((90 * Math.PI) / 180 / 2);
    return t * 2 * z;
  };

  const calculateFov = (carouselProps) => {
    const containerCarousel = containerRef.current.querySelector(
      ".container-carrossel"
    );
    const perspective = window
      .getComputedStyle(containerCarousel)
      .perspective.split("px")[0];

    const length =
      Math.sqrt(carouselProps.w * carouselProps.w) +
      Math.sqrt(carouselProps.h * carouselProps.h);
    return 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
  };

  const onResize = () => {
    const containerCarousel = containerRef.current.querySelector(
      ".container-carrossel"
    );
    const boundingCarousel = containerCarousel.getBoundingClientRect();

    return {
      w: boundingCarousel.width,
      h: boundingCarousel.height,
    };
  };

  const createCarousel = () => {
    const carouselItems =
      carouselRef.current.querySelectorAll(".carrossel-item");
    const carouselProps = onResize();
    const length = carouselItems.length;
    const degrees = 360 / length;
    const gap = 20;
    const tz = distanceZ(carouselProps.w, length, gap);

    const fov = calculateFov(carouselProps);
    const height = calculateHeight(tz);

    const container = containerRef.current;
    container.style.width = tz * 2 + gap * length + "px";
    container.style.height = height + "px";

    carouselItems.forEach((item, i) => {
      const degreesByItem = degrees * i + "deg";
      item.style.setProperty("--rotatey", degreesByItem);
      item.style.setProperty("--tz", tz + "px");
    });
  };

  const getPosX = (x) => {
    setCurrentMousePos(x);
    const delta = x - lastMousePos;
    setMoveTo((prevMoveTo) => prevMoveTo + delta / 2); // Adjust sensitivity by dividing the delta
    setLastMousePos(x);
  };

  const update = () => {
    setLastMoveTo((prevLastMoveTo) => lerp(moveTo, prevLastMoveTo, 0.1));
    carouselRef.current.style.setProperty("--rotatey", lastMoveTo + "deg");
    requestAnimationFrame(update);
  };

  const initEvents = () => {
    const carousel = carouselRef.current;
    const container = containerRef.current;

    // Mouse Events
    carousel.addEventListener("mousedown", (e) => {
      setIsMouseDown(true);
      setLastMousePos(e.clientX);
      carousel.style.cursor = "grabbing";
    });

    carousel.addEventListener("mouseup", () => {
      setIsMouseDown(false);
      carousel.style.cursor = "grab";
    });

    container.addEventListener("mouseleave", () => setIsMouseDown(false));

    carousel.addEventListener("mousemove", (e) => {
      if (isMouseDown) getPosX(e.clientX);
    });

    // Touch Events
    carousel.addEventListener("touchstart", (e) => {
      setIsMouseDown(true);
      setLastMousePos(e.touches[0].clientX);
      carousel.style.cursor = "grabbing";
    });

    carousel.addEventListener("touchend", () => {
      setIsMouseDown(false);
      carousel.style.cursor = "grab";
    });

    container.addEventListener("touchmove", (e) => {
      if (isMouseDown) getPosX(e.touches[0].clientX);
    });

    window.addEventListener("resize", createCarousel);

    update();
    createCarousel();
  };

  useEffect(() => {
    initEvents();
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <div className="container-carrossel">
        <div className="carrossel" ref={carouselRef}>
          <div className="carrossel-item">1</div>
          <div className="carrossel-item">2</div>
          <div className="carrossel-item">3</div>
          <div className="carrossel-item">4</div>
          <div className="carrossel-item">5</div>
          <div className="carrossel-item">6</div>
        </div>
      </div>
    </div>
  );
};

export default Carousel3D;
