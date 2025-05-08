# Vision Forge Frontend

![Vision Forge Logo](public/images/logo.png)

## Overview

Vision Forge is an AI-powered video creation platform that streamlines the content creation process. This application enables users to quickly generate professional videos through an intuitive step-by-step workflow - from script creation to publishing on social media platforms.

## ✨ Features

- **AI-Powered Script Creation** - Generate compelling video scripts with advanced AI technology
- **Image Generation** - Create visuals that match your script content
- **Audio Configuration** - Select from various voices or use your own recordings
- **Video Assembly** - Combine scripts, images, and audio into cohesive videos
- **Social Media Publishing** - Upload videos directly to YouTube and other platforms
- **Content Management** - Organize and manage your scripts, audios, and videos
- **Vector Database Integration** - Store and retrieve embeddings for content similarity search
- **Multi-language Support** - Currently supports English and Vietnamese

## 🛠️ Technologies

- **Framework**: Next.js 15
- **UI Library**: React 18, Material UI 6
- **State Management**: Redux Toolkit
- **API Client**: Axios
- **Animations**: Framer Motion
- **Internationalization**: i18next
- **Form Handling**: React Hook Form
- **Data Visualization**: Chart.js, Recharts
- **Development**: TypeScript, ESLint, Prettier
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18.x or later
- npm or yarn
- A running instance of the Vision Forge backend API

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vision-forge-frontend.git
cd vision-forge-frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000

# Authentication (if using external auth providers)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Other configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

This will start the development server with Turbopack at http://localhost:3000.

### Production Build

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## 📁 Project Structure

```
vision-forge-frontend/
├── public/                  # Static assets and locales
│   ├── images/              # Image assets
│   └── locales/             # i18n translation files
├── src/
│   ├── app/                 # Next.js app directory (pages)
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── dev/             # Developer tools
│   │   ├── flow/            # Video generation flow
│   │   ├── home/            # Homepage sections
│   │   ├── media/           # Media management
│   │   ├── pinecone/        # Vector database UI
│   │   ├── profile/         # User profile components
│   │   └── ...
│   ├── config/              # Configuration files
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Page layouts
│   ├── services/            # API services
│   ├── store/               # Redux store and slices
│   └── utils/               # Utility functions
└── ...config files
```

## 🔄 Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🌐 Internationalization

The application supports multiple languages. Current locales:

- English (default)
- Vietnamese

Add or edit translations in the `public/locales/` directory.

## 🧑‍💻 Development Tools

### Developer Tools

The application includes built-in developer tools accessible at `/dev/tools`:

- **Storage API Tools** - Manage cloud storage files
- **Pinecone Vector DB Tools** - Interface with vector embeddings

## 🔐 Authentication

The application uses JWT-based authentication. Login, registration, and password reset features are available at:

- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`

## 🎬 Video Generation Flow

The video generation process follows these steps:

1. **Script Creation** - Write or generate a script
2. **Image Generation** - Generate images based on the script
3. **Audio Configuration** - Configure voice and audio settings
4. **Video Generation** - Combine all elements into a video
5. **Social Publishing** - Optionally publish to social platforms

## 📦 API Integration

The frontend integrates with two API services:

1. **Main API** - REST API for authentication, content management, and workflow
2. **FastAPI Service** - Python-based service for AI operations (embeddings, image generation)

## 🔍 Environment Variables

- `NEXT_PUBLIC_API_URL` - Main API endpoint
- `NEXT_PUBLIC_FASTAPI_URL` - FastAPI endpoint for AI services
- `NEXT_PUBLIC_APP_URL` - Application URL for callbacks
- Add other environment variables as needed for specific integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📄 License

[MIT License](LICENSE)

## 📧 Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com)
