const express = require("express");



const configRoutes = require("./routes");

const app = express();


configRoutes(app);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});