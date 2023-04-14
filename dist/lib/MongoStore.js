"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoStore = void 0;
var fs = __importStar(require("fs"));
var mongoose_1 = require("mongoose");
var adm_zip_1 = __importDefault(require("adm-zip"));
var MongoStore = /** @class */ (function () {
    function MongoStore(_a) {
        var mongoose = _a.mongoose;
        if (!mongoose)
            throw new Error('A valid Mongoose instance is required for MongoStore.');
        this.mongoose = mongoose;
    }
    MongoStore.prototype.isConnectionReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.mongoose.connection.readyState !== 1)) return [3 /*break*/, 7];
                        _a = this.mongoose.connection.readyState;
                        switch (_a) {
                            case mongoose_1.ConnectionStates.connecting: return [3 /*break*/, 1];
                            case mongoose_1.ConnectionStates.disconnecting: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new Error('Connection to MongoDB was disconnected');
                    case 6: return [3 /*break*/, 0];
                    case 7: return [2 /*return*/, true];
                }
            });
        });
    };
    MongoStore.prototype.sessionExists = function (options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var collectionName_1, collections, collectionExists;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (!_c.sent()) return [3 /*break*/, 3];
                        collectionName_1 = "whatsapp-".concat(options.session, ".files");
                        return [4 /*yield*/, ((_b = (_a = this.mongoose.connection.db) === null || _a === void 0 ? void 0 : _a.listCollections()) === null || _b === void 0 ? void 0 : _b.toArray())];
                    case 2:
                        collections = _c.sent();
                        collectionExists = collections === null || collections === void 0 ? void 0 : collections.some(function (collection) { return collection.name === collectionName_1; });
                        return [2 /*return*/, collectionExists !== null && collectionExists !== void 0 ? collectionExists : false];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    MongoStore.prototype.save = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (_a.sent()) {
                            bucket_1 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    fs.createReadStream("".concat(options.session, ".zip"))
                                        .pipe(bucket_1.openUploadStream("".concat(options.session, ".zip")))
                                        .on('error', function (err) { return reject(err); })
                                        .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.deletePrevious(options)];
                                                case 1:
                                                    _a.sent();
                                                    resolve === null || resolve === void 0 ? void 0 : resolve.call(undefined);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoStore.prototype.extract = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (_a.sent()) {
                            bucket_2 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    bucket_2.openDownloadStreamByName("".concat(options.session, ".zip"))
                                        .pipe(fs.createWriteStream(options.path))
                                        .on('error', function (err) { return reject(err); })
                                        .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                        var zip;
                                        return __generator(this, function (_a) {
                                            zip = new adm_zip_1.default(options.path);
                                            if (!zip.test()) {
                                                reject(new Error('The downloaded file is corrupted.'));
                                            }
                                            else {
                                                resolve();
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); });
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoStore.prototype.delete = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket_3, documents;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        bucket_3 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                        return [4 /*yield*/, bucket_3.find({
                                filename: "".concat(options.session, ".zip")
                            }).toArray()];
                    case 2:
                        documents = _a.sent();
                        documents.map(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, bucket_3.delete(doc._id)];
                            });
                        }); });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoStore.prototype.checkValidZip = function (session, documentId) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (_a.sent()) {
                            bucket_4 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(session) });
                            return [2 /*return*/, new Promise(function (resolve) {
                                    var path = "./".concat(documentId, ".zip");
                                    bucket_4.openDownloadStream(documentId).pipe(fs.createWriteStream(path))
                                        .on('error', function () { return resolve(false); })
                                        .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                        var zip;
                                        return __generator(this, function (_a) {
                                            zip = new adm_zip_1.default(path);
                                            if (!zip.test()) {
                                                resolve(false);
                                            }
                                            else {
                                                resolve(true);
                                            }
                                            fs.rmSync(path);
                                            return [2 /*return*/];
                                        });
                                    }); });
                                })];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    MongoStore.prototype.deletePrevious = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket, documents, newDocument, oldSession;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                        return [4 /*yield*/, bucket.find({ filename: "".concat(options.session, ".zip") }).toArray()];
                    case 2:
                        documents = _a.sent();
                        newDocument = documents.reduce(function (a, b) { return a.uploadDate > b.uploadDate ? a : b; });
                        return [4 /*yield*/, this.checkValidZip(options.session, newDocument._id)];
                    case 3:
                        if (!(_a.sent())) {
                            console.log('File is corrupted, deleting...');
                            return [2 /*return*/, bucket.delete(newDocument._id)];
                        }
                        if (documents.length > 1) {
                            oldSession = documents.reduce(function (a, b) { return a.uploadDate < b.uploadDate ? a : b; });
                            return [2 /*return*/, bucket.delete(oldSession._id)];
                        }
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MongoStore;
}());
exports.MongoStore = MongoStore;
