"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const store_js_1 = require("../db/store.js");
class ReportsController {
    // Course-wide Summaries
    static getCourseSummaries(req, res) {
        try {
            const { departmentId, semester } = req.query;
            const summaries = store_js_1.dbStore.getCourseSummaries({
                departmentId: departmentId,
                semester: semester
            });
            res.json({
                success: true,
                data: summaries
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    // At-Risk Students Report
    static getAtRiskStudents(req, res) {
        try {
            const { departmentId, courseId, threshold } = req.query;
            const minThreshold = threshold ? Number(threshold) : 75.0;
            const atRiskStudents = store_js_1.dbStore.getAtRiskStudentsReport({
                departmentId: departmentId,
                courseId: courseId,
                minThreshold
            });
            res.json({
                success: true,
                data: atRiskStudents
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    // Generate / Issue Academic Warning Letter
    static issueWarningLetter(req, res) {
        try {
            const { studentId, courseId } = req.body;
            if (!studentId || !courseId) {
                return res.status(400).json({ success: false, error: 'studentId and courseId are required' });
            }
            const letter = store_js_1.dbStore.issueWarningLetter(studentId, courseId);
            res.json({
                success: true,
                message: 'Academic Warning Letter generated and issued.',
                data: letter
            });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
    // Get Warning Letter details
    static getWarningLetter(req, res) {
        try {
            const { letterId } = req.params;
            const letter = store_js_1.dbStore.warningLetters.find(l => l.id === letterId);
            if (!letter) {
                return res.status(404).json({ success: false, error: 'Warning letter not found' });
            }
            const student = store_js_1.dbStore.users.find(u => u.id === letter.studentId);
            const course = store_js_1.dbStore.courses.find(c => c.id === letter.courseId);
            res.json({
                success: true,
                data: {
                    ...letter,
                    student,
                    course
                }
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    // Individual Student Drill-Down
    static getStudentDrillDown(req, res) {
        try {
            const { studentId } = req.params;
            const drillDown = store_js_1.dbStore.getStudentDrillDown(studentId);
            if (!drillDown) {
                return res.status(404).json({ success: false, error: 'Student not found' });
            }
            res.json({
                success: true,
                data: drillDown
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}
exports.ReportsController = ReportsController;
