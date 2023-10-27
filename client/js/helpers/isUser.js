import { serverURL } from "./config.js";
import getCookie from "./getCookies.js";
const currentUserApiUrl = `${serverURL}api/user/current`

async function isCurrentUser(token) {
  try {
    const res = await fetch(currentUserApiUrl, {
      method: "get",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    const username = result.user;
    const userId = result.user_id;
    localStorage.setItem("username",username);
    localStorage.setItem("userId",userId);

    console.log(username);
  } catch (err) {
    console.log(err.message);
    window.location.href = "login.html";
  }
}

export default async function isUser() {
  const token = getCookie("token");
  if (token) {
    // Use the token for authentication or other purposes
    console.log("Token:", token);
    await isCurrentUser(token);
    return true;
  } else {
    console.error("Token not found in cookies.");
    return false;
  }
}