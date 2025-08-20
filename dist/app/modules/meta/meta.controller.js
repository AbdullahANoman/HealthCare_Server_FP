"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaController = void 0;
const catchAsync_1 = require("../../../helpers/catchAsync");
const sendResponse_1 = require("../../../helpers/sendResponse");
const meta_services_1 = require("./meta.services");
const fetcheDashboardMetaData = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield meta_services_1.MetaServices.fetcheDashboardMetaData(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Fetched Dashboard Meta Data Retrieved Successfully",
        data: result,
    });
}));
exports.MetaController = {
    fetcheDashboardMetaData,
};
