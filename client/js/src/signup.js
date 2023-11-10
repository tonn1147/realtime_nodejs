"use strict";
import { serverURL } from "../helpers/config.js";
import redirectTo from "../helpers/redirect.js";

const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const signupURL = serverURL + "api/user/signup";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const username = usernameInput.value;

  if(!email || !password || !username) return;
  const data = {
    email: email,
    username: username,
    password: password,
  };

  signup(data);
});

async function signup(data) {
  try {
    const res = await fetch(signupURL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if(res.status === 400) {
        const {message: errMessage} = await res.json();
        throw new Error(errMessage);
    }

    const result = await res.json();
    alert(JSON.stringify(result));
    redirectTo("login.html");
  } catch (err) {
    alert(err.message);
  }
}