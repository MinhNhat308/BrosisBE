import { Request, Response } from 'express';

// Simple test endpoint without Prisma
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    // Return mock data first to test
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
      }
    ];

    res.json({
      success: true,
      data: mockStudents,
      total: mockStudents.length
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get student statistics
export const getStudentStatistics = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        totalStudents: 20,
        contactedStudents: 15,
        activeInsurance: 18,
        totalEventParticipations: 45,
        totalDocumentSubmissions: 80,
        contactRate: 75,
        insuranceRate: 90
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create sample data endpoint
export const createSampleData = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'Sample data endpoint works'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
