const express = require("express");
const axios = require("axios");
const Redis = require("redis");
const cors = require("cors");
const redisClient = Redis.createClient();
const app = express();

const API_URL = "https://jsonplaceholder.typicode.com/photos";
const CACHE_EXPIRE_SECONDS = 60;

app.use(cors());
redisClient.connect();

async function getImages(albumId) {
    try {
        const cache = await redisClient.get(`/photos?albumId=${albumId}`);
        if (cache) {
            // console.log("cache hit");
            return JSON.parse(cache);
        }
        const { data } = await axios.get(API_URL, { params: { albumId } });
        await redisClient.setEx(
            `/photos?albumId=${albumId}`,
            CACHE_EXPIRE_SECONDS,
            JSON.stringify(data)
        );
        return data;
    } catch (error) {
        console.log(error);
    }
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
