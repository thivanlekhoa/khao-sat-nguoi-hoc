/**
 * GOOGLE APPS SCRIPT WEB APP - BACKEND NHẬN DỮ LIỆU TỪ FORM HTML
 * Tự động ghi nhận câu trả lời vào Google Sheets theo thời gian thực
 * 
 * HƯỚNG DẪN TRIỂN KHAI TRONG 1 PHÚT:
 * 1. Mở một Google Sheet mới (hoặc Google Sheet bạn muốn lưu dữ liệu) tại https://sheets.new
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) > Apps Script
 * 3. Xóa code cũ, dán toàn bộ đoạn code này vào.
 * 4. Bấm nút "Triển khai" (Deploy) góc trên bên phải > Chọn "Tùy chọn triển khai mới" (New deployment).
 * 5. Chọn loại: "Ứng dụng web" (Web App).
 *    - Mô tả: Nhận dữ liệu khảo sát Địa lý tự nhiên
 *    - Người thực thi (Execute as): Tôi (Me)
 *    - Người có quyền truy cập (Who has access): Bất kỳ ai (Anyone)  <-- CỰC KỲ QUAN TRỌNG
 * 6. Bấm "Triển khai" (Deploy) > Cấp quyền truy cập nếu được hỏi.
 * 7. Sao chép "URL ứng dụng web" (Web app URL) và dán vào biến GOOGLE_SCRIPT_WEB_APP_URL trong file index.html!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Khóa tránh xung đột khi nhiều người nộp cùng lúc
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Nếu trang tính còn trống, tự động tạo hàng Tiêu đề (Header)
    if (sheet.getLastRow() === 0) {
      var headers = [
        'Thời gian gửi',
        'Họ và tên', 'Số điện thoại', 'Email', 'Giới tính', 'Độ tuổi', 'Nơi cư trú', 'Đối tượng',
        '1. Nắm vững KTCM toàn diện',
        '2. Nắm vững KT cơ bản QLĐH',
        '3. Hiểu biết nguyên lý tự nhiên - XH',
        '4. KN thực hành chuyên môn',
        '5. KN giải quyết vấn đề CM',
        '6. KN giải quyết vấn đề liên ngành',
        '7. KN đánh giá chất lượng CV',
        '8. KN làm việc nhóm',
        '9. KN giao tiếp',
        '10. KN sử dụng ngoại ngữ',
        '11. Tư duy phản biện',
        '12. Năng lực CNTT',
        '13. Năng lực kỹ thuật số',
        '14. Năng lực ĐMST',
        '15. Năng lực học tập trọn đời',
        '16. Tư duy khởi nghiệp',
        '17. Đạo đức nghề nghiệp',
        '18. Trách nhiệm xã hội',
        '19. Ý thức phục vụ cộng đồng',
        '20. Ý thức phát triển bền vững',
        'Nhu cầu theo học (Câu 2)',
        'Ý kiến bổ sung (Câu 3)',
        'Phương thức tiếp nhận thông tin (Câu 4)'
      ];
      
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#0284c7');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    // Đọc dữ liệu JSON gửi lên từ trang web
    var data = JSON.parse(e.postData.contents);
    
    // Chuẩn bị hàng dữ liệu mới
    var row = [
      new Date(),
      data.fullName || '',
      data.phone || '',
      data.email || '',
      data.gender || '',
      data.age || '',
      data.residence || '',
      data.role === 'Khác' ? ('Khác: ' + (data.role_other || '')) : (data.role || ''),
      data.q1_1 || '',
      data.q1_2 || '',
      data.q1_3 || '',
      data.q1_4 || '',
      data.q1_5 || '',
      data.q1_6 || '',
      data.q1_7 || '',
      data.q1_8 || '',
      data.q1_9 || '',
      data.q1_10 || '',
      data.q1_11 || '',
      data.q1_12 || '',
      data.q1_13 || '',
      data.q1_14 || '',
      data.q1_15 || '',
      data.q1_16 || '',
      data.q1_17 || '',
      data.q1_18 || '',
      data.q1_19 || '',
      data.q1_20 || '',
      data.q2 || '',
      data.q3 || '',
      Array.isArray(data.q4) ? data.q4.join('; ') : (data.q4 || '')
    ];
    
    // Ghi dữ liệu vào sheet
    sheet.appendRow(row);
    
    // Trả kết quả JSON về cho web
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Dữ liệu đã được lưu thành công!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Backend Web App cho Khảo sát Địa lý tự nhiên đang hoạt động bình thường!");
}
