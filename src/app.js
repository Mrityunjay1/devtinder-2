const express = require('express');

const app = express();

app.use("/", (res, req) => {
    res.send('Hello World!');
})

app.use("/api", (res, req) => {
    res.send('Hello API!');
})

app.listen(7000, () => {
    console.log('Server is running on port 7000');
});