const linkRgx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

function escapeHTML (str="") {
  return str.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function parseMessage (message) { // todo: parse emotes?
  return escapeHTML(message).replace(
    linkRgx,
    link => `<a href="${link}" target="_blank">${link}</a>`
  );
}

export function shuffleArray (array) {
  if (!Array.isArray(array)) throw new Error("shuffleArray expects an array! Received: " + typeof array);
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}