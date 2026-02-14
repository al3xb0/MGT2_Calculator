# 🎮 MGT2 Calculator — Perfect Game Helper

A lightweight desktop companion app for **Mad Games Tycoon 2** that instantly shows you the optimal slider values, alignment settings, and design focus for any genre + subgenre combination. No more tabbing out to spreadsheets — pin it on top of your game and make perfect games every time.

Built with [Tauri v2](https://tauri.app/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/).

## 📥 Download

| Platform | Link |
|----------|------|
| **Windows (.exe)** | [⬇ Download Latest Release](https://github.com/al3xb0/MGT2_Calculator/releases/latest) |

> Go to the **Releases** page and download the `.exe` or `.msi` installer from the latest release assets.

---

## ✨ Features

- **Pre-computed data for 19 genres** — every single genre from Mad Games Tycoon 2
- **~200 genre + subgenre combination overrides** — not averaged, not estimated, but exact values extracted from the game's data
- **8 game slider recommendations** — Game Length, Game Depth, Beginner Friendliness, Innovation, Story, Characters, Level Design, Mission Design
- **Design Direction** — Core Gamers ↔ Casual, Nonviolent ↔ Explicit, Easy ↔ Hard per combination
- **Design Priority percentages** — Gameplay / Graphics / Sound / Technology split
- **Topic compatibility checker** — shows ✅ Perfect Match or ❌ Not Compatible for any topic + genre pair
- **Target Audience display** — highlights compatible audiences (Everyone, Children, Teenagers, Adults, Seniors) in green, grays out incompatible
- **Always-on-Top mode** — pin the window above your game so you never lose sight of the data
- **Window transparency** — adjustable real transparency so you can see through the window to your game
- **3 languages** — English, Russian, Polish
- **Dark theme with custom title bar** — frameless window with integrated minimize/maximize/close controls
- **Tiny footprint** — native Tauri app, ~3 MB installed, near-zero CPU/RAM usage

## 📸 Why This Calculator?

Most "calculators" for MGT2 either:
- Use **averaged** values that aren't accurate for specific combinations
- Require you to **open a browser** and search through tables
- Don't include **design direction** or **design priority** data

**MGT2 Calculator** uses the actual optimal slider values sourced from the definitive [Steam Community Guide](https://steamcommunity.com/sharedfiles/filedetails/?id=2730524852) by **Chronosuniverse**. When a specific genre + subgenre combination has its own overridden values, you get those exact values — not an average.

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **Rust** | 1.70+ | [rustup.rs](https://rustup.rs/) |
| **npm** | 9+ | Comes with Node.js |

> **Windows users**: Make sure you have the [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) installed (required by Rust/Tauri). During installation, select "Desktop development with C++".

> **Linux users**: Install system dependencies — see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/).

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/MGT2_Calculator.git
cd MGT2_Calculator

# Install frontend dependencies
npm install
```

### Development

```bash
# Start the app in development mode (hot-reload enabled)
npm run tauri dev
```

This will:
1. Start the Vite dev server on `http://localhost:1420`
2. Compile the Rust backend
3. Launch the desktop window with DevTools available

### Frontend Only (no Tauri)

If you only want to work on the UI without building Rust:

```bash
# Start Vite dev server
npm run dev

# Open http://localhost:1420 in your browser
```

> Note: The "Always on Top" feature won't work in browser mode — it requires the Tauri backend.

---

## 📦 Building for Production

### Build an Executable (.exe / .msi / .dmg)

```bash
npm run tauri build
```

The build output will be located in:

```
src-tauri/target/release/bundle/
├── msi/           # Windows installer (.msi)
├── nsis/          # Windows installer (.exe via NSIS)
├── dmg/           # macOS disk image
├── deb/           # Linux .deb package
└── appimage/      # Linux AppImage
```

> **Windows**: You'll find your `.exe` installer in `src-tauri/target/release/bundle/nsis/` and the portable `.msi` in `src-tauri/target/release/bundle/msi/`.

### Build Frontend Only

```bash
npm run build
```

Output goes to `dist/`.

---

## 🏗️ Project Structure

```
MGT2_Calculator/
├── src/                          # Frontend (React + TypeScript)
│   ├── components/               # UI components
│   │   ├── Header.tsx            # App header with language switch & pin button
│   │   ├── GenreSelector.tsx     # Main genre + subgenre selection
│   │   ├── ThemeSelector.tsx     # Theme picker with compatibility
│   │   ├── SliderDisplay.tsx     # Slider bars, alignment, design focus
│   │   ├── CompatibilityIndicator.tsx  # Match quality badges
│   │   ├── HistoryPanel.tsx      # Recent combinations history
│   │   ├── ErrorBoundary.tsx     # Error boundary wrapper
│   │   └── index.ts             # Barrel exports
│   ├── data/
│   │   ├── genres.ts             # All 19 genres + ~200 combination overrides
│   │   └── themes.ts             # Theme list with genre compatibility maps
│   ├── i18n/
│   │   ├── index.ts              # i18next initialization
│   │   ├── translations.ts       # Translation loader
│   │   └── locales/              # Translation JSON files
│   │       ├── en.json
│   │       ├── ru.json
│   │       └── pl.json
│   ├── store/
│   │   ├── useCalculatorStore.ts # Genre/theme selection + computed sliders
│   │   └── useAppStore.ts        # Window state (always-on-top, init)
│   ├── App.tsx                   # Root component
│   ├── App.css                   # Global styles + Tailwind import
│   └── main.tsx                  # React entry point
├── src-tauri/                    # Backend (Rust + Tauri v2)
│   ├── src/
│   │   ├── main.rs               # Entry point
│   │   └── lib.rs                # Tauri commands (always-on-top, window controls)
│   ├── tauri.conf.json           # Tauri configuration
│   ├── Cargo.toml                # Rust dependencies
│   ├── icons/                    # App icons for all platforms
│   └── capabilities/             # Tauri v2 security capabilities
├── package.json                  # Frontend dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite + Tailwind v4 setup
└── README.md                     # You are here
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Desktop Framework** | Tauri | 2.x |
| **Frontend** | React | 19.x |
| **Language** | TypeScript | 5.8 |
| **Build Tool** | Vite | 7.x |
| **Styling** | Tailwind CSS | 4.x |
| **State Management** | Zustand | 5.x |
| **Internationalization** | i18next + react-i18next | 25.x / 16.x |
| **Backend** | Rust | 2021 edition |

---

## 🌍 Localization

The app supports 3 languages out of the box:

| Code | Language |
|------|----------|
| `en` | English |
| `ru` | Russian (Русский) |
| `pl` | Polish (Polski) |

Translation files are in `src/i18n/locales/`. To add a new language:

1. Create `src/i18n/locales/{code}.json` by copying `en.json`
2. Translate all values
3. Add the import and resource entry in `src/i18n/translations.ts`
4. Add genre translations in the `genreTranslations` export
5. Add the language option to the Header component's language switcher

---

## 📊 Data Source

All slider values, alignment settings, design focus percentages, genre compatibility data, and target audiences are sourced from:

> **[Perfect Game Sliders and Combinations \[Updated\]](https://steamcommunity.com/sharedfiles/filedetails/?id=2730524852)** — Steam Community Guide by **Chronosuniverse**

This guide contains the most comprehensive and accurate data extracted directly from Mad Games Tycoon 2's game files. Full credit to the guide author for their incredible work compiling this data.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Commit** your changes: `git commit -m "Add my feature"`
4. **Push** to the branch: `git push origin feature/my-feature`
5. **Open** a Pull Request

### Contribution Ideas

- 🌍 Add more languages
- 🎨 Improve UI/UX
- 📱 Better responsive design
- 🐛 Bug fixes
- 📖 Documentation improvements
- ⭐ New features (e.g., training slider recommendations, platform support data)

---

## 📜 License

This project is open source. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Chronosuniverse](https://steamcommunity.com/sharedfiles/filedetails/?id=2730524852) — for the comprehensive slider data guide
- [Mad Games Tycoon 2](https://store.steampowered.com/app/1342330/Mad_Games_Tycoon_2/) — by Eggcode
- [Tauri](https://tauri.app/) — for the awesome framework
- [Vite](https://vite.dev/) — for blazing fast builds

---

**Made with ❤️ for Mad Games Tycoon 2 players who want to make perfect games every time.**
