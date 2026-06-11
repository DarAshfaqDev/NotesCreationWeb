# 📓 Slide-to-Sketch Note Studio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-slide--sketch--studio.vercel.app-FF4081?style=for-the-badge&logo=vercel&logoColor=white)](https://slide-sketch-studio.vercel.app)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

**Slide-to-Sketch Note Studio** is a visual learning companion that transforms plain-text DSA notes into beautifully styled, notebook-style slides with interactive algorithm visualizations. Export your slides as **PNG**, **JPEG**, or **multi-page PDF** — perfect for students, educators, and content creators.

<p align="center">
  <img src="src/assets/hero.png" alt="Slide-to-Sketch Studio Preview" width="700" style="border-radius: 12px;" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **📝 Rich Slide Editor** | Edit titles, paragraphs, bullet lists, and code blocks inline with a handcrafted notebook aesthetic |
| **📦 Bulk Importer** | Paste structured markdown-style transcripts — auto-parses into individual slides |
| **📊 Interactive Visualizers** | Live Stack (LIFO), Queue (FIFO), Binary Tree, Contiguous Array, and Complexity charts |
| **🎨 Notebook Styles** | Toggle between lined, grid, and plain paper backgrounds with handwritten or standard fonts |
| **📸 Export to PNG / JPEG** | Capture any slide as a high-resolution image (2x scale) |
| **📄 Export to PDF** | Compile the active slide into an A4 landscape PDF |
| **🖨️ Print Ready** | Browser print support with clean formatting |
| **📂 Slide Management** | Add, duplicate, delete, and navigate slides with ease |

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/DarAshfaqDev/NotesCreationWeb.git
cd NotesCreationWeb

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Build for Production

```bash
npm run build
```

A static build is emitted to the `dist/` directory, ready for deployment.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://reactjs.org/) | UI framework |
| [Vite 8](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Icon library |
| [html2canvas](https://html2canvas.hertzen.com/) | DOM-to-canvas rasterization |
| [jsPDF](https://github.com/parallax/jsPDF) | Client-side PDF generation |

---

## 📦 Export Formats

| Format | Button | Details |
|--------|--------|---------|
| **PNG** | `Download PNG` | Transparent background, 2x resolution |
| **JPEG** | `Download JPEG` | White fill, 95% quality, 2x resolution |
| **PDF** | `Download PDF Note Page` | A4 landscape, single slide per page |
| **Print** | `Print Master` | Native browser print dialog |

---

## 📝 Bulk Import Format

Separate slides using `--- Slide N: Title ---` delimiters:

```
--- Slide 1: Quick Sorting Arrays ---
Merge Sort recursive subdivisions slice lists in halves...
✓ Divide: split arrays around midpoint offsets
✓ Conquer: compare and order elements sequentially

data: [15, 30, 45, 60, 75]
[Array Visualizer]

--- Slide 2: FIFO Queue Tasks ---
A Queue is a linear system preserving structural FIFO order...
✓ Standard task scheduling pipeline
✓ CPU multi-process buffers

elements: [Job_A, Job_B, Job_C]
[Queue Visualizer]
```

Supported visualizer tags: `[Array Visualizer]`, `[Stack Visualizer]`, `[Queue Visualizer]`, `[Tree Visualizer]`, `[Complexity Visualizer]`

---

## 🌐 Deployment

The app is live at **[slide-sketch-studio.vercel.app](https://slide-sketch-studio.vercel.app)**.

### Deploy your own

**Vercel** (recommended):
```bash
npm install -g vercel
vercel --prod
```

**Netlify**:
```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a PR.

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/DarAshfaqDev">DarAshfaqDev</a> — <strong>@CodeVerve ACADEMY</strong>
</p>
