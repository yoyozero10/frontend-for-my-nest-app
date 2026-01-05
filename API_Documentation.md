# Tài Liệu API - Hệ Thống Tuyển Dụng

## Thông Tin Chung

**Base URL:** `http://localhost:8000/api/v1`

**API Version:** v1, v2

**Authentication:** JWT Bearer Token (trừ các endpoint được đánh dấu `Public`)

### Headers Chuẩn

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <access_token>"
}
```

### Response Format Chuẩn

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {}
}
```

---

## 1. Authentication APIs

### 1.1 Đăng Ký (Register)

**Endpoint:** `POST /auth/register`

**Public:** ✅ Không cần token

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "age": 25,
  "gender": "Nam",
  "address": "Hà Nội"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Register a new user",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Nguyễn Văn A",
    "email": "user@example.com"
  }
}
```

### 1.2 Đăng Nhập (Login)

**Endpoint:** `POST /auth/login`

**Public:** ✅ Không cần token

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "User Login",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": {
        "_id": "role_id",
        "name": "USER"
      }
    }
  }
}
```

> **Lưu ý:** Cookie `refreshToken` sẽ được set tự động với `httpOnly: true`, `maxAge: 7 days`

### 1.3 Lấy Thông Tin Tài Khoản

**Endpoint:** `GET /auth/account`

**Authentication:** ✅ Required

**Response:**
```json
{
  "statusCode": 200,
  "message": "User Information",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": {
        "_id": "role_id",
        "name": "USER"
      },
      "permissions": [
        {
          "_id": "perm_id",
          "name": "View Jobs",
          "apiPath": "/api/jobs",
          "method": "GET"
        }
      ]
    }
  }
}
```

### 1.4 Refresh Token

**Endpoint:** `GET /auth/refresh`

**Public:** ✅ Không cần token (dùng cookie)

**Response:**
```json
{
  "statusCode": 201,
  "message": "Refresh token success",
  "data": {
    "access_token": "new_access_token"
  }
}
```

### 1.5 Đăng Xuất (Logout)

**Endpoint:** `POST /auth/logout`

**Authentication:** ✅ Required

**Response:**
```json
{
  "statusCode": 200,
  "message": "User Logout",
  "data": null
}
```

---

## 2. Users APIs

### 2.1 Tạo User Mới

**Endpoint:** `POST /users`

**Authentication:** ✅ Required (Admin only)

**Request Body:**
```json
{
  "name": "Nguyễn Văn B",
  "email": "userb@example.com",
  "password": "password123",
  "age": 30,
  "gender": "Nam",
  "address": "TP HCM",
  "role": "USER",
  "company": {
    "_id": "company_id",
    "name": "ABC Company"
  }
}
```

### 2.2 Lấy Danh Sách Users (Phân Trang)

**Endpoint:** `GET /users?current=1&pageSize=10`

**Authentication:** ✅ Required

**Query Parameters:**
- `current`: Trang hiện tại (default: 1)
- `pageSize`: Số lượng items/trang (default: 10)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Fetch user with paginate",
  "data": {
    "meta": {
      "current": 1,
      "pageSize": 10,
      "pages": 5,
      "total": 50
    },
    "result": [
      {
        "_id": "user_id",
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "age": 25,
        "gender": "Nam",
        "address": "Hà Nội",
        "role": {
          "_id": "role_id",
          "name": "USER"
        },
        "company": {
          "_id": "company_id",
          "name": "ABC Company"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 2.3 Lấy User Theo ID

**Endpoint:** `GET /users/:id`

**Authentication:** ✅ Required

**Response:**
```json
{
  "statusCode": 200,
  "message": "Fetch user by id",
  "data": {
    "_id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": {...},
    "company": {...}
  }
}
```

### 2.4 Cập Nhật User

**Endpoint:** `PATCH /users`

**Authentication:** ✅ Required

**Request Body:**
```json
{
  "_id": "user_id",
  "name": "Nguyễn Văn A Updated",
  "age": 26,
  "gender": "Nam",
  "address": "Hà Nội"
}
```

### 2.5 Xóa User

**Endpoint:** `DELETE /users/:id`

**Authentication:** ✅ Required (Admin only)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Delete a User",
  "data": {
    "deleted": true
  }
}
```

---

## 3. Jobs APIs

### 3.1 Tạo Job Mới

**Endpoint:** `POST /jobs`

**Authentication:** ✅ Required (HR/Admin)

**Request Body:**
```json
{
  "name": "Senior Backend Developer",
  "skills": ["NestJS", "MongoDB", "TypeScript"],
  "company": {
    "_id": "company_id",
    "name": "ABC Company"
  },
  "salary": 2000,
  "quantity": 5,
  "level": "SENIOR",
  "description": "Mô tả công việc chi tiết...",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-12-31T23:59:59.000Z",
  "isActive": true
}
```

**Level Options:** `INTERN`, `FRESHER`, `JUNIOR`, `MIDDLE`, `SENIOR`

### 3.2 Lấy Danh Sách Jobs

**Endpoint:** `GET /jobs`

**Public:** ✅ Không cần token

**Response:**
```json
{
  "statusCode": 200,
  "message": "Fetch all jobs",
  "data": [
    {
      "_id": "job_id",
      "name": "Senior Backend Developer",
      "skills": ["NestJS", "MongoDB"],
      "company": {
        "_id": "company_id",
        "name": "ABC Company",
        "logo": "logo.png"
      },
      "salary": 2000,
      "quantity": 5,
      "level": "SENIOR",
      "description": "...",
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-12-31T23:59:59.000Z",
      "isActive": true,
      "createdBy": {...},
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3.3 Lấy Job Theo ID

**Endpoint:** `GET /jobs/:id`

**Public:** ✅ Không cần token

### 3.4 Cập Nhật Job

**Endpoint:** `PATCH /jobs/:id`

**Authentication:** ✅ Required (HR/Admin)

### 3.5 Xóa Job

**Endpoint:** `DELETE /jobs/:id`

**Authentication:** ✅ Required (HR/Admin)

---

## 4. Companies APIs

### 4.1 Tạo Company Mới

**Endpoint:** `POST /companies`

**Authentication:** ✅ Required (Admin)

**Request Body:**
```json
{
  "name": "ABC Technology",
  "description": "Công ty công nghệ hàng đầu",
  "address": "123 Đường ABC, Hà Nội",
  "logo": "abc-logo.png"
}
```

### 4.2 Lấy Danh Sách Companies (Có Filter)

**Endpoint:** `GET /companies?current=1&pageSize=10&search=ABC&name=Tech&address=Hà Nội`

**Public:** ✅ Không cần token

**Query Parameters:**
- `current`: Trang hiện tại
- `pageSize`: Số items/trang
- `search`: Tìm kiếm chung
- `name`: Lọc theo tên
- `address`: Lọc theo địa chỉ
- `description`: Lọc theo mô tả

**Response:**
```json
{
  "statusCode": 200,
  "message": "Fetch companies with filters",
  "data": {
    "meta": {
      "current": 1,
      "pageSize": 10,
      "pages": 3,
      "total": 25
    },
    "result": [
      {
        "_id": "company_id",
        "name": "ABC Technology",
        "description": "...",
        "address": "Hà Nội",
        "logo": "logo.png",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 4.3 Lấy Company Theo ID

**Endpoint:** `GET /companies/:id`

### 4.4 Cập Nhật Company

**Endpoint:** `PATCH /companies`

**Request Body:**
```json
{
  "_id": "company_id",
  "name": "ABC Technology Updated",
  "description": "...",
  "address": "...",
  "logo": "new-logo.png"
}
```

### 4.5 Xóa Company

**Endpoint:** `DELETE /companies/:id`

---

## 5. Resumes APIs

### 5.1 Tạo Resume (Nộp Đơn)

**Endpoint:** `POST /resumes`

**Authentication:** ✅ Required

**Request Body:**
```json
{
  "url": "https://example.com/cv.pdf",
  "companyId": "company_id",
  "jobId": "job_id"
}
```

### 5.2 Lấy Danh Sách Resumes

**Endpoint:** `GET /resumes?current=1&pageSize=10`

**Authentication:** ✅ Required (HR/Admin)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Fetch all resumes with paginate",
  "data": {
    "meta": {...},
    "result": [
      {
        "_id": "resume_id",
        "url": "cv.pdf",
        "status": "PENDING",
        "companyId": {
          "_id": "company_id",
          "name": "ABC Company"
        },
        "jobId": {
          "_id": "job_id",
          "name": "Backend Developer"
        },
        "userId": {
          "_id": "user_id",
          "name": "Nguyễn Văn A",
          "email": "user@example.com"
        },
        "history": [
          {
            "status": "PENDING",
            "updatedAt": "2024-01-01T00:00:00.000Z",
            "updatedBy": {...}
          }
        ],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### 5.3 Lấy Resumes Của User Hiện Tại

**Endpoint:** `POST /resumes/by-user`

**Authentication:** ✅ Required

### 5.4 Lấy Resume Theo ID

**Endpoint:** `GET /resumes/:id`

### 5.5 Cập Nhật Trạng Thái Resume

**Endpoint:** `PATCH /resumes/:id`

**Authentication:** ✅ Required (HR/Admin)

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

**Status Options:** `PENDING`, `REVIEWING`, `APPROVED`, `REJECTED`

### 5.6 Xóa Resume

**Endpoint:** `DELETE /resumes/:id`

---

## 6. Roles APIs

### 6.1 Tạo Role Mới

**Endpoint:** `POST /roles`

**Authentication:** ✅ Required (Admin)

**Request Body:**
```json
{
  "name": "HR_MANAGER",
  "description": "Quản lý tuyển dụng",
  "isActive": true,
  "permissions": [
    "permission_id_1",
    "permission_id_2"
  ]
}
```

### 6.2 Lấy Danh Sách Roles

**Endpoint:** `GET /roles?current=1&pageSize=10`

**Authentication:** ✅ Required

### 6.3 Lấy Role Theo ID

**Endpoint:** `GET /roles/:id`

### 6.4 Cập Nhật Role

**Endpoint:** `PATCH /roles/:id`

### 6.5 Xóa Role

**Endpoint:** `DELETE /roles/:id`

---

## 7. Permissions APIs

### 7.1 Tạo Permission Mới

**Endpoint:** `POST /permissions`

**Authentication:** ✅ Required (Admin)

**Request Body:**
```json
{
  "name": "Create Job",
  "apiPath": "/api/jobs",
  "method": "POST",
  "module": "JOBS"
}
```

**Method Options:** `GET`, `POST`, `PATCH`, `DELETE`

### 7.2 Lấy Danh Sách Permissions

**Endpoint:** `GET /permissions?current=1&pageSize=10`

### 7.3 Lấy Permission Theo ID

**Endpoint:** `GET /permissions/:id`

### 7.4 Cập Nhật Permission

**Endpoint:** `PATCH /permissions/:id`

### 7.5 Xóa Permission

**Endpoint:** `DELETE /permissions/:id`

---

## 8. Subscribers APIs

### 8.1 Tạo Subscriber (Đăng Ký Nhận Thông Báo)

**Endpoint:** `POST /subscribers`

**Authentication:** ✅ Required

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "skills": ["NestJS", "ReactJS", "MongoDB"]
}
```

### 8.2 Lấy Danh Sách Subscribers

**Endpoint:** `GET /subscribers?current=1&pageSize=10`

**Authentication:** ✅ Required (Admin)

### 8.3 Lấy Subscriber Theo ID

**Endpoint:** `GET /subscribers/:id`

### 8.4 Cập Nhật Subscriber

**Endpoint:** `PATCH /subscribers/:id`

### 8.5 Xóa Subscriber

**Endpoint:** `DELETE /subscribers/:id`

---

## 9. Files APIs

### 9.1 Upload File

**Endpoint:** `POST /files/upload`

**Authentication:** ✅ Required

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: File to upload (max 5MB)

**Supported Types:** 
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`
- Documents: `.pdf`, `.doc`, `.docx`

**Response:**
```json
{
  "statusCode": 200,
  "message": "File uploaded successfully",
  "data": {
    "filename": "1234567890-resume.pdf",
    "originalname": "resume.pdf",
    "mimetype": "application/pdf",
    "size": 1024000,
    "path": "uploads/1234567890-resume.pdf"
  }
}
```

---

## 10. Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Email is required", "Password is required"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền truy cập endpoint này",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

---

## 11. Lưu Ý Quan Trọng

### Authentication Flow

1. **Đăng nhập:** `POST /auth/login` → nhận `access_token` và `refreshToken` (cookie)
2. **Gọi API:** Thêm header `Authorization: Bearer <access_token>`
3. **Token hết hạn:** Gọi `GET /auth/refresh` → nhận `access_token` mới
4. **Đăng xuất:** `POST /auth/logout`

### CORS

API hỗ trợ CORS với `credentials: true`. Frontend cần set:
```javascript
fetch(url, {
  credentials: 'include'
})
```

### Pagination

Tất cả endpoints có phân trang đều trả về format:
```json
{
  "meta": {
    "current": 1,
    "pageSize": 10,
    "pages": 5,
    "total": 50
  },
  "result": [...]
}
```
