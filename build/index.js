"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var middleware = function (req, res, next) {
    var access_token = req.headers.authorization;
    var pc_app = req.headers['x-pc-app'];
    if (access_token) {
        if (pc_app) {
            axios_1.default.get('https://easeauth.cloud.piebits.org/actions/fetch/user', {
                headers: {
                    'Authorization': access_token,
                    'x-pc-app': pc_app
                }
            }).then(function (_a) {
                var data = _a.data;
                var user = __assign({ id: data._id, provider: data.provider, status: data.status }, data.data);
                req.user = user;
                next();
            }).catch(function (_a) {
                var response = _a.response;
                res.status(response.status).send(response.data);
            });
        }
        else {
            res.status(401).send('[x-pc-app] header missing from request');
        }
    }
    else {
        res.status(401).send('[authorization] header missing from request');
    }
};
exports.default = middleware;
