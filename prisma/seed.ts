import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed Event Categories
  const categories = [
    {
      name: 'orientation',
      description: 'Sự kiện định hướng tân sinh viên',
      color: 'bg-blue-500',
      icon: 'GraduationCap'
    },
    {
      name: 'ceremony',
      description: 'Lễ khai giảng, tốt nghiệp',
      color: 'bg-purple-500',
      icon: 'Award'
    },
    {
      name: 'academic',
      description: 'Sự kiện học tập, kiểm tra',
      color: 'bg-green-500',
      icon: 'BookOpen'
    },
    {
      name: 'career',
      description: 'Hội chợ việc làm, định hướng nghề nghiệp',
      color: 'bg-orange-500',
      icon: 'Briefcase'
    },
    {
      name: 'health',
      description: 'Khám sức khỏe, rèn luyện',
      color: 'bg-red-500',
      icon: 'Heart'
    },
    {
      name: 'exam',
      description: 'Kiểm tra xếp lớp, thi cử',
      color: 'bg-yellow-500',
      icon: 'FileText'
    }
  ];

  for (const category of categories) {
    await prisma.event_categories.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Seed Events for FPT University K21 Schedule
  const events = [
    {
      title: 'Tựu trường - Welcome Tân sinh viên K21',
      description: 'Chính thức chào đón các tân sinh viên K21 đến với đại gia đình FPT University campus TP.HCM',
      full_description: `Sự kiện tựu trường là cột mốc quan trọng đánh dấu bước đầu tiên của hành trình đại học tại FPT University. 

Các hoạt động chính:
- Làm thủ tục tựu trường
- Nhận tài liệu, thẻ sinh viên
- Gặp gỡ cố vấn học tập
- Tham quan campus
- Làm quen với các bạn cùng khóa

Đây là dịp để các bạn tân sinh viên làm quen với môi trường học tập mới và chuẩn bị cho những trải nghiệm thú vị sắp tới.`,
      start_date: new Date('2025-09-03'),
      end_date: new Date('2025-09-04'),
      location: 'FPT University Campus TP.HCM',
      target_audience: 'Tân sinh viên K21',
      event_type: 'orientation',
      priority: 'high',
      is_mandatory: true,
      is_online: false,
      organizer: 'Phòng Đào tạo - FPT University',
      contact_info: 'Email: daotao@fpt.edu.vn | Hotline: 0xxx-xxx-xxx',
      what_to_bring: 'Giấy tờ tùy thân, giấy báo nhập học, ảnh 3x4 (4 ảnh)',
      image_url: '/Unicorn1.jpg',
      registration_required: true,
      registration_deadline: new Date('2025-08-30T23:59:00'),
      tags: {
        create: [
          { tag_name: 'Tân sinh viên' },
          { tag_name: 'K21' },
          { tag_name: 'Tựu trường' },
          { tag_name: 'Campus TPHCM' }
        ]
      }
    },
    {
      title: 'Hướng dẫn Công nghệ thông tin',
      description: 'Buổi hướng dẫn sử dụng các hệ thống công nghệ thông tin của trường (trực tuyến theo ca)',
      full_description: `Buổi hướng dẫn chi tiết về việc sử dụng các hệ thống IT của FPT University:

Nội dung chính:
- Cách sử dụng FPT University Portal
- Hướng dẫn sử dụng email sinh viên
- Cách truy cập và sử dụng hệ thống LMS
- Đăng ký môn học online
- Xem thời khóa biểu và điểm thi
- Sử dụng các ứng dụng hỗ trợ học tập

Sự kiện được tổ chức trực tuyến theo ca để đảm bảo tất cả sinh viên đều được tham gia.`,
      start_date: new Date('2025-09-04'),
      start_time: '08:00',
      end_time: '17:00',
      location: 'Trực tuyến - Zoom/Teams',
      target_audience: 'Tân sinh viên K21',
      event_type: 'academic',
      priority: 'high',
      is_mandatory: true,
      is_online: true,
      organizer: 'Phòng Công nghệ thông tin',
      what_to_bring: 'Laptop, kết nối internet ổn định',
      image_url: '/Unicorn2.jpg',
      registration_required: true,
      tags: {
        create: [
          { tag_name: 'IT Training' },
          { tag_name: 'Online' },
          { tag_name: 'Portal' },
          { tag_name: 'LMS' }
        ]
      }
    },
    {
      title: 'LỄ KHAI GIẢNG NĂM HỌC 2025-2026',
      description: 'Lễ khai giảng trọng thể kết nối trực tuyến toàn quốc, kỷ niệm 80 năm thành lập Bộ Giáo dục & Đào tạo',
      full_description: `Lễ khai giảng năm học 2025-2026 là sự kiện trọng thể được tổ chức đồng loạt tại tất cả các cơ sở của Trường Đại học FPT trên toàn quốc.

Điểm đặc biệt:
- Kết nối trực tuyến với chương trình đặc biệt kỷ niệm 80 năm thành lập Bộ Giáo dục & Đào tạo
- Được truyền hình trực tiếp trên VTV1
- Mở ra khí thế mới cho năm học 2025-2026
- Thông điệp từ Ban Giám hiệu
- Tuyên thệ sinh viên
- Biểu diễn văn nghệ đặc sắc

Đây là sự kiện quan trọng đánh dấu sự khởi đầu chính thức của năm học mới.`,
      start_date: new Date('2025-09-05'),
      start_time: '08:00',
      end_time: '11:00',
      location: 'Hội trường chính + Truyền hình trực tiếp VTV1',
      target_audience: 'Toàn thể sinh viên',
      event_type: 'ceremony',
      priority: 'high',
      is_mandatory: true,
      is_online: false,
      organizer: 'Bộ Giáo dục & Đào tạo + FPT University',
      what_to_bring: 'Trang phục lịch sự, thái độ trang trọng',
      image_url: '/Unicorn3.jpg',
      registration_required: false,
      tags: {
        create: [
          { tag_name: 'Khai giảng' },
          { tag_name: 'VTV1' },
          { tag_name: 'Toàn quốc' },
          { tag_name: '80 năm GD&ĐT' }
        ]
      }
    },
    {
      title: 'Hướng dẫn & Kiểm tra xếp lớp Tiếng Anh',
      description: 'Kiểm tra trình độ và xếp lớp học Tiếng Anh phù hợp với từng sinh viên',
      full_description: `Sự kiện quan trọng để xác định trình độ Tiếng Anh và xếp lớp học phù hợp:

Quy trình:
- Buổi hướng dẫn về chương trình Tiếng Anh
- Kiểm tra trình độ đầu vào (Listening, Reading, Writing, Speaking)
- Phân loại theo các level: Basic, Intermediate, Advanced
- Thông báo kết quả và lịch học

Mục tiêu:
- Đảm bảo sinh viên học Tiếng Anh đúng trình độ
- Tối ưu hóa hiệu quả học tập
- Chuẩn bị tốt cho các môn học chuyên ngành bằng tiếng Anh`,
      start_date: new Date('2025-09-06'),
      end_date: new Date('2025-09-07'),
      start_time: '08:00',
      end_time: '17:00',
      location: 'Các phòng thi Campus TP.HCM',
      target_audience: 'Tân sinh viên K21',
      event_type: 'exam',
      priority: 'high',
      is_mandatory: true,
      is_online: false,
      organizer: 'Khoa Ngôn ngữ - FPT University',
      what_to_bring: 'CCCD/CMND, bút viết, đồng hồ',
      requirements: 'Có mặt đúng giờ, tuân thủ quy chế thi',
      image_url: '/Unicorn4.jpg',
      registration_required: false,
      tags: {
        create: [
          { tag_name: 'Tiếng Anh' },
          { tag_name: 'Placement Test' },
          { tag_name: 'Xếp lớp' },
          { tag_name: 'Language' }
        ]
      }
    },
    {
      title: 'Rèn luyện tập trung & Khám sức khỏe - Đợt 1',
      description: 'Chương trình rèn luyện thể chất và khám sức khỏe định kỳ cho tân sinh viên K21',
      full_description: `Chương trình rèn luyện tập trung và khám sức khỏe nhằm:

Mục tiêu:
- Nâng cao sức khỏe thể chất và tinh thần
- Kiểm tra sức khỏe tổng quát
- Xây dựng tinh thần đồng đội
- Rèn luyện kỷ luật và ý thức tập thể

Hoạt động chính:
- Tập thể dục buổi sáng
- Các môn thể thao tập thể
- Khám sức khỏe tổng quát
- Hoạt động team building

Lưu ý: Sinh viên sẽ được chia thành 2 đợt để đảm bảo chất lượng.`,
      start_date: new Date('2025-09-08'),
      end_date: new Date('2025-10-03'),
      start_time: '06:00',
      end_time: '18:00',
      location: 'Khu vực thể thao Campus + Trung tâm Y tế',
      target_audience: 'Tân sinh viên K21 - Đợt 1',
      max_participants: 500,
      event_type: 'health',
      priority: 'high',
      is_mandatory: true,
      is_online: false,
      organizer: 'Phòng Công tác Sinh viên + Y tế Trường',
      what_to_bring: 'Đồ thể thao, giày thể thao, khăn tắm, nước uống',
      requirements: 'Sức khỏe tốt, không có bệnh lý nặng',
      image_url: '/Unicorn5.jpg',
      registration_required: true,
      tags: {
        create: [
          { tag_name: 'Rèn luyện' },
          { tag_name: 'Khám sức khỏe' },
          { tag_name: 'Thể thao' },
          { tag_name: 'Đợt 1' }
        ]
      }
    },
    {
      title: 'Tuần lễ định hướng (Orientation Week) - Nhóm 1',
      description: 'Tuần lễ định hướng toàn diện về cuộc sống đại học và các hoạt động tại FPT University',
      full_description: `Orientation Week là tuần lễ quan trọng giúp tân sinh viên hòa nhập với môi trường đại học:

Các hoạt động chính:
- Giới thiệu về truyền thống FPT University
- Hướng dẫn quy chế đào tạo và học tập
- Giới thiệu các câu lạc bộ, đội nhóm
- Workshop kỹ năng mềm
- Gala night và các hoạt động giải trí
- Mentoring từ các sinh viên khóa trước

Mục tiêu:
- Giúp sinh viên thích ứng nhanh với môi trường mới
- Xây dựng mối quan hệ bạn bè
- Hiểu rõ về cơ hội và thách thức phía trước`,
      start_date: new Date('2025-09-10'),
      end_date: new Date('2025-09-19'),
      start_time: '08:00',
      end_time: '21:00',
      location: 'Toàn bộ Campus FPT University TP.HCM',
      target_audience: 'Tân sinh viên K21 - Nhóm 1',
      max_participants: 600,
      event_type: 'orientation',
      priority: 'high',
      is_mandatory: true,
      is_online: false,
      organizer: 'Phòng Công tác Sinh viên',
      what_to_bring: 'Tinh thần hào hứng, sẵn sàng học hỏi',
      image_url: '/BrotherWinds.jpg',
      registration_required: false,
      tags: {
        create: [
          { tag_name: 'Orientation' },
          { tag_name: 'Định hướng' },
          { tag_name: 'Nhóm 1' },
          { tag_name: 'Campus life' }
        ]
      }
    },
    {
      title: 'Kiểm tra xếp lớp LUK Global',
      description: 'Kiểm tra trình độ và bắt đầu học chính thức theo thời khóa biểu',
      full_description: `Bài kiểm tra cuối cùng trước khi bắt đầu học chính thức:

Nội dung kiểm tra:
- Đánh giá năng lực học tập tổng quát
- Xếp lớp theo trình độ phù hợp
- Chuẩn bị cho việc học theo thời khóa biểu chính thức

Sau khi hoàn thành:
- Sinh viên sẽ được phân lớp chính thức
- Nhận thời khóa biểu cụ thể
- Bắt đầu học tập theo chương trình đào tạo
- Chính thức trở thành sinh viên FPT University

Đây là cột mốc quan trọng kết thúc giai đoạn định hướng và bắt đầu quá trình học tập chính thức.`,
      start_date: new Date('2025-11-03'),
      start_time: '08:00',
      end_time: '17:00',
      location: 'Các phòng thi Campus TP.HCM',
      target_audience: 'Tân sinh viên K21',
      event_type: 'exam',
      priority: 'high',
      is_mandatory: true,
      is_online: false,
      organizer: 'Phòng Đào tạo',
      what_to_bring: 'CCCD/CMND, bút viết, máy tính (nếu cần)',
      requirements: 'Hoàn thành đầy đủ các khóa định hướng trước đó',
      image_url: '/Mentor.jpg',
      registration_required: false,
      tags: {
        create: [
          { tag_name: 'LUK Global' },
          { tag_name: 'Xếp lớp' },
          { tag_name: 'Học chính thức' },
          { tag_name: 'Assessment' }
        ]
      }
    },
    {
      title: 'Convocation Day - Lễ tốt nghiệp, Alumni Day & FPTU Career Fair',
      description: 'Sự kiện lớn kết hợp lễ tốt nghiệp, gặp gỡ cựu sinh viên và hội chợ việc làm',
      full_description: `Sự kiện trọng đại nhất trong năm học với 3 hoạt động chính:

🎓 CONVOCATION DAY - LỄ TỐT NGHIỆP:
- Lễ trao bằng tốt nghiệp trang trọng
- Phát biểu của Ban Giám hiệu
- Chia sẻ từ sinh viên xuất sắc
- Chụp ảnh lưu niệm cùng gia đình

👥 ALUMNI DAY:
- Gặp gỡ cựu sinh viên thành công
- Chia sẻ kinh nghiệm nghề nghiệp
- Networking và kết nối cộng đồng
- Trao giải Alumni của năm

💼 FPTU CAREER FAIR:
- Hơn 100 doanh nghiệp tham gia
- Cơ hội việc làm cho sinh viên
- Phỏng vấn trực tiếp tại chỗ
- Tư vấn hướng nghiệp miễn phí

Đây là sự kiện không thể bỏ lỡ cho mọi sinh viên FPT University!`,
      start_date: new Date('2025-11-15'),
      end_date: new Date('2025-11-16'),
      start_time: '08:00',
      end_time: '18:00',
      location: 'Toàn bộ Campus + Hội trường chính',
      target_audience: 'Toàn thể sinh viên, cựu sinh viên, gia đình',
      event_type: 'career',
      priority: 'high',
      is_mandatory: false,
      is_online: false,
      organizer: 'FPT University + Phòng Quan hệ Doanh nghiệp',
      what_to_bring: 'CV, trang phục lịch sự, tâm thế sẵn sàng',
      image_url: '/unicorn.png',
      registration_required: true,
      registration_deadline: new Date('2025-11-10T23:59:00'),
      tags: {
        create: [
          { tag_name: 'Tốt nghiệp' },
          { tag_name: 'Alumni' },
          { tag_name: 'Career Fair' },
          { tag_name: 'Job Opportunity' }
        ]
      }
    }
  ];

  for (const event of events) {
    await prisma.events.create({
      data: event,
    });
  }

  // Seed Academic Calendar
  const academicEvents = [
    {
      semester: '2025-2026',
      event_name: 'Bắt đầu năm học',
      start_date: new Date('2025-09-01'),
      description: 'Chính thức bắt đầu năm học 2025-2026'
    },
    {
      semester: '2025-2026',
      event_name: 'Tết Nguyên đán',
      start_date: new Date('2026-01-29'),
      end_date: new Date('2026-02-06'),
      description: 'Nghỉ Tết Nguyên đán Bính Ngọ',
      is_holiday: true
    },
    {
      semester: '2025-2026',
      event_name: 'Thi kết thúc học kỳ 1',
      start_date: new Date('2026-01-06'),
      end_date: new Date('2026-01-20'),
      description: 'Kỳ thi kết thúc học kỳ 1 năm học 2025-2026'
    }
  ];

  for (const academicEvent of academicEvents) {
    await prisma.academic_calendar.create({
      data: academicEvent,
    });
  }

  console.log('✅ Seed data created successfully for FPT University Events!');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
