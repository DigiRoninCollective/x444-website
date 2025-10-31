# x444 Protocol Website

Official website and interactive demo for the x444 HTTP 402 payment protocol.

## Features

- **Hero Section** - Eye-catching introduction with key stats
- **Features Showcase** - 6 core features with detailed descriptions
- **How It Works** - Step-by-step payment flow explanation
- **Technical Specs** - ERC-20 standards, networks, and security info
- **Interactive Demo** - Live payment simulation
- **Integration Guide** - Code examples for servers and clients
- **Documentation Links** - API reference and guides
- **Responsive Design** - Mobile-first, fully responsive layout

## Color Scheme

The website uses a neon cyberpunk aesthetic:

- **Primary Purple**: `#6a6aff` - Main brand color
- **Accent Pink**: `#ff6aaa` - Highlight and CTAs
- **Cyber Cyan**: `#6affff` - Interactive elements
- **Dark Background**: `#0a0a0a` - Minimalist dark theme

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start dev server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Project Structure

```
src/
├── components/
│   ├── Navigation.tsx    - Top navigation with mobile menu
│   ├── Hero.tsx          - Hero section with CTA
│   ├── Features.tsx      - Feature showcase grid
│   ├── HowItWorks.tsx    - Payment flow explanation
│   ├── Specs.tsx         - Technical specifications
│   ├── Demo.tsx          - Interactive payment demo
│   ├── Integration.tsx   - Integration code examples
│   ├── Docs.tsx          - Documentation links
│   ├── Ecosystem.tsx     - Ecosystem overview
│   └── Footer.tsx        - Footer with links
├── App.tsx               - Main app component
├── main.tsx              - React entry point
└── index.css             - Global styles and Tailwind
```

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette. The config includes:
- Brand colors (primary, accent, cyber)
- Dark backgrounds
- Gradients
- Custom animations (pulse-glow, float, flicker)

### Content

Each component is self-contained and can be easily customized:

1. **Navigation** - Update links in the `navLinks` array
2. **Features** - Modify the `features` array
3. **Specs** - Update the `specs` object
4. **Ecosystem** - Change the `ecosystem` data

### Code Examples

Update the code snippets in `HowItWorks.tsx` and `Integration.tsx` to match your latest API.

## Deployment

### Vercel (Recommended)

```bash
# Build and deploy
vercel deploy
```

### Traditional Hosting

```bash
# Build
pnpm build

# Upload dist/ folder to your host
```

### Docker

```bash
# Build image
docker build -t x444-website .

# Run container
docker run -p 3000:3000 x444-website
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

The website is optimized for:
- Fast load times (<2s)
- SEO friendly
- Mobile responsive
- Accessible (WCAG AA)

## License

MIT
