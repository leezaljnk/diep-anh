# Robot Kiến Sáng – Thử tài Phân loại Rác

Trò chơi giáo dục dành cho học sinh lớp 1, giúp các em luyện phân loại rác hữu cơ và rác tái chế cùng Robot Kiến Sáng. Giao diện được xây dựng bằng React, TypeScript và Vite.

## Bài thuyết trình giới thiệu dự án

**Thời lượng gợi ý:** khoảng 3–4 phút. Ba bạn có thể thay tên mình vào phần lời dẫn bên dưới. Khi thuyết trình, một bạn có thể vừa nói vừa trình chiếu trò chơi.

### Bạn thứ nhất – Giới thiệu dự án

> Kính chào thầy cô và các bạn! Chúng em là ba bạn học sinh lớp 2A5, Trường Tiểu học và THCS FPT Cầu Giấy. Hôm nay, chúng em xin giới thiệu dự án **“Robot Kiến Sáng – Thử tài Phân loại Rác”**.
>
> Chúng em làm trò chơi này để giúp các em nhỏ, đặc biệt là các bạn lớp 1, tập phân loại rác theo cách vui vẻ và dễ nhớ. Trong trò chơi, bạn Robot Kiến Sáng cùng các bạn dọn lớp học và đưa rác vào đúng thùng.
>
> Trò chơi có hai nhóm rác. Rác hữu cơ như lá cây, vỏ chuối và thức ăn thừa được bỏ vào **Thùng Xanh**. Rác tái chế như giấy cũ, vỏ hộp giấy và vỏ chai được bỏ vào **Thùng Cam**. Trò chơi hiện có 15 món rác để các bạn thử sức.

### Bạn thứ hai – Hướng dẫn cách chơi

> Bây giờ, chúng em xin hướng dẫn cách chơi. Trên màn hình có các món rác, bạn Robot Kiến Sáng và hai thùng rác. Mỗi lần bỏ đúng một món, bạn sẽ nhận được một ngôi sao. Mục tiêu là đạt **10 ngôi sao MAX_SCORE=10** để chiến thắng.
>
> Có hai cách chơi. Ở chế độ **kéo thả**, các bạn kéo món rác rồi thả vào thùng mà mình chọn. Ở chế độ **ra lệnh cho Robot**, các bạn chọn một món rác rồi chọn thùng; Robot sẽ đi nhặt và mang rác tới đó.
>
> Nếu chọn đúng, Robot vui mừng và tặng một ngôi sao. Nếu chọn nhầm, Robot sẽ nhắc các bạn thử lại. Đừng lo nhé, mình có thể suy nghĩ và chọn lại!

### Bạn thứ ba – Lợi ích và kết thúc

> Qua trò chơi, chúng em mong các bạn nhỏ nhớ rằng rác cần được phân loại, chứ không nên bỏ lẫn tất cả vào cùng một thùng. Các bạn cũng được luyện quan sát, suy nghĩ trước khi lựa chọn và sử dụng máy tính để học tập.
>
> Điều quan trọng nhất là những việc nhỏ mỗi ngày cũng có thể giúp lớp học sạch hơn và góp phần bảo vệ môi trường. Sau khi chơi, chúng ta có thể thực hành phân loại rác đúng cách ở lớp và ở nhà, theo hướng dẫn của thầy cô và gia đình.
>
> Dự án của chúng em vẫn có thể được bổ sung thêm hình ảnh và nội dung để trò chơi ngày càng phong phú hơn. Cảm ơn thầy cô và các bạn đã lắng nghe! Các bạn có muốn cùng Robot Kiến Sáng thử phân loại rác không ạ?

### Gợi ý trình chiếu

1. Bạn thứ nhất giới thiệu tên dự án và mở màn hình trò chơi.
2. Bạn thứ hai làm thử một lượt: chọn một món rác, đưa vào thùng và chỉ cho mọi người xem sao hoặc lời nhắc của Robot.
3. Bạn thứ ba nói về điều đã học được, rồi mời cả lớp cùng chơi.

## Tính năng

- Phân loại 15 món rác vào hai thùng: rác hữu cơ và rác tái chế.
- Trong lớp học, mỗi lô có đúng **3 món rác tái chế và 2 món rác hữu cơ**, xuất hiện ở các vị trí riêng biệt và được xáo trộn thứ tự. Mỗi nhóm có chu kỳ chọn riêng: tất cả món trong nhóm xuất hiện trước khi nhóm đó bắt đầu chu kỳ mới; không trùng món trong cùng một lô. Sân trường giữ cách chọn rác ngẫu nhiên hiện có.
- Bấm cửa sổ bên trái để ra sân trường; dọn 10 loại rác sân trường riêng (5 hữu cơ, 5 tái chế) bằng hình SVG dễ thương, rồi bấm **Về lớp học** để quay lại. Điểm, rác đang chơi và chu kỳ riêng của mỗi cảnh được giữ nguyên khi chuyển cảnh.
- Ở sân trường, cứ mỗi 4 giây rác chưa được nhặt sẽ được gió thổi sang một vị trí trống khác; rác đang được cầm hoặc kéo sẽ không bị di chuyển. Rác trong lớp chỉ xuất hiện trên sàn, còn rác sân trường chỉ xuất hiện trên bãi cỏ, tránh bảng đen, tường và bầu trời.
- Trong Khu Vườn nắng ấm, có thể dùng phím mũi tên hoặc bấm vào vị trí muốn đến để Kiến Sáng di chuyển mượt mà; mỗi món rác nhặt được giúp vườn nở thêm những bông hoa cao với nhiều hình dáng. Bầu trời có 12 đám mây với kích thước đa dạng, tự thu nhỏ trên màn hình hẹp và không cản thao tác chơi.
- Ở lớp học và sân trường, lời thoại của Kiến Sáng được phát bằng âm thanh mà không hiện bong bóng chữ.
- Đạt **10 sao** để chiến thắng. Rác xuất hiện ngoài vùng thùng rác với khoảng cách an toàn để dễ chọn/nhặt.
- Chơi bằng cách tự kéo thả rác hoặc chọn rác để Robot Kiến Sáng đi nhặt.
- Mở màn chơi riêng **Thử tài phân loại rác** để nối một món đồ cũ với các ý tưởng tái sử dụng. Mỗi ván có 5 lượt không lặp; mỗi lượt gồm 6 tranh, nút kiểm tra, cơ hội sửa đáp án và tiến độ riêng. Có thể chạm để chọn hoặc kéo trên máy tính; những ý tưởng cần gia công đều nhắc bé nhờ người lớn hỗ trợ.
- Hướng dẫn nằm trên bảng phấn: giữ phím mũi tên / WASD để di chuyển Kiến Sáng, Space / Enter để nhặt hoặc thả rác. Không hiển thị D-pad trên sàn chơi hay mã trang phục dưới nhân vật.
- Khi thiếu ảnh bước đi, Kiến dùng ảnh dự phòng trong nhóm `tim_rac_01`–`tim_rac_12` hoặc ảnh nhân vật chính; không lấy ảnh cầm rác (như `cam_banh_mi_*`) làm ảnh di chuyển tìm rác.
- Tùy chỉnh hình ảnh robot, trang phục, thùng rác và hình ảnh các món rác.
- Thu âm giọng nói cho phản hồi đúng, sai và chiến thắng.
- Lưu các tùy chỉnh trong trình duyệt và nạp ảnh đã lưu trong project khi chạy bản build.
- Khi mở trang, hiển thị màn chào tông xanh công nghệ với banner FPT Schools “Deep Learning with Love” từ `public/background-2.png`, giữ trọn ảnh và tách riêng phần giới thiệu/nút chơi để dễ đọc trên điện thoại. Ảnh được tối ưu thành `src/assets/welcome-background.webp` và nhúng sẵn để dùng được cả trong bản HTML offline; khi thay ảnh gốc cần tạo lại bản WebP (rộng 1600 px, chất lượng 86). Phát âm thanh vui khi tài nguyên sẵn sàng và chỉ bật nút bắt đầu sau khi trò chơi tải xong.
- Chế độ “Nhờ Kiến Sáng” di chuyển theo quãng đường thực tế (trung bình 200 px/giây, ít nhất 0,6 giây mỗi chặng), áp dụng cả khi đi nhặt, mang rác và quay về.
- Xuất trò chơi sang dự án Scratch (`.sb3`) và tải bản HTML độc lập để chơi offline.

## Hiệu năng trên GitHub Pages

- Khi build, ảnh trang phục, rác và thùng trong project được tạo thêm bản WebP (tối đa 512 × 512 px, giữ tỉ lệ và độ trong suốt). Manifest dùng bản nhẹ hơn với tên có hash để tận dụng cache; ảnh gốc vẫn giữ nguyên cho chỉnh sửa và xuất Scratch/offline.
- Bản production đọc thẳng manifest tĩnh, không gọi thử API của máy chủ dev trên GitHub Pages.
- Chỉ nạp trước nhóm hoạt ảnh đang dùng và các dáng nhặt rác, tối đa 3 ảnh đồng thời; không tải toàn bộ trang phục ngay khi mở trang.
- Vị trí từng khung hình chỉ cập nhật nhân vật thay vì render lại toàn bộ màn chơi. Giữ phím di chuyển theo thời gian thực, không phụ thuộc màn hình 30/60/144 Hz; dùng `transform` thay vì thay đổi `left/top` mỗi frame.
- Tài nguyên Supabase vẫn được ưu tiên và không bị thay thế bởi ảnh project. Các ảnh đã tải lên Supabase không được bước build này nén lại; nên tối ưu ảnh trước khi tải lên editor nếu dùng chế độ chia sẻ.
- Sau khi triển khai lại, dùng F5 để nhận manifest mới. Ping Google chỉ đo độ trễ tới Google, không đo tốc độ tải ảnh từ GitHub Pages/Supabase hay tốc độ render của trình duyệt.

Kiểm tra chuyển động: `node --import tsx --test tests/movement.test.ts tests/commandMovement.test.ts tests/mascotPosition.test.ts tests/mascotFrames.test.ts`.

## Yêu cầu

- [Bun](https://bun.sh/) hoặc Node.js và npm.
- Trình duyệt web hiện đại.

Không cần API key nếu chỉ chơi bằng tài nguyên trong project. Chế độ dùng chung online cần cấu hình Supabase như bên dưới.

## GitHub Pages + Supabase: ảnh và giọng nói dùng chung

Hai trang được build cùng nhau:

- `index.html`: trang chơi, đọc tài nguyên Supabase khi mở trang. Muốn nhận thay đổi mới, tải lại trang thủ công (F5); không kiểm tra định kỳ hoặc khi chuyển lại cửa sổ.
- `editor.html`: chọn vị trí và tải ảnh/âm thanh trực tiếp lên Supabase; hỗ trợ tải nhiều file theo tên ID.

Không cần đăng nhập theo thiết kế mini-game này. **Quyền ghi là công khai, không được bảo vệ bằng việc giấu link editor.** Bất kỳ ai có cấu hình website đều có thể thay tài nguyên, tiêu hao băng thông hoặc làm gián đoạn game. Không sử dụng cho dữ liệu riêng tư; đặc biệt cân nhắc trước khi công khai giọng nói/hình ảnh của trẻ. Giới hạn 5 MB/file và danh sách ID cố định không ngăn được việc tải lên lặp lại. Theo dõi quota trong Supabase; sao lưu ảnh gốc trên máy.

### 1. Tạo Supabase

1. Tạo project tại [Supabase](https://supabase.com/).
2. Mở **SQL Editor**, chạy toàn bộ [`supabase/setup.sql`](supabase/setup.sql). Script tạo bảng `game_assets`, bucket công khai `kien-sang` và policy đọc/ghi cho khách không đăng nhập, chỉ trong bucket/ID của game.
3. Vào phần API keys / Connect của project, lấy **Project URL** và **publishable key** (hoặc legacy `anon` key). Không dùng secret key hay `service_role`.
4. Tạo `.env.local` ở thư mục gốc:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
```

Hai giá trị này là cấu hình công khai trong bundle, không phải mật khẩu quản trị. Khởi động lại dev server hoặc build lại sau khi đổi chúng.

### 2. Build và đưa lên GitHub Pages

Khuyến nghị dùng **GitHub Actions**: mỗi lần push mã nguồn lên branch `main`, GitHub tự cài dependencies, kiểm tra TypeScript, build và publish toàn bộ `dist/`. Không cần commit `dist/` hoặc tạo branch `gh-pages`. Workflow đã có sẵn tại [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

GitHub Pages chỉ phục vụ file tĩnh, không chạy API của Vite. Bản build đọc trực tiếp `kien-sang-assets.json` (được tạo khi build) để nạp ảnh trang phục, ảnh rác, thùng rác và giọng nói trước khi bật nút bắt đầu. Cần publish cả manifest và thư mục `images/`, `voice/` trong `dist/`; các URL tương đối giữ đúng đường dẫn `/robot-kien-sang/`. Endpoint `/api/preloaded-assets` chỉ được gọi khi chạy dev server; nếu API không khả dụng, bản dev thử manifest tĩnh. Bản HTML offline tiếp tục dùng tài nguyên nhúng, không gọi mạng.

#### 2.1. Tạo repository GitHub

1. Đăng nhập GitHub, chọn **New repository**.
2. Đặt tên, ví dụ `robot-kien-sang`.
3. Chọn **Public** để dùng GitHub Pages với tài khoản miễn phí. Không khởi tạo thêm README nếu chuẩn bị đẩy project từ máy.
4. Chọn **Create repository**.

Trong các ví dụ dưới đây, thay `TEN_GITHUB` và `robot-kien-sang` bằng tài khoản và tên repository thực tế.

#### 2.2. Đưa mã nguồn lên GitHub

Mở PowerShell tại thư mục gốc project. Nếu project chưa có Git, chạy:

```powershell
git init
git branch -M main
```

Chuẩn bị các file và kiểm tra trước khi commit:

```powershell
git add .
git status
```

Phải có mã nguồn, `public/`, `package.json`, `package-lock.json` và workflow deploy. **Không được có `.env.local`, secret key hoặc `service_role`.** [`.gitignore`](.gitignore) đã loại trừ file môi trường riêng, dependencies và `dist/`; tuy nhiên file đã được Git theo dõi từ trước không tự được bỏ theo dõi bởi `.gitignore`.

Với repository mới, tiếp tục:

```powershell
git commit -m "Initial project"
git remote add origin https://github.com/TEN_GITHUB/robot-kien-sang.git
git push -u origin main
```

Git có thể yêu cầu đăng nhập GitHub. Nếu project đã có repository/remote, dùng remote hiện tại hoặc điều chỉnh URL phù hợp, không chạy lại `git remote add origin`.

#### 2.3. Cấu hình Supabase cho GitHub Actions

File `.env.local` trên máy không được gửi lên GitHub. Cần cấu hình riêng cho quá trình build trên GitHub:

1. Vào repository → **Settings → Secrets and variables → Actions**.
2. Chọn tab **Variables** → **New repository variable**.
3. Thêm đúng hai biến:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Project URL, ví dụ `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key hoặc legacy `anon` key của project |

Workflow đọc từ **Variables** (`vars`), không phải tab Secrets. Không dùng secret key hoặc `service_role`: hai biến `VITE_*` này sẽ xuất hiện công khai trong JavaScript của website.

#### 2.4. Bật GitHub Pages

1. Vào repository → **Settings → Pages**.
2. Trong **Build and deployment → Source**, chọn **GitHub Actions**.
3. Không chọn **Deploy from a branch** nếu dùng workflow có sẵn.

#### 2.5. Chạy workflow và theo dõi kết quả

Workflow [Deploy GitHub Pages](.github/workflows/deploy-pages.yml) đã có trong project; không cần tạo lại hoặc dán thêm YAML.

1. Vào tab **Actions** → chọn **Deploy GitHub Pages**.
2. Bấm **Run workflow**, chọn branch `main`, rồi xác nhận. Có thể dùng cách này nếu lần push đầu diễn ra trước khi cấu hình Variables hoặc bật Pages.
3. Chờ hai job `build` và `deploy` có dấu tích xanh.
4. Vào **Settings → Pages** hoặc mở environment `github-pages` trong lần chạy để lấy URL website.

Workflow dùng Node.js 22 và `npm ci`, nên `package-lock.json` phải được commit và đồng bộ với `package.json`. Nếu job thất bại, mở step màu đỏ để xem lỗi; nếu báo lockfile không khớp, chạy `npm install` trên máy, commit lockfile đã cập nhật rồi push lại.

Step **Upload complete build** dùng `path: dist`: GitHub upload toàn bộ bản build gồm HTML, JavaScript, CSS, manifest và ảnh. **Không chỉ upload HTML**, vì HTML online cần các file còn lại để chạy.

Bản build dùng đường dẫn tương đối, hỗ trợ URL dạng `https://TEN_GITHUB.github.io/robot-kien-sang/`:

| Mục đích | URL ví dụ |
|---|---|
| Chơi game | `https://TEN_GITHUB.github.io/robot-kien-sang/index.html` |
| Cập nhật ảnh/âm thanh | `https://TEN_GITHUB.github.io/robot-kien-sang/editor.html` |

Chia sẻ URL trang chơi cho người chơi. Trang editor không yêu cầu đăng nhập theo cấu hình hiện tại. Không tải `index.html` về rồi mở bằng `file://` để dùng chế độ online; HTML offline độc lập là chế độ khác.

#### 2.6. Kiểm tra kết nối Supabase

1. Mở URL `editor.html`.
2. Chọn **Thùng xanh (hữu cơ)** rồi upload một ảnh PNG/JPG/WebP.
3. Chờ thông báo xuất bản thành công.
4. Mở trang chơi và nhấn **F5** để nhận ảnh mới.
5. Trong Supabase SQL Editor, có thể kiểm tra:

```sql
select * from public.game_assets;
```

Bảng sẽ có ID vừa upload, ví dụ `images/bins/organic`, và mã revision. File nằm trong **Storage → bucket `kien-sang`**. Ngay sau khi chỉ chạy script setup, kết quả `Success. No rows returned` là bình thường: bảng đã tạo nhưng chưa có tài nguyên nào được xuất bản.

#### 2.7. Các lần cập nhật sau

- **Đổi ảnh/âm thanh dùng chung:** upload qua editor, không cần build hoặc deploy lại. Người chơi nhấn F5.
- **Đổi mã nguồn hoặc ảnh mặc định trong project:** commit và push lên `main`; workflow tự build/deploy lại.
- **Đổi Variables Supabase trên GitHub:** chạy lại workflow để cấu hình mới được đưa vào bundle.
- **Muốn cập nhật mã nguồn trên máy sau khi sửa file trực tiếp trên GitHub:** chạy `git pull` trước khi tiếp tục chỉnh sửa.

Nếu không dùng Actions, có thể build trên máy bằng `npm run build`, đưa **nội dung bên trong `dist/`** vào thư mục gốc branch `gh-pages`, rồi chọn **Settings → Pages → Deploy from a branch → gh-pages → / (root)**. Với cách này cấu hình Supabase lấy từ `.env.local` lúc build; mỗi lần cập nhật mã nguồn phải tự build và đưa lại toàn bộ nội dung mới lên branch đó. Chỉ chọn một phương thức publish để tránh nhầm cấu hình.

### 3. Cập nhật tài nguyên

Trong editor, chọn ID rồi chọn file; ảnh/âm thanh được xuất bản ngay. Hoặc chọn nhiều file đặt tên đúng ID:

- Trang phục: `tim_rac_01.png` … `tim_rac_12.png`, `cam_banh_mi_01.png` … và các ID trong [`mascotCostumes.ts`](src/data/mascotCostumes.ts).
- Món rác: `banh_mi.png`, `vo_hop_sua.png` … theo [`trashItems.ts`](src/data/trashItems.ts).
- Thùng rác: `thung_rac_xanh.png`, `thung_rac_cam.png`.
- Robot chính: `kien-sang-main.png`.
- Âm thanh: `correct.mp3`, `incorrect.mp3`, `victory.mp3`.

Ảnh online nhận PNG/JPG/WebP; âm thanh nhận MP3/WAV/WebM/OGG/M4A, tối đa 5 MB/file. Không chuyển định dạng âm thanh tự động. Storage giữ đường dẫn cố định theo ID, ví dụ `images/costumes/tim_rac_01`, `images/bins/organic`, `voice/correct` (không cần đuôi file; kiểu nội dung được giữ trong metadata). Bảng lưu revision để URL ảnh mới không dùng lại cache cũ. Không có chức năng xóa/reset tài nguyên chung trong editor này; upload file khác vào cùng ID để thay thế.

Tài nguyên Supabase ưu tiên hơn ảnh trong project và tùy chỉnh cũ của trình duyệt. Những ID chưa upload dùng bộ ảnh trong bản build. Chỉ thay tài nguyên thì **không cần build/deploy lại**. Không tự đưa bộ ảnh trong project lên Supabase: có thể dùng tải nhiều file để xuất bản bộ ban đầu.

Nếu Supabase lỗi, game báo lỗi và giữ tài nguyên đang có; có nút thử lại. Nếu chưa cấu hình Supabase, game giữ chế độ tùy chỉnh cục bộ như trước, editor báo chưa cấu hình. HTML offline và file JSON vẫn là snapshot riêng, không tự đồng bộ với Supabase.

## Giọng thu âm cho toàn bộ lời hướng dẫn

Game hỗ trợ **98 ID giọng nói cho cả 4 màn**: lớp học, sân trường, khu vườn và thử tài phân loại. Mọi lệnh gọi `triggerSpeech(text, voiceId)` truyền ID tường minh, kể cả câu động và nghe lại. Xem [toàn bộ ID, tên file và lời thoại cần thu](docs/voice-prompts.md). Không bắt buộc đủ bộ: thiếu file hoặc phát lỗi sẽ đọc văn bản bằng giọng trình duyệt. Hiệu ứng nhặt/thả, đúng/sai và nhạc chiến thắng vẫn được tạo bằng Web Audio, không phải các file này.

### Đặt file hoặc upload

- **Trong project:** copy MP3 vào `public/voice/`, giữ đúng tên chữ thường dưới đây, commit/push để build và deploy lại. Không cần insert `game_assets`. Manifest build, dev server và bản HTML offline được tạo lại đều nhận các MP3 này.
- **Dùng chung online:** chọn vị trí `voice/<ID>` trong editor hoặc tải nhiều file đúng tên. Ví dụ `welcome.mp3` tương ứng `voice/welcome`. Không cần deploy lại sau upload; người chơi F5.
- **Supabase đã thiết lập trước đây:** chạy lại toàn bộ [`supabase/setup.sql`](supabase/setup.sql) để cập nhật các ID được phép upload. Script không xóa tài nguyên đã có.
- **Thu trực tiếp trong game cục bộ/offline:** phòng thu có đủ 98 câu. Dữ liệu thu giữ định dạng trình duyệt tạo ra, không tự chuyển MP3. Khi chơi online, dùng editor để tải file thu sẵn lên Supabase.
- Supabase ưu tiên hơn MP3 trong bản build cho cùng ID. Nhập/xuất tùy chỉnh JSON và xuất HTML giữ toàn bộ các giọng này. Xuất Scratch vẫn chỉ dùng ba giọng đúng/sai/chiến thắng như trước; các câu hướng dẫn mở rộng dành cho game web.

### Danh sách bản thu cho cả 4 màn

[Danh sách đầy đủ 98 ID và lời thoại](docs/voice-prompts.md) gồm 21 câu chung/dự phòng cho lớp học và sân trường, 30 câu theo rác lớp học, 20 câu theo rác sân trường, 6 câu khu vườn và 21 câu thử tài phân loại.

Cần thu lại `victory.mp3` theo mốc **20 sao**. Các câu khen khác nhau dùng ID riêng; bản thu cũ không tự đổi nội dung. Xem danh sách để kiểm tra các câu hướng dẫn đã được đồng bộ lại.

Tạo lại danh sách từ mã nguồn:

```bash
node --import tsx scripts/generate_voice_catalog.ts
```

## Cài đặt và chạy ở chế độ phát triển

Trong thư mục dự án, cài các dependencies:

```bash
bun install
```

Khởi động máy chủ phát triển:

```bash
bun run dev
```

Mở URL được Vite hiển thị trong terminal (mặc định là `http://localhost:3000`). Máy chủ được cấu hình lắng nghe trên mọi địa chỉ mạng (`0.0.0.0`).

Nếu dùng npm thay cho Bun:

```bash
npm install
```
hoặc Fix the upstream dependency conflict, or retry this command with --force or --legacy-peer-deps to accept an incorrect (and potentially broken) dependency resolution
```bashnpm install --legacy-peer-deps```
hoặc update npm
```bash
npm install -g npm@latest
```
```bash
`npm run`:
  dev
    vite --port=3000 --host=0.0.0.0
  build
    vite build
  preview
    vite preview
  clean
    rm -rf dist server.js
  lint
    tsc --noEmit
```

## Build và xem bản build

Tạo bản build production trong thư mục `dist/`:

```bash
bun run build
```

Hoặc dùng npm:

```bash
npm run build
```

Để chạy thử bản build trên máy:

```bash
bun run preview
```

Sau đó mở URL preview được Vite in ra trong terminal.

## Kiểm tra TypeScript

Script `lint` hiện chạy TypeScript để kiểm tra lỗi kiểu:

```bash
bun run lint
```

Lệnh tương ứng với npm:

```bash
npm run lint
```

## Chơi offline

### Mang tùy chỉnh sang máy hoặc trình duyệt khác

Ảnh thay đổi khi chơi chỉ lưu trong trình duyệt, không tự ghi vào HTML hoặc tải lên server. Trong cửa sổ xuất HTML offline:

1. Chọn **Xuất tùy chỉnh** để tải `Kien_Sang_Tuy_Chinh.json`, chứa ảnh, giọng thu âm và kích thước đang dùng.
2. Chuyển tệp JSON cùng trò chơi sang máy/trình duyệt khác.
3. Mở trò chơi, vào cùng cửa sổ, chọn **Nhập tùy chỉnh**, chọn JSON và xác nhận thay thế bộ tùy chỉnh hiện tại.

Nhập/xuất JSON hoạt động khi mở HTML offline trực tiếp, không cần máy chủ. Tùy chỉnh được áp dụng ngay và lưu trong trình duyệt nhận; hãy giữ tệp JSON làm bản sao lưu vì dữ liệu trình duyệt có thể bị xóa. Điểm số và ván chơi không được xuất.

Trong ứng dụng, dùng chức năng tải HTML offline để xuất một file độc lập có nhúng mã nguồn và dữ liệu tùy chỉnh hiện tại. File mẫu được cung cấp trong [`public/Robot_Kien_Sang_Offline.html`](public/Robot_Kien_Sang_Offline.html); có thể mở file này bằng trình duyệt để chơi mà không cần máy chủ web.

Các lệnh cài đặt, chạy và build ở trên không tạo lại file HTML offline. File offline được xuất riêng từ giao diện ứng dụng.

Để tạo lại bản HTML offline trực tiếp từ các ảnh hiện có trong project:

```bash
node scripts/generate_offline_html.cjs
```

Lệnh này build lại ứng dụng và tạo `Robot_Kien_Sang_Offline.html` trong cả `public/` và `dist/`, có nhúng ảnh thùng rác, robot, trang phục và món rác. Khi xuất từ giao diện, các đường dẫn ảnh/âm thanh cũng được chuyển thành dữ liệu nhúng để không phụ thuộc vào `/images/` khi mở file trực tiếp.

## Ảnh tải lên và build/publish

Khi chạy ứng dụng bằng máy chủ phát triển, ảnh tải lên được lưu vào IndexedDB/localStorage của trình duyệt để dùng lại trên cùng trình duyệt. Các API của máy chủ phát triển cũng ghi ảnh vào thư mục `public/images/` trong project:

- Robot và thùng rác: `public/images/` (ví dụ `kien-sang-main.png`, `thung_rac_xanh.png`, `thung_rac_cam.png`).
- Trang phục robot: `public/images/costumes/`, đặt tên theo ID như `tim_rac_01.png`, `cam_banh_mi_01.png`, `vui_01.png`.
- Ảnh món rác: `public/images/trash/`, đặt tên theo ID vật phẩm như `vo_hop_sua.png`.

Bộ tìm rác cần đủ `tim_rac_01` đến `tim_rac_12` để hiển thị hoạt ảnh riêng đủ 12 bước. Nếu chưa có ảnh tìm rác nào, khi di chuyển game dùng hoạt ảnh SVG mặc định thay vì giữ một ảnh cảm xúc đứng yên. Có thể bổ sung bộ ảnh vào project rồi build lại, hoặc tải bộ ảnh qua editor online và tải lại trang chơi.

Ba ảnh `tim_rac_13.png`, `tim_rac_14.png`, `tim_rac_15.png` dùng riêng cho động tác cúi nhặt, không thuộc chu kỳ đi bộ. Khi nhặt rác bằng phím/nút điều khiển hoặc nhờ Kiến Sáng tự đi nhặt, nhân vật lần lượt hiện ảnh 13 → 14 → 15 trong giai đoạn nhặt rồi chuyển sang bộ cầm rác. Biểu cảm vui dùng `vui_01.png` đến `vui_04.png`, biểu cảm buồn dùng `buon_01.png` đến `buon_04.png`. Xưởng Trang Phục có tab **Cúi nhặt**, tab biểu cảm 8 ảnh và chế độ xem thử cho từng nhóm. Với Supabase đang sử dụng, chạy lại `supabase/setup.sql` để cho phép upload các ID mới.

Mỗi ảnh cúi nhặt hiển thị 180 ms; game giữ trọn chuỗi 540 ms trước khi đổi sang ảnh cầm rác. Trong lúc cúi nhặt, thao tác di chuyển, nhặt/thả và đổi chế độ được khóa để không ngắt chuỗi ảnh giữa chừng.

Rác vẫn hiện trên sàn trong phần đầu động tác cúi, sau đó dịch lên về phía tay và thu nhỏ trước khi chuyển sang trang phục cầm rác. Các tư thế cúi được hòa ảnh ngắn và nạp trước để giảm giật. Ở chế độ **Nhờ Kiến Sáng**, sau khi bỏ rác nhân vật đứng nguyên cạnh thùng, không tự quay về giữa lớp; lượt tiếp theo bắt đầu từ vị trí đang đứng.

Khu vườn dùng riêng bộ `public/images/costumes/cam_gio_01.png` đến `cam_gio_12.png` cho nhân vật cầm giỏ, không vẽ thêm giỏ emoji. Có thể tải từng ảnh, tải nhiều ảnh hoặc cả thư mục qua tab **Cầm giỏ** trong Xưởng Trang Phục và xem thử đủ 12 bước. Bộ này không thay bộ tìm rác trong lớp học; khi thiếu một frame sẽ dùng ảnh cầm giỏ khác đã có, khi chưa có cả bộ sẽ dùng nhân vật thông thường. Nếu dùng editor online với Supabase đã thiết lập, chạy lại `supabase/setup.sql` để cho phép upload nhóm `cam_gio_*`.

Ảnh PNG/JPG/WebP/SVG đặt sẵn trong các thư mục trên sẽ được chép sang `dist/`. Khi build, Vite tạo `dist/kien-sang-assets.json` để ứng dụng nhận biết và nạp ảnh trang phục, ảnh rác, robot và thùng rác. Đặt tên ảnh trang phục/rác khớp ID trong ứng dụng để ảnh được gắn đúng vị trí. Giao diện có 215 ô trang phục cho các nhóm đi bộ, cúi nhặt, cầm giỏ, cầm rác và biểu cảm vui/buồn; chỉ cần thêm tệp vào `costumes/` nếu muốn thay một hay nhiều trang phục bằng ảnh riêng.

Để ảnh tải lên qua giao diện được đưa vào bản publish: chạy máy chủ phát triển, tải ảnh và lưu, rồi chạy lại `npm run build`. Publish toàn bộ nội dung `dist/`. Build không thể lấy dữ liệu chỉ có trong IndexedDB/localStorage của một trình duyệt; các ảnh đó cần được tải vào project (hoặc xuất thành HTML offline) trước khi chia sẻ.

Ảnh chỉ lưu trong IndexedDB/localStorage là dữ liệu riêng của trình duyệt đó, không tự được đưa vào `dist/` hoặc chia sẻ với người dùng khác. Có thể dùng chức năng tải HTML offline trong ứng dụng để xuất một file mang theo tùy chỉnh đang dùng trên trình duyệt.

Nếu cần tạo lại ảnh mặc định robot và thùng rác từ SVG có sẵn trong mã nguồn:

```bash
node scripts/generate_bin_images.js
node scripts/restoreMascot.cjs
```

## Cấu trúc dự án

```text
src/
  components/   Các thành phần giao diện và hộp thoại của trò chơi
  data/         Dữ liệu vật phẩm rác và trang phục robot
  utils/        Âm thanh, lưu dữ liệu và xuất dự án Scratch
  App.tsx       Logic và trạng thái chính của trò chơi
public/         Hình ảnh, tài nguyên tĩnh và bản HTML offline
scripts/        Công cụ hỗ trợ xử lý tài nguyên
```
