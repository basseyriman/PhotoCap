# PhotoCap - AI-Powered Photo Caption Generator

A beautiful web application that generates creative and engaging captions for your photos using AI. Simply enter your location, outfit colors, and time of day to get the perfect caption.

## Features

- 🎨 **AI-Powered Captions**: Generate creative captions using OpenAI's GPT-4
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎯 **Simple Interface**: Easy-to-use form with location, colors, and time inputs
- 📋 **Copy to Clipboard**: One-click copying of generated captions
- 🌟 **Demo Mode**: Works without API key using fallback captions
- ⚡ **Fast & Lightweight**: Built with Next.js 14 and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd photocap
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your OpenAI API key (optional for demo mode):

   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key:

   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter Location**: Where was the photo taken? (e.g., "London", "Newcastle")
2. **Enter Colors**: What colors are in your outfit? (e.g., "Red", "Green", "Yellow")
3. **Select Time**: Choose the time of day (Day, Dawn, Sunset, Midnight)
4. **Generate Caption**: Click the button to get your AI-generated caption
5. **Copy Caption**: Use the copy button to copy the caption to your clipboard

## Demo Mode

If you don't have an OpenAI API key, the app will work in demo mode with pre-generated captions based on your inputs. You'll see a yellow notification indicating demo mode.

## Technologies Used

- **Next.js 14**: React framework with App Router
- **OpenAI API**: For AI-powered caption generation
- **React Hook Form**: For form handling and validation
- **Tailwind CSS**: For styling
- **Lucide React**: For beautiful icons

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
