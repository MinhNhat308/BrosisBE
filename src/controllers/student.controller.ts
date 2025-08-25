import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validate student by student_id (MSSV)
export const validateStudent = async (req: Request, res: Response) => {
  try {
    const { student_id } = req.body;
    
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Mã sinh viên không được để trống'
      });
    }

    // Find student by student_id
    const student = await prisma.students.findFirst({
      where: { student_id: student_id }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy sinh viên với MSSV: ${student_id}`
      });
    }

    // Find event registrations for this student
    const registrations = await prisma.event_registrations.findMany({
      where: { student_id: student_id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            start_date: true,
            status: true,
            location: true
          }
        }
      },
      orderBy: {
        registered_at: 'desc'
      }
    });

    return res.json({
      success: true,
      message: 'Sinh viên hợp lệ',
      data: {
        id: student.id,
        student_id: student.student_id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        department: student.department,
        registered_events: registrations
      }
    });

  } catch (error) {
    console.error('Error validating student:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi kiểm tra sinh viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all students with their event participations and document submissions
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    // Simple query first - no relations
    const students = await prisma.students.findMany({
      orderBy: {
        student_id: 'asc'
      }
    });

    res.json({
      success: true,
      data: students,
      total: students.length
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sinh viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get student by ID with detailed info
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
      include: {
        event_participations: {
          include: {
            event: true
          }
        },
        document_submissions: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sinh viên'
      });
    }

    return res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin sinh viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create new student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const {
      student_id,
      name,
      email,
      phone,
      parent_name,
      parent_phone,
      department,
      contact_status,
      insurance_status,
      address,
      notes
    } = req.body;

    const student = await prisma.students.create({
      data: {
        student_id,
        name,
        email,
        phone,
        parent_name,
        parent_phone,
        department,
        contact_status: contact_status || 'pending',
        insurance_status: insurance_status || 'pending',
        address,
        notes
      }
    });

    res.status(201).json({
      success: true,
      data: student,
      message: 'Tạo sinh viên thành công'
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo sinh viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update student
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const student = await prisma.students.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      data: student,
      message: 'Cập nhật sinh viên thành công'
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật sinh viên',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update student event participation
export const updateStudentEventParticipation = async (req: Request, res: Response) => {
  try {
    const { student_id, event_id } = req.params;
    const { participation_status, registration_note, contact_info } = req.body;

    const participation = await prisma.student_events.upsert({
      where: {
        student_id_event_id: {
          student_id: parseInt(student_id),
          event_id: parseInt(event_id)
        }
      },
      update: {
        participation_status,
        registration_note,
        contact_info,
        registered_at: participation_status !== 'not_registered' ? new Date() : null
      },
      create: {
        student_id: parseInt(student_id),
        event_id: parseInt(event_id),
        participation_status,
        registration_note,
        contact_info,
        registered_at: participation_status !== 'not_registered' ? new Date() : null
      }
    });

    res.json({
      success: true,
      data: participation,
      message: 'Cập nhật trạng thái tham gia sự kiện thành công'
    });
  } catch (error) {
    console.error('Error updating event participation:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái tham gia sự kiện',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update student document submission
export const updateStudentDocumentSubmission = async (req: Request, res: Response) => {
  try {
    const { student_id, document_id } = req.params;
    const { submission_status, file_url, notes } = req.body;

    const submission = await prisma.student_documents.update({
      where: { id: parseInt(document_id) },
      data: {
        submission_status,
        file_url,
        notes,
        submitted_at: submission_status === 'submitted' ? new Date() : null
      }
    });

    res.json({
      success: true,
      data: submission,
      message: 'Cập nhật trạng thái nộp hồ sơ thành công'
    });
  } catch (error) {
    console.error('Error updating document submission:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái nộp hồ sơ',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create sample data (20 students)
export const createSampleData = async (req: Request, res: Response) => {
  try {
    // Create 20 students
    const studentsData = [
      {
        student_id: "SE170001",
        name: "Nguyễn Văn An",
        email: "an.nguyen@fpt.edu.vn",
        phone: "0123456789",
        parent_name: "Nguyễn Văn Bình",
        parent_phone: "0987654321",
        department: "Kỹ thuật phần mềm",
        contact_status: "contacted",
        insurance_status: "active",
        address: "123 Đường ABC, Quận 1, TP.HCM"
      },
      {
        student_id: "GD170002",
        name: "Trần Thị Bình",
        email: "binh.tran@fpt.edu.vn",
        phone: "0123456790",
        parent_name: "Trần Văn Cường",
        parent_phone: "0987654322",
        department: "Thiết kế đồ họa",
        contact_status: "pending",
        insurance_status: "pending",
        address: "456 Đường DEF, Quận 2, TP.HCM"
      },
      {
        student_id: "IT170003",
        name: "Lê Văn Cường",
        email: "cuong.le@fpt.edu.vn",
        phone: "0123456791",
        parent_name: "Lê Thị Dung",
        parent_phone: "0987654323",
        department: "Công nghệ thông tin",
        contact_status: "contacted",
        insurance_status: "active",
        address: "789 Đường GHI, Quận 3, TP.HCM"
      },
      {
        student_id: "AI170004",
        name: "Phạm Thị Dung",
        email: "dung.pham@fpt.edu.vn",
        phone: "0123456792",
        parent_name: "Phạm Văn Em",
        parent_phone: "0987654324",
        department: "Trí tuệ nhân tạo",
        contact_status: "no_response",
        insurance_status: "expired",
        address: "321 Đường JKL, Quận 4, TP.HCM"
      },
      {
        student_id: "SE170005",
        name: "Hoàng Văn Em",
        email: "em.hoang@fpt.edu.vn",
        phone: "0123456793",
        parent_name: "Hoàng Thị Phượng",
        parent_phone: "0987654325",
        department: "Kỹ thuật phần mềm",
        contact_status: "contacted",
        insurance_status: "active",
        address: "654 Đường MNO, Quận 5, TP.HCM"
      }
    ];

    // Generate 15 more students
    for (let i = 6; i <= 20; i++) {
      const departments = ["Kỹ thuật phần mềm", "Thiết kế đồ họa", "Công nghệ thông tin", "Trí tuệ nhân tạo", "An ninh mạng"];
      const contactStatuses = ["contacted", "pending", "no_response"];
      const insuranceStatuses = ["active", "pending", "expired"];
      
      studentsData.push({
        student_id: `ST${170000 + i}`,
        name: `Sinh viên ${i}`,
        email: `student${i}@fpt.edu.vn`,
        phone: `012345679${i}`,
        parent_name: `Phụ huynh ${i}`,
        parent_phone: `098765432${i}`,
        department: departments[Math.floor(Math.random() * departments.length)],
        contact_status: contactStatuses[Math.floor(Math.random() * contactStatuses.length)],
        insurance_status: insuranceStatuses[Math.floor(Math.random() * insuranceStatuses.length)],
        address: `${i}00 Đường XYZ, Quận ${i % 10 + 1}, TP.HCM`
      });
    }

    // Insert students
    const students = await prisma.students.createMany({
      data: studentsData,
      skipDuplicates: true
    });

    res.json({
      success: true,
      message: `Tạo thành công ${students.count} sinh viên`,
      data: students
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo dữ liệu mẫu',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get statistics
export const getStudentStatistics = async (req: Request, res: Response) => {
  try {
    const totalStudents = await prisma.students.count();
    const contactedStudents = await prisma.students.count({
      where: { contact_status: 'contacted' }
    });
    const activeInsurance = await prisma.students.count({
      where: { insurance_status: 'active' }
    });
    const totalEventParticipations = await prisma.student_events.count({
      where: { participation_status: { not: 'not_registered' } }
    });
    const totalDocumentSubmissions = await prisma.student_documents.count({
      where: { submission_status: 'submitted' }
    });

    res.json({
      success: true,
      data: {
        totalStudents,
        contactedStudents,
        activeInsurance,
        totalEventParticipations,
        totalDocumentSubmissions,
        contactRate: totalStudents > 0 ? Math.round((contactedStudents / totalStudents) * 100) : 0,
        insuranceRate: totalStudents > 0 ? Math.round((activeInsurance / totalStudents) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
