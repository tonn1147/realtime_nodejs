"use strict";
import getCookie from "../helpers/getCookies.js";
import { serverURL } from "../helpers/config.js";

const form = document.getElementById("form");
const searchInput = document.getElementById("search");
const typeInput = document.getElementById("type");
const resultSection = document.querySelector(".result");
const welcomeUser = document.querySelector(".welcome-user");

const searchUrl = serverURL + "api/chat/search";
const username = localStorage.getItem("username");

welcomeUser.innerHTML = `Welcome back! ${username}`;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("hello");
  const searchValue = searchInput.value;
  const typeValue = typeInput.value;
  if (!searchValue) return;

  search(searchUrl, searchValue, typeValue);
  searchInput.value = "";
});

async function search(url, q, type = "room") {
  try {
    const res = await fetch(returnQueryUrlString(url, q, type), {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${getCookie("token")}`,
      },
    });
    const data = await res.json();
    console.log(data);
    displayListRoomOrTopic(data.result, type);
  } catch (error) {
    console.log(error.message);
  }
};

function returnQueryUrlString(url, search, type) {
  return `${url}?search=${search}&type=${type}`;
}

function displayListRoomOrTopic(objs, type) {
  objs.forEach((element) => {
    if (type === "room") {
      const html = `<div class="result"><a href="room.html?id=${element._id}">${element.name}</a></div>`;
      resultSection.insertAdjacentHTML("afterbegin", html);
    } else {
      const html = `<div class="result"><a href="topic.html?id=${element._id}">${element.name}</a></div>`;
      resultSection.insertAdjacentHTML("afterbegin", html);
    }
  });
}
