const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTags() {
  try {
    console.log('🌱 Seeding tags...');

    const tags = [
      { name: 'Nhập Học', color: '#ec4899' }, // Pink
      { name: 'Quân Sự', color: '#10b981' }, // Green  
      { name: 'Sinh Viên', color: '#3b82f6' }, // Blue
      { name: 'Kỹ Năng Sống', color: '#f59e0b' }, // Orange
      { name: 'Học Tập', color: '#8b5cf6' } // Purple
    ];

    for (const tag of tags) {
      await prisma.tags.upsert({
        where: { name: tag.name },
        update: { color: tag.color },
        create: tag
      });
      console.log(`✅ Created/Updated tag: ${tag.name}`);
    }

    console.log('🎉 Tags seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding tags:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTags();
