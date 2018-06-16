<template>
  <div>
    <div>
      <el-card class="box-card" v-if="!creating">
        <el-collapse v-model="activeName" accordion v-if="effects.length > 0">
          <el-collapse-item v-for="(effect, idx) in effects" :title="idx + ' - ' + effect.name" :name="effect.name">
            <p v-for="(val, key) in effect">{{ key }}: {{ val }}</p> <el-button @click="onRemoveEffectClick(effect, idx)">Remove</el-button>
          </el-collapse-item>
        </el-collapse>
        <p v-else>You have no effects in this page.</p>
      </el-card>

      <el-button @click.prevent="creating = !creating">New Effect</el-button>
    </div>

    <el-form ref="form" :model="form" label-width="120px" v-if="creating">
      <el-form-item label="Effect">
        <el-select v-model="form.effect" placeholder="Select">
          <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <!-- ------------- -->
      <!-- Playback Rate -->
      <!-- ------------- -->
      <div v-if="form.effect === 'rate'">
        <!-- state -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.rate.state"></el-switch>
        </el-form-item>

        <!-- speed -->
        <el-form-item label="Speed">
          <el-slider v-model="form.rate.amount" show-input :show-stops="true" :min="0" :max="2" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: pitch -->

      <!-- ----- -->
      <!-- pitch -->
      <!-- ----- -->
      <div v-if="form.effect === 'pitch'">
        <!-- state -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.pitch.state"></el-switch>
        </el-form-item>

        <!-- type -->
        <el-form-item label="Pitch Type">
          <el-switch on-text="2" off-text="1" v-model="form.pitch.type"></el-switch>
        </el-form-item>

        <!-- pitch -->
        <el-form-item label="Pitch">
          <el-slider v-model="form.pitch.amount" show-input :show-stops="true" :min="-1" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: pitch -->

      <!-- ------ -->
      <!-- reverb -->
      <!-- ------ -->
      <div v-if="form.effect === 'reverb'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.reverb.state"></el-switch>
        </el-form-item>

        <!-- time -->
        <el-form-item label="Time">
          <el-slider v-model="form.reverb.time" show-input :show-stops="true" :min="0" :max="20" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- decay -->
        <el-form-item label="Decay">
          <el-slider v-model="form.reverb.decay" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- reverse -->
        <el-form-item label="Reverse">
          <el-switch on-text="On" off-text="Off" v-model="form.reverb.reverse"></el-switch>
        </el-form-item>

        <!-- mix -->
        <el-form-item label="Mix">
          <el-slider v-model="form.reverb.mix" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: reverb -->

      <!-- ------- -->
      <!-- tremolo -->
      <!-- ------- -->
      <div v-if="form.effect === 'tremolo'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.tremolo.state"></el-switch>
        </el-form-item>

        <!-- speed -->
        <el-form-item label="Speed">
          <el-slider v-model="form.tremolo.speed" show-input :show-stops="true" :min="0" :max="20" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- depth -->
        <el-form-item label="Depth">
          <el-slider v-model="form.tremolo.depth" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- mix -->
        <el-form-item label="Mix">
          <el-slider v-model="form.tremolo.mix" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: tremolo -->

      <!-- ------- -->
      <!-- flanger -->
      <!-- ------- -->
      <div v-if="form.effect === 'flanger'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.flanger.state"></el-switch>
        </el-form-item>

        <!-- time -->
        <el-form-item label="Time">
          <el-slider v-model="form.flanger.time" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- speed -->
        <el-form-item label="Speed">
          <el-slider v-model="form.flanger.speed" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- depth -->
        <el-form-item label="Depth">
          <el-slider v-model="form.flanger.depth" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- feedback -->
        <el-form-item label="Feedback">
          <el-slider v-model="form.flanger.feedback" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- mix -->
        <el-form-item label="Mix">
          <el-slider v-model="form.flanger.mix" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: flanger -->

      <!-- ----- -->
      <!-- delay -->
      <!-- ----- -->
      <div v-if="form.effect === 'delay'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.delay.state"></el-switch>
        </el-form-item>

        <!-- time -->
        <el-form-item label="Time">
          <el-slider v-model="form.delay.time" show-input :show-stops="true" :min="0" :max="5" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- feedback -->
        <el-form-item label="Feedback">
          <el-slider v-model="form.delay.feedback" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- mix -->
        <el-form-item label="Mix">
          <el-slider v-model="form.delay.mix" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: delay -->

      <!-- --------- -->
      <!-- dub_delay -->
      <!-- --------- -->
      <div v-if="form.effect === 'dub_delay'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.dub_delay.state"></el-switch>
        </el-form-item>

        <!-- time -->
        <el-form-item label="Time">
          <el-slider v-model="form.dub_delay.time" show-input :show-stops="true" :min="0" :max="5" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- feedback -->
        <el-form-item label="Feedback">
          <el-slider v-model="form.dub_delay.feedback" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- cutoff -->
        <el-form-item label="Cutoff">
          <el-slider v-model="form.dub_delay.cutoff" show-input :show-stops="true" :min="0" :max="22050" :step="100"></el-slider> 
        </el-form-item>

        <!-- mix -->
        <el-form-item label="Mix">
          <el-slider v-model="form.dub_delay.mix" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: dub_delay -->

      <!-- --------------- -->
      <!-- ping_pong_delay -->
      <!-- --------------- -->
      <div v-if="form.effect === 'ping_pong_delay'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.ping_pong_delay.state"></el-switch>
        </el-form-item>

        <!-- time -->
        <el-form-item label="Time">
          <el-slider v-model="form.ping_pong_delay.time" show-input :show-stops="true" :min="0" :max="5" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- feedback -->
        <el-form-item label="Feedback">
          <el-slider v-model="form.ping_pong_delay.feedback" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- mix -->
        <el-form-item label="Mix">
          <el-slider v-model="form.ping_pong_delay.mix" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: ping_pong_delay -->

      <!-- ---------- -->
      <!-- distortion -->
      <!-- ---------- -->
      <div v-if="form.effect === 'distortion'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.distortion.state"></el-switch>
        </el-form-item>

        <!-- gain -->
        <el-form-item label="Gain">
          <el-slider v-model="form.distortion.gain" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- mix -->
        <el-form-item label="Mix">
          <el-slider v-model="form.distortion.mix" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: distortion -->

      <!-- ---------- -->
      <!-- quadrafuzz -->
      <!-- ---------- -->
      <div v-if="form.effect === 'quadrafuzz'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.quadrafuzz.state"></el-switch>
        </el-form-item>

        <!-- low gain -->
        <el-form-item label="Low Gain">
          <el-slider v-model="form.quadrafuzz.lowGain" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- mid low gain -->
        <el-form-item label="Mid Low Gain">
          <el-slider v-model="form.quadrafuzz.midLowGain" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- mid high gain -->
        <el-form-item label="Mid High Gain">
          <el-slider v-model="form.quadrafuzz.midHighGain" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- high gain -->
        <el-form-item label="High Gain">
          <el-slider v-model="form.quadrafuzz.highGain" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>

        <!-- mix -->
        <el-form-item label="Mix">
          <el-slider v-model="form.quadrafuzz.mix" show-input :show-stops="true" :min="0" :max="1" :step="0.1"></el-slider> 
        </el-form-item>
      </div> <!-- end: quadrafuzz -->

      <!-- ---------- -->
      <!-- compressor -->
      <!-- ---------- -->
      <div v-if="form.effect === 'compressor'">
        <!-- type -->
        <el-form-item label="State">
          <el-switch on-text="On" off-text="Off" v-model="form.compressor.state"></el-switch>
        </el-form-item>

        <!-- threshold -->
        <el-form-item label="Threshold">
          <el-slider v-model="form.compressor.threshold" show-input :show-stops="true" :min="-100" :max="0" :step="1"></el-slider> 
        </el-form-item>

        <!-- knee -->
        <el-form-item label="Knee">
          <el-slider v-model="form.compressor.knee" show-input :show-stops="true" :min="0" :max="40" :step="1"></el-slider> 
        </el-form-item>

        <!-- attack -->
        <el-form-item label="Attack">
          <el-slider v-model="form.compressor.attack" show-input :show-stops="false" :min="0" :max="1" :step="0.001"></el-slider> 
        </el-form-item>

        <!-- release -->
        <el-form-item label="Release">
          <el-slider v-model="form.compressor.release" show-input :show-stops="false" :min="0" :max="1" :step="0.001"></el-slider> 
        </el-form-item>

        <!-- ratio -->
        <el-form-item label="Ratio">
          <el-slider v-model="form.compressor.ratio" show-input :show-stops="true" :min="1" :max="20" :step="1"></el-slider> 
        </el-form-item>
      </div> <!-- end: compressor -->
  

      <el-form-item>
        <el-button @click.prevent="onCreateClick">Create</el-button>
      </el-form-item>
    </el-form>

    <pre>
      {{ effects }}
    </pre>
  </div>
</template>

<script>
export default {
  mounted() {
    chrome.runtime.onMessage.addListener((request, sender) => {
      console.log('REQUEST AT APP.vue', request);

      if (request && request.popup) {
        if (request.popup.command === 'updateEffects') {
          this.effects = request.popup.effects;
          console.log('updated effects');
        }
      }
    });

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'getEffects' }, (response) => {
        if (response) {
          this.effects = response.effects;
        }
      });
    });
  },
  data() {
    return {
      effects: [],
      creating: false,
      form: {
        effect: '',
        rate: {
          state: true,
          amount: -1,
        },
        pitch: {
          state: true,
          amount: 0,
          type: false
        },
        reverb: {
          state: true,
          time: 0,
          decay: 0,
          reverse: false,
          mix: 0.5,
        },
        tremolo: {
          state: true,
          speed: 0,
          depth: 0,
          mix: 0.5,
        },
        flanger: {
          state: true,
          time: 0,
          speed: 0,
          depth: 0,
          feedback: 0,
          mix: 0.5,
        },
        delay: {
          state: true,
          time: 0,
          feedback: 0,
          mix: 0.5,
        },
        dub_delay: {
          state: true,
          time: 0,
          cutoff: 0,
          feedback: 0,
          mix: 0.5,
        },
        ping_pong_delay: {
          state: true,
          time: 0,
          feedback: 0,
          mix: 0.5,
        },
        distortion: {
          state: true,
          gain: 0,
          mix: 0.5,
        },
        quadrafuzz: {
          state: true,
          lowGain: 0.6,
          midLowGain: 0.8,
          midHighGain: 0.5,
          highGain: 0.6,
          mix: 0.5,
        },
        compressor: {
          state: true,
          threshold: 0,
          knee: 0,
          attack: 0,
          release: 0,
          ratio: 1,
        },
      },
      options: [
        {
          label: 'Playback Rate',
          value: 'rate'
        },
        {
          label: 'Pitch',
          value: 'pitch'
        },
        {
          label: 'Reverb',
          value: 'reverb'
        },
        {
          label: 'Tremolo',
          value: 'tremolo'
        },
        {
          label: 'Flanger',
          value: 'flanger'
        },
        {
          label: 'Delay',
          value: 'delay'
        },
        {
          label: 'Dub Delay',
          value: 'dub_delay'
        },
        {
          label: 'Ping-Pong Delay',
          value: 'ping_pong_delay'
        },
        {
          label: 'Distortion',
          value: 'distortion'
        },
        {
          label: 'Quadrafuzz',
          value: 'quadrafuzz'
        },
        {
          label: 'Compressor',
          value: 'compressor'
        },
      ]
    };
  },
  methods: {
    onRemoveEffectClick(effect, idx) {
      const data = { 
        command: 'removeEffect', 
        effect: effect,
        idx: idx,
      };

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, data, (response) => {
          console.log('resp', response);
        });
      });
    },
    onCreateClick() {
      const data = { 
        command: 'createEffect', 
        effect: this.form[this.form.effect],
      };

      data.effect.name = this.form.effect;

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, data, (response) => {
          console.log('resp', response);
          this.creating = false;
        });
      });
    },
  },
};
</script>

<style>
body {
  width: 500px;
  height: 500px;
}
</style>
