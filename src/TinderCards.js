import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./TinderCards.css";

function TinderCards() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data from backend...");
        const backendUrl =
          process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";
        const req = await axios.get(`${backendUrl}/tinder/cards`);
        console.log("Data received:", req.data);
        setPeople(req.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        console.error("Error details:", error.response || error.message);
      }
    }
    fetchData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Reset card position when currentIndex changes
  useEffect(() => {
    if (cardRef.current && people.length > 0) {
      cardRef.current.style.transform = "translate(0px, 0px) rotate(0deg)";
    }
  }, [currentIndex, people.length]);

  const handleSwipe = (direction) => {
    console.log(`Swiped ${direction} on ${people[currentIndex].name}`);
    setCurrentIndex((prev) => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    cardRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${
      x * 0.1
    }deg)`;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;

    setIsDragging(false);
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;

    // Determine swipe direction based on distance
    if (Math.abs(x) > 100) {
      const direction = x > 0 ? "right" : "left";
      handleSwipe(direction);
    } else {
      // Reset card position if not swiped far enough
      cardRef.current.style.transform = "translate(0px, 0px) rotate(0deg)";
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - dragOffset.x;
    const y = touch.clientY - rect.top - dragOffset.y;

    cardRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${
      x * 0.1
    }deg)`;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;

    setIsDragging(false);
    const touch = e.changedTouches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left - dragOffset.x;

    // Determine swipe direction based on distance
    if (Math.abs(x) > 100) {
      const direction = x > 0 ? "right" : "left";
      handleSwipe(direction);
    } else {
      // Reset card position if not swiped far enough
      cardRef.current.style.transform = "translate(0px, 0px) rotate(0deg)";
    }
  };

  if (currentIndex >= people.length) {
    return (
      <div className="tinderCards">
        <div className="tinderCards__cardContainer">
          <h2>No more cards!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="tinderCards">
      <div className="tinderCards__cardContainer">
        <div
          ref={cardRef}
          className="swipe"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            cursor: isDragging ? "grabbing" : "grab",
            transition: isDragging ? "none" : "transform 0.3s ease",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{ backgroundImage: `url(${people[currentIndex].imgUrl})` }}
            className="card"
          >
            <h3>{people[currentIndex].name}</h3>
          </div>
        </div>
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => handleSwipe("left")}
            style={{ margin: "0 10px" }}
          >
            Swipe Left
          </button>
          <button
            onClick={() => handleSwipe("right")}
            style={{ margin: "0 10px" }}
          >
            Swipe Right
          </button>
        </div>
      </div>
    </div>
  );
}

export default TinderCards;
