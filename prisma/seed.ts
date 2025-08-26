import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tăng timeout cho phiên seed (tránh 1205 nếu DB hơi chậm)
  await prisma.$executeRawUnsafe('SET SESSION innodb_lock_wait_timeout=50;');

  // =============================
  // 0) DỌN DỮ LIỆU CŨ AN TOÀN
  // =============================
  // Tắt FK, TRUNCATE theo thứ tự (tag/registration trước, rồi events)
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=0;');
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE event_tags;');
  } catch {}
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE registrations;'); // nếu bạn có bảng này
  } catch {}
  try {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE events;');
  } catch {}
  // Giữ lại categories (nếu muốn reset thì TRUNCATE rồi seed lại)
  // await prisma.$executeRawUnsafe('TRUNCATE TABLE event_categories;');
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=1;');

  // =============================
  // 1) SEED CATEGORIES
  // =============================
  const categories = [
    { name: 'orientation', description: 'Sự kiện định hướng tân sinh viên', color: 'bg-blue-500', icon: 'GraduationCap' },
    { name: 'ceremony',   description: 'Lễ khai giảng, tốt nghiệp',          color: 'bg-purple-500', icon: 'Award' },
    { name: 'training',   description: 'Rèn luyện, kỹ năng, sức khỏe',       color: 'bg-red-500', icon: 'Heart' },
    { name: 'placement',  description: 'Kiểm tra xếp lớp, thi cử',           color: 'bg-yellow-500', icon: 'FileText' },
    { name: 'career',     description: 'Hội chợ việc làm, hướng nghiệp',     color: 'bg-orange-500', icon: 'Briefcase' },
  ];

  for (const c of categories) {
    await prisma.event_categories.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }

  // =============================
  // 2) SEED EVENTS (createMany)
  // =============================
  // LƯU Ý: các field khớp với schema bạn đang dùng
  const eventsData = [
    {
      title: 'Tựu trường – Welcome Tân sinh viên',
      description: 'Chào đón Tân sinh viên K21 tại FPTU TP.HCM.',
      full_description:
        `🎉 Sự kiện chào đón Tân sinh viên K21 tại FPTU TP.HCM, mở ra hành trình đại học đầy cảm hứng.\n\n` +
        `📌 Nội dung: check-in, hướng dẫn nhập học, gặp gỡ cố vấn, mini game, booth CLB…\n\n` +
        `🕒 03 – 04/09/2025\n📍 FPTU TP.HCM\n👥 Tân sinh viên K21`,
      start_date: new Date('2025-09-03'),
      end_date: new Date('2025-09-04'),
      location: 'FPTU TP.HCM',
      target_audience: 'Tân sinh viên K21',
      event_type: 'orientation',
      status: 'upcoming',
      priority: 'normal',
      current_participants: 0,
      is_mandatory: true,
      is_online: false,
      organizer: 'Trường Đại học FPT',
      registration_required: true,
      image_url: null,
    },
    {
      title: 'Hướng dẫn Công nghệ thông tin',
      description: 'Buổi hướng dẫn CNTT trực tuyến theo ca cho Tân sinh viên.',
      full_description:
        `💻 Hướng dẫn email sinh viên, LMS, portal, wifi, phần mềm học tập.\n\n` +
        `🕒 04/09/2025\n📍 Online\n👥 Tân sinh viên K21`,
      start_date: new Date('2025-09-04'),
      end_date: new Date('2025-09-04'),
      location: 'Online',
      target_audience: 'Tân sinh viên K21',
      event_type: 'training',
      status: 'upcoming',
      priority: 'normal',
      current_participants: 0,
      is_mandatory: true,
      is_online: true,
      organizer: 'Trường Đại học FPT',
      registration_required: true,
      image_url: null,
    },
    {
      title: 'Lễ Khai giảng năm học 2025 – 2026',
      description: 'Khai giảng toàn quốc, truyền hình trực tiếp VTV1.',
      full_description:
        `🎓 Kết nối trực tuyến toàn quốc, kỷ niệm 80 năm Bộ Giáo dục.\n\n` +
        `🕒 05/09/2025\n📍 Toàn quốc (kết nối trực tuyến)\n👥 Toàn trường`,
      start_date: new Date('2025-09-05'),
      end_date: new Date('2025-09-05'),
      location: 'Toàn quốc (kết nối trực tuyến)',
      target_audience: 'Toàn trường',
      event_type: 'ceremony',
      status: 'upcoming',
      priority: 'normal',
      current_participants: 0,
      is_mandatory: true,
      is_online: true,
      organizer: 'Trường Đại học FPT & Bộ GD&ĐT',
      registration_required: false,
      image_url: null,
    },
    {
      title: 'Hướng dẫn & Kiểm tra xếp lớp Tiếng Anh',
      description: 'Sinh viên tham gia hướng dẫn và kiểm tra phân lớp tiếng Anh.',
      full_description:
        `🗣️ Giới thiệu lộ trình TA, kiểm tra xếp lớp đầu vào.\n\n` +
        `🕒 06 – 07/09/2025\n📍 FPTU TP.HCM\n👥 Tân sinh viên K21`,
      start_date: new Date('2025-09-06'),
      end_date: new Date('2025-09-07'),
      location: 'FPTU TP.HCM',
      target_audience: 'Tân sinh viên K21',
      event_type: 'placement',
      status: 'upcoming',
      priority: 'normal',
      current_participants: 0,
      is_mandatory: true,
      is_online: false,
      organizer: 'Trường Đại học FPT',
      registration_required: false,
      image_url: null,
    },
    {
      title: 'Rèn luyện tập trung & Khám sức khỏe',
      description: 'Sinh viên tham gia rèn luyện tập trung và khám sức khỏe theo đợt.',
      full_description:
        `💪 Rèn luyện thể chất + khám sức khỏe định kỳ.\n\n` +
        `🕒 08/09 – 31/10/2025 (chia đợt)\n📍 FPTU TP.HCM\n👥 Tân sinh viên K21`,
      start_date: new Date('2025-09-08'),
      end_date: new Date('2025-10-31'),
      location: 'FPTU TP.HCM',
      target_audience: 'Tân sinh viên K21',
      event_type: 'training',
      status: 'upcoming',
      priority: 'normal',
      current_participants: 0,
      is_mandatory: true,
      is_online: false,
      organizer: 'Trường Đại học FPT',
      registration_required: true,
      image_url: null,
    },
    {
      title: 'Tuần lễ định hướng (Orientation Week)',
      description: 'Sinh viên tham gia Orientation Week để làm quen với môi trường học tập.',
      full_description:
        `🧭 Hiểu văn hóa, cách học tín chỉ, đời sống sinh viên.\n\n` +
        `🕒 Nhóm 1: 10/09 – 19/09/2025 | Nhóm 2: 08/10 – 17/10/2025\n📍 FPTU TP.HCM\n👥 Tân sinh viên K21`,
      start_date: new Date('2025-09-10'),
      end_date: new Date('2025-10-17'),
      location: 'FPTU TP.HCM',
      target_audience: 'Tân sinh viên K21',
      event_type: 'orientation',
      status: 'upcoming',
      priority: 'normal',
      current_participants: 0,
      is_mandatory: true,
      is_online: false,
      organizer: 'Trường Đại học FPT',
      registration_required: false,
      image_url: null,
    },
    {
      title: 'Kiểm tra xếp lớp LUK Global',
      description: 'Bài kiểm tra xếp lớp LUK Global. Chính thức học theo TKB.',
      full_description:
        `🌍 Kiểm tra LUK Global – phân lớp và bắt đầu học chính thức.\n\n` +
        `🕒 03/11/2025\n📍 FPTU TP.HCM\n👥 Tân sinh viên K21`,
      start_date: new Date('2025-11-03'),
      end_date: new Date('2025-11-03'),
      location: 'FPTU TP.HCM',
      target_audience: 'Tân sinh viên K21',
      event_type: 'placement',
      status: 'upcoming',
      priority: 'normal',
      current_participants: 0,
      is_mandatory: true,
      is_online: false,
      organizer: 'Trường Đại học FPT',
      registration_required: false,
      image_url: null,
    },
    {
      title: 'Convocation Day – Lễ tốt nghiệp, Alumni Day & Career Fair',
      description: 'Lễ tốt nghiệp, Alumni Day và Career Fair tại FPTU TP.HCM.',
      full_description:
        `🎓 Lễ tốt nghiệp + 👥 Alumni Day + 💼 Career Fair.\n\n` +
        `🕒 11/2025\n📍 FPTU TP.HCM\n👥 Toàn trường`,
      start_date: new Date('2025-11-15'),
      end_date: new Date('2025-11-15'),
      location: 'FPTU TP.HCM',
      target_audience: 'Toàn trường',
      event_type: 'ceremony',
      status: 'upcoming',
      priority: 'normal',
      current_participants: 0,
      is_mandatory: false,
      is_online: false,
      organizer: 'Trường Đại học FPT',
      registration_required: true,
      image_url: null,
    },
  ] as const;

  await prisma.events.createMany({
    data: eventsData.map(e => ({ ...e })),
    skipDuplicates: true,
  });

  // Lấy lại id theo title để gắn tags
  const dbEvents = await prisma.events.findMany({
    select: { id: true, title: true },
  });
  const idByTitle = new Map(dbEvents.map(e => [e.title, e.id]));

  // =============================
  // 3) SEED TAGS (createMany)
  // =============================
  const tagList: { event_id: number; tag_name: string }[] = [];

  function addTags(title: string, tags: string[]) {
    const id = idByTitle.get(title);
    if (!id) return;
    for (const t of tags) {
      tagList.push({ event_id: id, tag_name: t });
    }
  }

  addTags('Tựu trường – Welcome Tân sinh viên', ['K21', 'Nhập học', 'Welcome', 'Orientation']);
  addTags('Hướng dẫn Công nghệ thông tin', ['K21', 'CNTT', 'LMS', 'Online']);
  addTags('Lễ Khai giảng năm học 2025 – 2026', ['Khai giảng', 'Toàn quốc', 'VTV1', '2025-2026']);
  addTags('Hướng dẫn & Kiểm tra xếp lớp Tiếng Anh', ['Tiếng Anh', 'Placement', 'K21']);
  addTags('Rèn luyện tập trung & Khám sức khỏe', ['Rèn luyện', 'Khám sức khỏe', 'K21']);
  addTags('Tuần lễ định hướng (Orientation Week)', ['Orientation Week', 'K21', 'Định hướng']);
  addTags('Kiểm tra xếp lớp LUK Global', ['LUK Global', 'Placement', 'K21']);
  addTags('Convocation Day – Lễ tốt nghiệp, Alumni Day & Career Fair', ['Convocation', 'Alumni Day', 'Career Fair']);

  if (tagList.length) {
    await prisma.event_tags.createMany({
      data: tagList,
      skipDuplicates: true,
    });
  }

  console.log('✅ Seed data created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
