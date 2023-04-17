<script>
  import { browser } from "$app/environment"; // sveltekit environment
  import { onMount, createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { blur, fly, scale } from "svelte/transition";
  import { Confetti } from "svelte-confetti";
  import { sounds } from "$lib/utils/sounds";
  import { raffle } from "$lib/utils/raffle";
  import { shuffleArray } from "$lib/utils/misc";
  import UserImage from "./UserImage.svelte";
  import UserProfileLink from "./UserProfileLink.svelte";

  const dispatch = createEventDispatcher();

  const timings = {
    step: 2,
    slowdown: 40,
    last: 90,
    stop: 210,
  };

  /*
  // debug - faster spin
  const timings = {
    step: 5,
    slowdown: 40,
    last: 100,
    stop: 111
  };
  */

  let items = [];
  let scrollIndex = writable(0);

  const itemNodes = [];
  let elementContainer;

  function reorderElements(index) {
    if (!elementContainer) return;

    // this is some waytoodank shit
    const isPortraitMode = window.innerHeight > window.innerWidth;
    const indexOffset = isPortraitMode ? -1 : 0;
    const hardOffset = isPortraitMode ? 92.5 : 97.5;
    const offsetPerIndex = isPortraitMode ? 33 : 20;
    const offsetConstant = hardOffset + Math.floor(offsetPerIndex / 2);
    const scaleBreakpoint = isPortraitMode ? 207.5 : 147.5;

    itemNodes.forEach((el, i) => {
      let relativeIndex = i - (index % itemNodes.length) + 2;

      let offset = offsetConstant + (relativeIndex - indexOffset) * offsetPerIndex;
      offset -= itemNodes.length * offsetPerIndex * Number(relativeIndex >= itemNodes.length / 2);
      offset += itemNodes.length * offsetPerIndex * Number(relativeIndex < -itemNodes.length / 2);

      const scale = Math.min(
        1,
        Math.pow(1 - (0.6 * Math.abs(offset - scaleBreakpoint)) / scaleBreakpoint, 4)
      );
      const winnerScale = isSpinEnded ? 1.3 : 1;

      const conformedOffset = offset;

      el.style.left = conformedOffset + "%";
      el.style.transform = `scale(${scale * 1 * winnerScale}) translateX(${
        50 * (scale * winnerScale - 1)
      }%)`;
      el.style.visibility =
        offset < 40 || offset > 250 + Number(isPortraitMode) * 50 ? "hidden" : "visible";
      el.style.zIndex = Math.round(100 * scale);
      el.style.opacity = isSpinEnded ? Number(scale === 1) : 0.5 + 0.5 * scale;
    });
  }
  scrollIndex.subscribe((value) => {
    reorderElements(value);
  });

  function scrollElements(delta) {
    $scrollIndex = ($scrollIndex + delta) % items.length;
    sounds.roll.forcePlay();
  }

  window.addEventListener(
    "resize",
    () => {
      reorderElements($scrollIndex);
    },
    { passive: true }
  );

  let lastTorque = null,
    isSpinEnded = false;
  onMount(() => {
    if (!browser) return;
    isSpinEnded = false;

    items.length = 0;
    while (items.length < 20) {
      items = items.concat(Array.from($raffle.entrants.values()));
    }
    items = shuffleArray(items.map((user) => $raffle.entries.get(user)));
    reorderElements(0);

    sounds.start.play();
    sounds.rollmany.play();

    let delay = 1;
    const timing = Object.assign({}, timings);

    const tFactor = 3; // used to be a calculated param based on projected browser fps
    timing.step /= tFactor;

    // torque is a step of animation
    const torque = () => {
      delay += timings.step;
      if (delay > timing.slowdown) delay += 2 * timings.step;
      if (delay > timing.last) {
        delay += 5 * timings.step;
        sounds.suspense.play();
      }
      if (delay > timing.stop) {
        lastTorque = setTimeout(spinEnded, 1000);
        sounds.suspense.stop();
        sounds.end.play();
        return;
      }
      scrollElements(1);
      lastTorque = setTimeout(torque, 100 + delay);
    };
    torque();

    return () => {
      clearTimeout(lastTorque);
    };
  });

  function spinEnded() {
    isSpinEnded = true;
    const chosenElement = items[$scrollIndex];
    console.info("Winner:", chosenElement);
    // play sound
    sounds.win.play();
    // hide non-winners
    itemNodes.forEach((item, idx) => {
      if (idx !== $scrollIndex) {
        item.style.opacity = 0;
      } else {
        reorderElements($scrollIndex);
      }
    });
  }

  function stopSpin() {
    const chosenElement = items[$scrollIndex];
    $raffle.getWinner(chosenElement.username);
    dispatch("drawn", chosenElement);
    isSpinEnded = false; // stops confetti
  }
</script>

<div class="carousel">
  {#if items.length > 0}
    <div class="elements" bind:this={elementContainer} in:blur={{ duration: 1000, amount: 10 }}>
      <div class="elements-inner">
        {#each items as entry, i}
          <div class="project-square" bind:this={itemNodes[i]}>
            <div class="project-icon" style:border-bottom-color={entry.usercolor || "gray"}>
              <UserImage user={entry.username} h="300px" w="300px" color={entry.usercolor} />
            </div>
            <div class="username-caption">
              <UserProfileLink user={entry.username}>
                {entry.author}
              </UserProfileLink>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="spinner-border text-secondary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  {/if}
</div>

{#if isSpinEnded}
  <div class="glower" in:scale={{ duration: 500 }} />

  <div class="panel" transition:fly={{ duration: 1000, y: 300 }}>
    <button class="btn btn-success" on:click={stopSpin}> Nice! </button>
  </div>

  <!-- confetti -->
  <div class="confetti">
    <Confetti
      x={[-5, 5]}
      y={[0, 0.1]}
      delay={[0, 2000]}
      colorArray={["yellow", "lime", "green", "yellow"]}
      size="12"
      infinite
      duration="5000"
      amount="100"
      fallDistance="100vh"
    />
  </div>
{/if}

<style>
  .carousel {
    flex: 1 0 auto;
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0 auto;
    position: relative;
    z-index: 20;
  }
  .elements {
    color: black;
    width: 100%;
  }
  .elements-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform: translate(-100%, 25%);
  }

  .project-square {
    position: absolute;
    top: 0;
    left: 0;
    width: 40%;
    height: 50%;
    min-width: 40%;
    transition: all 0.4s ease;
    color: white;
  }
  .project-square::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  .project-icon {
    width: 300px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 1em;
    transform: translateX(-50%);
    transition: filter 0.1s ease;
    filter: none;
    color: transparent;
    user-select: none;
    pointer-events: none;
    border-bottom: 4px solid gray;
    display: flex;
  }

  .username-caption {
    transform: translateX(-50%);
    font-size: 24px;
    opacity: 0.8;
    text-align: center;
    text-shadow: 0px 0px 4px black;
  }

  .glower {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    z-index: 15;
    border-radius: 50%;
    opacity: 0.25;
    width: 100px;
    height: 100px;
    background-color: rgb(250, 255, 186);
    box-shadow: 0px 0px 160px 160px rgb(250, 255, 186);
    animation: glow 1.5s linear infinite alternate;
  }
  @keyframes glow {
    to {
      opacity: 0.35;
      background-color: rgb(215, 211, 99);
      box-shadow: 0px 0px 180px 180px rgb(215, 211, 99);
      width: 120px;
      height: 120px;
    }
  }

  .panel {
    position: fixed;
    width: 100%;
    z-index: 21;
    height: auto;
    bottom: 8%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  }
  .panel button {
    font-weight: bold;
    font-size: 32px;
  }

  .confetti {
    position: fixed;
    top: -50px;
    z-index: 19;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
  }

  @media all and (orientation: portrait) {
    .elements-inner {
      transform: translate(-163.5%, 20%);
    }
    .project-square {
      width: 50%;
      min-width: 50%;
    }
    .panel button {
      width: unset;
      max-width: unset;
      flex: 1 0 auto;
    }
    .glower {
      top: 32%;
    }
  }
</style>
