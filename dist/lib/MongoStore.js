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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
                            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                    var documents, _a, documents_1, documents_1_1, doc, e_1_1, zip;
                                    var _b, e_1, _c, _d;
                                    return __generator(this, function (_e) {
                                        switch (_e.label) {
                                            case 0: return [4 /*yield*/, bucket_2.find({ filename: "".concat(options.session, ".zip") }).toArray()];
                                            case 1:
                                                documents = _e.sent();
                                                _e.label = 2;
                                            case 2:
                                                _e.trys.push([2, 10, 11, 16]);
                                                _a = true, documents_1 = __asyncValues(documents);
                                                _e.label = 3;
                                            case 3: return [4 /*yield*/, documents_1.next()];
                                            case 4:
                                                if (!(documents_1_1 = _e.sent(), _b = documents_1_1.done, !_b)) return [3 /*break*/, 9];
                                                _d = documents_1_1.value;
                                                _a = false;
                                                _e.label = 5;
                                            case 5:
                                                _e.trys.push([5, , 7, 8]);
                                                doc = _d;
                                                return [4 /*yield*/, this.checkValidZip({ session: options.session, documentId: doc._id, path: options.path })];
                                            case 6:
                                                if (_e.sent()) {
                                                    return [3 /*break*/, 9];
                                                }
                                                return [3 /*break*/, 8];
                                            case 7:
                                                _a = true;
                                                return [7 /*endfinally*/];
                                            case 8: return [3 /*break*/, 3];
                                            case 9: return [3 /*break*/, 16];
                                            case 10:
                                                e_1_1 = _e.sent();
                                                e_1 = { error: e_1_1 };
                                                return [3 /*break*/, 16];
                                            case 11:
                                                _e.trys.push([11, , 14, 15]);
                                                if (!(!_a && !_b && (_c = documents_1.return))) return [3 /*break*/, 13];
                                                return [4 /*yield*/, _c.call(documents_1)];
                                            case 12:
                                                _e.sent();
                                                _e.label = 13;
                                            case 13: return [3 /*break*/, 15];
                                            case 14:
                                                if (e_1) throw e_1.error;
                                                return [7 /*endfinally*/];
                                            case 15: return [7 /*endfinally*/];
                                            case 16:
                                                zip = new adm_zip_1.default(options.path);
                                                if (!zip.test()) {
                                                    reject(new Error('The downloaded file is corrupted.'));
                                                }
                                                else {
                                                    resolve();
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
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
    MongoStore.prototype.checkValidZip = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (_a.sent()) {
                            bucket_4 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                            return [2 /*return*/, new Promise(function (resolve) {
                                    var _a;
                                    var path = (_a = options.path) !== null && _a !== void 0 ? _a : "./".concat(options.documentId, ".zip");
                                    bucket_4.openDownloadStream(options.documentId).pipe(fs.createWriteStream(path))
                                        .on('error', function () { return resolve(false); })
                                        .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                        var zip;
                                        return __generator(this, function (_a) {
                                            zip = new adm_zip_1.default(path);
                                            if (!zip.test())
                                                resolve(false);
                                            else
                                                resolve(true);
                                            if (!options.path)
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
            var bucket_5, documents, newDocument_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        bucket_5 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                        return [4 /*yield*/, bucket_5.find({ filename: "".concat(options.session, ".zip") }).toArray()];
                    case 2:
                        documents = _a.sent();
                        newDocument_1 = documents.reduce(function (a, b) { return a.uploadDate > b.uploadDate ? a : b; });
                        return [4 /*yield*/, this.checkValidZip({ session: options.session, documentId: newDocument_1._id })];
                    case 3:
                        if (!(_a.sent())) {
                            console.log('File is corrupted, deleting...');
                            return [2 /*return*/, bucket_5.delete(newDocument_1._id)];
                        }
                        if (documents.length > 1) {
                            return [2 /*return*/, documents.filter(function (doc) { return doc._id != newDocument_1._id; }).map(function (old) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, bucket_5.delete(old._id)];
                                }); }); })];
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
