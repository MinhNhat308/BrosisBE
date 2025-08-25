import { Request, Response } from 'express';
import prismaService from '../services/prisma.service';

// Update student status - can only be changed once
export const updateStudentStatus = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "inactive"'
      });
    }

    // Check if student exists
    const existingStudent = await prismaService.client.students.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update student status
    const updatedStudent = await prismaService.client.students.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status: status,
        updated_at: new Date()
      }
    });

    res.json({
      success: true,
      message: `Student status updated to ${status}`,
      data: updatedStudent
    });

  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all students from database
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prismaService.client.students.findMany({
      include: {
        event_participations: {
          include: {
            event: true
          }
        },
        document_submissions: true
      },
      orderBy: {
        student_id: 'asc'
      }
    });

    // Calculate statistics for each student
    const studentsWithStats = await Promise.all(students.map(async student => {
      const submittedDocuments = student.document_submissions?.filter(doc => doc.submission_status === 'submitted').length || 0;
      const totalDocuments = student.document_submissions?.length || 0;
      const attendedEvents = student.event_participations?.filter(ep => ep.participation_status === 'attended').length || 0;
      
      // Also check event_registrations table for this student
      const eventRegistrations = await prismaService.client.event_registrations.findMany({
        where: {
          student_id: student.student_id
        },
        include: {
          event: true
        }
      });
      
      return {
        ...student,
        submitted_documents_count: submittedDocuments,
        total_documents_count: totalDocuments,
        attended_events_count: attendedEvents,
        event_registrations: eventRegistrations
      };
    }));

    res.json({
      success: true,
      data: studentsWithStats,
      total: studentsWithStats.length
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

// Get student statistics from database
export const getStudentStatistics = async (req: Request, res: Response) => {
  try {
    const totalStudents = await prismaService.client.students.count();
    
    const contactedStudents = await prismaService.client.students.count({
      where: {
        contact_status: 'contacted'
      }
    });

    const activeInsurance = await prismaService.client.students.count({
      where: {
        insurance_status: 'active'
      }
    });

    const totalEventParticipations = await prismaService.client.student_events.count({
      where: {
        participation_status: 'attended'
      }
    });

    const totalDocumentSubmissions = await prismaService.client.student_documents.count({
      where: {
        submission_status: 'submitted'
      }
    });

    const contactRate = totalStudents > 0 ? Math.round((contactedStudents / totalStudents) * 100) : 0;
    const insuranceRate = totalStudents > 0 ? Math.round((activeInsurance / totalStudents) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        contactedStudents,
        activeInsurance,
        totalEventParticipations,
        totalDocumentSubmissions,
        contactRate,
        insuranceRate
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

// Get student by ID with full details
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const student = await prismaService.client.students.findUnique({
      where: {
        id: parseInt(id)
      },
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
        message: 'Student not found'
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
      message: 'Error fetching student',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
