import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands, Results, HAND_CONNECTIONS } from '@mediapipe/hands';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';
import { motion, AnimatePresence } from 'motion/react';

interface HandTrackingProps {
  onGesture: (gesture: string) => void;
  active: boolean;
}

const HandTracking: React.FC<HandTrackingProps> = ({ onGesture, active }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const handsRef = useRef<Hands | null>(null);
  
  const [gesture, setGesture] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const lastGestureRef = useRef<string | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);

  // Initialize Hands library once
  useEffect(() => {
    console.log("Initializing Hands library...");
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: Results) => {
      if (!canvasRef.current || !webcamRef.current?.video) return;

      const canvasCtx = canvasRef.current.getContext('2d');
      if (!canvasCtx) return;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
          drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });

          const detectedGesture = detectGesture(landmarks);
          updateGesture(detectedGesture);
        }
      } else {
        updateGesture(null);
      }
      canvasCtx.restore();
    });

    handsRef.current = hands;

    return () => {
      hands.close();
    };
  }, []);

  // Detection loop using requestAnimationFrame
  const detect = async () => {
    if (!active) return;

    const video = webcamRef.current?.video;
    const hands = handsRef.current;

    // 1. Sửa lỗi đứt vòng lặp: Luôn gọi lại requestAnimationFrame để duy trì vòng lặp chờ
    if (!hands || !video) {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }

    // 2. Kiểm tra kích thước khung hình an toàn và trạng thái sẵn sàng của video
    if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
      try {
        // 4. Bắt lỗi (Error Handling) để không làm sập luồng nhận diện
        await hands.send({ image: video });
      } catch (err) {
        console.error("AI Detection Error:", err);
      }
    }

    requestRef.current = requestAnimationFrame(detect);
  };

  useEffect(() => {
    if (active && isCameraReady) {
      requestRef.current = requestAnimationFrame(detect);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [active, isCameraReady]);

  const requestCamera = async () => {
    setIsRetrying(true);
    setPermissionDenied(false);
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      window.location.reload();
    } catch (err) {
      console.error("Manual camera request failed:", err);
      setPermissionDenied(true);
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isCameraReady && active && !permissionDenied) {
        setCameraError(true);
      }
    }, 15000);
    return () => clearTimeout(timeout);
  }, [isCameraReady, active, permissionDenied]);

  const detectGesture = (landmarks: any[]) => {
    // Landmarks: 0: WRIST, 4: THUMB_TIP, 8: INDEX_FINGER_TIP, 12: MIDDLE_FINGER_TIP, 16: RING_FINGER_TIP, 20: PINKY_TIP
    // 6: INDEX_FINGER_PIP, 10: MIDDLE_FINGER_PIP, 14: RING_FINGER_PIP, 18: PINKY_PIP
    
    const fingers = [];
    
    // Thumb: Check distance between thumb tip and pinky base or use horizontal position
    const thumbTip = landmarks[4];
    const thumbBase = landmarks[2];
    const indexBase = landmarks[5];
    
    // Simple thumb detection: is it extended horizontally?
    const isThumbUp = Math.abs(thumbTip.x - indexBase.x) > Math.abs(thumbBase.x - indexBase.x);
    if (isThumbUp) fingers.push('thumb');
    
    // Other fingers: is the tip higher than the PIP joint?
    const isIndexUp = landmarks[8].y < landmarks[6].y;
    const isMiddleUp = landmarks[12].y < landmarks[10].y;
    const isRingUp = landmarks[16].y < landmarks[14].y;
    const isPinkyUp = landmarks[20].y < landmarks[18].y;
    
    if (isIndexUp) fingers.push('index');
    if (isMiddleUp) fingers.push('middle');
    if (isRingUp) fingers.push('ring');
    if (isPinkyUp) fingers.push('pinky');

    const count = fingers.length;
    
    // New Mapping:
    // 1 finger (index) -> A
    // 2 fingers -> B
    // 3 fingers -> C
    // 5 fingers (open palm) -> D
    
    if (count === 1 && isIndexUp) return 'A';
    if (count === 2 && isIndexUp && isMiddleUp) return 'B';
    if (count === 3 && isIndexUp && isMiddleUp && isRingUp) return 'C';
    if (count >= 4) return 'D'; // 4 or 5 fingers for D
    
    return null;
  };

  const updateGesture = (newGesture: string | null) => {
    if (newGesture === lastGestureRef.current) {
      if (newGesture && holdStartTimeRef.current) {
        const elapsed = Date.now() - holdStartTimeRef.current;
        const progress = Math.min(elapsed / 1000, 1); // Set to 1.0s for confirmation
        setHoldProgress(progress);
        
        if (progress === 1) {
          onGesture(newGesture);
          holdStartTimeRef.current = null; // Reset to avoid double trigger
          setHoldProgress(0);
        }
      } else if (newGesture) {
        holdStartTimeRef.current = Date.now();
      }
    } else {
      lastGestureRef.current = newGesture;
      holdStartTimeRef.current = newGesture ? Date.now() : null;
      setGesture(newGesture);
      setHoldProgress(0);
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border-4 border-white shadow-card bg-[#263238]">
      {/* @ts-expect-error - Webcam types are overly strict */}
      <Webcam
        ref={webcamRef as any}
        mirrored
        audio={false}
        muted={true}
        playsInline={true}
        screenshotFormat="image/jpeg"
        className="absolute inset-0 w-full h-full object-cover z-0"
        videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
        onUserMedia={() => {
          console.log("Webcam stream started");
          setIsCameraReady(true);
        }}
        onUserMediaError={(err) => {
          console.error("Webcam stream error:", err);
          if (err.toString().includes("Permission denied") || err.toString().includes("NotAllowedError")) {
            setPermissionDenied(true);
          } else {
            setCameraError(true);
          }
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        width={640}
        height={480}
      />
      
      <div className="absolute inset-0 border-4 border-accent pointer-events-none flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent z-20">
        <div className="text-white font-bold flex items-center gap-2 text-sm">
          <div className={`w-3 h-3 rounded-full ${isCameraReady ? 'bg-accent animate-pulse' : (cameraError || permissionDenied ? 'bg-danger' : 'bg-yellow-500')}`} />
          {permissionDenied ? 'BẠN CHƯA CHO PHÉP CAMERA' : (cameraError ? 'LỖI KHỞI TẠO CAMERA' : (!isCameraReady ? 'ĐANG KHỞI TẠO CAMERA...' : (gesture ? `ĐANG NHẬN DIỆN: ${gesture} TAY` : 'CHỜ CỬ CHỈ...')))}
        </div>
        {permissionDenied && (
          <div className="mt-2 text-[10px] text-white/80 font-medium pointer-events-auto bg-black/40 p-2 rounded-lg">
            <p className="mb-2">Vui lòng nhấn nút bên dưới hoặc biểu tượng camera ở thanh địa chỉ để cấp quyền.</p>
            <button 
              onClick={requestCamera}
              disabled={isRetrying}
              className="w-full bg-accent text-white py-2 rounded-lg font-black uppercase hover:bg-green-600 transition-all disabled:opacity-50"
            >
              {isRetrying ? 'ĐANG THỬ...' : 'BẬT CAMERA NGAY'}
            </button>
          </div>
        )}
        {(cameraError && !permissionDenied) && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 pointer-events-auto bg-danger text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
          >
            TẢI LẠI TRANG
          </button>
        )}
        {isCameraReady && gesture && (
          <div className="text-[#FFF176] text-xs font-bold mt-1">
            Giữ 1.0s để xác nhận...
          </div>
        )}
      </div>

      <AnimatePresence>
        {gesture && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="absolute top-4 right-4 bg-secondary text-text w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg border-2 border-white"
          >
            {gesture}
          </motion.div>
        )}
      </AnimatePresence>

      {holdProgress > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-2 bg-white/20">
          <motion.div
            className="h-full bg-secondary"
            style={{ width: `${holdProgress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default HandTracking;
