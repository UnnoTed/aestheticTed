import Vue from 'vue';
import App from './templates/App.vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

console.log('\'Allo \'Allo! Popup');

document.querySelectorAll('#ok')[0].addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { command: 'applyEffects' }, (response) => {
      console.log('resp', response);
    });
  });
});

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render: h => h(App),
  data: {
    message: 'Hello Vue.js!'
  }
});
