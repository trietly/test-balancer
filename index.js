const express = require("express");
const app = express();
const balancer = require("./api/balancer.js");

app.use("/api/balancer", balancer);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
