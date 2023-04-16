"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const api_1 = __importDefault(require("./api/api"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.route('/app')
    .get((req, res) => {
    // render app from /app folder.
});
app.use('/api', api_1.default);
app.all("/ping", (req, res) => {
    res.status(200).send("PONG");
});
http_1.default.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=app.js.map