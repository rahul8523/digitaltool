import Pusher from "pusher-js";
import { toast } from "react-toastify";

let pusherInstance = null;
let channelInstance = null;
let audio = null;

export function initPusher(empId) {
  if (!empId) return;
  if (pusherInstance && channelInstance) return;

  audio = new Audio("https://digitalxplode.in/sounds/task.mp3");
  audio.preload = "auto";

  Pusher.logToConsole = true; 

  pusherInstance = new Pusher("b7c70fac15ddf21537d9", {
    cluster: "ap2",
    forceTLS: true
  });

  channelInstance = pusherInstance.subscribe(`tasks.${empId}`);

  channelInstance.bind("pusher:subscription_succeeded", () => {
    console.log("✅ Subscribed to:", `tasks.${empId}`);
  });

  channelInstance.bind("task.created", (data) => {
    console.log("📡 Event received:", data);

    toast.info("🆕 New Task Assigned");

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((e) => console.log("Audio blocked:", e));
    }

    if (Notification.permission === "granted") {
      new Notification("New Task Assigned", {
        body: data?.task?.subject || "You have a new task",
        icon: "/logo.png"
      });
    }
  });
}