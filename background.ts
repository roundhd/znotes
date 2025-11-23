declare const chrome: any;

// Allows users to open the side panel by clicking the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
    console.log("YouTube Transcript Sync installed");
});