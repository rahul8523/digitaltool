/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../api/axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { toast } from 'react-toastify';

dayjs.extend(utc);
dayjs.extend(timezone);

const IST = 'Asia/Kolkata';

const useTaskTimer = (taskId) => {
  const [serverLiveSeconds, setServerLiveSeconds] = useState(0); // server-auth time (stored+running)
  const [isTiming, setIsTiming] = useState(false);
  const [startIso, setStartIso] = useState(null); // for display & resilience
  const syncRef = useRef(null);
  const tickRef = useRef(null);

  const hydrate = async () => {
    if (!taskId) return;
    try {
      const res = await axiosInstance.get(`/tasks/${taskId}/time`);
      const { live_time_till_now, start_time, status } = res.data;

      setServerLiveSeconds(parseInt(live_time_till_now ?? 0, 10));
      setStartIso(start_time || null);
      setIsTiming(Boolean(start_time) && status === 'Working');
    } catch (e) {
      console.error('Hydrate timer failed:', e);
    }
  };

  // Initial + periodic server re-sync (every 60s) to avoid drift
  useEffect(() => {
    hydrate();
    syncRef.current = window.setInterval(hydrate, 60000);
    return () => {
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, [taskId]);

  // Smooth UI tick (client-side) – increments local display each second
  const [displaySeconds, setDisplaySeconds] = useState(0);
  useEffect(() => {
    // Reset display on each hydrate
    setDisplaySeconds(serverLiveSeconds);
  }, [serverLiveSeconds]);

  useEffect(() => {
    if (isTiming) {
      tickRef.current = window.setInterval(() => {
        setDisplaySeconds((prev) => prev + 1);
      }, 1000);
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isTiming]);

  // Re-hydrate when tab becomes active again (survives logout/back/refresh use-cases)
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'visible') hydrate();
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  // Office hour auto-stop at 18:30 IST
useEffect(() => {
  const h = window.setInterval(async () => {
    if (!isTiming) return;
    const now = dayjs().tz(IST);
    if (now.hour() === 18 && now.minute() === 30) {
      try {
        toast.info('Timer stopped automatically at 18:30 IST.');
        // Just change status → backend will accumulate once
        await axiosInstance.put(`/tasks/${taskId}/status`, { status: 'To-do' });
        await hydrate();
      } catch (err) {
        console.error('Auto-stop/status failed:', err);
      }
    }
  }, 1000);
  return () => clearInterval(h);
}, [isTiming, taskId]);

  const startTimer = async () => {
    try {
      await axiosInstance.put(`/tasks/${taskId}/start`);
      await hydrate();
    } catch (e) {
      console.error('Start timer failed:', e);
    }
  };

  const stopTimer = async () => {
    try {
      await axiosInstance.put(`/tasks/${taskId}/stop`);
      await hydrate();
    } catch (e) {
      console.error('Stop timer failed:', e);
    }
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return {
    // authoritative live seconds for display
    seconds: displaySeconds,
    // whether currently timing per server
    isTiming,
    startIso,         // in case you want to show "Started at ..."
    startTimer,
    stopTimer,
    formatTime,
    rehydrate: hydrate
  };
};

export default useTaskTimer;
