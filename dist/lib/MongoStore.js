"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var fs_extra_1 = __importDefault(require("fs-extra"));
var path = __importStar(require("path"));
var archiver_1 = __importDefault(require("archiver"));
var adm_zip_1 = __importDefault(require("adm-zip"));
var mongoose_1 = require("mongoose");
var events_1 = require("events");
var MongoStore = /** @class */ (function (_super) {
    __extends(MongoStore, _super);
    function MongoStore(_a) {
        var mongoose = _a.mongoose, debug = _a.debug, deleteFileTemp = _a.deleteFileTemp;
        var _this = _super.call(this) || this;
        _this.requiredDirs = ['Default/IndexedDB', 'Default/Local Storage']; /* => Required Files & Dirs in WWebJS to restore session */
        _this.deleteFileTemp = false;
        if (!mongoose)
            throw new Error('A valid Mongoose instance is required for MongoStore.');
        _this.mongoose = mongoose;
        _this.debug = debug !== null && debug !== void 0 ? debug : false;
        _this.deleteFileTemp = deleteFileTemp !== null && deleteFileTemp !== void 0 ? deleteFileTemp : true;
        return _this;
    }
    MongoStore.prototype.isConnectionReady = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.debug) {
                            console.log('Checking connection to MongoDB');
                        }
                        _b.label = 1;
                    case 1:
                        if (!(this.mongoose.connection.readyState !== 1)) return [3 /*break*/, 8];
                        _a = this.mongoose.connection.readyState;
                        switch (_a) {
                            case mongoose_1.ConnectionStates.connecting: return [3 /*break*/, 2];
                            case mongoose_1.ConnectionStates.disconnecting: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6: throw new Error('Connection to MongoDB was disconnected');
                    case 7: return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, true];
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
                        if (this.debug) {
                            console.log('Checking if session exists in MongoDB');
                        }
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
            var dirPath, filePath, stream, archive_1, tempDir_1, bucket_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 12];
                        if (!(options === null || options === void 0 ? void 0 : options.dataPath)) return [3 /*break*/, 11];
                        dirPath = path.resolve("".concat(options.dataPath, "/").concat(options.session));
                        filePath = path.resolve("".concat(options.session, ".zip"));
                        if (!fs_extra_1.default.existsSync(filePath)) return [3 /*break*/, 3];
                        return [4 /*yield*/, fs_extra_1.default.promises.unlink(filePath)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        stream = fs_extra_1.default.createWriteStream("".concat(options.session, ".zip"));
                        archive_1 = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
                        tempDir_1 = path.resolve("".concat(options.dataPath, "/temp-").concat(options.session));
                        if (!fs_extra_1.default.existsSync("".concat(tempDir_1))) return [3 /*break*/, 5];
                        return [4 /*yield*/, fs_extra_1.default.promises.rm("".concat(tempDir_1), { recursive: true })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, fs_extra_1.default.mkdir("".concat(tempDir_1))];
                    case 6:
                        _a.sent();
                        if (this.debug) {
                            console.log('Copying session files to temp directory');
                        }
                        return [4 /*yield*/, fs_extra_1.default.copy("".concat(dirPath), tempDir_1)];
                    case 7:
                        _a.sent();
                        if (this.debug) {
                            console.log('Copying session files to temp directory - Done');
                        }
                        archive_1.pipe(stream);
                        return [4 /*yield*/, Promise.all(this.requiredDirs.map(function (dir) {
                                if (_this.debug) {
                                    console.log("".concat(tempDir_1, "/").concat(dir), dir);
                                }
                                archive_1.directory("".concat(tempDir_1, "/").concat(dir), dir);
                            }))];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, archive_1.finalize()];
                    case 9:
                        _a.sent();
                        stream.close();
                        if (!this.deleteFileTemp) return [3 /*break*/, 11];
                        return [4 /*yield*/, fs_extra_1.default.promises.rm("".concat(tempDir_1), { recursive: true })];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        if (this.debug) {
                            console.log('Saving session to MongoDB');
                        }
                        bucket_1 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                fs_extra_1.default.createReadStream("".concat(options.session, ".zip"))
                                    .pipe(bucket_1.openUploadStream("".concat(options.session, ".zip")))
                                    .on('error', function (err) { return reject(err); })
                                    .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.deley(1000 * 10)];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, this.deletePrevious(options).then(function () {
                                                        _this.emit('saved', options.session);
                                                        if (_this.debug) {
                                                            console.log('Session saved to MongoDB');
                                                        }
                                                    }).catch(function (error) {
                                                        _this.emit('error', error);
                                                    }).finally(function () {
                                                        resolve === null || resolve === void 0 ? void 0 : resolve.call(undefined);
                                                        var filePath = path.resolve("".concat(options.session, ".zip"));
                                                        if (fs_extra_1.default.existsSync(filePath) && _this.deleteFileTemp) {
                                                            fs_extra_1.default.rm(filePath, { recursive: true });
                                                        }
                                                        ;
                                                    })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            })];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    MongoStore.prototype.extract = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (_a.sent()) {
                            if (this.debug) {
                                console.log('Extracting session from MongoDB');
                            }
                            bucket = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, {
                                bucketName: "whatsapp-".concat(options.session)
                            });
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    var _a;
                                    bucket.openDownloadStreamByName("".concat(options.session, ".zip"))
                                        .pipe(fs_extra_1.default.createWriteStream((_a = options.path) !== null && _a !== void 0 ? _a : "".concat(options.session, ".zip")))
                                        .on('error', function (err) { return reject(err); })
                                        .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.deley(1000 * 5)];
                                                case 1:
                                                    _a.sent();
                                                    resolve === null || resolve === void 0 ? void 0 : resolve.call(undefined);
                                                    if (this.debug) {
                                                        console.log('Session extracted from MongoDB');
                                                    }
                                                    this.emit('extracted');
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
    MongoStore.prototype.delete = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket_2, documents;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        if (this.debug) {
                            console.log('Deleting session from MongoDB');
                        }
                        bucket_2 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                        return [4 /*yield*/, bucket_2.find({
                                filename: "".concat(options.session, ".zip")
                            }).toArray()];
                    case 2:
                        documents = _a.sent();
                        documents.map(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, bucket_2.delete(doc._id)];
                            });
                        }); });
                        if (this.debug) {
                            console.log('Session deleted from MongoDB');
                        }
                        this.emit('deleted');
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoStore.prototype.validate = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var bucket_3, filePath_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (_a.sent()) {
                            if (this.debug) {
                                console.log('Validating session in MongoDB');
                            }
                            bucket_3 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                            filePath_1 = path.resolve("./".concat(options.documentId, ".zip"));
                            if (this.debug)
                                console.log(filePath_1);
                            return [2 /*return*/, new Promise(function (resolve) {
                                    bucket_3.openDownloadStream(options.documentId)
                                        .pipe(fs_extra_1.default.createWriteStream(filePath_1))
                                        .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
                                        var folderPath, zip, err_1;
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    _a.trys.push([0, 1, 2, 5]);
                                                    folderPath = path.resolve("./temp-".concat(options.documentId));
                                                    zip = new adm_zip_1.default(filePath_1);
                                                    zip.extractAllToAsync(folderPath, true, true, function (err) {
                                                        if (err) {
                                                            if (_this.debug) {
                                                                console.log('Session validation failed in MongoDB');
                                                                console.log(err);
                                                            }
                                                            resolve === null || resolve === void 0 ? void 0 : resolve.call(undefined, false);
                                                        }
                                                        else {
                                                            if (_this.debug) {
                                                                console.log('Session validated in MongoDB');
                                                            }
                                                            resolve === null || resolve === void 0 ? void 0 : resolve.call(undefined, true);
                                                        }
                                                        if (_this.deleteFileTemp)
                                                            fs_extra_1.default.promises.rm(filePath_1, { recursive: true });
                                                    });
                                                    return [3 /*break*/, 5];
                                                case 1:
                                                    err_1 = _a.sent();
                                                    resolve === null || resolve === void 0 ? void 0 : resolve.call(undefined, false);
                                                    if (this.debug) {
                                                        console.log('Session validation failed in MongoDB');
                                                        console.log(err_1);
                                                    }
                                                    return [3 /*break*/, 5];
                                                case 2:
                                                    if (!this.deleteFileTemp) return [3 /*break*/, 4];
                                                    return [4 /*yield*/, fs_extra_1.default.promises.rm(filePath_1, { recursive: true })];
                                                case 3:
                                                    _a.sent();
                                                    _a.label = 4;
                                                case 4: return [7 /*endfinally*/];
                                                case 5: return [2 /*return*/];
                                            }
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
            var bucket_4, documents, newDocument_1, isValid;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.isConnectionReady()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 7];
                        bucket_4 = new this.mongoose.mongo.GridFSBucket(this.mongoose.connection.db, { bucketName: "whatsapp-".concat(options.session) });
                        return [4 /*yield*/, bucket_4.find({ filename: "".concat(options.session, ".zip") }).toArray()];
                    case 2:
                        documents = _a.sent();
                        newDocument_1 = documents.reduce(function (a, b) { return a.uploadDate > b.uploadDate ? a : b; });
                        return [4 /*yield*/, this.validate({ session: options.session, documentId: newDocument_1._id })];
                    case 3:
                        isValid = _a.sent();
                        if (!(documents.length > 1 && isValid == false)) return [3 /*break*/, 6];
                        if (!this.deleteFileTemp) return [3 /*break*/, 5];
                        return [4 /*yield*/, bucket_4.delete(newDocument_1._id)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (this.debug)
                            console.log('File is corrupted, deleted from MongoDB');
                        throw new Error('File is corrupted, deleted from MongoDB');
                    case 6:
                        if (documents.length > 1) {
                            documents.filter(function (doc) { return doc._id != newDocument_1._id; }).map(function (old) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, bucket_4.delete(old._id)];
                            }); }); });
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MongoStore.prototype.deley = function (ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    };
    MongoStore.prototype.on = function (eventName, listener) {
        return _super.prototype.on.call(this, eventName, listener);
    };
    return MongoStore;
}(events_1.EventEmitter));
exports.MongoStore = MongoStore;
