# SerenityEcho: Project Documentation

**A Privacy-Focused, Offline-First Ambient Sound Mixer**

## 1. Project Overview
**SerenityEcho** is a web-based ambient sound mixer designed to help users focus, relax, or sleep. It allows users to blend high-quality environmental sounds (rain, wind, fire, etc.) to create their perfect atmosphere.

**Core Philosophy:**
*   **Privacy First**: No tracking, no accounts needed.
*   **Offline Capable**: Works without an internet connection once loaded.
*   **Local Persistence**: All data (custom sounds, presets) is stored locally on the user's device using IndexedDB.
*   **Aesthetic First**: A premium, "glassmorphism" UI design that feels serene and responsive.

---

## 2. Tech Stack

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Framework** | **React 18** (TypeScript) | Robust component model, type safety, ecosystem. |
| **Build Tool** | **Vite** | Fast dev server, optimized production builds. |
| **Styling** | **Tailwind CSS** | Utility-first, rapid UI development, easy dark mode. |
| **Routing** | **React Router v6** | Client-side routing for SPA experience. |
| **Icons** | **Phosphor Icons** | Consistent, clean SVG line icons. |
| **Database** | **IndexedDB** | Storing large binary files (audio blobs) locally. |
| **Audio** | **Web Audio API** | Low-latency audio mixing, gaining, and looping. |
| **Smooth Scroll** | **Lenis** | Premium organic scroll feel. |
| **Deployment** | **Netlify** | Fast Global CDN edge delivery. |

---

## 3. Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── AtmosphereBackground/ # The dynamic aurora background
│   ├── FeedbackModal/   # Web3Forms integration
│   ├── MixerLayer/      # Individual sound control strip
│   ├── SupportPopup/    # "Buy Me a Coffee" popup
│   └── ...
├── data/
│   └── soundLibrary.ts  # Static definition of built-in sounds
├── hooks/
│   ├── useAudioEngine.ts # Core audio logic (Web Audio API)
│   └── useLocalPresets.ts # IndexedDB interface for presets
├── pages/
│   ├── Landing.tsx      # Home page
│   ├── Mixer.tsx        # The main app (drag-and-drop mixer)
│   ├── SoundLibrary.tsx # Grid view of all sounds
│   └── About.tsx        # Info page
├── services/
│   └── audioStorage.ts  # Low-level IndexedDB wrapper
└── types/
    └── ...              # TypeScript interfaces
```

---

## 4. Key Systems & Features

### 4.1 Audio Engine (`useAudioEngine.ts`)
The heart of the application. It creates an `AudioContext` and manages a graph of `AudioBufferSourceNodes` connected to `GainNodes`.
*   **Nodes**: Each layer has its own Source and Gain node.
*   **Master Volume**: A master Gain node controls the final output.
*   **Buffers**: Audio files are fetched, decoded into `AudioBuffer`s, and cached in memory.
*   **Context Management**: Handles `suspend`/`resume` states for browser autoplay policies.

### 4.2 Data Persistence (`audioStorage.ts` & IndexedDB)
We do not use a backend database. Everything lives in the browser's **IndexedDB**.
*   **Schema**:
    *   `sounds`: Stores custom uploaded audio files (Blobs).
    *   `presets`: Stores JSON objects defining a mix (layer IDs, volumes, etc.).
*   **Why IndexedDB?**: `localStorage` has a ~5MB limit, too small for audio. IndexedDB handles hundreds of MBs.

### 4.3 The "Zen Start" Logic
To minimize "Empty State" anxiety for new users:
1.  **Check**: On load, `Mixer.tsx` asks IndexedDB: "Does this user have any saved presets?"
2.  **Action**: 
    *   **If Yes**: Do nothing (preserve user history).
    *   **If No**: Automatically load the **Zen Preset** (Rain + Stream + Wind + Bells + Crickets).

### 4.4 Feedback System
Integrated directly into the UI without page redirects.
*   **Provider**: **Web3Forms**.
*   **Flow**: User clicks "Feedback" -> Modal opens -> Form Submit (POST) -> API sends email to `naveenakalanka70@gmail.com`.

---

## 5. Development Guide

### Prerequisites
*   Node.js v16+
*   npm or yarn

### Setup
1.  **Clone**: `git clone https://github.com/NaveenAkalanka/SerenityEcho.git`
2.  **Install**: `npm install`
3.  **Run**: `npm run dev` (Opens http://localhost:5173)

### Building for Production
```bash
npm run build
# Output is generated in /dist folder
```

### Deployment (Netlify)
The project is configured for Netlify.
*   **Build Command**: `npm run build`
*   **Publish Directory**: `dist`
*   **SPA Redirects**: A `public/_redirects` file (`/* /index.html 200`) ensures React Router works on refresh.

---

## 6. Contribution Workflow
1.  **Branch**: Create a feature branch (`git checkout -b feature/NewSound`).
2.  **Code**: Follow the "Glassmorphism" design capability.
3.  **Test**: Ensure `npm run build` passes (TypeScript strict mode is active).
4.  **PR**: Submit a Pull Request.

---

## 7. License & Credits
*   **License**: MIT License.
*   **Sounds**: Sourced from high-quality royalty-free libraries (see `soundLibrary.ts`).
*   **Author**: Naveen Akalanka.

---
*Generated: December 15, 2025*
