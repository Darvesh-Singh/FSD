-- Native SQL DDL Schema for University Smart Attendance System
-- PostgreSQL / SQLite compatible schema

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(16) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    building VARCHAR(128) NOT NULL,
    head_of_department VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    credits INT DEFAULT 3,
    semester VARCHAR(32) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    university_id VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(16) NOT NULL CHECK(role IN ('ADMIN', 'PROFESSOR', 'STUDENT')),
    department_id VARCHAR(64) NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    rfid_badge_id VARCHAR(64) UNIQUE,
    class_year VARCHAR(32), -- Freshman, Sophomore, Junior, Senior
    avatar_url TEXT,
    gpa NUMERIC(3,2) DEFAULT 3.50,
    phone VARCHAR(32),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
    id VARCHAR(64) PRIMARY KEY,
    section_code VARCHAR(32) NOT NULL,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    instructor_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    capacity INT DEFAULT 60,
    default_room VARCHAR(64) NOT NULL,
    schedule_time VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, section_code)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_id VARCHAR(64) NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(16) DEFAULT 'ACTIVE',
    UNIQUE(student_id, section_id)
);

CREATE TABLE IF NOT EXISTS lectures (
    id VARCHAR(64) PRIMARY KEY,
    section_id VARCHAR(64) NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    hall VARCHAR(128) NOT NULL,
    geofence_lat NUMERIC(9,6) DEFAULT 37.774929,
    geofence_lng NUMERIC(9,6) DEFAULT -122.419416,
    geofence_radius_meters NUMERIC(6,2) DEFAULT 65.0,
    dynamic_qr_secret VARCHAR(128),
    dynamic_qr_code VARCHAR(128),
    dynamic_qr_expires_at TIMESTAMP,
    status VARCHAR(16) DEFAULT 'SCHEDULED' CHECK(status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    grace_period_minutes INT DEFAULT 10,
    late_cutoff_minutes INT DEFAULT 25,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance_logs (
    id VARCHAR(64) PRIMARY KEY,
    lecture_id VARCHAR(64) NOT NULL REFERENCES lectures(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(16) NOT NULL CHECK(status IN ('PRESENT', 'LATE', 'ABSENT', 'EXCUSED')),
    check_in_time TIMESTAMP,
    check_in_method VARCHAR(32) DEFAULT 'SYSTEM_AUTO' CHECK(check_in_method IN ('RFID_SCAN', 'DYNAMIC_QR', 'GEOFENCE_GPS', 'MANUAL_OVERRIDE', 'SYSTEM_AUTO')),
    device_ip VARCHAR(64),
    gps_lat NUMERIC(9,6),
    gps_lng NUMERIC(9,6),
    distance_from_hall_meters NUMERIC(7,2),
    verified_by_instructor BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lecture_id, student_id)
);

CREATE TABLE IF NOT EXISTS absence_appeals (
    id VARCHAR(64) PRIMARY KEY,
    attendance_log_id VARCHAR(64) NOT NULL REFERENCES attendance_logs(id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason_category VARCHAR(32) NOT NULL,
    explanation TEXT NOT NULL,
    document_url TEXT,
    status VARCHAR(16) DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by VARCHAR(64),
    reviewer_comment TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_warning_letters (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(64) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    attendance_percentage NUMERIC(5,2) NOT NULL,
    threshold_percentage NUMERIC(5,2) DEFAULT 75.0,
    warning_stage VARCHAR(32) DEFAULT 'STAGE_1_CAUTION' CHECK(warning_stage IN ('STAGE_1_CAUTION', 'STAGE_2_PROBATION', 'STAGE_3_DEBARMENT')),
    status VARCHAR(16) DEFAULT 'ISSUED',
    letter_body_html TEXT NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_lecture ON attendance_logs(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lectures_date ON lectures(date);
CREATE INDEX IF NOT EXISTS idx_lectures_status ON lectures(status);
CREATE INDEX IF NOT EXISTS idx_enrollment_section ON enrollments(section_id);

