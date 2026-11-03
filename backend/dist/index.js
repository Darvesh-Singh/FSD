"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const dashboardRoutes_js_1 = __importDefault(require("./routes/dashboardRoutes.js"));
const attendanceRoutes_js_1 = __importDefault(require("./routes/attendanceRoutes.js"));
const reportsRoutes_js_1 = __importDefault(require("./routes/reportsRoutes.js"));
const academicRoutes_js_1 = __importDefault(require("./routes/academicRoutes.js"));
const store_js_1 = require("./db/store.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (req.path !== '/api/dashboard/kpis' || duration > 100) {
            console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
        }
    });
    next();
});
// Mount Routes
app.use('/api/dashboard', dashboardRoutes_js_1.default);
app.use('/api/attendance', attendanceRoutes_js_1.default);
app.use('/api/reports', reportsRoutes_js_1.default);
app.use('/api/academic', academicRoutes_js_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ONLINE',
        system: 'University Smart Attendance System API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Periodic dynamic QR rotation (every 30 seconds) for all active lectures
setInterval(() => {
    const inProgress = store_js_1.dbStore.lectures.filter(l => l.status === 'IN_PROGRESS');
    inProgress.forEach(lec => {
        const code = `UNIV-${Math.floor(100000 + Math.random() * 900000)}`;
        lec.dynamicQrCode = code;
        lec.dynamicQrExpiresAt = new Date(Date.now() + 30 * 1000).toISOString();
    });
}, 30000);
app.listen(PORT, () => {
    console.log(`🚀 University Smart Attendance Backend API running on http://localhost:${PORT}`);
    console.log(`📡 Relational in-memory academic registry initialized with:`);
    console.log(`   - ${store_js_1.dbStore.departments.length} Departments`);
    console.log(`   - ${store_js_1.dbStore.courses.length} Courses`);
    console.log(`   - ${store_js_1.dbStore.sections.length} Sections`);
    console.log(`   - ${store_js_1.dbStore.users.length} Users (${store_js_1.dbStore.users.filter(u => u.role === 'STUDENT').length} Students)`);
    console.log(`   - ${store_js_1.dbStore.lectures.length} Total Lecture Sessions`);
    console.log(`   - ${store_js_1.dbStore.attendanceLogs.length} Verified Attendance Logs`);
});
exports.default = app;
