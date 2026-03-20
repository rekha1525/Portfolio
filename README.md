## Deploy to GitHub Pages

1. **Create a GitHub repository** (e.g. `yourusername.github.io` for a user site, or any repo name for a project site).

2. **Push this project** to the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to the repo → **Settings** → **Pages**
   - Under **Source**, choose **Deploy from a branch**
   - **Branch:** `main` (or `master`), folder: **/ (root)**
   - Save

4. **Wait a minute or two.** Your site will be at:
   - User/org site: `https://YOUR_USERNAME.github.io`
   - Project site: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### If the site is in a subfolder (project site)

When the repo name is not `username.github.io`, GitHub serves the site at `username.github.io/repo-name/`. So CSS/JS paths must work from that subfolder. This project uses relative paths (`styles.css`, `script.js`), so it works as-is. If you use a custom domain or move files, keep paths relative to `index.html`.

## Customize

- **Name & tagline:** Edit the hero section in `index.html` (e.g. "Your Name", "Developer & Creative").
- **About:** Update the About section text and add a profile image:
  ```html
  <img src="your-photo.jpg" alt="Your Name">
  ```
- **Skills:** Change the list in the Skills section.
- **Projects:** Replace the project cards with your real projects (titles, descriptions, Live/Code links).
- **Contact:** Update email and social links in the Contact section.
- **Colors/fonts:** Adjust CSS variables at the top of `styles.css` (`:root`).