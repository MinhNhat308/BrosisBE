-- Kiểm tra registrations hiện tại
SELECT er.*, e.title as event_title 
FROM event_registrations er 
JOIN events e ON er.event_id = e.id 
ORDER BY er.registered_at DESC 
LIMIT 10;

-- Xóa registration cũ nếu muốn test lại (THAY THẾ email và event_id phù hợp)
-- DELETE FROM event_registrations 
-- WHERE student_email = 'your_email@example.com' AND event_id = 1;
