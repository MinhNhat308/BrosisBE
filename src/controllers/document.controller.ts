import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all document types/templates
export const getAllDocumentTypes = async (req: Request, res: Response) => {
  try {
    // Return standard document types that students need to submit
    const documentTypes = [
      {
        id: 1,
        document_type: "Hồ sơ nhập học",
        document_name: "Hồ sơ nhập học đầy đủ",
        description: "Giấy tờ tùy thân, học bạ THPT, chứng minh thu nhập gia đình",
        is_required: true,
        deadline: "2024-08-15"
      },
      {
        id: 2,
        document_type: "Đơn xin học bổng",
        document_name: "Đơn xin học bổng",
        description: "Đơn xin học bổng và các giấy tờ chứng minh hoàn cảnh",
        is_required: false,
        deadline: "2024-09-01"
      },
      {
        id: 3,
        document_type: "Giấy khám sức khỏe",
        document_name: "Giấy khám sức khỏe",
        description: "Giấy khám sức khỏe từ bệnh viện công lập",
        is_required: true,
        deadline: "2024-08-30"
      },
      {
        id: 4,
        document_type: "Đơn xin ở KTX",
        document_name: "Đơn đăng ký ký túc xá",
        description: "Đơn đăng ký ở ký túc xá và giấy tờ liên quan",
        is_required: false,
        deadline: "2024-09-15"
      },
      {
        id: 5,
        document_type: "Bảo hiểm Y tế",
        document_name: "Thẻ bảo hiểm y tế",
        description: "Thẻ bảo hiểm y tế sinh viên hoặc giấy tờ liên quan",
        is_required: true,
        deadline: "2024-09-01"
      }
    ];

    res.json({
      success: true,
      data: documentTypes
    });
  } catch (error) {
    console.error('Error fetching document types:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách loại hồ sơ',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create document requirements for all students
export const createDocumentRequirementsForAllStudents = async (req: Request, res: Response) => {
  try {
    // Get all students
    const students = await prisma.students.findMany({
      select: { id: true }
    });

    const documentTypes = [
      {
        document_type: "Hồ sơ nhập học",
        document_name: "Hồ sơ nhập học đầy đủ",
        description: "Giấy tờ tùy thân, học bạ THPT, chứng minh thu nhập gia đình",
        is_required: true,
        deadline: new Date("2024-08-15")
      },
      {
        document_type: "Đơn xin học bổng",
        document_name: "Đơn xin học bổng",
        description: "Đơn xin học bổng và các giấy tờ chứng minh hoàn cảnh",
        is_required: false,
        deadline: new Date("2024-09-01")
      },
      {
        document_type: "Giấy khám sức khỏe",
        document_name: "Giấy khám sức khỏe",
        description: "Giấy khám sức khỏe từ bệnh viện công lập",
        is_required: true,
        deadline: new Date("2024-08-30")
      },
      {
        document_type: "Đơn xin ở KTX",
        document_name: "Đơn đăng ký ký túc xá",
        description: "Đơn đăng ký ở ký túc xá và giấy tờ liên quan",
        is_required: false,
        deadline: new Date("2024-09-15")
      },
      {
        document_type: "Bảo hiểm Y tế",
        document_name: "Thẻ bảo hiểm y tế",
        description: "Thẻ bảo hiểm y tế sinh viên hoặc giấy tờ liên quan",
        is_required: true,
        deadline: new Date("2024-09-01")
      }
    ];

    // Create document requirements for each student
    const documentsToCreate = [];
    for (const student of students) {
      for (const docType of documentTypes) {
        // Randomly assign some as submitted for demo
        const isSubmitted = Math.random() > 0.6; // 40% chance of being submitted
        
        documentsToCreate.push({
          student_id: student.id,
          document_type: docType.document_type,
          document_name: docType.document_name,
          description: docType.description,
          submission_status: isSubmitted ? 'submitted' : 'not_submitted',
          submitted_at: isSubmitted ? new Date() : null,
          deadline: docType.deadline,
          is_required: docType.is_required
        });
      }
    }

    const result = await prisma.student_documents.createMany({
      data: documentsToCreate,
      skipDuplicates: true
    });

    res.json({
      success: true,
      message: `Tạo thành công ${result.count} yêu cầu hồ sơ`,
      data: result
    });
  } catch (error) {
    console.error('Error creating document requirements:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo yêu cầu hồ sơ',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get document submissions by student
export const getDocumentSubmissionsByStudent = async (req: Request, res: Response) => {
  try {
    const { student_id } = req.params;

    const submissions = await prisma.student_documents.findMany({
      where: {
        student_id: parseInt(student_id)
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            student_id: true,
            email: true
          }
        }
      },
      orderBy: {
        deadline: 'asc'
      }
    });

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching document submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách hồ sơ',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update document submission status
export const updateDocumentSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { submission_status, file_url, notes } = req.body;

    const submission = await prisma.student_documents.update({
      where: { id: parseInt(id) },
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

// Get document statistics
export const getDocumentStatistics = async (req: Request, res: Response) => {
  try {
    const totalDocuments = await prisma.student_documents.count();
    const submittedDocuments = await prisma.student_documents.count({
      where: { submission_status: 'submitted' }
    });
    const requiredDocuments = await prisma.student_documents.count({
      where: { is_required: true }
    });
    const submittedRequiredDocuments = await prisma.student_documents.count({
      where: { 
        is_required: true,
        submission_status: 'submitted'
      }
    });
    const overdueDocuments = await prisma.student_documents.count({
      where: {
        submission_status: 'not_submitted',
        deadline: {
          lt: new Date()
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalDocuments,
        submittedDocuments,
        requiredDocuments,
        submittedRequiredDocuments,
        overdueDocuments,
        submissionRate: totalDocuments > 0 ? Math.round((submittedDocuments / totalDocuments) * 100) : 0,
        requiredSubmissionRate: requiredDocuments > 0 ? Math.round((submittedRequiredDocuments / requiredDocuments) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching document statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê hồ sơ',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all documents for a specific student
export const getStudentDocuments = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const documents = await prisma.student_documents.findMany({
      where: {
        student_id: parseInt(studentId)
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching student documents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update document submission status
export const updateDocumentStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { documentId } = req.params;
    const { submission_status, notes } = req.body;

    // Validate submission status
    const validStatuses = ['not_submitted', 'submitted', 'pending_review', 'approved', 'rejected'];
    if (!submission_status || !validStatuses.includes(submission_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    // Check if document exists
    const existingDocument = await prisma.student_documents.findUnique({
      where: {
        id: parseInt(documentId)
      }
    });

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Update document status
    const updateData: any = {
      submission_status: submission_status,
      updated_at: new Date()
    };

    // If status is submitted, set submitted_at timestamp
    if (submission_status === 'submitted') {
      updateData.submitted_at = new Date();
    }

    // Add notes if provided
    if (notes) {
      updateData.notes = notes;
    }

    const updatedDocument = await prisma.student_documents.update({
      where: {
        id: parseInt(documentId)
      },
      data: updateData
    });

    return res.json({
      success: true,
      message: `Document status updated to ${submission_status}`,
      data: updatedDocument
    });

  } catch (error) {
    console.error('Error updating document status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating document status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create default documents for a student
export const createDefaultDocuments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { studentId } = req.params;

    // Check if student exists
    const student = await prisma.students.findUnique({
      where: {
        id: parseInt(studentId)
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if documents already exist for this student
    const existingDocuments = await prisma.student_documents.findMany({
      where: {
        student_id: parseInt(studentId)
      }
    });

    if (existingDocuments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Documents already exist for this student'
      });
    }

    // Define default documents for FPT University admission
    const defaultDocuments = [
      {
        document_type: 'Biên nhận nhập học',
        document_name: '02 bản gốc Biên nhận nhập học',
        description: 'Biên nhận nhập học theo mẫu của Trường Đại học FPT (02 bản gốc)',
        is_required: true,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Phiếu nhập học',
        document_name: '01 bản gốc Phiếu nhập học',
        description: 'Phiếu nhập học theo mẫu của Trường Đại học FPT (01 bản gốc)',
        is_required: true,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Học bạ THPT',
        document_name: '01 bản sao công chứng Học bạ THPT',
        description: 'Học bạ trung học phổ thông đủ 3 năm, bao gồm cả trang kết quả học tập (hạnh kiểm) & kết quả rèn luyện (học lực) - công chứng cả quyển học bạ',
        is_required: true,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Bằng tốt nghiệp THPT',
        document_name: '01 bản sao công chứng Bằng tốt nghiệp THPT',
        description: 'Bằng tốt nghiệp THPT (hoặc Giấy chứng nhận tốt nghiệp THPT tạm thời và phải nộp bổ sung trong vòng 1 năm)',
        is_required: true,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Căn cước công dân',
        document_name: '01 bản sao công chứng Căn cước/CCCD',
        description: 'Căn cước công dân hoặc Căn cước (01 bản sao công chứng)',
        is_required: true,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Giấy khai sinh',
        document_name: '01 bản sao công chứng Giấy khai sinh',
        description: 'Giấy khai sinh (01 bản sao công chứng)',
        is_required: true,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Ảnh 3x4',
        document_name: '01 ảnh 3×4',
        description: 'Ảnh 3×4 bỏ vào phong bì nhỏ, ghi rõ họ tên và ngày tháng năm sinh ra bên ngoài phong bì và đằng sau ảnh',
        is_required: true,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'SchoolRank',
        document_name: 'Giấy chứng nhận xếp hạng SchoolRank',
        description: 'Giấy chứng nhận xếp hạng SchoolRank trên trang https://schoolrank.fpt.edu.vn/ (áp dụng với thí sinh xét tuyển theo xếp hạng SchoolRank 2025)',
        is_required: false,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Kết quả thi THPT 2025',
        document_name: 'Giấy chứng nhận kết quả thi THPT 2025',
        description: '01 bản gốc hoặc bản sao công chứng Giấy chứng nhận kết quả kỳ thi tốt nghiệp THPT năm 2025 (đối với hồ sơ đăng ký dùng kết quả thi 2025)',
        is_required: false,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Kết quả thi THPT các năm trước',
        document_name: 'Giấy chứng nhận kết quả thi THPT các năm trước',
        description: 'Bản gốc/bản sao công chứng Giấy chứng nhận kết quả thi hoặc xác nhận điểm của Sở GD&ĐT (đối với kết quả thi các năm trước 2025)',
        is_required: false,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Kết quả thi đánh giá năng lực',
        document_name: 'Giấy chứng nhận kết quả thi đánh giá năng lực',
        description: 'Kết quả kỳ thi đánh giá năng lực của ĐHQG Hà Nội hoặc ĐHQG TPHCM năm 2025 (nếu đăng ký theo phương thức này)',
        is_required: false,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Đơn ưu tiên xét tuyển',
        document_name: 'Đơn đăng ký ưu tiên xét tuyển',
        description: '01 Đơn đăng ký ưu tiên xét tuyển (áp dụng cho đối tượng Ưu tiên thế hệ 1)',
        is_required: false,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Giấy tờ xét tuyển thẳng',
        document_name: 'Giấy tờ chứng nhận xét tuyển thẳng',
        description: '01 bản sao công chứng Giấy tờ chứng nhận điều kiện xét tuyển thẳng (nếu đủ điều kiện)',
        is_required: false,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Chứng chỉ chương trình khác',
        document_name: 'Bằng/chứng chỉ chương trình đặc biệt',
        description: '01 bản sao công chứng: Bằng/chứng chỉ APTECH, ARENA, SKILLKING, JETKING, BTEC HND, Melbourne Polytechnic, FUNiX, Cao đẳng FPT Polytechnic (nếu xét tuyển theo Phương thức khác)',
        is_required: false,
        deadline: new Date('2024-09-15')
      },
      {
        document_type: 'Chứng chỉ tiếng Anh',
        document_name: 'Chứng chỉ tiếng Anh quốc tế',
        description: '01 bản sao công chứng Chứng chỉ TOEFL iBT từ 80 hoặc IELTS từ 6.0 hoặc VSTEP bậc 4 hoặc tương đương (nếu có)',
        is_required: false,
        deadline: new Date('2024-09-30')
      }
    ];

    // Create documents for the student
    const createdDocuments = await Promise.all(
      defaultDocuments.map(doc => 
        prisma.student_documents.create({
          data: {
            student_id: parseInt(studentId),
            ...doc
          }
        })
      )
    );

    return res.json({
      success: true,
      message: 'Default documents created successfully',
      data: createdDocuments
    });

  } catch (error) {
    console.error('Error creating default documents:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating default documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
