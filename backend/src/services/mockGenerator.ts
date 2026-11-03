import { 
  Department, Course, Section, User, Enrollment, Lecture, 
  AttendanceLog, AbsenceAppeal, AcademicWarningLetter,
  AttendanceStatus, CheckInMethod, LectureStatus, WarningStage
} from '../models/types.js';

export function generateUniversityDataset() {
  // 1. Departments
  const departments: Department[] = [
    {
      id: 'dept-cse',
      code: 'CSE',
      name: 'Computer Science & Engineering',
      building: 'Alan Turing Hall',
      headOfDepartment: 'Prof. Donald Knuth'
    },
    {
      id: 'dept-ee',
      code: 'EE',
      name: 'Electrical Engineering',
      building: 'Nikola Tesla Building',
      headOfDepartment: 'Prof. Claude Shannon'
    },
    {
      id: 'dept-me',
      code: 'ME',
      name: 'Mechanical & Aerospace Engineering',
      building: 'Isaac Newton Complex',
      headOfDepartment: 'Prof. Theodore von Kármán'
    },
    {
      id: 'dept-mgmt',
      code: 'MGMT',
      name: 'School of Technology Management',
      building: 'Ada Lovelace Pavilion',
      headOfDepartment: 'Prof. Peter Drucker'
    }
  ];

  // 2. Instructors & Admin
  const adminUser: User = {
    id: 'user-admin-01',
    universityId: 'ADM-2026-001',
    name: 'Dr. Eleanor Vance',
    email: 'admin.vance@university.edu',
    role: 'ADMIN',
    departmentId: 'dept-cse',
    rfidBadgeId: 'RFID-ADM-001',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 019-2831'
  };

  const professors: User[] = [
    {
      id: 'prof-01',
      universityId: 'FAC-CSE-01',
      name: 'Prof. Marcus Chen',
      email: 'marcus.chen@university.edu',
      role: 'PROFESSOR',
      departmentId: 'dept-cse',
      rfidBadgeId: 'RFID-FAC-101',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 014-9921'
    },
    {
      id: 'prof-02',
      universityId: 'FAC-CSE-02',
      name: 'Dr. Aris Thorne',
      email: 'aris.thorne@university.edu',
      role: 'PROFESSOR',
      departmentId: 'dept-cse',
      rfidBadgeId: 'RFID-FAC-102',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 014-8832'
    },
    {
      id: 'prof-03',
      universityId: 'FAC-EE-01',
      name: 'Prof. Elena Rostova',
      email: 'elena.rostova@university.edu',
      role: 'PROFESSOR',
      departmentId: 'dept-ee',
      rfidBadgeId: 'RFID-FAC-201',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 018-7711'
    },
    {
      id: 'prof-04',
      universityId: 'FAC-ME-01',
      name: 'Dr. Henrik Lindqvist',
      email: 'henrik.lindqvist@university.edu',
      role: 'PROFESSOR',
      departmentId: 'dept-me',
      rfidBadgeId: 'RFID-FAC-301',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 017-6622'
    },
    {
      id: 'prof-05',
      universityId: 'FAC-MGMT-01',
      name: 'Dr. Sophia Sterling',
      email: 'sophia.sterling@university.edu',
      role: 'PROFESSOR',
      departmentId: 'dept-mgmt',
      rfidBadgeId: 'RFID-FAC-401',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (555) 016-5544'
    }
  ];

  // 3. Courses
  const courses: Course[] = [
    {
      id: 'course-cs101',
      code: 'CS-101',
      title: 'Data Structures & Algorithms',
      departmentId: 'dept-cse',
      credits: 4,
      semester: 'Fall 2026',
      description: 'Foundational algorithmic problem solving, trees, graphs, dynamic programming.'
    },
    {
      id: 'course-cs301',
      code: 'CS-301',
      title: 'Distributed Systems & Cloud Architecture',
      departmentId: 'dept-cse',
      credits: 4,
      semester: 'Fall 2026',
      description: 'Consensus protocols, microservices, RPCs, fault tolerance and replication.'
    },
    {
      id: 'course-cs404',
      code: 'CS-404',
      title: 'Applied Machine Learning & Neural Networks',
      departmentId: 'dept-cse',
      credits: 3,
      semester: 'Fall 2026',
      description: 'Deep neural networks, backpropagation, transformers, and computer vision.'
    },
    {
      id: 'course-ee201',
      code: 'EE-201',
      title: 'Digital Signal Processing & Wavelets',
      departmentId: 'dept-ee',
      credits: 4,
      semester: 'Fall 2026',
      description: 'Fourier transforms, FIR/IIR filtering, spectrogram analysis.'
    },
    {
      id: 'course-me105',
      code: 'ME-105',
      title: 'Advanced Engineering Thermodynamics',
      departmentId: 'dept-me',
      credits: 3,
      semester: 'Fall 2026',
      description: 'Entropy generation, Carnot cycles, Rankine and Brayton power cycles.'
    },
    {
      id: 'course-mgmt101',
      code: 'MGMT-101',
      title: 'High-Growth Tech Venture Management',
      departmentId: 'dept-mgmt',
      credits: 3,
      semester: 'Fall 2026',
      description: 'Product lifecycle strategy, unit economics, tech ethics and venture capital.'
    }
  ];

  // 4. Sections
  const sections: Section[] = [
    {
      id: 'sec-cs101-a',
      sectionCode: 'Section 01',
      courseId: 'course-cs101',
      instructorId: 'prof-01',
      capacity: 45,
      defaultRoom: 'Turing Hall A-101',
      scheduleTime: 'Mon, Wed 09:00 - 10:30'
    },
    {
      id: 'sec-cs301-a',
      sectionCode: 'Section 01',
      courseId: 'course-cs301',
      instructorId: 'prof-02',
      capacity: 40,
      defaultRoom: 'Turing Hall B-205',
      scheduleTime: 'Tue, Thu 11:00 - 12:30'
    },
    {
      id: 'sec-cs404-a',
      sectionCode: 'Section 01',
      courseId: 'course-cs404',
      instructorId: 'prof-01',
      capacity: 35,
      defaultRoom: 'Hopper Auditorium',
      scheduleTime: 'Mon, Wed 14:00 - 15:30'
    },
    {
      id: 'sec-ee201-a',
      sectionCode: 'Section 01',
      courseId: 'course-ee201',
      instructorId: 'prof-03',
      capacity: 30,
      defaultRoom: 'Tesla Lab 302',
      scheduleTime: 'Mon, Wed 10:45 - 12:15'
    },
    {
      id: 'sec-me105-a',
      sectionCode: 'Section 01',
      courseId: 'course-me105',
      instructorId: 'prof-04',
      capacity: 35,
      defaultRoom: 'Newton Hall 104',
      scheduleTime: 'Tue, Thu 09:30 - 11:00'
    },
    {
      id: 'sec-mgmt101-a',
      sectionCode: 'Section 01',
      courseId: 'course-mgmt101',
      instructorId: 'prof-05',
      capacity: 50,
      defaultRoom: 'Lovelace Amphitheater',
      scheduleTime: 'Fri 10:00 - 13:00'
    }
  ];

  // 5. Students (40+ students with varied attendance patterns)
  const studentNames = [
    { name: 'Lucas Montgomery', gender: 'm', year: 'Junior', dept: 'dept-cse', gpa: 3.82, risk: false },
    { name: 'Aria Takahashi', gender: 'f', year: 'Sophomore', dept: 'dept-cse', gpa: 3.91, risk: false },
    { name: 'Devon Miller', gender: 'm', year: 'Junior', dept: 'dept-cse', gpa: 2.45, risk: true }, // At-Risk student
    { name: 'Zara Patel', gender: 'f', year: 'Senior', dept: 'dept-cse', gpa: 3.65, risk: false },
    { name: 'Julian Hayes', gender: 'm', year: 'Freshman', dept: 'dept-cse', gpa: 3.40, risk: false },
    { name: 'Camila Rodriguez', gender: 'f', year: 'Junior', dept: 'dept-cse', gpa: 2.30, risk: true }, // At-Risk student
    { name: 'Ethan Zhao', gender: 'm', year: 'Senior', dept: 'dept-cse', gpa: 3.95, risk: false },
    { name: 'Khadija Al-Mansoor', gender: 'f', year: 'Sophomore', dept: 'dept-cse', gpa: 3.75, risk: false },
    { name: 'Marcus Bell', gender: 'm', year: 'Sophomore', dept: 'dept-cse', gpa: 2.15, risk: true }, // At-Risk student
    { name: 'Seraphina Lin', gender: 'f', year: 'Junior', dept: 'dept-cse', gpa: 3.88, risk: false },
    
    // EE students
    { name: 'Siddharth Nair', gender: 'm', year: 'Sophomore', dept: 'dept-ee', gpa: 3.72, risk: false },
    { name: 'Chloe Dubois', gender: 'f', year: 'Junior', dept: 'dept-ee', gpa: 2.50, risk: true }, // At-risk
    { name: 'Kenji Sato', gender: 'm', year: 'Senior', dept: 'dept-ee', gpa: 3.60, risk: false },
    { name: 'Amara Okafor', gender: 'f', year: 'Freshman', dept: 'dept-ee', gpa: 3.85, risk: false },
    { name: 'Dante Russo', gender: 'm', year: 'Junior', dept: 'dept-ee', gpa: 2.20, risk: true }, // At-risk
    { name: 'Maya Angelis', gender: 'f', year: 'Senior', dept: 'dept-ee', gpa: 3.79, risk: false },
    
    // ME students
    { name: 'Niklas Berg', gender: 'm', year: 'Junior', dept: 'dept-me', gpa: 3.55, risk: false },
    { name: 'Fatima Zahra', gender: 'f', year: 'Sophomore', dept: 'dept-me', gpa: 3.80, risk: false },
    { name: 'Liam O’Connor', gender: 'm', year: 'Senior', dept: 'dept-me', gpa: 2.35, risk: true }, // At-risk
    { name: 'Isabella Rossi', gender: 'f', year: 'Freshman', dept: 'dept-me', gpa: 3.68, risk: false },
    { name: 'Tariq Hassan', gender: 'm', year: 'Junior', dept: 'dept-me', gpa: 2.40, risk: true }, // At-risk
    
    // MGMT / Cross-enrolled
    { name: 'Oliver Bennett', gender: 'm', year: 'Senior', dept: 'dept-mgmt', gpa: 3.90, risk: false },
    { name: 'Ananya Sharma', gender: 'f', year: 'Junior', dept: 'dept-mgmt', gpa: 3.70, risk: false },
    { name: 'Felix Tremblay', gender: 'm', year: 'Sophomore', dept: 'dept-mgmt', gpa: 2.25, risk: true }, // At-risk
    { name: 'Sofia Morales', gender: 'f', year: 'Freshman', dept: 'dept-mgmt', gpa: 3.62, risk: false },
    { name: 'Gabriel Santos', gender: 'm', year: 'Junior', dept: 'dept-mgmt', gpa: 3.81, risk: false },
    { name: 'Hannah Wright', gender: 'f', year: 'Senior', dept: 'dept-cse', gpa: 3.52, risk: false },
    { name: 'Ryan Park', gender: 'm', year: 'Freshman', dept: 'dept-cse', gpa: 3.30, risk: false },
    { name: 'Elena Gomez', gender: 'f', year: 'Junior', dept: 'dept-ee', gpa: 3.69, risk: false },
    { name: 'Noah Goldberg', gender: 'm', year: 'Sophomore', dept: 'dept-me', gpa: 3.42, risk: false }
  ];

  const students: User[] = studentNames.map((s, idx) => {
    const idNum = String(idx + 1).padStart(3, '0');
    const deptPrefix = s.dept.replace('dept-', '').toUpperCase();
    const gradYear = s.year === 'Freshman' ? '28' : s.year === 'Sophomore' ? '27' : s.year === 'Junior' ? '26' : '25';
    const emailPrefix = s.name.toLowerCase().replace(/[^a-z]/g, '.');
    
    // Unsplash avatar avatars
    const avatarList = [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
    ];

    return {
      id: `stud-${idNum}`,
      universityId: `U${gradYear}${deptPrefix}${idNum}`,
      name: s.name,
      email: `${emailPrefix}@student.university.edu`,
      role: 'STUDENT' as const,
      departmentId: s.dept,
      rfidBadgeId: `RFID-${gradYear}${deptPrefix}-${idNum}`,
      classYear: s.year as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior',
      avatarUrl: avatarList[idx % avatarList.length],
      gpa: s.gpa,
      phone: `+1 (555) 241-0${idNum}`
    };
  });

  const users: User[] = [adminUser, ...professors, ...students];

  // 6. Enrollments: Enroll students into matching and elective courses
  const enrollments: Enrollment[] = [];
  students.forEach((stud, sIdx) => {
    // CSE students enrolled in CS-101, CS-301, and elective
    if (stud.departmentId === 'dept-cse') {
      enrollments.push({
        id: `enr-${stud.id}-cs101`,
        studentId: stud.id,
        sectionId: 'sec-cs101-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
      enrollments.push({
        id: `enr-${stud.id}-cs301`,
        studentId: stud.id,
        sectionId: 'sec-cs301-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
      if (sIdx % 2 === 0) {
        enrollments.push({
          id: `enr-${stud.id}-cs404`,
          studentId: stud.id,
          sectionId: 'sec-cs404-a',
          enrolledAt: '2026-08-25T08:00:00Z',
          status: 'ACTIVE'
        });
      } else {
        enrollments.push({
          id: `enr-${stud.id}-mgmt101`,
          studentId: stud.id,
          sectionId: 'sec-mgmt101-a',
          enrolledAt: '2026-08-25T08:00:00Z',
          status: 'ACTIVE'
        });
      }
    } else if (stud.departmentId === 'dept-ee') {
      enrollments.push({
        id: `enr-${stud.id}-ee201`,
        studentId: stud.id,
        sectionId: 'sec-ee201-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
      enrollments.push({
        id: `enr-${stud.id}-cs101`,
        studentId: stud.id,
        sectionId: 'sec-cs101-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
      enrollments.push({
        id: `enr-${stud.id}-mgmt101`,
        studentId: stud.id,
        sectionId: 'sec-mgmt101-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
    } else if (stud.departmentId === 'dept-me') {
      enrollments.push({
        id: `enr-${stud.id}-me105`,
        studentId: stud.id,
        sectionId: 'sec-me105-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
      enrollments.push({
        id: `enr-${stud.id}-cs101`,
        studentId: stud.id,
        sectionId: 'sec-cs101-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
      enrollments.push({
        id: `enr-${stud.id}-mgmt101`,
        studentId: stud.id,
        sectionId: 'sec-mgmt101-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
    } else {
      enrollments.push({
        id: `enr-${stud.id}-mgmt101`,
        studentId: stud.id,
        sectionId: 'sec-mgmt101-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
      enrollments.push({
        id: `enr-${stud.id}-cs101`,
        studentId: stud.id,
        sectionId: 'sec-cs101-a',
        enrolledAt: '2026-08-25T08:00:00Z',
        status: 'ACTIVE'
      });
    }
  });

  // 7. Lectures (Past 14 days + Today's Live Active lectures)
  const lectures: Lecture[] = [];
  const attendanceLogs: AttendanceLog[] = [];
  const absenceAppeals: AbsenceAppeal[] = [];
  const warningLetters: AcademicWarningLetter[] = [];

  // Lecture halls with precise coordinates for GPS geofencing
  const hallLocations: Record<string, { lat: number; lng: number; radius: number }> = {
    'Turing Hall A-101': { lat: 37.774929, lng: -122.419416, radius: 65 },
    'Turing Hall B-205': { lat: 37.775110, lng: -122.419100, radius: 60 },
    'Hopper Auditorium': { lat: 37.774780, lng: -122.419890, radius: 80 },
    'Tesla Lab 302': { lat: 37.776000, lng: -122.418500, radius: 55 },
    'Newton Hall 104': { lat: 37.773800, lng: -122.420500, radius: 60 },
    'Lovelace Amphitheater': { lat: 37.775500, lng: -122.417800, radius: 90 }
  };

  const todayStr = '2026-11-03';

  // Create 10 past dates (Mon/Wed/Fri, Tue/Thu over past 3 weeks)
  const pastDates = [
    '2026-10-12', '2026-10-14', '2026-10-16',
    '2026-10-19', '2026-10-21', '2026-10-23',
    '2026-10-26', '2026-10-28', '2026-10-30',
    '2026-11-02'
  ];

  let lecCounter = 1;

  sections.forEach((sec) => {
    const loc = hallLocations[sec.defaultRoom] || { lat: 37.774929, lng: -122.419416, radius: 65 };
    
    // Past completed lectures
    pastDates.slice(0, 8).forEach((pDate, pIdx) => {
      const lecId = `lec-${String(lecCounter++).padStart(3, '0')}`;
      const lecture: Lecture = {
        id: lecId,
        sectionId: sec.id,
        title: `Session ${pIdx + 1}: Core Principles & Applied Practicum`,
        date: pDate,
        startTime: sec.scheduleTime.includes('09:00') ? '09:00' : '11:00',
        endTime: sec.scheduleTime.includes('09:00') ? '10:30' : '12:30',
        hall: sec.defaultRoom,
        geofenceLat: loc.lat,
        geofenceLng: loc.lng,
        geofenceRadiusMeters: loc.radius,
        status: 'COMPLETED',
        gracePeriodMinutes: 10,
        lateCutoffMinutes: 25
      };
      lectures.push(lecture);

      // Create attendance logs for enrolled students in this section
      const enrolledInSec = enrollments.filter(e => e.sectionId === sec.id);
      enrolledInSec.forEach((enr) => {
        const student = students.find(s => s.id === enr.studentId)!;
        const studentRiskMeta = studentNames.find(sn => sn.name === student.name);
        const isAtRisk = studentRiskMeta?.risk || false;

        let status: AttendanceStatus = 'PRESENT';
        let method: CheckInMethod = 'RFID_SCAN';
        let checkInTime: string | undefined = `${pDate}T09:04:15Z`;

        const roll = Math.random();
        if (isAtRisk) {
          // At-risk students have ~40-60% attendance
          if (roll < 0.45) {
            status = 'ABSENT';
            checkInTime = undefined;
            method = 'SYSTEM_AUTO';
          } else if (roll < 0.70) {
            status = 'LATE';
            checkInTime = `${pDate}T09:16:30Z`;
            method = 'DYNAMIC_QR';
          } else {
            status = 'PRESENT';
            method = (roll > 0.85) ? 'GEOFENCE_GPS' : 'RFID_SCAN';
          }
        } else {
          // Healthy students have ~90-95% attendance
          if (roll < 0.05) {
            status = 'ABSENT';
            checkInTime = undefined;
            method = 'SYSTEM_AUTO';
          } else if (roll < 0.12) {
            status = 'LATE';
            checkInTime = `${pDate}T09:12:45Z`;
            method = 'DYNAMIC_QR';
          } else if (roll < 0.15) {
            status = 'EXCUSED';
            checkInTime = undefined;
            method = 'MANUAL_OVERRIDE';
          } else {
            status = 'PRESENT';
            method = roll > 0.5 ? 'RFID_SCAN' : roll > 0.25 ? 'DYNAMIC_QR' : 'GEOFENCE_GPS';
          }
        }

        const logId = `log-${lecId}-${student.id}`;
        attendanceLogs.push({
          id: logId,
          lectureId: lecId,
          studentId: student.id,
          status,
          checkInTime,
          checkInMethod: method,
          deviceIp: '192.168.10.' + (Math.floor(Math.random() * 200) + 10),
          gpsLat: loc.lat + (Math.random() - 0.5) * 0.0003,
          gpsLng: loc.lng + (Math.random() - 0.5) * 0.0003,
          distanceFromHallMeters: status === 'PRESENT' ? Math.floor(Math.random() * 35) + 5 : undefined,
          verifiedByInstructor: true,
          notes: status === 'LATE' ? 'Arrived during grace cutoff window' : undefined
        });

        // Add an appeal for a few absent/late logs
        if (status === 'ABSENT' && Math.random() < 0.18) {
          absenceAppeals.push({
            id: `apl-${logId}`,
            attendanceLogId: logId,
            studentId: student.id,
            reasonCategory: Math.random() > 0.5 ? 'MEDICAL' : 'ACADEMIC_CONFLICT',
            explanation: 'Underwent urgent health checkup at university health center. Attached medical certificate from Dr. Adams.',
            documentUrl: 'https://university.edu/health-center/records/cert-99214.pdf',
            status: Math.random() > 0.5 ? 'APPROVED' : 'PENDING',
            submittedAt: `${pDate}T16:30:00Z`,
            reviewedBy: Math.random() > 0.5 ? 'prof-01' : undefined,
            reviewerComment: 'Valid medical slip verified with health services registry.'
          });
        }
      });
    });

    // 8. Today's Lectures (Live sessions)
    const liveLecId = `lec-live-${sec.id}`;
    const isInProgress = (sec.id === 'sec-cs101-a' || sec.id === 'sec-ee201-a');
    const isCompletedEarlierToday = sec.id === 'sec-me105-a';
    
    // Dynamic rotating TOTP token representation
    const dynamicCode = `UNIV-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiresAt = new Date(Date.now() + 30 * 1000).toISOString();

    const todayLecture: Lecture = {
      id: liveLecId,
      sectionId: sec.id,
      title: isInProgress 
        ? `Live Lecture: Active Seminar & Architecture Review` 
        : `Lecture Session: Advanced Laboratory Discussion`,
      date: todayStr,
      startTime: isInProgress ? '14:30' : isCompletedEarlierToday ? '09:00' : '16:00',
      endTime: isInProgress ? '16:00' : isCompletedEarlierToday ? '10:30' : '17:30',
      hall: sec.defaultRoom,
      geofenceLat: loc.lat,
      geofenceLng: loc.lng,
      geofenceRadiusMeters: loc.radius,
      dynamicQrSecret: 'SECRET-KEY-' + sec.id,
      dynamicQrCode: dynamicCode,
      dynamicQrExpiresAt: expiresAt,
      status: isInProgress ? 'IN_PROGRESS' : isCompletedEarlierToday ? 'COMPLETED' : 'SCHEDULED',
      gracePeriodMinutes: 10,
      lateCutoffMinutes: 25
    };
    lectures.push(todayLecture);

    // If in progress or completed today, generate attendance logs
    if (isInProgress || isCompletedEarlierToday) {
      const enrolledInSec = enrollments.filter(e => e.sectionId === sec.id);
      enrolledInSec.forEach((enr, eIdx) => {
        const student = students.find(s => s.id === enr.studentId)!;
        const studentRiskMeta = studentNames.find(sn => sn.name === student.name);
        const isAtRisk = studentRiskMeta?.risk || false;

        // In progress: some students checked in, some not yet
        let status: AttendanceStatus = 'ABSENT';
        let checkInTime: string | undefined = undefined;
        let method: CheckInMethod = 'SYSTEM_AUTO';

        const checkedInRatio = isInProgress ? 0.78 : 0.88;
        if (Math.random() < checkedInRatio && (!isAtRisk || Math.random() > 0.4)) {
          status = eIdx % 6 === 0 ? 'LATE' : 'PRESENT';
          checkInTime = `${todayStr}T14:${String(Math.floor(Math.random() * 25) + 31).padStart(2, '0')}:22Z`;
          method = eIdx % 3 === 0 ? 'DYNAMIC_QR' : eIdx % 2 === 0 ? 'RFID_SCAN' : 'GEOFENCE_GPS';
        }

        attendanceLogs.push({
          id: `log-${liveLecId}-${student.id}`,
          lectureId: liveLecId,
          studentId: student.id,
          status,
          checkInTime,
          checkInMethod: method,
          deviceIp: '192.168.10.' + (100 + eIdx),
          gpsLat: loc.lat + (Math.random() - 0.5) * 0.0002,
          gpsLng: loc.lng + (Math.random() - 0.5) * 0.0002,
          distanceFromHallMeters: status === 'PRESENT' ? Math.floor(Math.random() * 20) + 3 : undefined,
          verifiedByInstructor: status !== 'ABSENT',
          notes: undefined
        });
      });
    }
  });

  // 9. Pre-generate Academic Warning Letters for Students below 75%
  // Let's compute actual course-wise attendance for students
  const atRiskStudents = studentNames.filter(s => s.risk);
  atRiskStudents.forEach((riskMeta, rIdx) => {
    const student = students.find(s => s.name === riskMeta.name);
    if (!student) return;

    const course = courses[rIdx % courses.length];
    const letterId = `warn-let-${student.id}-${course.id}`;
    
    const percentage = Number((58.5 + (rIdx * 2.8)).toFixed(1));
    const stage: WarningStage = percentage < 65 ? 'STAGE_2_PROBATION' : 'STAGE_1_CAUTION';

    warningLetters.push({
      id: letterId,
      studentId: student.id,
      courseId: course.id,
      attendancePercentage: percentage,
      thresholdPercentage: 75.0,
      warningStage: stage,
      status: 'ISSUED',
      letterBodyHtml: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #991b1b; margin-bottom: 4px;">OFFICIAL ACADEMIC ATTENDANCE ADVISORY</h2>
          <p style="color: #64748b; font-size: 13px;">OFFICE OF THE UNIVERSITY REGISTRAR & ACADEMIC STANDARDS BOARD</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p><strong>To:</strong> ${student.name} (${student.universityId})</p>
          <p><strong>Department:</strong> ${student.departmentId.toUpperCase()} | <strong>Class:</strong> ${student.classYear}</p>
          <p><strong>Course Under Review:</strong> ${course.code} - ${course.title}</p>
          <p><strong>Recorded Attendance:</strong> <span style="color: #dc2626; font-weight: bold;">${percentage}%</span> (Mandatory Threshold: <strong>75.0%</strong>)</p>
          <p>Dear ${student.name},</p>
          <p>This official notification informs you that your cumulative class participation in <strong>${course.code}</strong> has dropped below the university-mandated threshold of 75%. Pursuant to Senate Academic Regulation 4.2B, regular attendance is a prerequisite for examination eligibility and semester credit accreditation.</p>
          <p>You have been placed under <strong>${stage.replace(/_/g, ' ')}</strong> status. You are strongly instructed to schedule an immediate consultation with your course faculty advisor.</p>
          <p style="margin-top: 24px;">Sincerely,<br/><strong>Academic Review Board & Registrar's Office</strong></p>
        </div>
      `,
      issuedAt: '2026-11-01T10:00:00Z'
    });
  });

  return {
    departments,
    courses,
    sections,
    users,
    enrollments,
    lectures,
    attendanceLogs,
    absenceAppeals,
    warningLetters
  };
}

