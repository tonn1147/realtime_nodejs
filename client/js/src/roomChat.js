import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import getCookie from "../helpers/getCookies.js";
import isUser from "../helpers/isUser.js";
import redirectTo from "../helpers/redirect.js";

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("id");
const chatSection = document.querySelector(".chat--display-message");
const form = document.querySelector("form");
const inputMessage = document.querySelector(".form__input--message");

(async function () {
  if (!(await isUser())) redirectTo("login.html");

  const currentUsername = localStorage.getItem("username")

  const socket = io("http://localhost:3000/");
  socket.on("connect", () => {
    console.log("you are connected with" + socket.id);
    displayMessage(`you are connected with id ${socket.id}`, currentUsername);
    socket.emit("get-all-messages", roomId);
  });

  socket.on("return-all-messages", (messages) => {
    messages.foreach((message) => {
      displayMessage(message);
    });
    scrollToBottom();
  });

  socket.on("receiving-message", (message) => {
    displayMessage(message);
    scrollToBottom();
  });

  socket.on("user-left", () => {
    displayMessage("has left the chat");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = inputMessage.value;
    if (!message) return;
    // displayMessage(message);
    socket.emit("sending-message", message);
    inputMessage.value = "";
  });
})();

//code start

function displayMessage(message, user = currentUser) {
  const sended_message = `<div class="message"><em>${user}</em>:<p>${message}</p><hr></div>`;
  chatSection.insertAdjacentHTML("beforeend", sended_message);
}

function displayImage(url, user = currentUser) {
  const sended_message = `<div class="image"><em>${user}</em>:<image src="${url}" alt="image"><hr></div>`;
  chatSection.insertAdjacentHTML("beforeend", sended_message);
}

function scrollToBottom() {
  chatSection.scrollTop = chatSection.scrollHeight;
}
