-- Thêm 5 tag chính cho hệ thống blog
INSERT IGNORE INTO tags (name) VALUES 
('Nhập Học'),
('Quân Sự'), 
('Sinh Viên'),
('Kỹ Năng Sống'),
('Học Tập');

-- Kiểm tra kết quả
SELECT * FROM tags;
