/* =================================================
   PROJECT DATA
   All portfolio project content (single source of truth)
   Consumed by the modal module
================================================= */
const projectData = {
  ai: {
    title: 'AGI Core — Neural Reasoning Engine',
    icon: 'AI',
    desc: 'A research-driven project exploring next-generation reasoning systems that combine energy-efficient neural pathways, self-improving agent loops, and symbolic-neural hybrid architectures. Built to investigate how AGI-style systems can be designed with transparency, modularity, and ethical guardrails at the core.',
    tags: ['Python', 'PyTorch', 'CUDA', 'JAX', 'Transformers'],
    highlights: [
      '🧠 Custom reasoning module with chain-of-thought + memory replay',
      '⚡ Energy-aware inference routing for low-power edge deployment',
      '🔁 Self-improvement loop with human-in-the-loop feedback',
      '🛡 Built-in alignment checks and interpretability tooling',
      '📊 Real-time monitoring dashboard for agent behavior'
    ]
  },
  os: {
    title: 'NEXUS OS — Vision Pro Inspired UI',
    icon: 'OS',
    desc: 'A futuristic operating system concept that reimagines how humans interact with computers. Featuring glassmorphic windows, neural shortcuts, holographic panels, spatial gestures, and a context-aware AI assistant that lives across every application.',
    tags: ['C++', 'Rust', 'Assembly', 'Wayland', 'ML'],
    highlights: [
      '🪟 Holographic, depth-aware window system',
      '✋ Gesture & gaze control layer',
      '🤖 System-wide AI copilot with on-device inference',
      '⚡ Sub-100ms UI response with custom compositor',
      '🔐 Hardware-isolated security enclaves'
    ]
  },
  game: {
    title: 'AETHER — Immersive 3D Game Engine',
    icon: '3D',
    desc: 'A browser-native 3D game engine pushing the limits of WebGL. Real-time ray tracing, AI-driven NPCs with emergent behavior, dynamic global illumination, and procedural world generation — all running at 60fps in a modern browser.',
    tags: ['Three.js', 'WebGL', 'GLSL', 'WebGPU', 'WASM'],
    highlights: [
      '✨ Real-time ray-traced reflections & soft shadows',
      '🤖 NPCs with neural-network-driven decision making',
      '🌍 Procedural world generation with biome system',
      '🎮 Physics with custom broadphase solver',
      '🎨 Post-processing pipeline: bloom, DOF, motion blur'
    ]
  },
  vision: {
    title: 'ARGUS — Vision Intelligence System',
    icon: 'CV',
    desc: 'A real-time computer vision pipeline optimized for edge devices. Performs object detection, multi-object tracking, depth estimation, and semantic scene understanding — all while running smoothly on low-power hardware.',
    tags: ['Python', 'OpenCV', 'TensorFlow Lite', 'ONNX', 'CUDA'],
    highlights: [
      '👁 60fps multi-object detection on edge devices',
      '📐 Depth estimation with monocular input',
      '🎯 Tracking with Kalman + Hungarian algorithm',
      '🧠 Scene understanding via segmentation models',
      '📡 Real-time streaming over WebRTC'
    ]
  },
  sec: {
    title: 'CIPHER — Ethical Hacking Toolkit',
    icon: '🛡',
    desc: 'A modular security framework designed for penetration testers, red teams, and security researchers. Includes automated recon, vulnerability scanning, exploit chaining, and detailed reporting — built with ethics and education at its core.',
    tags: ['Python', 'Bash', 'Networking', 'Scapy', 'Nmap'],
    highlights: [
      '🔍 Automated reconnaissance & OSINT',
      '🛠 Modular exploit framework with safety checks',
      '🌐 Network auditing with custom packet crafting',
      '📊 Beautiful HTML reports with remediation steps',
      '⚖️ Built-in scope enforcement & audit logging'
    ]
  },
  ux: {
    title: 'HOLOGRAM — Futuristic UI Kit',
    icon: 'UX',
    desc: 'A complete design system and component library inspired by Apple Vision Pro, Nothing OS, and the most iconic sci-fi interfaces. Glass surfaces, animated gradients, neon glows, and motion choreography that makes every interaction feel premium.',
    tags: ['Figma', 'Motion', 'React', 'Tokens', 'Storybook'],
    highlights: [
      '🪟 200+ glass, neon, and holographic components',
      '🎬 Motion library with 50+ signature animations',
      '🎨 Adaptive theming: dark, cyberpunk, light',
      '⚛️ Production-ready React + TypeScript code',
      '📚 Full Storybook documentation'
    ]
  }
};

// Expose to global scope (no module bundler)
window.projectData = projectData;
