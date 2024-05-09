
INSERT INTO public.status (title,description,created_at,updated_at,step) VALUES
	 ('Đã gửi','Sinh viên tự đánh giá và gửi đến ban cán sự lớp đánh giá lại','2022-12-01',NULL,1),
	 ('Hiệu trưởng phê duyệt','Đã được Hiệu trưởng phê duyệt','2022-12-02',NULL,6),
	 ('Đã công bố','Phiếu điểm được ghi nhận thành điểm chính thức','2022-12-02',NULL,7),
	 ('Lớp đã xét duyệt','Sinh viên ban cán sự đã chấm điểm xét duyệt','2022-12-01',NULL,2),
	 ('CVHT đã xác nhận','Cố vấn học tập đã xác nhận phiếu điểm này chính xác','2022-12-02',NULL,3),
	 ('Hội đồng Khoa thông qua','Đã được hội đồng cấp khoa đồng ý','2022-12-02',NULL,4),
	 ('Hội đồng Trường thông qua','Đã được hội đồng cấp khoa đồng ý','2022-12-02',NULL,5);


INSERT INTO public."period" (id, title,"start","end") VALUES
	 (1, 'Học Kỳ I 2022 - 2023','2022-12-01','2022-12-31');
	
INSERT INTO public.notifications (title,"content",status,created_at,updated_at,period_id) VALUES
	 ('HIHI','Điền nhé các em','public','2022-12-05',NULL,1);


INSERT INTO public.major (id, "name") VALUES
	 (1, 'HTTTQL'),
	 (2, 'TKKT');

INSERT INTO public."class" (full_name,short_name,major_id) VALUES
	 ('K53 THKT','K53 THKT',1),
	 ('K53 TKKD','K53 TKKD',2);

INSERT INTO public."role" (id, "name",role_code) VALUES
	 (1, 'Phòng CTSV','1'),
	 (2, 'CVHT','2'),
	 (3, 'Ban cán sự','3'),
	 (4, 'Sinh viên','4');
	 
	
INSERT INTO public.account (id, email,"password",register_date,last_login,role_id) VALUES
	 (1, 'thangdrit@gmail.com','123456','2022-12-05 21:45:47.747652','2022-12-05 21:46:16',1),
	 (2, 'ctsv@hce.edu.vn','123456','2022-12-05 21:46:50.115526',NULL,1);

INSERT INTO public.manager (manager_id,"name",phone,address,acc_id) VALUES
	 ('CTSV','CTSV','1','1',1),
	 ('123','123','123','123',2);




INSERT INTO public.group_criteria (id, title,"index") values
	 (1, 'Phần I. Đánh giá về ý thức học tập (0 - 20 điểm) ',1),
	 (2, 'Phần II. Đánh giá về ý thức và kết quả chấp hành nội quy, quy chế trong trường (0 - 25 điểm)',2),
	 (3, 'Phần III: Đánh giá về ý thức và kết quả tham gia các hoạt động chính trị - xã hội, văn hoá, thể thao, phòng chống các tệ nạn xã hội (0 - 20 điểm)',3),
	 (4, 'Phần IV: Đánh giá về phẩm chất công dân và quan hệ với cộng đồng (0 - 25 điểm)',4),
	 (5, 'Phần V. Đánh giá về ý thức và kết quả tham gia công tác Đảng, Đoàn, Hội, Lớp trong trường hoặc đạt được thành tích đặc biệt trong học tập, rèn luyện (0 - 10 điểm)',5);

INSERT INTO public.criteria (title,max,group_id) VALUES
	 ('2. Tham gia các hoạt động xã hội, nhân đạo, từ thiện vì cộng đồng',5,4),
	 ('1. Chấp hành nghiêm chỉnh các chủ trương của Đảng, chính sách và  pháp luật của Nhà nước',5,4),
	 ('3. Tham gia giữ gìn trật tự, an ninh, dũng cảm đấu tranh bảo vệ pháp luật, lễ phép và tôn trọng mọi người',5,4),
	 ('4. Tham gia các hoạt động VH, VN, TDTT do địa phương tổ chức',5,4),
	 ('5. Có tinh thần chia sẻ, giúp đỡ người thân, những người gặp khó khăn, hoạn nạn',5,4),
	 ('1. Là Ban cán sự lớp, Ban chấp hành Chi đoàn, Ban chủ nhiệm Câu lạc bộ, Đội nhóm hoàn thành tốt nhiệm vụ',2,5),
	 ('2. Là cán bộ Đoàn, Hội cấp trường, cấp Đại học Huế hoàn thành tốt nhiệm vụ',2,5),
	 ('4. Đạt danh hiệu Sinh viên 5 tốt hoặc Sao tháng giêng (Cấp trường được 1, cấp Đại học Huế được 2, cấp Tỉnh hoặc TW được 3 điểm)',3,5),
	 ('3: Có giấy khen, bằng khen do các cấp trao tặng (Cấp trường được 1, cấp Đại học Huế 2, cấp Tỉnh hoặc TW 3 điểm)',3,5),
	 ('1. Đi học đúng giờ, nghiêm túc, trật tự trong giờ học',6,1);
INSERT INTO public.criteria (title,max,group_id) VALUES
	 ('2. Chấp hành nghiêm chỉnh quy chế thi, kiểm tra',4,1),
	 ('3. Là chủ trì hoặc thành viên các nhóm NCKH',2,1),
	 ('4. Tham gia các nhóm Khởi nghiệp, các cuộc thi về chuyên môn từ cấp Khoa trở lên',2,1),
	 ('5. Kết quả học tập',6,1),
	 ('1. Tham gia tuần lễ sinh hoạt công dân sinh viên đầy đủ, đúng giờ',6,2),
	 ('4. Mang bảng tên, trang phục nghiêm túc khi đến trường',5,2),
	 ('5. Đóng học phí đầy đủ, đúng kỳ hạn',6,2),
	 ('1. Tham gia đầy đủ các buổi sinh hoạt lớp',4,3),
	 ('2. Là thành viên câu lạc bộ, đội nhóm',3,3),
	 ('3. Tham gia các hoạt động do câu lạc bộ, đội nhóm, lớp tổ chức',2,3);
INSERT INTO public.criteria (title,max,group_id) VALUES
	 ('4. Tham gia các hoạt động VH, VN, TDTT từ cấp Khoa trở lên tổ chức',5,3),
	 ('5. Là thành viên Đội đại sứ hoặc có Tham gia tư vấn tuyển sinh hàng năm',2,3),
	 ('6. Tham gia các hoạt động tình nguyện hè, tình nguyện quốc tế, mittinh, diễu hành, các cuộc thi tìm hiểu phòng chống ma tuý do các cấp tổ chức.',4,3),
	 ('3. Chấp hành nghiêm túc các quyết định điều động của nhà trường',3,2),
	 ('2. Hoàn thành đúng hạn việc bổ sung hồ sơ sinh viên theo thông báo của nhà trường',5,2);

