import { dbStore } from './store.js';

console.log('🌱 Seeding University Smart Attendance System database...');
dbStore.reset();
console.log('✅ Seeding completed successfully!');
console.log(`Departments: ${dbStore.departments.length}`);
console.log(`Courses: ${dbStore.courses.length}`);
console.log(`Sections: ${dbStore.sections.length}`);
console.log(`Users: ${dbStore.users.length}`);
console.log(`Lectures: ${dbStore.lectures.length}`);
console.log(`Attendance Logs: ${dbStore.attendanceLogs.length}`);
console.log(`Absence Appeals: ${dbStore.absenceAppeals.length}`);
console.log(`Warning Letters: ${dbStore.warningLetters.length}`);

