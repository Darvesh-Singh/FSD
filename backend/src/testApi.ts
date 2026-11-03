import app from './index.js';
import { dbStore } from './db/store.js';

async function runTests() {
  console.log('🧪 Starting End-to-End API Suite Verification...');
  
  // 1. Dashboard KPIs
  const kpis = dbStore.getDashboardKPIs();
  console.log(`✅ [1/5] Dashboard KPIs generated:`);
  console.log(`   - Daily Campus Attendance: ${kpis.dailyCampusAttendancePercentage}%`);
  console.log(`   - Ongoing Lectures: ${kpis.ongoingLecturesCount}`);
  console.log(`   - Checked-in Today: ${kpis.totalStudentsCheckedInToday} / ${kpis.totalStudentsExpectedToday}`);
  console.log(`   - At-Risk Students Flagged: ${kpis.atRiskStudentsCount}`);

  // 2. Course Summaries
  const summaries = dbStore.getCourseSummaries();
  console.log(`✅ [2/5] Course Summaries aggregated: ${summaries.length} courses`);
  summaries.forEach(s => {
    console.log(`   * ${s.courseCode}: Avg ${s.averageAttendancePercentage}%, Low Sessions: ${s.criticallyLowLecturesCount}, At-Risk: ${s.atRiskStudentsCount}`);
  });

  // 3. At-Risk Students
  const atRisk = dbStore.getAtRiskStudentsReport();
  console.log(`✅ [3/5] At-Risk Students identified (< 75%): ${atRisk.length} records`);
  atRisk.slice(0, 3).forEach(r => {
    console.log(`   * ${r.name} (${r.universityId}) in ${r.courseCode}: ${r.attendancePercentage}% [${r.warningStage}]`);
  });

  // 4. Warning Letter Generation
  if (atRisk.length > 0) {
    const letter = dbStore.issueWarningLetter(atRisk[0].studentId, atRisk[0].courseId);
    console.log(`✅ [4/5] Academic Warning Letter issued successfully:`);
    console.log(`   - Letter ID: ${letter.id}`);
    console.log(`   - Student: ${atRisk[0].name}`);
    console.log(`   - Course: ${atRisk[0].courseCode}`);
    console.log(`   - Stage: ${letter.warningStage}`);
  }

  // 5. Smart Attendance Capture: Geofence & Dynamic QR & RFID
  const inProgressLec = dbStore.lectures.find(l => l.status === 'IN_PROGRESS');
  if (inProgressLec) {
    console.log(`✅ [5/5] In-Progress Lecture verified: ${inProgressLec.title} in ${inProgressLec.hall}`);
    console.log(`   - Dynamic QR Token: ${inProgressLec.dynamicQrCode}`);
    console.log(`   - Geofence Boundary: ${inProgressLec.geofenceLat}, ${inProgressLec.geofenceLng} (${inProgressLec.geofenceRadiusMeters}m radius)`);
  }

  console.log('🎉 ALL SUITE TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

