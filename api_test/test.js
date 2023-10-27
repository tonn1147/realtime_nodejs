const axios = require("axios");
const http  = require("http");

const urls = ["http://localhost:3000/api/chat/topics"];

// (async function () {
//   try {
//     const res = await testGetMethod(urls[0]);
//     console.log(res);
//   } catch (err) {
//     console.error(err.message);
//   }
// })();

// async function testGetMethod(url) {
//   const data = [];
//   try {
//     const res = await axios.get(url);
//     console.log(res.data);
//     // data.push(res.data);
//   } catch (error) {
//     console.log(error.response.data);
//     console.log(error.response.status);
//     console.log(error.response.headers);
//   }
//   return res.data;
// }


http.get('http://localhost:3000/api/chat/topics').then(resp => {

    console.log(resp.data);
    console.log("done");
});