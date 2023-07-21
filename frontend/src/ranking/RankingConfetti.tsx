import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const canvasStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

function getAnimationSettings(originXA: number, originXB: number) {
  return {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    particleCount: 150,
    origin: {
      x: randomInRange(originXA, originXB),
      y: Math.random() - 0.2,
    },
  };
}

export default function Fireworks() {
  const refAnimationInstance = useRef<any>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>();

  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
      refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
    }
  }, []);

  useEffect(() => {
    // 컴포넌트가 마운트되면 10초 후에 애니메이션을 멈추도록 설정
    const timerId = setTimeout(() => {
      if (refAnimationInstance.current) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
    }, 10000);

    refAnimationInstance.current && setIntervalId(setInterval(nextTickAnimation, 400));;

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timerId);
  }, [nextTickAnimation]);


  // const startAnimation = useCallback(() => {
  //   if (!intervalId) {
  //     setIntervalId(setInterval(nextTickAnimation, 400));
  //   }
  // }, [intervalId, nextTickAnimation]);

  // const pauseAnimation = useCallback(() => {
  //   if (intervalId) {
  //     clearInterval(intervalId);
  //     setIntervalId(undefined);
  //   }
  // }, [intervalId]);

  // const stopAnimation = useCallback(() => {
  //   if (intervalId) {
  //     clearInterval(intervalId);
  //     setIntervalId(undefined);
  //   }
  //   if (refAnimationInstance.current) {
  //     refAnimationInstance.current.reset();
  //   }
  // }, [intervalId]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <>
      <div>
        {/* <button onClick={startAnimation}>Start</button> //시작 버튼
        <button onClick={pauseAnimation}>Pause</button> // 일시정지 버튼
        <button onClick={stopAnimation}>Stop</button> //종료버튼 */ } 
      </div>
      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
    </>
  );
}

