# Adding a New Project

> Step-by-step guide to adding a project to your portfolio.

## 1. Add the data

Edit `js/data.js` and add a new entry:

```js
export const projectData = {
  // ... existing projects
  myNewProject: {
    title: 'MY NEW PROJECT — Cool Subtitle',
    icon: 'NP',  // 2-3 character code, shown large in the card visual
    desc: 'A detailed description of what this project is, what it does, and what makes it interesting. Aim for 2-3 sentences.',
    tags: ['React', 'TypeScript', 'AI'],
    highlights: [
      '🎯 Key feature or achievement #1',
      '⚡ Key feature or achievement #2',
      '🚀 Key feature or achievement #3',
      '🧠 Key feature or achievement #4',
      '📊 Key feature or achievement #5'
    ]
  }
};
```

## 2. Add the card markup

In `index.html`, find `<div class="projects-grid">` and add a new card:

```html
<div class="project-card magnetic reveal" data-project="myNewProject">
  <div class="project-visual"><span>NP</span></div>
  <div class="project-tags">
    <span class="project-tag">React</span>
    <span class="project-tag">TypeScript</span>
    <span class="project-tag">AI</span>
  </div>
  <h3 class="project-title">MY NEW PROJECT — Cool Subtitle</h3>
  <p class="project-desc">A detailed description of what this project is...</p>
  <a class="project-link" data-modal="myNewProject">Explore project →</a>
</div>
```

The `data-project` and `data-modal` attributes must match the key in `projectData`.

## 3. Reveal animation delay (optional)

The 6 existing projects use `reveal-delay-1` and `reveal-delay-2` to stagger the load-in animation. If you add a 7th project, you might want to extend the delays:

```html
<div class="project-card magnetic reveal reveal-delay-3" data-project="myNewProject">
  ...
</div>
```

Available delays: `-1`, `-2`, `-3`, `-4`, `-5`.

## 4. Test it

1. Open the page and scroll to the projects section
2. The new card should appear with a fade-in
3. Hovering should trigger the 3D tilt effect
4. Clicking "Explore project →" should open the modal with full details

## 💡 Tips

- **Keep titles under 60 characters** — they need to fit on one line
- **Use emoji in highlights** for visual variety (🎯 ⚡ 🧠 🚀 📊 🔒)
- **3-5 tags is ideal** — too many clutters the card
- **5 highlights is the sweet spot** — fewer feels thin, more feels overwhelming
- **Reuse a real abbreviation or initials** for the icon (e.g. "CV" for Computer Vision)

## 🖼 Want a real image instead of an icon?

Replace the `.project-visual` block:

```html
<!-- Instead of: -->
<div class="project-visual"><span>NP</span></div>

<!-- Use: -->
<div class="project-visual" style="background-image: url('assets/projects/my-project.jpg'); background-size: cover;"></div>
```

Then drop your image into `assets/projects/`.
