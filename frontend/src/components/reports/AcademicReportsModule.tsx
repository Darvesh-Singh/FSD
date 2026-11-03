import React, { useState, useEffect } from 'react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { api } from '../../services/api';
import { CourseSummaryReport, AtRiskStudentReport } from '../../types';
import { CourseSummaryView } from './CourseSummaryView';
import { AtRiskReportView } from './AtRiskReportView';
import { WarningLetterModal } from './WarningLetterModal';
import { 
  Filter, BookOpen, ShieldAlert, SlidersHorizontal, 
  RotateCcw, Download, Sparkles 
} from 'lucide-react';

export const AcademicReportsModule: React.FC = () => {
  const { 
    departments, 
    courses, 
    selectedDepartmentId, 
    setSelectedDepartmentId,
    selectedCourseId, 
    setSelectedCourseId,
    selectedSemester, 
    setSelectedSemester,
    atRiskThreshold, 
    setAtRiskThreshold 
  } = useAttendanceStore();

  const [activeTab, setActiveTab] = useState<'courses' | 'at-risk'>('courses');
  const [courseSummaries, setCourseSummaries] = useState<CourseSummaryReport[]>([]);
  const [atRiskReports, setAtRiskReports] = useState<AtRiskStudentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaries, atRisk] = await Promise.all([
        api.getCourseSummaries(selectedDepartmentId, selectedSemester),
        api.getAtRiskStudents(selectedDepartmentId, selectedCourseId, atRiskThreshold)
      ]);
      setCourseSummaries(summaries);
      setAtRiskReports(atRisk);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDepartmentId, selectedCourseId, selectedSemester, atRiskThreshold]);

  const filteredCourses = selectedDepartmentId === 'ALL'
    ? courses
    : courses.filter(c => c.departmentId === selectedDepartmentId);

  return (
    <div className="space-y-6">
      
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-academic-400">
                Academic Audit & Compliance
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-academic-500/10 text-academic-300 border border-academic-500/20">
                Multi-Column Telemetry
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Academic Attendance Reports
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Inspect course-level lecture summaries, spot attendance dips, and track at-risk students subject to university debarment warnings.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'courses' 
                  ? 'bg-academic-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Course Summaries</span>
            </button>

            <button
              onClick={() => setActiveTab('at-risk')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'at-risk' 
                  ? 'bg-rose-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>At-Risk Students ({atRiskReports.length})</span>
            </button>
          </div>
        </div>

        {/* Multi-Column Filter Grid Bar */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Department Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Department
            </label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-academic-500"
            >
              <option value="ALL">All Departments (University-wide)</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Course / Subject
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-academic-500"
            >
              <option value="ALL">All Enrolled Courses</option>
              {filteredCourses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Academic Term
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-academic-500"
            >
              <option value="Fall 2026">Fall Semester 2026</option>
              <option value="Spring 2026">Spring Semester 2026</option>
            </select>
          </div>

          {/* Mandatory Threshold Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex justify-between">
              <span>Risk Threshold</span>
              <strong className="text-rose-400 font-mono">&lt; {atRiskThreshold}%</strong>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="60"
                max="85"
                step="5"
                value={atRiskThreshold}
                onChange={(e) => setAtRiskThreshold(Number(e.target.value))}
                className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-300 w-8 text-right">
                {atRiskThreshold}%
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* View Content */}
      {activeTab === 'courses' ? (
        <CourseSummaryView
          summaries={courseSummaries}
          loading={loading}
          onSelectCourse={(cId) => {
            setSelectedCourseId(cId);
            setActiveTab('at-risk');
          }}
        />
      ) : (
        <AtRiskReportView
          reports={atRiskReports}
          loading={loading}
          onViewLetter={(lId) => setSelectedLetterId(lId)}
          onRefresh={loadData}
        />
      )}

      {/* Warning Letter Modal Dialog */}
      <WarningLetterModal
        letterId={selectedLetterId}
        onClose={() => setSelectedLetterId(null)}
      />

    </div>
  );
};

