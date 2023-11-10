"use strict";
import { serverURL } from "../helpers/config.js";
import getCookie from "../helpers/getCookies.js";

const urlParams = new URLSearchParams(window.location.search);
const topicId = urlParams.get("id");
const headerTitle = document.querySelector(".title");
const roomsList = document.querySelector(".room-list");

const getTopicUrl = `${serverURL}api/chat/topic?id=${topicId}`
const getRoomsByTopic = `${serverURL}api/chat/getRoomsByTopic?id=${topicId}`

console.log(topicId);

async function getTopicAndDisplay() {
    try {
        const topic = await fetch(getTopicUrl, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${getCookie("token")}`,
            },
        });

        const topicJson = await topic.json();

    } catch (error) {
        
    }
}

function displayTopic(topic) {
    headerTitle.innerHTML = topic.name;
}

async function getRoomsAndDisplay() {
    try {
        const topic = await fetch(getRoomsByTopic, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${getCookie("token")}`,
            },
        });

        const RoomsJson = await topic.json();
        RoomsJson.forEach(element => {
            displayRoom(element);
        });
    } catch (error) {
        
    }
}

function displayRoom(room) {
    const roomHTMLstring = `<div class="room"><a href="room.html?id=${room._id}">${room.name}</a></div>`
    roomsList.insertAdjacentHTML("afterbegin",roomHTMLstring);
}