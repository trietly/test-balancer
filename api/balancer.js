const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const router = express.Router();
const axios = require("axios");

const servers = JSON.parse(String(process.env.UPSTREAM_SERVERS));

let current = 0,
  server;

const handler = async (req, res) => {
  try {
    const { method, headers, body: data, query } = req;
    server = servers[current];

    const response = await axios({
      url: `${server}/proxy?url=${query.url}&src=${query.src}`,
      method,
      headers,
      data,
      responseType: "stream",
    });
    console.log(`proxy to  ${server} succeeded`);

    current === servers.length - 1 ? (current = 0) : current++;

    return response.data.pipe(res)
    // return res.send(server);
  } catch (error) {
    console.error(`proxy to ${server} failed`, error);

    if (current === servers.length - 1) {
      res.status(500).send("Server error");
    } else {
      handler(req, res);
    }
  }
};

router.get("/", handler);

module.exports = router;
