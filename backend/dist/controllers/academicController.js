"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicController = void 0;
const store_js_1 = require("../db/store.js");
class AcademicController {
    static getDepartments(req, res) {
        res.json({ success: true, data: store_js_1.dbStore.departments });
    }
    static getCourses(req, res) {
        const { departmentId } = req.query;
        let list = store_js_1.dbStore.courses;
        if (departmentId && departmentId !== 'ALL') {
            list = list.filter(c => c.departmentId === departmentId);
        }
        res.json({ success: true, data: list });
    }
    static getSections(req, res) {
        const { courseId } = req.query;
        let list = store_js_1.dbStore.sections;
        if (courseId && courseId !== 'ALL') {
            list = list.filter(s => s.courseId === courseId);
        }
        res.json({ success: true, data: list });
    }
    static getUsers(req, res) {
        const { role } = req.query;
        let list = store_js_1.dbStore.users;
        if (role) {
            list = list.filter(u => u.role === role);
        }
        res.json({ success: true, data: list });
    }
    static getLectures(req, res) {
        const { status, date } = req.query;
        let list = store_js_1.dbStore.lectures;
        if (status) {
            list = list.filter(l => l.status === status);
        }
        if (date) {
            list = list.filter(l => l.date === date);
        }
        res.json({ success: true, data: list });
    }
}
exports.AcademicController = AcademicController;
