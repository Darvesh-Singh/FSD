import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboardRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import { dbStore } from './db/store.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/academic', academicRoutes);

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
  const inProgress = dbStore.lectures.filter(l => l.status === 'IN_PROGRESS');
  inProgress.forEach(lec => {
    const code = `UNIV-${Math.floor(100000 + Math.random() * 900000)}`;
    lec.dynamicQrCode = code;
    lec.dynamicQrExpiresAt = new Date(Date.now() + 30 * 1000).toISOString();
  });
}, 30000);

app.listen(PORT, () => {
  console.log(`🚀 University Smart Attendance Backend API running on http://localhost:${PORT}`);
  console.log(`📡 Relational in-memory academic registry initialized with:`);
  console.log(`   - ${dbStore.departments.length} Departments`);
  console.log(`   - ${dbStore.courses.length} Courses`);
  console.log(`   - ${dbStore.sections.length} Sections`);
  console.log(`   - ${dbStore.users.length} Users (${dbStore.users.filter(u => u.role === 'STUDENT').length} Students)`);
  console.log(`   - ${dbStore.lectures.length} Total Lecture Sessions`);
  console.log(`   - ${dbStore.attendanceLogs.length} Verified Attendance Logs`);
});

export default app;

