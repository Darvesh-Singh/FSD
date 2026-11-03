"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_js_1 = require("../controllers/dashboardController.js");
const router = (0, express_1.Router)();
router.get('/kpis', dashboardController_js_1.DashboardController.getDashboard);
router.get('/lecture/:lectureId', dashboardController_js_1.DashboardController.getLiveLecture);
exports.default = router;
