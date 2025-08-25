import { Request, Response } from 'express';

// Get all events
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const mockEvents = [
      {
        id: 1,
        title: "Workshop React cơ bản",
        start_date: "2024-02-10",
        location: "Phòng Lab A",
        event_type: "Workshop",
        status: "completed"
      },
      {
        id: 2,
        title: "Hackathon 48h",
        start_date: "2024-01-20",
        location: "Hội trường lớn",
        event_type: "Competition",
        status: "completed"
      },
      {
        id: 3,
        title: "Seminar AI/ML",
        start_date: "2024-03-15",
        location: "Phòng hội thảo",
        event_type: "Seminar",
        status: "upcoming"
      }
    ];

    res.json({
      success: true,
      data: mockEvents
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
