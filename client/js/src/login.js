import { serverURL } from "../helpers/config.js";
import redirectTo from "../helpers/redirect.js";
import isUser from "../helpers/isUser.js";

const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginURL = serverURL + "api/user/login";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if(!email || !password) return;
  const data = {
    email: email,
    password: password,
  };

  login(data);
});

async function login(data) {
  try {
    const res = await fetch(loginURL, {
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
    const dateExpire = new Date().setDate(new Date() + 1);
    document.cookie = `token=${result.token}; expires=${dateExpire};path=/`;
    
    await isUser();
    redirectTo("homePage.html");
  } catch (err) {
    console.error(err);
    redirectTo("404.html");
  }
}

