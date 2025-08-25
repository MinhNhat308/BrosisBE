const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncParticipants() {
  console.log('🔄 Đang sync số lượng participants...');
  
  try {
    // Lấy tất cả events
    const events = await prisma.events.findMany({
      include: {
        _count: {
          select: {
            registrations: true
          }
        }
      }
    });
    
    console.log(`📊 Tìm thấy ${events.length} events`);
    
    // Update từng event
    for (const event of events) {
      const realCount = event._count.registrations;
      
      await prisma.events.update({
        where: { id: event.id },
        data: {
          current_participants: realCount
        }
      });
      
      console.log(`✅ Event "${event.title}": ${realCount} người đăng ký`);
    }
    
    console.log('🎉 Sync hoàn thành!');
  } catch (error) {
    console.error('❌ Lỗi sync:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncParticipants();
