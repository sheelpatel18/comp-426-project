"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const api_1 = __importDefault(require("./api/api"));
const minimist_1 = __importDefault(require("minimist"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const args = (0, minimist_1.default)(process.argv.slice(2));
const port = args?.port || 5001;
app.use((0, cors_1.default)());
if (!args['api-only']) {
    console.log('run app route');
    app.route('/app')
        .get((req, res) => {
        // render app from /app folder.
    });
}
app.use('/api', api_1.default);
app.all("/ping", (req, res) => {
    res.status(200).send("PONG");
});
http_1.default.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=app.js.map