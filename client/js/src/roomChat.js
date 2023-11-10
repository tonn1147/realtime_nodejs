"use strict";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import getCookie from "../helpers/getCookies.js";
import isUser from "../helpers/isUser.js";
import redirectTo from "../helpers/redirect.js";

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("id");
const chatSection = document.querySelector(".chat--display-message");
const form = document.querySelector("form");
const inputText = document.querySelector(".form__input--text");
const inputImage = document.querySelector(".form__input--image")(
  async function () {
    if (!(await isUser())) redirectTo("login.html");

    const currentUsername = localStorage.getItem("username");
    const currentUserId = localStorage.getItem("userId");

    const socket = io("http://localhost:3000/");
    socket.on("connect", () => {
      console.log("you are connected with" + socket.id + ":" + currentUserId);
      displayMessage(
        `you are connected with id ${socket.id}: ${currentUserId}`,
        currentUsername
      );
      socket.emit("join-room");
      socket.emit("get-all-messages", roomId);
    });

    socket.on("return-all-messages", async (messages) => {
      messages.foreach((message) => {
        if (message.type === "image")
          displayImage(message.context, message.user_id);
        else displayMessage(message.context, message.user_id);
      });
      scrollToBottom();
    });

    socket.on("receiving-message", (message) => {
      if (message.type === "image")
        displayImage(message.context, message.user_id);
      else displayMessage(message.context, message.user_id);
      scrollToBottom();
    });

    socket.on("user-left", () => {
      displayMessage("has left the chat", currentUserId);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const reader = new FileReader();

      const textMessage = inputText.value;
      const imageMessage = inputImage.files[0];

      if (!textMessage || !imageMessage) {
        alert("pls enter a message!");
        return;
      }

      if (imageMessage) {
        reader.readAsDataURL(imageMessage);
        reader.onload = function () {
          const img = reader.result;
          socket.emit("sending-message", img, currentUserId, (type = "image"));
          imageMessage.value = "";
        };
      } else {
        socket.emit(
          "sending-message",
          textMessage,
          currentUserId,
          (type = "text")
        );
        textMessage.value = "";
        inputImage.value = "";
      }
      // displayMessage(message);
    });
  }
)();

//code start

function displayMessage(message, user = "user") {
  const sended_message = `<div class="message"><em>${user}</em>:<p>${message}</p><hr></div>`;
  chatSection.insertAdjacentHTML("beforeend", sended_message);
}

function displayImage(url, user = "user") {
  const sended_message = `<div class="image"><em>${user}</em>:<image src="${url}" alt="image"><hr></div>`;
  chatSection.insertAdjacentHTML("beforeend", sended_message);
}

function scrollToBottom() {
  chatSection.scrollTop = chatSection.scrollHeight;
}
