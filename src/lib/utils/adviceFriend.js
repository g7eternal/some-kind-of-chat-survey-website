import { browser } from "$app/environment"; // sveltekit environment
import AdviceFriend from "$lib/elements/AdviceFriend.svelte";

const nullFunction = () => {};

export function showAdviceFriend(content, title = "", sanitize = false) {
  if (!browser) return;

  const root = document.createElement("div");
  root.classList = "fs-6 text-light";

  if (title) {
    const headContent = document.createElement("div");
    headContent.classList = "fs-4";
    headContent[sanitize ? "innerText" : "innerHTML"] = title;
    root.appendChild(headContent);
  }

  const textContent = document.createElement("div");
  textContent[sanitize ? "innerText" : "innerHTML"] = content;
  root.appendChild(textContent);

  const adviceFriend = new AdviceFriend({
    props: {
      content: root,
    },
    target: document.body,
  });

  adviceFriend.$on("hide-advice", () => {
    adviceFriend.$destroy();
  });
}

export function showConfirmAdviceFriend(content, buttonText = "OK", actionCallback = nullFunction) {
  if (!browser) return;

  const root = document.createElement("div");
  root.classList = "d-flex flex-column";

  const textContent = document.createElement("div");
  textContent.innerHTML = content;
  textContent.classList = "fs-6 text-light";
  root.appendChild(textContent);

  const btn = document.createElement("button");
  btn.classList = "btn btn-primary border-dark mt-1 my-auto";
  btn.innerHTML = buttonText;
  btn.addEventListener("click", function () {
    adviceFriend.$destroy();
    actionCallback.call(this, arguments);
  });
  root.appendChild(btn);

  const adviceFriend = new AdviceFriend({
    props: {
      interactive: true,
      content: root,
    },
    target: document.body,
  });

  adviceFriend.$on("hide-advice", () => {
    adviceFriend.$destroy();
  });
}
