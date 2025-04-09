# Deployment Guide: Zurich Perspectives

This guide provides instructions for deploying the Zurich Perspectives interactive web pilot to various hosting environments.

## Local Deployment

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Steps
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Build the application:
   ```
   npm run build
   ```
5. Start the production server:
   ```
   npm start
   ```
6. Access the application at http://localhost:3000

## Vercel Deployment (Recommended)

Vercel is the recommended hosting platform for Next.js applications.

### Prerequisites
- Vercel account
- Vercel CLI (optional)

### Steps
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in the Vercel dashboard:
   - Go to https://vercel.com/new
   - Select your Git repository
   - Configure project settings (or use defaults)
   - Click "Deploy"
3. Alternatively, use the Vercel CLI:
   ```
   npm install -g vercel
   vercel login
   vercel
   ```

## Netlify Deployment

### Prerequisites
- Netlify account
- Netlify CLI (optional)

### Steps
1. Push your code to a Git repository
2. Import the project in the Netlify dashboard:
   - Go to https://app.netlify.com/start
   - Select your Git repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"
3. Alternatively, use the Netlify CLI:
   ```
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

## Docker Deployment

### Prerequisites
- Docker installed on your server

### Steps
1. Create a Dockerfile in the project root:
   ```
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```
2. Build the Docker image:
   ```
   docker build -t zurich-perspectives .
   ```
3. Run the Docker container:
   ```
   docker run -p 3000:3000 zurich-perspectives
   ```
4. Access the application at http://localhost:3000

## Environment Variables

The application doesn't require any environment variables for basic functionality. However, if you need to customize certain aspects, you can use the following:

- `NEXT_PUBLIC_BASE_URL`: Base URL for the application (useful for absolute URLs)
- `NEXT_PUBLIC_API_URL`: URL for external APIs (if added in future enhancements)

## Post-Deployment Verification

After deploying, verify that:
1. The welcome page loads correctly
2. All persona profiles are accessible
3. Interactive elements work as expected
4. Data visualizations render properly
5. Navigation between sections functions correctly

## Troubleshooting

Common issues and solutions:
- If static assets aren't loading, check your base URL configuration
- If the application fails to build, ensure all dependencies are installed
- For performance issues, consider enabling caching headers in your hosting environment

For additional support, refer to the Next.js deployment documentation: https://nextjs.org/docs/deployment
