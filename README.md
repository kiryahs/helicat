# 🚁 HeliCat - Solana Meme Token Website

A fun, chaotic, and cute website for the HeliCat meme token featuring a cat with a helicopter hat!

## Features

### 3D Helicopter Blades
- Smooth, realistic helicopter blade rotation using Three.js
- Motion blur effects for authentic look
- Interactive mouse tracking
- Speed variations for dynamic feel

### Interactive Elements
- Click the cat 10 times for a surprise easter egg
- Hover effects on all interactive elements
- Smooth scroll navigation
- Floating particle background with cat and helicopter emojis
- Random flying cats across the screen

### Sections
1. **Hero** - Main landing with 3D helicopter blades over the cat
2. **About** - Story of HeliCat with the original video
3. **Tokenomics** - Token distribution and details
4. **How to Buy** - Step-by-step guide for purchasing
5. **Community** - Social media links

### Design Features
- Vibrant gradient backgrounds
- Glitch text effects on title
- Parallax cloud animations
- Responsive design for all devices
- Smooth animations throughout
- Fun color palette (orange, cyan, yellow)

## Setup

### Quick Start
1. Simply open `index.html` in a modern web browser
2. No build process required!

### File Structure
```
helicat_meme/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── helicopter.js       # Three.js helicopter blade system
├── script.js           # Interactive elements and effects
├── Download.mp4        # Original HeliCat video
├── image-Photoroom.png # Cat image for hero section
└── README.md           # This file
```

## Customization

### Update Contract Address
In `index.html`, find line 37:
```html
<p>CA: <span id="contract">TBA - Launching Soon!</span></p>
```
Replace "TBA - Launching Soon!" with your actual contract address.

### Social Media Links
In `index.html`, update the social links around line 110:
```html
<a href="#" class="social-btn twitter">
```
Replace `#` with your actual social media URLs.

### Colors
Edit the CSS variables in `styles.css` (lines 3-9):
```css
:root {
    --primary-color: #ff6b35;    /* Main orange */
    --secondary-color: #4ecdc4;   /* Cyan */
    --accent-color: #ffe66d;      /* Yellow */
    --dark-bg: #1a1a2e;           /* Dark background */
    --light-bg: #16213e;          /* Light background */
}
```

### Helicopter Blade Speed
In `helicopter.js`, line 16:
```javascript
this.rotationSpeed = 0.3; // Increase for faster rotation
```

### Token Supply
Update tokenomics in `index.html` around line 85.

## Interactive Features

### Easter Eggs
- **Click the cat 10 times** - Triggers a special message
- **Hover over the cat** - Makes helicopter blades spin faster
- **Console messages** - Check your browser console for fun messages

### Keyboard Shortcuts
- None yet - feel free to add your own!

## Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires WebGL support for 3D helicopter blades.

## Performance

### Optimization Tips
1. The site uses minimal dependencies (only Three.js CDN)
2. Animations are GPU-accelerated
3. Images should be optimized for web
4. Consider using a CDN for production

### Reduce Particle Count
In `script.js`, line 16:
```javascript
const particleCount = 30; // Reduce for slower devices
```

## Deployment

### GitHub Pages
1. Push to a GitHub repository
2. Go to Settings > Pages
3. Select main branch
4. Your site will be live at `https://yourusername.github.io/helicat_meme`

### Other Hosting
Simply upload all files to any web hosting service. No server-side code required!

## Credits

- Original TikTok video: [@miaustories6](https://www.tiktok.com/@miaustories6/video/7562376612809870614)
- Three.js for 3D graphics
- Made with love by the HeliCat community

## License

This is a meme project. Feel free to fork, modify, and share!

## Disclaimer

$HELICAT is a meme coin with no intrinsic value or expectation of financial return.
This website is for entertainment purposes. Always DYOR (Do Your Own Research).

---

🚁 To the moon! 🐱
