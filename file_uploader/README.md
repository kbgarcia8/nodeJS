# File Storage

### 🔑 User Authentication
- Secure login and logout

### 👥 Member Types & Permissions

#### 🛠️ Admin
- **User Management**
  - Create, Search, Update, and Delete users
- **File Management**
  - Upload files to main (default) or custom folders
  - Toggle file privacy (Public / Private)
  - Download and delete files of all users
- **Folder Management**
  - Create and delete folders for all users

#### 👤 Registered User
- **File Management**
  - Upload files to main (default) or custom folders
  - Toggle file privacy (Public / Private)
  - Download public files and own files
  - Delete own files
- **Folder Management**
  - Create and delete own folders
- **Additional Features**
  - Extra storage compared to guest accounts 🚧 (Coming Soon)

#### 👥 Guest
- **File Management**
  - Upload files to main (default) folder
  - Download only public files

### For improvements
1. Migrate from Aiven to Supabase
2. Add a share folder functionality. When a user wants to share a folder (and all of its contents), they should have a form to specify the duration i.e. 1d, 10d etc. This should generate a link that can be shared with anyone (unauthenticated users). For example, the link could be in the following format: https://yourapp.com/share/c758c495-0705-44c6-8bab-6635fd12cf81 (Can be implemented using Supabase can be shown in bukcets in file when get URL is clicked)
3. Move file from one folder to another
4. User Account Settings - edit username/password
5. Rename project to File Storage when migrated to own repository