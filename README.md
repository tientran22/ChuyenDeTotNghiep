
## Cách Xây Dựng và Chạy Dự Án

### Bước 1: Clone hoặc Tải Xuống Repository

Clone repository hoặc tải xuống mã nguồn.

### Bước 2: Cập Nhật Composer

```bash
cd fj_be/fj_be
composer install
composer update
```

### Bước 3: Tạo Khóa Dự Án

Đầu tiên, tạo một tệp .env và sau đó sao chép tất cả dữ liệu từ .env.example sang .env.

```bash
php artisan key:generate
```
### Bước 4: Chạy Máy Chủ

```bash
php artisan serve
```
### Bước 5: Cài Đặt npm và Xây Dựng Gói

```bash
npm install
npm run dev
```
