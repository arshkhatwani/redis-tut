const express = require("express");
const axios = require("axios");

const app = express();
const API_URL = "https://jsonplaceholder.typicode.com/photos";

async function getImages(albumId) {
    const { data } = await axios.get(API_URL, { params: { albumId } });
    return data;
}

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/images", async (req, res) => {
    const albumId = req.query.albumId != undefined ? req.query.albumId : 1;
    const data = await getImages(albumId);
    res.send(data);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
