# CloudDrop

A full-stack web application that enables secure file sharing through AWS S3 with team collaboration features. Users can upload large files, generate signed URLs with expiration limits, and collaborate through group chat with role-based access. Includes flexible subscription plans powered by Razorpay payment integration.

## 🚀 Features

### File Management
- **Large File Upload**: Upload videos, images, and other files directly to S3 bucket
- **Multiple File Support**: Batch upload multiple files simultaneously
- **Signed URL Generation**: Create secure, time-limited access URLs for files
- **Expiration Control**: Set custom expiration times for file access

### Authentication & Security
- **Email-based Signup**: Secure registration with OTP verification
- **Email Verification**: Two-step verification process for account security
- **Secure File Access**: All file access through signed URLs with time limits
- **Subscription Management**: Free and Pro plans with Razorpay payment processing

### Collaboration Features
- **Group Chat**: Create and manage team groups
- **Role Assignment**: Assign specific roles to group members (Frontend Developer, Backend Specialist, etc.)
- **Chat Commands**: Special commands for file operations within chat
- **Email Integration**: Send signed URLs directly via email with verification

### Chat Commands
- `/signedUrl filename expiration` - Generate signed URL for specified file with custom expiration

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for production
- **Tailwind CSS** - Utility-first CSS framework
- **Aceternity UI** - Modern UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **AWS S3** - Cloud storage service
- **Razorpay** - Payment gateway for subscription management

### Additional Technologies
- **JavaScript** - Primary programming language
- **Email Service** - For OTP verification and signed URL delivery

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- AWS Account with S3 bucket configured
- Email service credentials (for OTP and notifications)
- Razorpay account for payment processing

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd [project-directory]
   ```

2. **Install dependencies for backend**
   ```bash
   cd backend
   npm install
   ```

3. **Install dependencies for frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` files in both frontend and backend directories:
   
   **Backend `.env`:**
   ```env
   PORT=5000
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   S3_BUCKET_NAME=your_s3_bucket_name
   EMAIL_SERVICE_API_KEY=your_email_service_key
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
   
   **Frontend `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend application**
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
project-root/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── package.json
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   └── package.json
└── README.md
```

## 💳 Subscription Plans

CloudDrop offers flexible pricing to meet different user needs:

### Free Plan
- Basic file upload capabilities
- Limited storage space
- Standard signed URL generation
- Basic group chat functionality
- Email support

### Pro Plan
- Unlimited file uploads
- Extended storage capacity
- Priority signed URL generation
- Advanced group management features
- Role-based permissions
- Priority email support
- Extended file retention periods

**Payment Processing:** Secure payments handled through Razorpay integration with support for multiple payment methods including cards, UPI, and net banking.

### File Upload & Management
- Secure direct upload to S3 bucket
- Automatic file type validation
- Progress tracking for large file uploads
- File metadata storage and retrieval

### Signed URL Generation
- Time-limited access to files
- Customizable expiration periods
- Secure URL generation with AWS signatures
- Direct sharing capabilities

### Group Collaboration
- Create project-specific groups
- Assign roles like Frontend Developer, Backend Specialist, etc.
- Real-time chat functionality
- Role-based permissions and access

### Email Integration
- OTP-based signup verification
- Signed URL delivery via email
- Email address verification before sending
- Automated notification system

## 🔒 Security Features

- JWT-based authentication
- Email verification for all operations
- Signed URLs with expiration limits
- Role-based access control
- Secure file storage in AWS S3
- PCI-compliant payment processing with Razorpay

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support or questions, please open an issue in the GitHub repository or contact the development team.
mail - clouddrop.s3@gmail.com

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - File upload and management
  - Signed URL generation
  - Group chat with roles
  - Email integration
  - OTP-based authentication
  - Free and Pro subscription plans
  - Razorpay payment integration

---
