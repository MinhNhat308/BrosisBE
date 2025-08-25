import { Request, Response } from 'express';

// Get all document types
export const getAllDocumentTypes = async (req: Request, res: Response) => {
  try {
    const documentTypes = [
      {
        id: 1,
        name: "Hồ sơ nhập học",
        required: true,
        deadline: "2024-08-15"
      },
      {
        id: 2,
        name: "Đơn xin học bổng",
        required: false,
        deadline: "2024-09-01"
      },
      {
        id: 3,
        name: "Giấy khám sức khỏe",
        required: true,
        deadline: "2024-08-30"
      },
      {
        id: 4,
        name: "Đơn xin ở KTX",
        required: false,
        deadline: "2024-09-15"
      },
      {
        id: 5,
        name: "Bảo hiểm Y tế",
        required: true,
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
      message: 'Error fetching document types',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
