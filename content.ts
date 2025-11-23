/**
 * This script runs in the context of the YouTube page.
 * It listens for video time updates and sends them to the extension side panel.
 */

export {}; // Treat as module to avoid global scope conflict

declare const chrome: any;

let videoElement: HTMLVideoElement | null = null;
let updateInterval: number | null = null;

// Helper to find the main video player
function findVideoElement(): HTMLVideoElement | null {
  return document.querySelector('video');
}

// Function to start monitoring
function startMonitoring() {
  if (updateInterval) clearInterval(updateInterval);
  
  videoElement = findVideoElement();
  
  if (!videoElement) {
    // Retry shortly if video not found (loading state)
    setTimeout(startMonitoring, 1000);
    return;
  }

  // Use 'timeupdate' event for performance, but fallback to interval if needed
  videoElement.addEventListener('timeupdate', handleTimeUpdate);
  
  // Also hook into navigation events (SPA navigation in YouTube)
  // MutationObserver could be used here for more robustness on YT
}

function handleTimeUpdate() {
  if (!videoElement) return;
  
  // Send message to runtime (Side Panel)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    chrome.runtime.sendMessage({
      type: 'VIDEO_UPDATE',
      payload: {
        currentTime: videoElement.currentTime,
        isPlaying: !videoElement.paused,
        videoId: videoId
      }
    }).catch(() => {
        // Connection lost (side panel closed), ignore
    });
  } catch (e) {
    // Extension context invalidated
  }
}

// Listen for messages from the Side Panel (e.g., Seek command)
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === 'REQUEST_STATUS') {
     handleTimeUpdate(); // Force an update immediately
  }
  
  if (message.type === 'SEEK_VIDEO' && message.payload?.time) {
    const video = findVideoElement();
    if (video) {
        video.currentTime = message.payload.time;
        video.play();
    }
  }
});

// Initialize
// YouTube is a Single Page App, so we need to watch for URL changes or DOM updates
// Simple polling for video element presence for this demo:
setInterval(() => {
    if (!videoElement || !videoElement.isConnected) {
        startMonitoring();
    }
}, 2000);

startMonitoring();