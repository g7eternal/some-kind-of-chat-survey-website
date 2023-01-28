<script>
  import { scale } from "svelte/transition";

  export let color = "#ffff00";
  export let h = "auto", w = "";
  export let animate = false;
</script>

<style>
  @keyframes rainbow {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }
  .animate {
    animation: rainbow 4s linear infinite alternate;
  }

  .donk {
    position: relative;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .backlay {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }
  .overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
  }
</style>

<div class="donk" style:width={w || h} style:height={h} in:scale={{duration:200}}>
  <div class="donk backlay">
    <img src="favicon.png" alt="">
  </div>
  <div class="donk overlay" class:animate={animate}>
    <svg style:width={w} height={h} viewBox="0 0 52.916666 52.916666">
      <!-- generated with InkScape, check /img/portrait-overlay.svg -->
      <path
        style={`fill:${color};stroke:#bd8600;stroke-width:1;stroke-linecap:round;stroke-linejoin:round`}
        d="M 15.424327,24.164035 C 19.974583,21.057318 26.608233,1.6954778 29.938073,2.4965348 c 2.473955,-0.8163654 5.804713,7.1264231 7.92798,10.6073802 1.789498,2.933766 11.073683,5.239372 11.263759,10.935701 -2.513009,-1.848429 -30.288987,3.767245 -33.705485,0.124419 z"
        />
      <path
        style={`fill:${color};fill-opacity:1;stroke:#bd8600;stroke-width:1;stroke-linecap:round;stroke-linejoin:round`}
        d="m 10.121134,37.082473 c 12.828566,2.79951 20.95274,1.40763 32.574739,1.190722 3.881811,2.608984 3.528564,6.629654 2.72165,10.801546 -11.423429,-0.161946 -23.895524,-0.663509 -41.863057,0.357908 0,-4.025773 0.7831628,-11.981619 6.566668,-12.350176 z"
        />
    </svg>
  </div>
</div>