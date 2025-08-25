const mysql = require('mysql2/promise');

async function insertStudents() {
  try {
    const connection = await mysql.createConnection({
      host: '159.65.128.97',
      port: 3306,
      user: 'root',
      password: 'yourStrongPassword',
      database: 'NhatNguyen'
    });

    const studentsData = [
      ['SE170001', 'Nguyễn Văn An', 'an.nguyen@fpt.edu.vn', '0123456789', 'Nguyễn Văn Bình', '0987654321', 'Kỹ thuật phần mềm', 'contacted', 'active', '123 Đường ABC, Quận 1, TP.HCM', 'Sinh viên tích cực', 'active'],
      ['GD170002', 'Trần Thị Bình', 'binh.tran@fpt.edu.vn', '0123456790', 'Trần Văn Cường', '0987654322', 'Thiết kế đồ họa', 'pending', 'pending', '456 Đường DEF, Quận 2, TP.HCM', 'Cần liên hệ', 'active'],
      ['IT170003', 'Lê Văn Cường', 'cuong.le@fpt.edu.vn', '0123456791', 'Lê Thị Dung', '0987654323', 'Công nghệ thông tin', 'contacted', 'active', '789 Đường GHI, Quận 3, TP.HCM', 'Giỏi về lập trình', 'active'],
      ['AI170004', 'Phạm Thị Dung', 'dung.pham@fpt.edu.vn', '0123456792', 'Phạm Văn Em', '0987654324', 'Trí tuệ nhân tạo', 'no_response', 'expired', '321 Đường JKL, Quận 4, TP.HCM', 'Chưa liên hệ được', 'active'],
      ['SE170005', 'Hoàng Văn Em', 'em.hoang@fpt.edu.vn', '0123456793', 'Hoàng Thị Phượng', '0987654325', 'Kỹ thuật phần mềm', 'contacted', 'active', '654 Đường MNO, Quận 5, TP.HCM', 'Có tiềm năng', 'active'],
      ['GD170006', 'Võ Thị Giang', 'giang.vo@fpt.edu.vn', '0123456794', 'Võ Văn Hùng', '0987654326', 'Thiết kế đồ họa', 'pending', 'pending', '987 Đường PQR, Quận 6, TP.HCM', 'Học thiết kế', 'active'],
      ['IT170007', 'Đặng Văn Hùng', 'hung.dang@fpt.edu.vn', '0123456795', 'Đặng Thị Lan', '0987654327', 'Công nghệ thông tin', 'contacted', 'active', '147 Đường STU, Quận 7, TP.HCM', 'Thành tích tốt', 'active'],
      ['AI170008', 'Ngô Thị Lan', 'lan.ngo@fpt.edu.vn', '0123456796', 'Ngô Văn Minh', '0987654328', 'Trí tuệ nhân tạo', 'pending', 'active', '258 Đường VWX, Quận 8, TP.HCM', 'Quan tâm AI', 'active'],
      ['SE170009', 'Bùi Văn Minh', 'minh.bui@fpt.edu.vn', '0123456797', 'Bùi Thị Oanh', '0987654329', 'Kỹ thuật phần mềm', 'contacted', 'expired', '369 Đường YZ1, Quận 9, TP.HCM', 'Cần gia hạn BHYT', 'active'],
      ['GD170010', 'Trịnh Thị Oanh', 'oanh.trinh@fpt.edu.vn', '0123456798', 'Trịnh Văn Phúc', '0987654330', 'Thiết kế đồ họa', 'no_response', 'pending', '741 Đường AB2, Quận 10, TP.HCM', 'Chưa phản hồi', 'active'],
      ['IT170011', 'Lý Văn Phúc', 'phuc.ly@fpt.edu.vn', '0123456799', 'Lý Thị Quỳnh', '0987654331', 'Công nghệ thông tin', 'contacted', 'active', '852 Đường CD3, Quận 11, TP.HCM', 'Năng động', 'active'],
      ['AI170012', 'Huỳnh Thị Quỳnh', 'quynh.huynh@fpt.edu.vn', '0123456800', 'Huỳnh Văn Sơn', '0987654332', 'Trí tuệ nhân tạo', 'pending', 'active', '963 Đường EF4, Quận 12, TP.HCM', 'Học giỏi', 'active'],
      ['SE170013', 'Phan Văn Sơn', 'son.phan@fpt.edu.vn', '0123456801', 'Phan Thị Trang', '0987654333', 'Kỹ thuật phần mềm', 'contacted', 'pending', '174 Đường GH5, Bình Thạnh, TP.HCM', 'Tích cực tham gia', 'active'],
      ['GD170014', 'Vũ Thị Trang', 'trang.vu@fpt.edu.vn', '0123456802', 'Vũ Văn Thành', '0987654334', 'Thiết kế đồ họa', 'no_response', 'expired', '285 Đường IJ6, Tân Bình, TP.HCM', 'Cần liên hệ gấp', 'active'],
      ['IT170015', 'Đinh Văn Thành', 'thanh.dinh@fpt.edu.vn', '0123456803', 'Đinh Thị Uyên', '0987654335', 'Công nghệ thông tin', 'contacted', 'active', '396 Đường KL7, Tân Phú, TP.HCM', 'Ưu tiên học bổng', 'active'],
      ['AI170016', 'Dương Thị Uyên', 'uyen.duong@fpt.edu.vn', '0123456804', 'Dương Văn Vinh', '0987654336', 'Trí tuệ nhân tạo', 'pending', 'active', '507 Đường MN8, Gò Vấp, TP.HCM', 'Nghiên cứu tốt', 'active'],
      ['SE170017', 'Cao Văn Vinh', 'vinh.cao@fpt.edu.vn', '0123456805', 'Cao Thị Xuân', '0987654337', 'Kỹ thuật phần mềm', 'contacted', 'pending', '618 Đường OP9, Phú Nhuận, TP.HCM', 'Leader nhóm', 'active'],
      ['GD170018', 'Lâm Thị Xuân', 'xuan.lam@fpt.edu.vn', '0123456806', 'Lâm Văn Yên', '0987654338', 'Thiết kế đồ họa', 'no_response', 'active', '729 Đường QR0, Quận 1, TP.HCM', 'Sáng tạo', 'active'],
      ['IT170019', 'Mai Văn Yên', 'yen.mai@fpt.edu.vn', '0123456807', 'Mai Thị Ánh', '0987654339', 'Công nghệ thông tin', 'contacted', 'expired', '840 Đường ST1, Quận 2, TP.HCM', 'Cần gia hạn', 'active'],
      ['AI170020', 'Đỗ Thị Ánh', 'anh.do@fpt.edu.vn', '0123456808', 'Đỗ Văn Bách', '0987654340', 'Trí tuệ nhân tạo', 'pending', 'active', '951 Đường UV2, Quận 3, TP.HCM', 'Tiềm năng cao', 'active']
    ];

    const query = `
      INSERT INTO students (
        student_id, name, email, phone, parent_name, parent_phone, 
        department, contact_status, insurance_status, address, notes, status
      ) VALUES ?
    `;

    const [results] = await connection.execute(query, [studentsData]);
    console.log('✅ Inserted', results.affectedRows, 'students successfully!');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error inserting students:', error);
  }
}

insertStudents();
