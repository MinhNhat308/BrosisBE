const express = require('express');
const cors = require('cors');

const app = express();
const port = 8081;

app.use(cors());
app.use(express.json());

// Mock data cho 20 sinh viên
const mockStudents = [
  {
    id: 1,
    student_id: "SE170001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@fpt.edu.vn",
    phone: "0123456789",
    parent_name: "Nguyễn Văn Bình",
    parent_phone: "0987654321",
    department: "Kỹ thuật phần mềm",
    contact_status: "contacted",
    insurance_status: "active",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    notes: "Sinh viên tích cực",
    status: "active"
  },
  {
    id: 2,
    student_id: "GD170002",
    name: "Trần Thị Bình",
    email: "binh.tran@fpt.edu.vn",
    phone: "0123456790",
    parent_name: "Trần Văn Cường",
    parent_phone: "0987654322",
    department: "Thiết kế đồ họa",
    contact_status: "pending",
    insurance_status: "pending",
    address: "456 Đường DEF, Quận 2, TP.HCM",
    notes: "Cần liên hệ",
    status: "active"
  }
];

// Generate thêm 18 sinh viên nữa
for (let i = 3; i <= 20; i++) {
  const departments = ["Kỹ thuật phần mềm", "Thiết kế đồ họa", "Công nghệ thông tin", "Trí tuệ nhân tạo", "An ninh mạng"];
  const contactStatuses = ["contacted", "pending", "no_response"];
  const insuranceStatuses = ["active", "pending", "expired"];
  
  mockStudents.push({
    id: i,
    student_id: `ST${170000 + i}`,
    name: `Sinh viên ${i}`,
    email: `student${i}@fpt.edu.vn`,
    phone: `012345679${i}`,
    parent_name: `Phụ huynh ${i}`,
    parent_phone: `098765432${i}`,
    department: departments[Math.floor(Math.random() * departments.length)],
    contact_status: contactStatuses[Math.floor(Math.random() * contactStatuses.length)],
    insurance_status: insuranceStatuses[Math.floor(Math.random() * insuranceStatuses.length)],
    address: `${i}00 Đường XYZ, Quận ${i % 10 + 1}, TP.HCM`,
    notes: `Ghi chú cho sinh viên ${i}`,
    status: "active"
  });
}

// Mock data cho events
const mockEvents = [
  {
    id: 1,
    title: "Workshop React cơ bản",
    date: "2024-02-10",
    location: "Phòng Lab A",
    type: "Workshop",
    status: "completed"
  },
  {
    id: 2,
    title: "Hackathon 48h",
    date: "2024-01-20",
    location: "Hội trường lớn",
    type: "Competition",
    status: "completed"
  },
  {
    id: 3,
    title: "Seminar AI/ML",
    date: "2024-03-15",
    location: "Phòng hội thảo",
    type: "Seminar",
    status: "upcoming"
  }
];

// Mock data cho event participations
const mockEventParticipations = [];
mockStudents.forEach(student => {
  mockEvents.forEach(event => {
    const statuses = ["attended", "registered", "excuse", "not_registered"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (status !== "not_registered") {
      mockEventParticipations.push({
        id: mockEventParticipations.length + 1,
        student_id: student.id,
        event_id: event.id,
        participation_status: status,
        registered_at: "2024-01-15",
        registration_note: `Ghi chú cho ${student.name}`,
        contact_info: student.phone
      });
    }
  });
});

// Mock data cho documents
const documentTypes = [
  { id: 1, name: "Hồ sơ nhập học", required: true, deadline: "2024-08-15" },
  { id: 2, name: "Đơn xin học bổng", required: false, deadline: "2024-09-01" },
  { id: 3, name: "Giấy khám sức khỏe", required: true, deadline: "2024-08-30" },
  { id: 4, name: "Đơn xin ở KTX", required: false, deadline: "2024-09-15" },
  { id: 5, name: "Bảo hiểm Y tế", required: true, deadline: "2024-09-01" }
];

const mockDocumentSubmissions = [];
mockStudents.forEach(student => {
  documentTypes.forEach(docType => {
    const isSubmitted = Math.random() > 0.4; // 60% chance of being submitted
    
    mockDocumentSubmissions.push({
      id: mockDocumentSubmissions.length + 1,
      student_id: student.id,
      document_type: docType.name,
      document_name: docType.name,
      description: `Mô tả cho ${docType.name}`,
      submission_status: isSubmitted ? "submitted" : "not_submitted",
      submitted_at: isSubmitted ? "2024-01-20" : null,
      deadline: docType.deadline,
      is_required: docType.required,
      notes: `Ghi chú cho ${docType.name}`
    });
  });
});

// API Routes

// Get all students
app.get('/students', (req, res) => {
  const studentsWithDetails = mockStudents.map(student => {
    const eventParticipations = mockEventParticipations.filter(p => p.student_id === student.id);
    const documentSubmissions = mockDocumentSubmissions.filter(d => d.student_id === student.id);
    
    return {
      ...student,
      event_participations: eventParticipations.map(p => ({
        ...p,
        event: mockEvents.find(e => e.id === p.event_id)
      })),
      document_submissions: documentSubmissions
    };
  });

  res.json({
    success: true,
    data: studentsWithDetails,
    total: studentsWithDetails.length
  });
});

// Get student statistics
app.get('/students/statistics', (req, res) => {
  const totalStudents = mockStudents.length;
  const contactedStudents = mockStudents.filter(s => s.contact_status === 'contacted').length;
  const activeInsurance = mockStudents.filter(s => s.insurance_status === 'active').length;
  const totalEventParticipations = mockEventParticipations.length;
  const totalDocumentSubmissions = mockDocumentSubmissions.filter(d => d.submission_status === 'submitted').length;

  res.json({
    success: true,
    data: {
      totalStudents,
      contactedStudents,
      activeInsurance,
      totalEventParticipations,
      totalDocumentSubmissions,
      contactRate: Math.round((contactedStudents / totalStudents) * 100),
      insuranceRate: Math.round((activeInsurance / totalStudents) * 100)
    }
  });
});

// Get student by ID
app.get('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = mockStudents.find(s => s.id === studentId);
  
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy sinh viên'
    });
  }

  const eventParticipations = mockEventParticipations.filter(p => p.student_id === studentId);
  const documentSubmissions = mockDocumentSubmissions.filter(d => d.student_id === studentId);

  res.json({
    success: true,
    data: {
      ...student,
      event_participations: eventParticipations.map(p => ({
        ...p,
        event: mockEvents.find(e => e.id === p.event_id)
      })),
      document_submissions: documentSubmissions
    }
  });
});

// Get all events
app.get('/events', (req, res) => {
  res.json({
    success: true,
    data: mockEvents
  });
});

// Get document types
app.get('/documents/types', (req, res) => {
  res.json({
    success: true,
    data: documentTypes
  });
});

// Update student event participation
app.put('/students/:student_id/events/:event_id', (req, res) => {
  const { student_id, event_id } = req.params;
  const { participation_status, registration_note, contact_info } = req.body;

  const existingIndex = mockEventParticipations.findIndex(
    p => p.student_id === parseInt(student_id) && p.event_id === parseInt(event_id)
  );

  if (existingIndex >= 0) {
    mockEventParticipations[existingIndex] = {
      ...mockEventParticipations[existingIndex],
      participation_status,
      registration_note,
      contact_info,
      registered_at: participation_status !== 'not_registered' ? new Date().toISOString() : null
    };
  } else {
    mockEventParticipations.push({
      id: mockEventParticipations.length + 1,
      student_id: parseInt(student_id),
      event_id: parseInt(event_id),
      participation_status,
      registration_note,
      contact_info,
      registered_at: participation_status !== 'not_registered' ? new Date().toISOString() : null
    });
  }

  res.json({
    success: true,
    message: 'Cập nhật trạng thái tham gia sự kiện thành công'
  });
});

// Update student document submission
app.put('/documents/:id', (req, res) => {
  const docId = parseInt(req.params.id);
  const { submission_status, notes } = req.body;

  const docIndex = mockDocumentSubmissions.findIndex(d => d.id === docId);
  
  if (docIndex >= 0) {
    mockDocumentSubmissions[docIndex] = {
      ...mockDocumentSubmissions[docIndex],
      submission_status,
      notes,
      submitted_at: submission_status === 'submitted' ? new Date().toISOString() : null
    };

    res.json({
      success: true,
      message: 'Cập nhật trạng thái nộp hồ sơ thành công'
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Không tìm thấy hồ sơ'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Mock API Server running on port ${port}`);
  console.log(`📊 Students: ${mockStudents.length}`);
  console.log(`🎯 Events: ${mockEvents.length}`);
  console.log(`📋 Document submissions: ${mockDocumentSubmissions.length}`);
});
