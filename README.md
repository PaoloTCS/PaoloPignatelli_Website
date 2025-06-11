# Paolo Pignatelli Website

A modern, responsive academic website showcasing research in linguistics and philosophy.

## Overview

This website contains four main sections:
- **Home**: Introduction and overview
- **Linguistics**: Research areas and R&D projects
- **Philosophy**: Philosophical inquiries and academic work
- **Related Sites**: Useful resources and links for academic research

## Features

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Modern CSS Grid and Flexbox layout
- ✅ Smooth animations and hover effects
- ✅ Mobile-first navigation with hamburger menu
- ✅ Professional typography using Google Fonts
- ✅ Clean, academic design aesthetic
- ✅ Fast loading and optimized performance

## Deployment to GitHub Pages

### Method 1: Direct Upload
1. Create a new repository on GitHub (e.g., `paolo-pignatelli-website`)
2. Upload all files to the repository
3. Go to repository Settings → Pages
4. Set Source to "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click Save

### Method 2: Git Commands
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Paolo Pignatelli Website"

# Add GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/paolo-pignatelli-website.git

# Push to GitHub
git push -u origin main
```

Then enable GitHub Pages in repository settings as described in Method 1.

### Custom Domain (Optional)
If you want to use a custom domain:
1. Create a `CNAME` file in the root directory
2. Add your domain name (e.g., `www.paolopignatelli.com`)
3. Configure DNS settings with your domain provider

## File Structure

```
├── index.html          # Homepage
├── linguistics.html    # Linguistics page
├── philosophy.html     # Philosophy page
├── related-sites.html  # Related sites page
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
├── Images/             # Images directory
│   └── Pignatelli_stemma (1).jpg
└── README.md          # This file
```

## Customization

### Content Updates
- Edit HTML files to update content
- Modify text, add new research areas, or update links
- All external links include proper security attributes

### Styling Changes
- Main styles are in `styles.css`
- Color scheme uses professional blues and grays
- Fonts: Playfair Display (headings) + Source Sans Pro (body)

### Adding New Pages
1. Create new HTML file following the same structure
2. Update navigation in all HTML files
3. Add corresponding styles if needed

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized images
- Minimal external dependencies
- CSS Grid and Flexbox for efficient layouts
- Smooth scroll and animation performance

## License

© 2024 Paolo Pignatelli. All rights reserved. 