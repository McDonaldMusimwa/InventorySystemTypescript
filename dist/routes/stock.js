const r = require('express').Router();
r.get('/', (req, res, next) => {
    res.json({ message: "get all the stock route" }); // Use res.send() to send a response
    // Or use res.json() if you want to send JSON data: res.json({ message: "we are connected" });
    // Next middleware or route handler should be called using next()
});
module.exports = r;
//# sourceMappingURL=stock.js.map