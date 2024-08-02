import React, { useState, useEffect, useRef } from "react";
import { TimerType } from "./timer.type.ts";
import "./timer.css"

export const Timer: React.FC<TimerType> = ({ isTick }) => {
  const initialTime = 300; // 5 minutes in seconds

  const [time, setTime] = useState<number>(() => {
    const savedEndTime = localStorage.getItem("endTime");
    const now = Date.now();
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));
      return remainingTime;
    }
    return initialTime;
  });

  const [isActive, setIsActive] = useState<boolean>(() => {
    const savedEndTime = localStorage.getItem("endTime");
    return savedEndTime !== null;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTick) {
      handleStart();
    }
  }, [isTick]);

  useEffect(() => {
    if (isActive && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, time]);

  useEffect(() => {
    if (time === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isActive && time > 0) {
      const endTime = Date.now() + time * 1000;
      localStorage.setItem("endTime", endTime.toString());
    } else {
      localStorage.removeItem("endTime");
    }
  }, [isActive, time]);

  const handleStart = () => {
    setIsActive(true);
    const endTime = Date.now() + time * 1000;
    localStorage.setItem("endTime", endTime.toString());
  };


  return (
    <div className={"timer-container"}>
      {isTick ? (
        <div id="timer">
          Time Remaining: {new Date(time * 1000).toISOString().substr(14, 5)}
        </div>
      ) : null}
    </div>
  );
};

export default Timer;
