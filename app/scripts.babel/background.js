'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

// chrome.browserAction.setBadgeText({text: 'disabled'});

console.log('\'Allo \'Allo! Event Page for Browser Action');

