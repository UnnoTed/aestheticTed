import PitchShift from 'soundbank-pitch-shift';
import Pizzicato from 'pizzicato';
import reverbjs from '../scripts/reverb.js';
import { watch } from 'melanke-watchjs';
import Reverb from 'soundbank-reverb';
import Jungle from '../scripts/jungle.js';
// var rev = require('./rev.js');
import rev from 'raw-loader!../Library/FalklandPalaceRoyalTennisCourt.wav.base64';

// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function createReverb(node, ctx) {
  reverbjs.extend(ctx);
  const reverbNode = ctx.createReverbFromBase64(rev, () => {
    reverbNode.connect(ctx.destination);
  });

  node.connect(reverbNode);
}

function createPitch(node, ctx) {
  var pitchShift = PitchShift(ctx);
  pitchShift.transpose = -9;
  pitchShift.wet.value = 1;
  pitchShift.dry.value = 0;  
  pitchShift.connect(ctx.destination);
}

const minifyMap = {
  rate: {
    0: 'state',
    1: 'amount',
  },
  pitch: {
    0: 'state',
    1: 'amount',
    2: 'type',
  },
  reverb: {
    0: 'state',
    1: 'time',
    2: 'decay',
    3: 'reverse',
    4: 'mix',
  },
  tremolo: {
    0: 'state',
    1: 'speed',
    2: 'depth',
    3: 'mix',
  },
  flanger: {
    0: 'state',
    1: 'time',
    2: 'speed',
    3: 'depth',
    4: 'feedback',
    5: 'mix',
  },
  delay: {
    0: 'state',
    1: 'time',
    2: 'feedback',
    3: 'mix',
  },
  dub_delay: {
    0: 'state',
    1: 'time',
    2: 'cutoff',
    3: 'feedback',
    4: 'mix',
  },
  ping_pong_delay: {
    0: 'state',
    1: 'time',
    2: 'feedback',
    3: 'mix',
  },
  distortion: {
    0: 'state',
    1: 'gain',
    2: 'mix',
  },
  quadrafuzz: {
    0: 'state',
    1: 'lowGain',
    2: 'midLowGain',
    3: 'midHighGain',
    4: 'highGain',
    5: 'mix',
  },
  compressor: {
    0: 'state',
    1: 'threshold',
    2: 'knee',
    3: 'attack',
    4: 'release',
    5: 'ratio',
  },
};

class Minifier {
  constructor(map) {
    this.map = map;
  }

  parse(data) {
    data = JSON.parse(data);
    const list = [];

    data.forEach((val) => {
      const fx = {
        name: val[0],
      };
      val = val.slice(1);

      Object.keys(this.map[fx.name]).sort().forEach((key) => {
        fx[this.map[fx.name][key]] = val[key];
      });

      list.push(fx);
    });

    return list;
  }

  compile(fx) {
    const data = [];

    fx.forEach((val, idx) => {
      const values = [`${val.name}`];

      Object.keys(this.map[val.name]).sort().forEach((key) => {
        if (key === 'name') {
          return;
        }

        values.push(val[this.map[val.name][key]]);
      });

      data.push(values);
    });

    return JSON.stringify(data);
  }
}

//const aesthetics = '[["reverb",true,0,0,false,0.5],["tremolo",true,0,0,0.5],["delay",true,0,0,0.5],["quadrafuzz",true,0.6,0.8,0.5,0.6,0.5]]';

class Aesthetics {
  constructor() {
    this.default = '[["rate",true,0.5],["pitch",true,-1,2],["delay",true,0.85,0.1,0.1],["reverb",true,1,2,false,0.5]]';
    this.current = [];
    this.effects = [];
    this.minifier = new Minifier(minifyMap);
  }

  process(aes) {
    if (!aes) {
      console.log('aesthetics: from param(aesthettics)', this.aesthettics, aes);
      this.aesthetics = getParameterByName('aesthetics');

    } else {
      this.aesthetics = this.minifier.compile(aes);
      console.log(`aesthetics: from process(${this.aesthetics})`);
    }

    if (!this.aesthetics || this.aesthetics.length === 0) {
      console.log('aesthetics: nothing to process');
      return;
    }

    console.log('aesthetics: processing', this.aesthetics);

    this.copyEffects(this.minifier.parse(this.aesthetics));
    console.log('PARSED', this.effects);
    console.log('COMPILED', this.minifier.compile(this.effects));

    console.log('aesthetics:start');
    const video = document.querySelector('video');
    console.log(video);

    if (!this.node) {
      Pizzicato.context = new AudioContext();
      this.node = Pizzicato.context.createMediaElementSource(video);
    }

    video.playbackRate = parseFloat(1);

    this.effects.forEach((fx, idx) => {
      console.log('aesthetics', `added ${fx.name}`, fx);

      const isPizzicato = ([
        'delay', 'dub_delay', 'ping_pong_delay', 
        'tremolo', 'flanger', 'distortion', 
        'quadrafuzz', 'compressor',
      ].indexOf(fx.name) !== -1);
      let effect;

      // playback rate
      if (fx.name === 'rate') {
        video.playbackRate = parseFloat(fx.amount);

        // cancels effect insertion
        return;

        // reverb
      } else if (fx.name === 'reverb') {
        reverbjs.extend(Pizzicato.context);
        effect = Pizzicato.context.createReverbFromBase64(rev, () => {});

        // tremolo
      } else if (isPizzicato) {
        effect = new Pizzicato.Effects[fx.name.charAt(0).toUpperCase() + fx.name.slice(1)](fx);

        // pitch
      } else if (fx.name === 'pitch') {
        if (fx.type === 1) {
          effect = PitchShift(Pizzicato.context);
          effect.transpose = fx.amount;
          effect.wet.value = 1;
          effect.dry.value = 0;

        } else {
          effect = new Jungle(Pizzicato.context);
          effect.setPitchOffset(fx.amount, false);
          effect.isJungle = true;

          console.log('jungle', effect);
        }
      }

      effect.idx = idx;

      if (this.current.length === 0) {
        this.node.connect(effect.isJungle ? effect.input : effect);

      } else {
        const before = this.current[this.current.length-1];

        if (before.isJungle) {
          before.output.connect(effect);

        } else {
          before.connect(effect.isJungle ? effect.input : effect);
        }
      }

      this.current.push(effect);
    });

    console.log('this.current', this.current, this.current.length, this.current[this.current.length-1]);
    
    if (this.current.length > 0) {
      if (this.current[this.current.length-1].isJungle) {
        this.current[this.current.length-1].output.connect(Pizzicato.context.destination);

      } else {
        this.current[this.current.length-1].connect(Pizzicato.context.destination);
      }
    } else {
      this.node.connect(Pizzicato.context.destination);
      this.isNodeConnected = true;
    }

    console.log('aesthetics: done');
  }

  remove() {
    if (!this.current || this.current.length === 0) {
      return;
    }

    if (this.current[this.current.length-1].isJungle) {
      this.current[this.current.length-1].output.disconnect(Pizzicato.context.destination);

    } else {
      this.current[this.current.length-1].disconnect(Pizzicato.context.destination);
    }

    for (let i = this.current.length-1; i > 0; i -= 1) {
      const effect = this.current[i];
      console.log('RUNNING THROUGH EFFECTS', effect, this.current, this.current.length, i);

      if (this.current.length === 0 || i === 0) {
        this.node.disconnect(effect.isJungle ? effect.input : effect);

      } else {
        const before = this.current[i-1];

        if (before.isJungle) {
          before.input.disconnect(effect);

        } else {
          before.disconnect(effect.isJungle ? effect.output : effect);
        }
      }

      this.current = this.current.slice(0, i);
    }

    if (this.isNodeConnected) {
      this.node.disconnect(Pizzicato.context.destination);
      this.isNodeConnected = false;
    }

    this.current = [];
  }

  copyEffects(fx) {
    this.effects = fx;
    chrome.runtime.sendMessage({
      popup: {
        command: 'updateEffects',
        effects: this.effects,
      },
    });
  }

  addEffect(fx) {
    this.effects.push(fx);
    chrome.runtime.sendMessage({
      popup: {
        command: 'updateEffects',
        effects: this.effects,
      },
    });
  }

  removeEffect(fx, idx) {
    let list = this.effects;

    const first = list.slice(0, idx);
    const last = list.slice(idx+1, list.length);
    console.log(first, last);

    list = first.concat(last);
    this.effects = list;
    this.remove();
  }
}

const a = new Aesthetics();
a.process();

function removeParameter(url, parameter) {
  var urlparts= url.split('?');

  if (urlparts.length >= 2) {
    var urlBase=urlparts.shift(); //get first part, and remove from array
    var queryString=urlparts.join("?"); //join it back up

    var prefix = encodeURIComponent(parameter) + '=';
    var pars = queryString.split(/[&;]/g);
    for (var i = pars.length; i-- > 0;) {               //reverse iteration as may be destructive
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {   //idiom for string.startsWith
        pars.splice(i, 1);
      }
    }
    url = urlBase+'?'+pars.join('&');
  }
  return url;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('on message', request);
  if (!request || typeof request['command'] === 'undefined') {
    console.log('request without command');
    return;
  }

  const changeURL = () => {
    const compiled = new Minifier(minifyMap).compile(a.effects);
    console.log('COMPILED', compiled);

    const newurl = removeParameter(window.location.href, 'aesthetics') + 
      `${window.location.search === '' ? '?' : '&'}aesthetics=${compiled}`;

    console.log('newurl', newurl);
    window.history.pushState({ path: newurl }, '', newurl);
  };

  if (request.command === 'createEffect') {
    a.remove();
    a.addEffect(request.effect);

    changeURL();
    a.process();

  } else if (request.command === 'applyEffects' || request.command === 'removeEffect') {
    if (request.command === 'removeEffect') {
      console.log('REMOVING EFFECT', request.idx, a.effects);
      a.removeEffect(request.effect, request.idx);
      console.log('REMOVED EFFECT', request.idx, a.effects);

    } else {
      console.log('aesthetics -> applyEffects');
      a.remove();
    }

    changeURL();
    a.process();

    console.log('aesthetics: processed', request.command);
  } else if (request.command === 'getEffects') {
    sendResponse({ effects: a.effects });
  }
});

