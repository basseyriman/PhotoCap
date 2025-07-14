# PhotoCap - AI-Powered Photo Caption Generator

A beautiful web application that generates creative and engaging captions for your photos using AI vision technology. Upload photos or capture them directly with your camera, then get viral-worthy captions perfect for social media.

## ✨ Features

- 🤖 **AI Vision Analysis**: Advanced GPT-4o vision model analyzes photos comprehensively
- 📸 **Camera Capture**: Take photos directly in the browser with your device camera
- 📁 **File Upload**: Drag & drop or click to upload photos from your device
- 🎯 **Smart Caption Generation**: AI analyzes composition, lighting, mood, colors, and more
- 📱 **Social Media Integration**: Share to multiple platforms with combined image + caption
- 🎨 **Combined Image Creation**: Download photos with captions overlaid
- 📋 **Copy to Clipboard**: One-click copying of generated captions
- 🌟 **Multi-Platform Sharing**: Twitter, Facebook, WhatsApp, Instagram, LinkedIn, Pinterest, Telegram, Reddit, Tumblr
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Fast & Lightweight**: Built with Next.js 14 and Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/basseyriman/PhotoCap.git
cd photocap
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your OpenAI API key:

   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Photo Capture & Upload

1. **Camera Capture**: Click the camera icon to take photos directly with your device
2. **File Upload**: Drag & drop images or click to upload from your device
3. **Supported Formats**: PNG, JPEG, GIF, WebP (up to 5MB)

### AI Caption Generation

1. **Upload/Capture**: Add a photo using camera or file upload
2. **Generate Caption**: Click the "Generate Caption" button
3. **AI Analysis**: The system analyzes:
   - Composition, lighting, mood, colors
   - Setting, subjects, fashion, expressions
   - Overall aesthetic and visual storytelling
4. **Viral-Worthy Captions**: Get engaging, trendy captions perfect for social media

### Social Media Sharing

1. **Share Options**: Click the share button to see all platform options
2. **Combined Images**: Download photos with captions overlaid
3. **Platform-Specific**: Each platform has optimized sharing:
   - **Instagram**: Caption copied to clipboard + Instagram opened
   - **Twitter/Facebook**: Direct sharing with pre-filled content
   - **WhatsApp/Telegram**: Message sharing with image + caption
   - **LinkedIn/Pinterest**: Professional sharing options

## 🤖 AI Technology

### Vision Model

- **Model**: GPT-4o (latest vision model)
- **Analysis**: Comprehensive photo analysis including:
  - Visual composition and aesthetics
  - Lighting and mood analysis
  - Subject and setting recognition
  - Fashion and style elements
  - Emotional impact assessment

### Caption Generation

- **Trendy Language**: Uses current viral language and hashtags
- **Emotional Storytelling**: Creates captions that drive engagement
- **Multi-Platform Optimization**: Adapts to different social media platforms
- **Creative Freedom**: Bypasses restrictions for maximum creativity

## 🌐 Social Media Platforms

### Supported Platforms

- **Instagram**: Caption copying + platform opening
- **Twitter**: Direct tweet sharing
- **Facebook**: Post sharing with image
- **WhatsApp**: Message sharing
- **LinkedIn**: Professional post sharing
- **Pinterest**: Pin creation
- **Telegram**: Channel/message sharing
- **Reddit**: Subreddit posting
- **Tumblr**: Blog post sharing

### Sharing Features

- **Combined Images**: Photos with captions overlaid
- **Pre-filled Content**: Captions automatically added to posts
- **Platform-Specific URLs**: Optimized sharing for each platform
- **Error Handling**: Graceful fallbacks for unsupported features

## 🛠️ Technologies Used

- **Next.js 14**: React framework with App Router
- **OpenAI GPT-4o**: Advanced vision model for photo analysis
- **React Hooks**: State management and effects
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful, consistent icons
- **Canvas API**: Image processing and overlay creation
- **MediaDevices API**: Camera access and photo capture

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variable in Vercel dashboard:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
3. Deploy automatically on push to main branch

### Environment Variables for Production

- Set `OPENAI_API_KEY` in your hosting platform's environment variables
- Never commit API keys to version control

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for the GPT-4o vision model
- Next.js team for the amazing framework
- Tailwind CSS for the beautiful styling system
- Lucide for the consistent icon set

---

**PhotoCap** - Transform your photos into viral social media content with AI-powered captions! 🚀
