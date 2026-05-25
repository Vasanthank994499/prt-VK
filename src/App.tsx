import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Shuffle, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ExternalLink, 
  Mail, 
  Sliders, 
  Volume2, 
  Video, 
  X, 
  Info, 
  FileVideo, 
  Flame,
  Lock,
  Unlock,
  Key,
  Layers,
  Palette,
  Sparkles
} from 'lucide-react';

// Custom interface for Work items
interface WorkItem {
  id: string;
  title: string;
  category: string;
  type: 'vertical' | 'landscape' | 'normal';
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  softwareUsed?: string[];
  description?: string;
}

// Initial state values matching Vasanthan K's portfolio
const INITIAL_WORKS: WorkItem[] = [
  {
    id: 'cinematic-reel-2024',
    title: 'CINEMATIC SHOWREEL 2024',
    category: 'Commercial Production',
    type: 'landscape',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-foggy-pine-forest-42415-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    duration: '1:45',
    softwareUsed: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    description: 'High-contrast commercial showreel showing high-speed transitions, sound design integration, and custom color grading.'
  },
  {
    id: 'social-reel-01',
    title: 'STREETWEAR SOCIAL HOOK',
    category: 'Social Motion Design',
    type: 'vertical',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-man-doing-tricks-on-a-skateboard-40618-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
    duration: '0:15',
    softwareUsed: ['After Effects', 'CapCut'],
    description: 'Fast-paced Instagram Reel designed for maximal viewer retention. Built with aggressive typography cuts and frame stutter effects.'
  },
  {
    id: 'vfx-composite',
    title: 'CYBERPUNK NEON INTEGRATION',
    category: 'Advanced Visual Effects',
    type: 'normal',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-driving-in-a-futuristic-neon-lit-tunnel-42733-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
    duration: '0:45',
    softwareUsed: ['After Effects', 'Photoshop'],
    description: 'Multi-layer matte composite including tracking points, neon volumetric lights, and custom clean plate design.'
  },
  {
    id: 'dynamic-promo',
    title: 'KINETIC BRAND TEASER',
    category: 'Creative Graphic Design',
    type: 'normal',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-neon-lines-background-27756-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    duration: '0:30',
    softwareUsed: ['DaVinci Resolve', 'Canva'],
    description: 'Corporate advertising promo combining bold graphic layout designs with liquid logo reveal actions.'
  },
  {
    id: 'sound-re-grade-promo',
    title: 'ADVENTURE COLOR GRADE & FOLEY',
    category: 'Professional Color Grading',
    type: 'landscape',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-a-rocky-coast-42022-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    duration: '1:10',
    softwareUsed: ['DaVinci Resolve', 'Premiere Pro'],
    description: 'Outdoor documentary footage with a signature teal and warm glow pass, matching atmospheric raw foley tracks.'
  },
  {
    id: 'tiktok-hype-reel',
    title: 'GYM MOTIVATION FAST REEL',
    category: 'Studio Motion',
    type: 'vertical',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athletic-man-lifting-a-barbell-40114-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
    duration: '0:22',
    softwareUsed: ['Premiere Pro', 'CapCut'],
    description: 'Fast-paced vertical edit featuring frame-perfect beat synchronization, subtle camera shake, and flash screen overlays.'
  }
];

// Software items with custom branding colors, proficiency levels, and actual expert shortcuts
interface SoftwareItem {
  id: string;
  name: string;
  brandColor: string;
  proficiency: number;
  shortcut: string;
  description: string;
}

const SOFTWARE_LIST: SoftwareItem[] = [
  {
    id: 'pr',
    name: 'Premiere Pro',
    brandColor: 'text-[#00c4ff] bg-[#001c3d]',
    proficiency: 95,
    shortcut: 'Cmd + K (Cut Tool)',
    description: 'Primary timeline tool. Advanced multi-cam synch, dynamic pacing, keyframe-speed-ramping.'
  },
  {
    id: 'ae',
    name: 'After Effects',
    brandColor: 'text-[#ff5cff] bg-[#22003d]',
    proficiency: 92,
    shortcut: 'F9 (Easy Ease Keyframe)',
    description: 'Kinetic typography, motion graphics transitions, visual effects masking, composition tracking.'
  },
  {
    id: 'dr',
    name: 'DaVinci Resolve',
    brandColor: 'text-[#fbc531] bg-[#332a0c]',
    proficiency: 88,
    shortcut: 'Option + S (Serial Node)',
    description: 'Color-science grading, node trees, LUT balancing, professional color isolation, digital foley layout.'
  },
  {
    id: 'cc',
    name: 'CapCut',
    brandColor: 'text-white bg-[#101015]',
    proficiency: 90,
    shortcut: 'B (Quick Split Tool)',
    description: 'Rapid social-media drafting, auto-captions, vertical filters, and sound trending presets.'
  },
  {
    id: 'ps',
    name: 'Photoshop',
    brandColor: 'text-[#00c4ff] bg-[#001c3d]',
    proficiency: 90,
    shortcut: 'Cmd + J (Duplicate Layer)',
    description: 'High-end asset manipulation, thumbnail color composition, lighting layout overlays.'
  },
  {
    id: 'cv',
    name: 'Canva',
    brandColor: 'text-white bg-[#007c80]',
    proficiency: 85,
    shortcut: 'T (Quick Add Text)',
    description: 'Fast social-media templates, typographic frames, rapid corporate layout visual drafting.'
  }
];

// Skills matching the original list precisely
interface SkillItem {
  name: string;
  percentage: number;
  subSkills: string;
}

const SKILL_ITEMS: SkillItem[] = [
  { name: 'Studio Motion', percentage: 95, subSkills: 'Storytelling, Multi-cam sync, Audiovisual coherence' },
  { name: 'High-End Motion Graphics', percentage: 92, subSkills: 'Kinetic typography, Custom logo animations, Seamless transitions' },
  { name: 'Professional Color Grading', percentage: 88, subSkills: 'RGB Curves, LUT calibration, Cinematic Teal & Orange balance' },
  { name: 'Immersive Sound Design', percentage: 85, subSkills: 'Foley layering, Sub drops, Ambient leveling & Noise reduction' },
  { name: 'Advanced Visual Effects', percentage: 86, subSkills: 'Chroma Keying, Camera Tracking, Screen Replacement & Rotoscoping' },
  { name: 'Creative Graphic Design', percentage: 90, subSkills: 'High-contrast typography layouts, Digital flyers, Branding assets' }
];

// Categorized structure for Software Deck with corresponding Lucide icons
const SOFTWARE_CATEGORIES = [
  {
    name: 'NLE & TIMELINE EDITING',
    iconName: 'video',
    itemNames: ['Premiere Pro', 'CapCut']
  },
  {
    name: 'MOTION & COLOR SCIENCE',
    iconName: 'flame',
    itemNames: ['After Effects', 'DaVinci Resolve']
  },
  {
    name: 'DESIGN & CREATIVE LAYOUT',
    iconName: 'palette',
    itemNames: ['Photoshop', 'Canva']
  }
];

// Categorized structure for Expert Services Skills with corresponding Lucide icons
const SKILL_CATEGORIES = [
  {
    name: 'MOTION & TIMELINE DECK',
    iconName: 'layers',
    itemNames: ['Studio Motion', 'High-End Motion Graphics']
  },
  {
    name: 'COLOR & VFX CORE',
    iconName: 'sliders',
    itemNames: ['Professional Color Grading', 'Advanced Visual Effects']
  },
  {
    name: 'AUDIO & GRAPHIC DESIGN',
    iconName: 'volume',
    itemNames: ['Immersive Sound Design', 'Creative Graphic Design']
  }
];

// Helper to render beautiful colored icons for each category header
const renderCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'video':
      return <Video className="w-3.5 h-3.5 text-[#00ff00]" />;
    case 'flame':
      return <Flame className="w-3.5 h-3.5 text-[#00ff00]" />;
    case 'palette':
      return <Palette className="w-3.5 h-3.5 text-[#00ff00]" />;
    case 'layers':
      return <Layers className="w-3.5 h-3.5 text-[#00ff00]" />;
    case 'sliders':
      return <Sliders className="w-3.5 h-3.5 text-[#00ff00]" />;
    case 'volume':
      return <Volume2 className="w-3.5 h-3.5 text-[#00ff00]" />;
    default:
      return null;
  }
};

// Custom default profile path matching Vasanthan K
const DEFAULT_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%"><defs><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%2300ff00" stop-opacity="0.15"/><stop offset="100%" stop-color="%23000000" stop-opacity="0"/></radialGradient></defs><rect width="120" height="120" fill="%23030303"/><circle cx="60" cy="60" r="50" fill="url(%23glow)"/><circle cx="60" cy="60" r="45" fill="none" stroke="%23111" stroke-width="1"/><circle cx="60" cy="60" r="45" fill="none" stroke="%2300ff00" stroke-width="1.5" stroke-dasharray="20 10 5 10"/><path d="M35 110 C 35 90, 45 80, 60 80 C 75 80, 85 90, 85 110 Z" fill="%23ffffff" stroke="%23e0e0e0" stroke-width="1"/><path d="M50 80 L 60 93 L 70 80" fill="none" stroke="%23ccc" stroke-width="1.5"/><path d="M60 93 L 60 110" fill="none" stroke="%23ccc" stroke-width="1" stroke-dasharray="2 2"/><path d="M53 70 L 53 82 C 53 82, 60 85, 67 82 L 67 70 Z" fill="%23d4a373"/><path d="M48 48 C 48 38, 72 38, 72 48 C 72 58, 68 68, 60 68 C 52 68, 48 58, 48 48 Z" fill="%23e9c46a"/><circle cx="48" cy="50" r="4" fill="%23e9c46a"/><path d="M47 43 C 47 33, 73 31, 73 41 C 70 38, 55 35, 47 43 Z" fill="%23111111"/><path d="M48 44 C 45 46, 45 35, 60 32 C 75 29, 73 38, 73 42 C 73 42, 64 36, 48 44 Z" fill="%231c1c1c"/><path d="M48 50 C 48 62, 53 72, 60 72 C 67 72, 72 62, 72 50 C 72 54, 70 66, 60 67 C 50 66, 48 54, 48 50 Z" fill="%231c1c1c"/><path d="M51 58 C 55 60, 65 60, 69 58 C 71 63, 67 71, 60 71 C 53 71, 49 63, 51 58 Z" fill="%23111111"/><path d="M54 55 Q 60 58 66 55" fill="none" stroke="%23111111" stroke-width="2.5"/><path d="M58 45 Q 61 44 64 45" fill="none" stroke="%23111111" stroke-width="1.5"/><circle cx="61" cy="48" r="1.5" fill="%23111111"/><path d="M15 35 L 15 20 L 30 20" fill="none" stroke="%2300ff00" stroke-width="1" stroke-opacity="0.6"/><path d="M105 35 L 105 20 L 90 20" fill="none" stroke="%2300ff00" stroke-width="1" stroke-opacity="0.6"/><path d="M15 85 L 15 100 L 30 100" fill="none" stroke="%2300ff00" stroke-width="1" stroke-opacity="0.6"/><path d="M105 85 L 105 100 L 90 100" fill="none" stroke="%2300ff00" stroke-width="1" stroke-opacity="0.6"/></svg>`;

export default function App() {
  const [works, setWorks] = useState<WorkItem[]>(INITIAL_WORKS);
  const [activeTab, setActiveTab] = useState<'all' | 'landscape' | 'vertical' | 'normal'>('all');
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'works' | 'skill' | 'about'>('dashboard');
  
  // Custom video upload states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Social Motion Design');
  const [newType, setNewType] = useState<'vertical' | 'landscape' | 'normal'>('normal');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newDescription, setNewDescription] = useState('');
  
  // Persistent avatar upload in localStorage
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('vasanthan_profile_img') || DEFAULT_AVATAR_SVG;
  });

  // Admin lock states for owner-only uploader
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_v2') === 'true';
  });
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Auto-login via URL Query parameters (e.g. ?admin=true or ?admin=vk)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminVal = params.get('admin');
    if (adminVal === 'true' || adminVal === 'vk' || adminVal === 'vasanthan') {
      setIsAdmin(true);
      localStorage.setItem('is_admin_v2', 'true');
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passcodeInput.trim().toLowerCase();
    if (cleanInput === 'vasanthan2026' || cleanInput === 'vk2026' || cleanInput === '777') {
      setIsAdmin(true);
      localStorage.setItem('is_admin_v2', 'true');
      setIsAdminAuthOpen(false);
      setPasscodeInput('');
      setAuthError('');
    } else {
      setAuthError('INVALID SECURITY CODE');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('is_admin_v2');
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('vasanthan_profile_img', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Studio Monitor Lightbox state
  const [activeLightboxProject, setActiveLightboxProject] = useState<WorkItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedLUT, setSelectedLUT] = useState<'none' | 'teal_orange' | 'cyber' | 'noir' | 'vintage'>('none');
  
  // System states
  const [currentTime, setCurrentTime] = useState<string>('');
  const [shuffleTriggered, setShuffleTriggered] = useState(false);
  const [hoveredSoftware, setHoveredSoftware] = useState<SoftwareItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Update clock every single second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false,
        timeZoneName: 'short'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simple scroll monitor to update the active navbar tab in real-time
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 250;
      
      const workEl = document.getElementById('work-section-root');
      const skillsEl = document.getElementById('skills-section-root');
      const aboutEl = document.getElementById('about-section-root');
      
      if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveNav('about');
      } else if (skillsEl && scrollPos >= skillsEl.offsetTop) {
        setActiveNav('skill');
      } else if (workEl && scrollPos >= workEl.offsetTop) {
        setActiveNav('works');
      } else {
        setActiveNav('dashboard');
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Navigation Click Handler with smooth scroll calculations
  const handleNavClick = (section: 'dashboard' | 'works' | 'skill' | 'about', e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setActiveNav(section);
    setIsMobileMenuOpen(false);

    if (section === 'dashboard') {
      setSelectedSoftware(null);
      setSelectedSkill(null);
      setActiveTab('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const elementId = section === 'works' 
        ? 'work-section-root' 
        : section === 'skill'
          ? 'skills-section-root'
          : 'about-section-root';
          
      const element = document.getElementById(elementId);
      if (element) {
        const offset = 80; // height offset for sticky header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  // Simple visualizer canvas loop when lightbox is playing
  useEffect(() => {
    if (!activeLightboxProject || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frequencies = Array.from({ length: 32 }, () => Math.random() * 20);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / frequencies.length;

      frequencies = frequencies.map((f) => {
        if (isPlaying) {
          const target = Math.random() * (canvas.height - 8);
          return f + (target - f) * 0.25;
        } else {
          return f * 0.85;
        }
      });

      frequencies.forEach((f, idx) => {
        const x = idx * barWidth;
        const height = Math.max(2, f);
        
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - height);
        gradient.addColorStop(0, 'rgba(0, 255, 0, 0.1)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.8)');
        gradient.addColorStop(1, '#00ff00');

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, canvas.height - height, barWidth - 2, height);
      });

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [activeLightboxProject, isPlaying]);

  // Adjust playback rate when altered
  useEffect(() => {
    if (lightboxVideoRef.current) {
      lightboxVideoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, activeLightboxProject]);

  // Sorter / Filter Logic Helper
  const getFilteredWorks = () => {
    let list = [...works];
    
    // Sort by Navigation Aspect Tab
    if (activeTab !== 'all') {
      list = list.filter(w => w.type === activeTab);
    }

    // Filter by Active clicked Software tag
    if (selectedSoftware) {
      list = list.filter(w => w.softwareUsed?.includes(selectedSoftware));
    }

    // Filter by Active clicked Skill Category
    if (selectedSkill) {
      const skillNameMap: { [key: string]: string } = {
        'Studio Motion': 'Studio Motion',
        'High-End Motion Graphics': 'Social Motion Design',
        'Professional Color Grading': 'Professional Color Grading',
        'Immersive Sound Design': 'Immersive Sound Design',
        'Advanced Visual Effects': 'Advanced Visual Effects',
        'Creative Graphic Design': 'Creative Graphic Design'
      };
      const filterCategory = skillNameMap[selectedSkill];
      if (filterCategory) {
        list = list.filter(w => w.category === filterCategory || w.title.toLowerCase().includes(selectedSkill.toLowerCase().replace('expert ', '').replace('high-end ', '')));
      }
    }

    return list;
  };

  const filteredItems = getFilteredWorks();

  // Shuffle Function with visual stagger triggers
  const executeShuffle = () => {
    setShuffleTriggered(true);
    setTimeout(() => {
      setWorks((prev) => {
        const shuffled = [...prev];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      });
      setShuffleTriggered(false);
    }, 300);
  };

  // Reset to initial list
  const handleResetWorks = () => {
    setWorks(INITIAL_WORKS);
    setActiveTab('all');
    setSelectedSoftware(null);
    setSelectedSkill(null);
    setActiveNav('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop and read file URLs
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setNewVideoFile(file);
      setNewTitle(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
      
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('reel') || lowerName.includes('short') || lowerName.includes('tiktok') || lowerName.includes('story')) {
        setNewType('vertical');
        setNewCategory('Social Motion Design');
      } else if (lowerName.includes('cinematic') || lowerName.includes('wide') || lowerName.includes('landscape') || lowerName.includes('showreel')) {
        setNewType('landscape');
        setNewCategory('Commercial Production');
      } else {
        setNewType('normal');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewVideoFile(file);
      setNewTitle(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
    }
  };

  // Create & Insert New Work Item
  const handleCreateWorkItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let finalVideoUrl = '';
    const finalThumbnailUrl = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80'; 

    if (newVideoFile) {
      finalVideoUrl = URL.createObjectURL(newVideoFile);
    } else if (newVideoUrl.trim()) {
      finalVideoUrl = newVideoUrl.trim();
    } else {
      finalVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-recording-studio-with-microphone-and-monitors-43048-large.mp4';
    }

    let suggestedSoftware = ['Premiere Pro'];
    if (newCategory === 'Social Motion Design' || newCategory === 'Advanced Visual Effects') {
      suggestedSoftware = ['After Effects', 'Premiere Pro'];
    } else if (newCategory === 'Professional Color Grading') {
      suggestedSoftware = ['DaVinci Resolve'];
    }

    const customNewItem: WorkItem = {
      id: `custom-work-${Date.now()}`,
      title: newTitle.toUpperCase(),
      category: newCategory,
      type: newType,
      videoUrl: finalVideoUrl,
      thumbnailUrl: finalThumbnailUrl,
      duration: '0:30',
      softwareUsed: suggestedSoftware,
      description: newDescription.trim() || `Custom media uploaded via Vasanthan Portfolio Workspace.`
    };

    setWorks((prev) => [customNewItem, ...prev]);
    
    setNewTitle('');
    setNewCategory('Social Motion Design');
    setNewType('normal');
    setNewVideoUrl('');
    setNewVideoFile(null);
    setNewDescription('');
    setIsUploadOpen(false);
  };

  const handleDeleteWorkItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setWorks((prev) => prev.filter(w => w.id !== id));
    if (activeLightboxProject?.id === id) {
      setActiveLightboxProject(null);
    }
  };

  const getFilterStyle = () => {
    switch (selectedLUT) {
      case 'teal_orange':
        return 'contrast(1.15) saturate(1.4) hue-rotate(-10deg) brightness(0.95) sepia(0.1)';
      case 'cyber':
        return 'contrast(1.3) saturate(1.8) hue-rotate(130deg) brightness(1.1)';
      case 'noir':
        return 'grayscale(1) contrast(1.4) brightness(0.85)';
      case 'vintage':
        return 'sepia(0.55) contrast(0.9) brightness(1.05) saturate(0.85)';
      default:
        return 'none';
    }
  };

  // High-fidelity custom SVG logos for Premiere Pro, After Effects, DaVinci, CapCut, Photoshop, and Canva
  const getSoftwareLogo = (name: string) => {
    switch (name) {
      case 'Premiere Pro':
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="#000000" stroke="#00ff00" strokeWidth="1.5"/>
            <text x="6" y="21" fill="#00ff00" fontFamily="'Inter', system-ui, sans-serif" fontWeight="900" fontSize="13" letterSpacing="-0.5">PR</text>
          </svg>
        );
      case 'After Effects':
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="#000000" stroke="#00ff00" strokeWidth="1.5"/>
            <text x="6" y="21" fill="#00ff00" fontFamily="'Inter', system-ui, sans-serif" fontWeight="900" fontSize="13" letterSpacing="-0.5">AE</text>
          </svg>
        );
      case 'DaVinci Resolve':
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#000000" stroke="#333" strokeWidth="1.5"/>
            <circle cx="16" cy="11" r="5" fill="#FF4E4E" opacity="0.9"/>
            <circle cx="12" cy="18.5" r="5" fill="#3BFF4B" opacity="0.9"/>
            <circle cx="20" cy="18.5" r="5" fill="#3399FF" opacity="0.9"/>
          </svg>
        );
      case 'CapCut':
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="4" fill="#0D0D15" />
            <path d="M6 6H18V9L12 14L6 9V6Z" fill="#FFF"/>
            <path d="M6 18H18V15L12 10L6 15V18Z" fill="#00FF00"/>
          </svg>
        );
      case 'Photoshop':
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="#000000" stroke="#00ff00" strokeWidth="1.5"/>
            <text x="6" y="21" fill="#00ff00" fontFamily="'Inter', system-ui, sans-serif" fontWeight="900" fontSize="13" letterSpacing="-0.5">PS</text>
          </svg>
        );
      case 'Canva':
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#000000" stroke="#00ff00" strokeWidth="1.5"/>
            <text x="7" y="20.5" fill="#00ff00" fontFamily="'Inter', system-ui, sans-serif" fontWeight="900" fontSize="12" letterSpacing="-0.5">CV</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div id="portfolio-app-root" className="relative min-h-screen bg-black text-white font-sans antialiased selection:bg-[#00ff00] selection:text-black flex flex-col justify-between overflow-x-hidden">
      
      {/* GLOBAL GRAPHIC BACKGROUND WORK - GRID, LASER ACCENTS, MATRIX CORNERS, LIGHT NODE BLURS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Tech Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00ff00 1px, transparent 1px),
              linear-gradient(to bottom, #00ff00 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Tech Secondary Sub-Grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00ff00 1px, transparent 1px),
              linear-gradient(to bottom, #00ff00 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px'
          }}
        />

        {/* Diagonal Tech Scanlines overlay */}
        <div 
          className="absolute inset-0 opacity-[0.0125]"
          style={{
            backgroundImage: 'linear-gradient(0deg, #00ff00 25%, transparent 25%, transparent 50%, #00ff00 50%, #00ff00 75%, transparent 75%, transparent)',
            backgroundSize: '100% 4px'
          }}
        />

        {/* Ambient Neon Blobs */}
        <div className="absolute top-1/4 left-[10%] w-[500px] h-[500px] bg-[#00ff00]/[0.025] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-2/3 right-[10%] w-[600px] h-[600px] bg-emerald-500/[0.015] rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-[#00ff00]/[0.02] rounded-full blur-[130px]" />

        {/* Abstract sci-fi Tech Crosses/Corners scatters */}
        {/* Top-left corner deck */}
        <div className="absolute top-24 left-12 w-10 h-10 border-l border-t border-[#00ff00]/15" />
        <div className="absolute top-24 left-12 w-2 h-2 bg-[#00ff00]/25 rounded-full" />
        <span className="absolute top-[102px] left-[60px] font-mono text-[7px] text-[#00ff00]/20 tracking-widest font-bold">GRID_SYS_A1</span>
        
        {/* Top-right corner deck */}
        <div className="absolute top-24 right-12 w-10 h-10 border-r border-t border-[#00ff00]/15" />
        <div className="absolute top-24 right-12 w-2 h-2 bg-[#00ff00]/25 rounded-full" />
        
        {/* Mid vertical dot lines on the far margins */}
        <div className="absolute top-1/3 left-6 bottom-1/3 border-l border-dashed border-[#00ff00]/10 flex flex-col justify-between py-10">
          <span className="font-mono text-[7px] text-zinc-700 -rotate-90 origin-left tracking-widest">FPS:60.0000</span>
          <span className="font-mono text-[7px] text-zinc-700 -rotate-90 origin-left tracking-widest">ALIGN_PASS</span>
          <span className="font-mono text-[7px] text-[#00ff00]/25 -rotate-90 origin-left tracking-widest uppercase">system:active</span>
        </div>

        <div className="absolute top-1/3 right-6 bottom-1/3 border-r border-dashed border-[#00ff00]/10 flex flex-col justify-between py-10 text-right">
          <span className="font-mono text-[7px] text-zinc-700 rotate-90 origin-right tracking-widest">LATITUDE.13</span>
          <span className="font-mono text-[7px] text-zinc-700 rotate-90 origin-right tracking-widest">LONGITUDE.80</span>
          <span className="font-mono text-[7px] text-[#00ff00]/25 rotate-90 origin-right tracking-widest uppercase">MONITOR_ON</span>
        </div>

        {/* Scatter Tech Crosses around */}
        <div className="absolute top-[15%] left-[25%] text-zinc-800 font-mono text-xs select-none opacity-40">+</div>
        <div className="absolute top-[45%] left-[75%] text-zinc-850 font-mono text-lg select-none opacity-40">+</div>
        <div className="absolute top-[80%] left-[15%] text-zinc-800 font-mono text-xs select-none opacity-40">+</div>
        <div className="absolute top-[65%] left-[88%] text-zinc-800 font-mono text-xs select-none opacity-40">+</div>
        <div className="absolute top-[30%] left-[65%] text-zinc-850 font-mono text-sm select-none opacity-30">+</div>

        {/* Small tech target Reticle in background */}
        <div className="absolute top-[40%] left-[8%] w-16 h-16 border border-[#00ff00]/10 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border border-dashed border-[#00ff00]/5 rounded-full" />
          <div className="absolute w-4 h-[1px] bg-[#00ff00]/30" />
          <div className="absolute h-4 w-[1px] bg-[#00ff00]/30" />
        </div>

        <div className="absolute top-[75%] right-[10%] w-20 h-20 border border-dashed border-[#00ff00]/10 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 border border-[#00ff00]/5 rounded-full" />
          <div className="absolute w-6 h-[1px] bg-[#00ff00]/20" />
          <div className="absolute h-6 w-[1px] bg-[#00ff00]/20" />
        </div>

        {/* Cybernetic code columns sidebar decorations */}
        <div className="absolute top-[20%] left-[94%] text-[6px] text-zinc-800 font-mono leading-relaxed hidden xl:block select-none truncate w-24">
          01001001 01001110 01010100 01000101 01010010 01001110 01000001 01010100 01001001 01001111 01001110 01000001 01001100 00100000 01010111 01001111 01010010 01001011 01010015 01010000 01000001 01010011 01000101
        </div>
        <div className="absolute top-[50%] left-[1%] text-[6px] text-zinc-800 font-mono leading-relaxed hidden xl:block select-none truncate w-24">
          VASANTHAN // CREATIVE // MOTION // SUITE // EXPERT // MULTIMEDIA // CODE // LAYOUTS
        </div>
      </div>

      {/* HEADER SECTION - PERFECT SINGLE CHIP NAVIGATION SEPARATED BY STRAIGHT PERPENDICULAR LINES */}
      <header id="portfolio-header" className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-black/85 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => handleNavClick('dashboard', e)} 
            className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] px-3.5 py-1.5 rounded-full text-[10px] text-gray-400 hover:text-[#00ff00] hover:border-[#00ff00]/55 transition-all font-mono outline-none cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
            <span>TECH FRAME</span>
            <span className="text-zinc-800">|</span>
            <span>ACTIVE</span>
          </button>
        </div>

        {/* Navigation - Elegant, straight perpendicular line separators, no double slash, custom active routing */}
        <nav className="hidden md:flex items-center gap-4">
          <button 
            onClick={(e) => handleNavClick('dashboard', e)}
            className={`text-xs font-mono tracking-widest uppercase transition-colors outline-none cursor-pointer ${activeNav === 'dashboard' ? 'text-[#00ff00] font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            DASHBOARD
          </button>
          
          <span className="text-zinc-800 font-light">|</span>
          
          <button 
            onClick={(e) => handleNavClick('works', e)}
            className={`text-xs font-mono tracking-widest uppercase transition-colors outline-none cursor-pointer ${activeNav === 'works' ? 'text-[#00ff00] font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            WORKS
          </button>
          
          <span className="text-zinc-800 font-light">|</span>
          
          <button 
            onClick={(e) => handleNavClick('skill', e)}
            className={`text-xs font-mono tracking-widest uppercase transition-colors outline-none cursor-pointer ${activeNav === 'skill' ? 'text-[#00ff00] font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            SKILLS
          </button>
          
          <span className="text-zinc-800 font-light">|</span>

          <button 
            onClick={(e) => handleNavClick('about', e)}
            className={`text-xs font-mono tracking-widest uppercase transition-colors outline-none cursor-pointer ${activeNav === 'about' ? 'text-[#00ff00] font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            ABOUT
          </button>
          
          <span className="text-zinc-800 font-light">|</span>
          
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=vasanthankasvk@gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 border border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all duration-300 rounded text-xs font-mono flex items-center gap-1.5 animate-pulse"
          >
            Hire Me
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-[#00ff00] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Sliders size={20} />}
        </button>
      </header>

      {/* MOBILE NAV PANEL */}
      {isMobileMenuOpen && (
        <div id="mobile-nav" className="md:hidden border-b border-[#1a1a1a] bg-[#050505] p-6 flex flex-col gap-4 animate-fade-in z-30">
          <div className="flex flex-col gap-3">
            <button 
              onClick={(e) => handleNavClick('dashboard', e)}
              className={`text-left text-xs font-mono py-2 border-b border-[#111] uppercase tracking-wider transition-colors cursor-pointer ${
                activeNav === 'dashboard' ? 'text-[#00ff00] font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              DASHBOARD
            </button>
            <button 
              onClick={(e) => handleNavClick('works', e)}
              className={`text-left text-xs font-mono py-2 border-b border-[#111] uppercase tracking-wider transition-colors cursor-pointer ${
                activeNav === 'works' ? 'text-[#00ff00] font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              WORKS
            </button>
            <button 
              onClick={(e) => handleNavClick('skill', e)}
              className={`text-left text-xs font-mono py-2 border-b border-[#111] uppercase tracking-wider transition-colors cursor-pointer ${
                activeNav === 'skill' ? 'text-[#00ff00] font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              SKILLS
            </button>
            <button 
              onClick={(e) => handleNavClick('about', e)}
              className={`text-left text-xs font-mono py-2 uppercase tracking-wider transition-colors cursor-pointer ${
                activeNav === 'about' ? 'text-[#00ff00] font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ABOUT
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=vasanthankasvk@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 bg-zinc-900 rounded border border-[#1a1a1a] text-xs font-mono text-white hover:border-white transition-colors"
            >
              Hire Me
            </a>
            <a 
              href="https://www.linkedin.com/in/vasanthankasvk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 bg-[#00ff00] rounded text-black font-extrabold text-xs font-mono hover:bg-[#00cc00]"
            >
              LINKEDIN 😊
            </a>
          </div>
        </div>
      )}

      {/* MAIN DUAL/TRIPLE PANEL DASHBOARD LAYOUT GRID - HIGHLY RESPONSIVE */}
      <div id="portfolio-dashboard-grid" className="flex-1 w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[260px_1fr_300px] gap-0 border-b border-[#1a1a1a]">
        
        {/* LEFT SIDEBAR PANEL */}
        <aside id="dashboard-sidebar-left" className="border-r border-[#1a1a1a] p-4 sm:p-6 flex flex-col gap-8 bg-[#030303] lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] overflow-y-auto w-full">
                  {/* USER MINI BIO WITH WORK PROFILE IMAGE & ONLINE SINGLE QUOTE  */}
          <div className="flex flex-col gap-4 border-b border-[#1a1a1a] pb-5">
            <div className={`relative w-24 h-24 mx-auto mb-1 group ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}>
              {/* Luminous aura shadow border */}
              <div className="absolute inset-x-0 -top-1 -bottom-1 rounded-full bg-gradient-to-tr from-[#00ff00]/30 via-emerald-800/10 to-transparent blur-md animate-pulse pointer-events-none" />
              
              <div 
                className={`w-24 h-24 rounded-full border-2 border-[#00ff00] overflow-hidden bg-zinc-900 relative z-10 ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => {
                  if (isAdmin) {
                    const input = document.getElementById('profile-image-upload-input');
                    if (input) input.click();
                  }
                }}
              >
                <img 
                  src={profileImage} 
                  alt="Vasanthan K Profile Portrait" 
                  className={`w-full h-full object-cover transition-all duration-500 ${isAdmin ? 'group-hover:scale-105' : ''}`}
                  referrerPolicy="no-referrer"
                />
                {isAdmin && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300 z-20">
                    <span className="text-[8px] text-[#00ff00] font-mono tracking-widest font-bold">CLICK TO</span>
                    <span className="text-[8px] text-white font-mono tracking-widest font-bold">UPLOAD IMAGE</span>
                  </div>
                )}
              </div>

              {/* Status indicator pill in right bottom corners */}
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-black border-2 border-[#00ff00] flex items-center justify-center z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-ping" />
              </div>

              <input 
                type="file" 
                id="profile-image-upload-input" 
                className="hidden" 
                accept="image/*" 
                onChange={handleProfileImageUpload}
              />
            </div>

            {isAdmin && (
              <div className="text-center animate-fade-in">
                <div className="flex flex-col gap-1 px-2.5 py-1.5 bg-[#050505] border border-[#141414] rounded">
                  <span className="text-[8px] text-[#00ff00] font-mono uppercase font-bold tracking-wider">
                    🛰️ BUILD COPIER ACTIVE
                  </span>
                  <p className="text-[7.5px] text-zinc-500 leading-tight">
                    Upload your picture, copy the system code, and paste/send it to make it permanent for all visitors!
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profileImage);
                      alert("Unified Base64 Profile Code Copied! Send this to me via chat so I can embed it globally in App.tsx for your next publish.");
                    }}
                    className="mt-1 w-full py-0.5 bg-[#00ff00]/10 border border-[#00ff00]/20 hover:bg-[#00ff00] hover:text-black transition-all rounded text-[7.5px] font-mono uppercase font-black cursor-pointer"
                  >
                    Copy Global Code
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem('vasanthan_profile_img');
                      setProfileImage(DEFAULT_AVATAR_SVG);
                      alert("Local profile image override cleared. Restored to system default!");
                    }}
                    className="mt-1 w-full py-0.5 bg-red-950/30 border border-red-900/40 hover:bg-red-600 hover:text-white transition-all rounded text-[7.5px] font-mono uppercase font-black cursor-pointer"
                  >
                    Reset Local Override
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <h2 className="text-base font-black tracking-widest text-white uppercase font-sans">
                VASANTHAN K
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 mt-1.5 rounded bg-zinc-900 border border-[#1a1a1a] text-[9.5px] font-mono text-[#00ff00]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00]" />
                ONLINE
              </div>
            </div>

            <div className="text-center bg-black border border-[#161616] p-3 rounded">
              <p className="text-xs text-zinc-400 font-serif italic leading-relaxed">
                "Designing high-end responsive websites and premium studio motion sequences with pixel-perfect timing."
              </p>
            </div>
          </div>

          {/* SOFTWARE LIST CARD GRID WITH OFFICIAL SVG CUSTOM LOGOS */}
          <div className="flex flex-col gap-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono flex items-center justify-between border-b border-[#1a1a1a] pb-2">
              <span>SOFTWARE DECK</span>
              <span className="text-[9px] text-[#00ff00]/80">BY CATEGORY</span>
            </div>
            
            <div className="flex flex-col gap-4">
              {SOFTWARE_CATEGORIES.map((category) => (
                <div key={category.name} className="flex flex-col gap-1.5">
                  {/* Category Header with Lucide categorized icon */}
                  <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-mono font-bold tracking-wider uppercase bg-[#070707] border border-[#141414] px-2 py-1 rounded">
                    {renderCategoryIcon(category.iconName)}
                    <span>{category.name}</span>
                  </div>

                  {/* Category items list */}
                  <div className="flex flex-col gap-1.5 pl-1.5">
                    {category.itemNames.map((itemName) => {
                      const soft = SOFTWARE_LIST.find(s => s.name === itemName);
                      if (!soft) return null;
                      const isActive = selectedSoftware === soft.name;
                      return (
                        <button
                          key={soft.id}
                          onClick={() => {
                            setSelectedSoftware(isActive ? null : soft.name);
                            setSelectedSkill(null); 
                          }}
                          onMouseEnter={() => setHoveredSoftware(soft)}
                          onMouseLeave={() => setHoveredSoftware(null)}
                          className={`w-full relative p-2 flex items-center justify-between border rounded transition-all duration-300 outline-none cursor-pointer text-left ${
                            isActive 
                              ? 'border-[#00ff00] bg-zinc-950 shadow-[0_0_8px_rgba(0,255,0,0.12)]' 
                              : 'border-[#121212] bg-[#030303] hover:border-zinc-800 hover:bg-[#070707]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Logo and state dot */}
                            <div className="relative shrink-0">
                              {getSoftwareLogo(soft.name)}
                              {isActive && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00ff00] outline outline-[1px] outline-black" />}
                            </div>
                            
                            {/* Name & details */}
                            <div className="min-w-0">
                              <div className="text-[10.5px] font-bold text-white leading-tight truncate">
                                {soft.name}
                              </div>
                              <div className="text-[8px] text-[#00ff00] font-mono leading-none mt-0.5">
                                {soft.proficiency}% PRO
                              </div>
                            </div>
                          </div>

                          {/* Right elements: Shortcut badge in monospaced capsule */}
                          <div className="shrink-0 text-right">
                            <span className="px-1.5 py-0.5 bg-black border border-[#161616] text-[7.5px] text-zinc-500 font-mono rounded">
                              {soft.id.toUpperCase()}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* SOFTWARE LIVE DETAILS TOOLTIP */}
            <div className="min-h-[75px] bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded flex flex-col justify-center">
              {hoveredSoftware ? (
                <div className="animate-fade-in">
                  <div className="text-[10px] font-mono text-[#00ff00] uppercase tracking-wider mb-1">
                    {hoveredSoftware.name} workflow
                  </div>
                  <div className="text-[10px] text-gray-300 leading-normal mb-1">
                    {hoveredSoftware.description}
                  </div>
                  <div className="text-[9px] text-emerald-500 font-mono">
                    Hotkey: <strong className="font-semibold text-white">{hoveredSoftware.shortcut}</strong>
                  </div>
                </div>
              ) : selectedSoftware ? (
                <div>
                  <div className="text-[10px] font-mono text-[#00ff00] flex items-center justify-between mb-1">
                    <span>ACTIVE FILTER MATCHED</span>
                    <button 
                      onClick={() => setSelectedSoftware(null)}
                      className="text-zinc-500 hover:text-white"
                    >
                      CLEAR
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Currently showcasing items rendered using <strong className="text-white">{selectedSoftware}</strong>.
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-zinc-500 text-center italic">
                  Hover over any software block to view advanced commands &amp; key workflows.
                </p>
              )}
            </div>
          </div>

          {/* QUICK LINKS SECTION */}
          <div className="mt-auto pt-4 border-t border-[#111] hidden lg:block space-y-2">
            <div className="text-[10px] text-zinc-600 font-mono tracking-wider mb-2">QUICK CONTROLS</div>
            
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=vasanthankasvk@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-[#00ff00]/5 border border-[#00ff00]/25 hover:bg-[#00ff00] hover:text-black hover:border-transparent text-[#00ff00] transition-all rounded text-[10px] font-mono flex items-center justify-center gap-1.5"
            >
              <Mail size={12} /> EMAIL DIRECT
            </a>

            <a 
              href="https://www.linkedin.com/in/vasanthankasvk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-zinc-950 border border-[#1a1a1a] text-zinc-300 hover:text-white hover:border-zinc-700 transition-all rounded text-[10px] font-mono flex items-center justify-center gap-1.5"
            >
              😊 LINKEDIN PROFILE
            </a>

            <button 
              onClick={handleResetWorks}
              className="w-full py-1.5 bg-zinc-950 border border-[#111] text-zinc-500 hover:text-white transition-colors rounded text-[9.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={10} /> RESET STATE
            </button>

            {isAdmin ? (
              <button 
                onClick={handleAdminLogout}
                className="w-full py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/25 hover:bg-[#00ff00] hover:text-black hover:border-transparent text-[#00ff00] transition-colors rounded text-[9.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock size={10} /> LOCK CONSOLE
              </button>
            ) : (
              <button 
                onClick={() => setIsAdminAuthOpen(true)}
                className="w-full py-1.5 bg-[#030303] border border-[#111] text-zinc-650 hover:text-white hover:border-[#222] transition-colors rounded text-[9.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock size={10} /> OWNER ATTAINMENT
              </button>
            )}
          </div>
        </aside>

        {/* CENTRAL MAIN PANEL (WORKS & PREVIEWS) */}
        <main id="work-section-root" className="p-4 sm:p-8 flex flex-col gap-6 bg-black w-full overflow-hidden">
          
          {/* SECTION HEADER BLOCK - Clean layout, parenthesis number removed */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a1a] pb-6">
            <div>
              <div className="text-[10px] text-zinc-400 font-mono mb-1 flex items-center gap-1">
                <span>FORMAT REEL SELECTOR</span>
                <span className="text-zinc-800">|</span>
                <span>MATCHED: {filteredItems.length}</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight uppercase">
                FEATURED WORK SHOWROOM 
              </h2>
            </div>

            {/* ACTION TRIGGERS */}
            <div className="flex items-center gap-2">
              <button
                onClick={executeShuffle}
                disabled={shuffleTriggered}
                className={`px-3.5 py-1.5 bg-zinc-900 border border-[#1a1a1a] hover:border-zinc-700 hover:text-[#00ff00] text-xs font-mono rounded flex items-center gap-1.5 cursor-pointer select-none transition-all duration-150 ${shuffleTriggered ? 'scale-95 opacity-50' : 'active:scale-95'}`}
                title="Shuffle grid coordinates"
              >
                <Shuffle size={13} className={shuffleTriggered ? 'animate-spin' : ''} /> 
                {shuffleTriggered ? 'SHUFFLING...' : 'SHUFFLE LAYOUT'}
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-3.5 py-1.5 bg-[#00ff00] hover:bg-[#00dd00] text-black font-extrabold text-xs font-mono rounded flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer animate-pulse"
                  title="Upload custom clip to your dynamic deck"
                >
                  <Plus size={13} strokeWidth={2.5} /> CHIP CONNECTOR
                </button>
              )}
            </div>
          </div>

          {/* GRID FORMAT RATIOS FILTER TABS */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#050505] p-3 border border-[#161616] rounded">
            
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider mr-2">GRID-FORMAT:</span>
              <button
                onClick={() => { setActiveTab('all'); setActiveNav('work'); }}
                className={`px-2.5 py-1.5 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-[#00ff00] text-black border-[#00ff00] font-bold' 
                    : 'bg-transparent text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white'
                }`}
              >
                ALL RATIOS
              </button>
              <button
                onClick={() => { setActiveTab('vertical'); setActiveNav('work'); }}
                className={`px-2.5 py-1.5 text-[10px] font-mono rounded border transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'vertical' 
                    ? 'bg-[#00ff00] text-black border-[#00ff00] font-bold' 
                    : 'bg-transparent text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="w-[6px] h-[9px] border border-current rounded-[1px] bg-transparent" />
                VERTICAL (9:16)
              </button>
              <button
                onClick={() => { setActiveTab('landscape'); setActiveNav('work'); }}
                className={`px-2.5 py-1.5 text-[10px] font-mono rounded border transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'landscape' 
                    ? 'bg-[#00ff00] text-black border-[#00ff00] font-bold' 
                    : 'bg-transparent text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="w-[11px] h-[6px] border border-current rounded-[1px] bg-transparent" />
                LANDSCAPE (16:9)
              </button>
              <button
                onClick={() => { setActiveTab('normal'); setActiveNav('work'); }}
                className={`px-2.5 py-1.5 text-[10px] font-mono rounded border transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'normal' 
                    ? 'bg-[#00ff00] text-black border-[#00ff00] font-bold' 
                    : 'bg-transparent text-zinc-400 border-zinc-900 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="w-[8px] h-[8px] border border-current rounded-[1px] bg-transparent" />
                REGULAR
              </button>
            </div>

            {/* Active Selection Badge */}
            {(selectedSoftware || selectedSkill) && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-500 font-mono">SELECTED FORMAT:</span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-[#222] text-[#00ff00] text-[9.5px] font-mono rounded flex items-center gap-1.5">
                  {(selectedSoftware ? `Software: ${selectedSoftware}` : `Skill: ${selectedSkill}`)}
                  <button 
                    onClick={() => { setSelectedSoftware(null); setSelectedSkill(null); }}
                    className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={10} className="align-middle inline" />
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* DYNAMIC SHUFFLED REH-EDITABLE WORKS PORTFOLIO GRID - HIGHLY RESPONSIVE */}
          {filteredItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-[#1a1a1a] rounded bg-[#030303]">
              <FileVideo size={36} className="text-zinc-700 mb-3 animate-pulse" />
              <div className="text-sm font-mono text-zinc-400 mb-1">NO WORK SAMPLES FOUND</div>
              <p className="text-xs text-zinc-600 text-center max-w-[320px] mb-4">
                Let's reset filters to fetch the default pristine high-pacing edits.
              </p>
              <button 
                onClick={handleResetWorks}
                className="px-4 py-2 bg-zinc-900 border border-[#1a1a1a] text-[#00ff00] text-xs font-mono rounded hover:border-[#333] cursor-pointer"
              >
                RESET GRID FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredItems.map((item) => {
                const isVerticalCard = item.type === 'vertical';
                const isLandscapeCard = item.type === 'landscape';

                // Assign flexible grids, conforming precisely to requested layout
                let gridClass = 'col-span-1 h-[250px]'; 
                if (isVerticalCard) {
                  gridClass = 'col-span-1 row-span-2 h-[520px]'; 
                } else if (isLandscapeCard) {
                  gridClass = 'col-span-1 md:col-span-2 h-[260px]';
                }

                return (
                  <div
                    key={item.id}
                    id={`work-item-${item.id}`}
                    onClick={() => setActiveLightboxProject(item)}
                    className={`group relative rounded border border-[#1a1a1a] bg-[#050505] overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-300 hover:border-zinc-600 hover:shadow-[0_0_15px_rgba(0,255,0,0.06)] ${gridClass}`}
                  >
                    {/* Thumbnail Asset Layers */}
                    <div className="absolute inset-0 z-0 bg-neutral-950">
                      <img 
                        src={item.thumbnailUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 opacity-40 group-hover:opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10 z-10" />
                    </div>

                    {/* Meta labels */}
                    <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center pointer-events-none">
                      <span className={`text-[8.5px] font-mono uppercase px-2 py-0.5 rounded tracking-widest ${
                        isVerticalCard 
                          ? 'bg-[#00ff00] text-black font-extrabold' 
                          : isLandscapeCard 
                            ? 'bg-blue-600 text-white font-extrabold' 
                            : 'bg-zinc-800 text-gray-300'
                      }`}>
                        {item.type}
                      </span>
                      
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-mono bg-black/80 text-zinc-400 px-2 py-0.5 rounded border border-[#1a1a1a]">
                          {item.duration || '0:30'}
                        </span>
                        
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDeleteWorkItem(item.id, e)}
                            className="p-1 rounded bg-black/80 border border-[#1a1a1a] text-zinc-500 hover:text-red-500 pointer-events-auto transition-colors cursor-pointer"
                            title="Delete design item"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Interactive Play Feedback Trigger */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-black/40">
                      <div className="w-11 h-11 rounded-full border border-[#00ff00] bg-black/80 flex items-center justify-center text-[#00ff00] transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Play size={16} fill="#00ff00" className="ml-1" />
                      </div>
                    </div>

                    {/* Footer text indicators */}
                    <div className="p-4 sm:p-5 z-20 absolute bottom-0 left-0 w-full">
                      <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.22em] mb-1">
                        {item.category}
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold tracking-tight truncate uppercase text-white group-hover:text-[#00ff00] transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.softwareUsed?.map((s, idx) => (
                          <span key={idx} className="text-[8.5px] font-mono bg-[#0c0c0c] text-zinc-400 px-1.5 py-0.5 rounded border border-[#161616]">
                            #{s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR PANEL - CONSOLIDATED METRI-PANELS, LATEST USER SPECS */}
        <aside id="dashboard-sidebar-right" className="p-4 sm:p-6 flex flex-col gap-6 bg-[#030303] lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] overflow-y-auto justify-between border-l border-[#1a1a1a] xl:border-l-0">
          
          {/* USER SKILL ITEMS DECK */}
          <div id="skills-section-root" className="flex flex-col gap-4">
            <div className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono flex items-center gap-1.5 border-b border-[#1a1a1a] pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00]" />
              EXPERT SERVICES
            </div>

            <div className="flex flex-col gap-5">
              {SKILL_CATEGORIES.map((category) => (
                <div key={category.name} className="flex flex-col gap-1.5">
                  {/* Category Header with Dynamic Lucide Icon */}
                  <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-mono font-bold tracking-wider uppercase bg-[#070707] border border-[#141414] px-2 py-1 rounded">
                    {renderCategoryIcon(category.iconName)}
                    <span>{category.name}</span>
                  </div>

                  {/* Skills lists inside category */}
                  <div className="flex flex-col gap-2 pl-1.5">
                    {category.itemNames.map((itemName) => {
                      const skill = SKILL_ITEMS.find(s => s.name === itemName);
                      if (!skill) return null;
                      const isActive = selectedSkill === skill.name;
                      return (
                        <div 
                          key={skill.name} 
                          onMouseEnter={() => setHoveredSkill(skill)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          onClick={() => {
                            setSelectedSkill(isActive ? null : skill.name);
                            setSelectedSoftware(null); 
                            setActiveNav('skill');
                          }}
                          className={`group cursor-pointer p-2 rounded border transition-all duration-200 ${
                            isActive 
                              ? 'bg-zinc-950 border-[#00ff00]/40 shadow-[0_0_8px_rgba(0,255,0,0.08)]' 
                              : 'hover:bg-zinc-950 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className={`font-semibold tracking-tight transition-colors ${isActive ? 'text-[#00ff00]' : 'text-gray-300 group-hover:text-white'}`}>
                              {skill.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#00ff00] font-extrabold">
                              {skill.percentage}%
                            </span>
                          </div>
                          {/* Linear neon display bars */}
                          <div className="w-full h-1 bg-[#111] rounded overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-emerald-600 to-[#00ff00] rounded transition-all duration-1000"
                              style={{ width: `${skill.percentage}%` }}
                            />
                          </div>
                          <span className="text-[8.5px] text-zinc-500 font-mono block mt-1 leading-snug truncate">
                            {skill.subSkills}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* LIVE DISPLAY */}
            <div className="min-h-[50px] bg-[#0a0a0a] border border-[#1a1a1a] p-3 rounded text-[10px] text-zinc-400">
              {hoveredSkill ? (
                <div>
                  <span className="text-[#00ff00] font-mono tracking-widest uppercase block mb-0.5">CORE WORKFLOW:</span>
                  <p className="leading-relaxed text-zinc-300">{hoveredSkill.subSkills}</p>
                </div>
              ) : selectedSkill ? (
                <div>
                  <span className="text-[#00ff00] font-mono tracking-widest uppercase block mb-0.5">SELECTED SKILL:</span>
                  <p className="text-zinc-300">Filtering project reels related to "<span className="text-white">{selectedSkill}</span>".</p>
                </div>
              ) : (
                <p className="text-center italic text-zinc-500">
                  Click any service above to automatically filter portfolio work clips.
                </p>
              )}
            </div>
          </div>

          {/* DYNAMIC SPECS METRICS SECTION - PERFECTLY CONSOLIDATED W/ SYSTEM CLOCK AS REQUESTED */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono border-b border-[#1a1a1a] pb-1.5">
              METRIC SUMMARY
            </div>
            
            {/* CONSOLIDATED CARD: "120 plus equal to 10 plus clock" */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-md flex flex-col gap-3">
              <div>
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                  PORTFOLIO EDITS
                </div>
                <div className="text-3xl font-black text-[#00ff00] tracking-tighter">
                  10+ <span className="text-xs font-normal text-white ml-1 uppercase tracking-wider">FEATURED WORKS</span>
                </div>
              </div>
              
              <div className="border-t border-[#161616] pt-2.5">
                <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">PRO-CONSOLE ACTIVE TIME</div>
                <div className="text-sm font-mono font-bold tracking-widest text-[#00ff00] mt-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-ping" />
                  <span>{currentTime || '10:33:02 UTC'}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-md flex justify-between items-center">
              <div>
                <div className="text-[9px] text-[#00ff00] font-mono">CLIENT RETENTION</div>
                <div className="text-xl font-extrabold tracking-tight">100% RELIABILITY</div>
              </div>
              <div className="w-11 h-11 rounded-full border border-[#151515] bg-black flex items-center justify-center font-mono text-[10px] font-bold text-center text-[#00ff00]">
                5.0★
              </div>
            </div>
          </div>

        </aside>
      </div>

      {/* ABOUT & BIOGRAPHY SECTION */}
      <section id="about-section-root" className="border-t border-[#1a1a1a] bg-[#030303] p-6 sm:p-12">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#1a1a1a]">
            <div>
              <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.25em] mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                <span>PROFESSIONAL BRIEF</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-white">
                ABOUT &amp; DESIGN ESSENCE
              </h2>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono text-left md:text-right">
              <div>AVAILABILITY: TRAVEL READY</div>
              <div className="text-[#00ff00]">ACTIVE RANGE: GLOBAL WORKSPACE</div>
            </div>
          </div>

          {/* BIO DETAILS & CONTRACT DISPATCH FORM SIDE BY SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            <div className="flex flex-col justify-between bg-black/40 border border-[#141414] p-6 rounded">
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-mono text-zinc-400 tracking-widest uppercase pb-2 border-b border-[#111]">
                  EXPERT RESPONSIVE WEBSITE &amp; MOTION DESIGN
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                  I am <strong className="text-white font-semibold">Vasanthan K</strong>, professional designer and studio motion specialist. Delivering high-speed commercial motion assets, custom timelines, and elite fully-responsive site flows, I focus on premium, interactive layouts.
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  My design architecture focuses on raw typographic integrity, neon accent cues, and optimized performance benchmarks. 100% stable, travel-ready, and optimized for global creative pipelines.
                </p>
              </div>
              
              <div className="text-[10px] text-zinc-600 font-mono tracking-wider pt-6 border-t border-[#111]/60 mt-4 flex items-center gap-2">
                <span>COORDINATES: 13.0827° N, 80.2707° E (INDIA)</span>
              </div>
            </div>

            <div className="bg-black border border-[#1a1a1a] p-6 rounded flex flex-col gap-4 justify-between">
              <div>
                <h3 className="text-xs font-mono text-zinc-400 tracking-widest uppercase pb-2 border-b border-[#111]">
                  START A PROJECT | DIRECT INBOX
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mt-2.5">
                  Request clean visual deliverables, active commercial video layouts, or expert website collaborations globally.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Mail */}
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=vasanthankasvk@gmail.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-zinc-950 border border-[#1a1a1a] rounded flex items-center justify-between hover:border-[#00ff00] hover:bg-[#080808] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#111] flex items-center justify-center text-[#00ff00]">
                      <Mail size={14} />
                    </div>
                    <div>
                      <div className="text-[9px] text-[#00ff00] font-mono">EMAIL DIRECT</div>
                      <div className="text-xs font-semibold text-white font-mono">vasanthankasvk@gmail.com</div>
                    </div>
                  </div>
                  <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/vasanthankasvk"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-zinc-950 border border-[#1a1a1a] rounded flex items-center justify-between hover:border-[#00ff00] hover:bg-[#080808] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#111] flex items-center justify-center text-[#00ff00] text-sm">
                      😊
                    </div>
                    <div>
                      <div className="text-[9px] text-[#00ff00] font-mono font-bold">LINKEDIN PROFILE 😊</div>
                      <div className="text-xs font-semibold text-white font-mono font-sans">Vasanthan K</div>
                    </div>
                  </div>
                  <ExternalLink size={12} className="text-zinc-500 group-hover:text-white transition-colors" />
                </a>
              </div>

              <div className="text-[9px] text-zinc-500 font-mono text-center">
                Active response times. Tap links to initialize a direct workspace sync.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER STATUS STRIP - STRAIGHT PERPENDICULAR LINES, NO DOUBLE SLASH */}
      <footer id="portfolio-footer" className="bg-[#050505] border-t border-[#1a1a1a] px-4 sm:px-8 py-4 text-[10px] text-zinc-500 font-mono tracking-wider flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>
          PORTFOLIO 2026 | ALL RIGHTS RESERVED
        </div>
        <div className="flex items-center gap-6">
          <span>BASED IN INDIA</span>
          <span className="text-[#00ff00] flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse inline-block" />
            SYSTEM STATUS: OPTIMAL
          </span>
        </div>
      </footer>

      {/* --- LIGHTBOX MODAL: THE INTERACTIVE 'PRODUCTION MONITOR SUITE' --- */}
      {activeLightboxProject && (
        <div 
          id="editor-monitor-lightbox" 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md overflow-y-auto animate-fade-in"
          onClick={() => setActiveLightboxProject(null)}
        >
          <div 
            className="w-full max-w-5xl bg-[#080808] border border-[#222] rounded-lg overflow-hidden flex flex-col gap-0 shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()} 
          >
            
            {/* TOP BAR */}
            <div className="bg-[#0e0e0e] border-b border-[#222] px-4 py-3 flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="font-extrabold text-red-600 tracking-wider text-[10px]">REC MODE</span>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-300">PROJECT: {activeLightboxProject.title}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-zinc-400 text-[10px]">
                  <span>RATIO: {activeLightboxProject.type.toUpperCase()}</span>
                  <span>|</span>
                  <span>FPS: 60.00</span>
                </div>
                <button 
                  onClick={() => setActiveLightboxProject(null)}
                  className="p-1 rounded text-zinc-400 hover:text-[#00ff00] transition-colors cursor-pointer"
                  aria-label="Close monitor"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* MONITOR RENDER PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-3">
              
              {/* VIDEO CONTAINER */}
              <div className="col-span-1 lg:col-span-2 bg-black flex flex-col items-center justify-center relative border-r border-[#1a1a1a] min-h-[280px] sm:min-h-[400px]">
                
                <video
                  ref={lightboxVideoRef}
                  src={activeLightboxProject.videoUrl}
                  loop
                  muted={isMuted}
                  autoPlay={isPlaying}
                  className="max-h-[380px] sm:max-h-[460px] w-full object-contain transition-all duration-300"
                  style={{ filter: getFilterStyle() }}
                />

                <div className="absolute top-4 left-4 text-[9px] font-mono text-white/20 bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
                  VASANTHAN K. CONSOLE | WATERMARK
                </div>

                {selectedLUT !== 'none' && (
                  <div className="absolute top-4 right-4 text-[10px] font-mono text-[#00ff00] bg-black/80 px-2 py-1 border border-[#00ff00] rounded animate-pulse pointer-events-none uppercase">
                    LUT APPLIED: {selectedLUT.replace('_', ' ')}
                  </div>
                )}
              </div>

              {/* CONTROLS COLUMN */}
              <div className="p-4 sm:p-5 flex flex-col justify-between gap-5 bg-[#0a0a0a]">
                
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-widest">
                    ACTIVE SOURCE DETAILS
                  </div>
                  <h3 className="text-base font-extrabold tracking-tight uppercase">
                    {activeLightboxProject.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {activeLightboxProject.description}
                  </p>
                  
                  <div className="flex items-center gap-1.5 mt-1 bg-zinc-950 border border-[#161616] p-2 rounded">
                    <Info size={12} className="text-[#00ff00]" />
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Category: <span className="text-white font-semibold">{activeLightboxProject.category}</span>
                    </span>
                  </div>
                </div>

                {/* LUT WORKSPACE */}
                <div className="flex flex-col gap-2.5">
                  <div className="text-[10px] text-zinc-500 font-mono tracking-wider flex items-center justify-between">
                    <span>LIVE COLOR LUT SELECTOR</span>
                    <span className="text-[#00ff00] text-[9px] font-bold">| REAL-TIME</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    <button 
                      onClick={() => setSelectedLUT('none')}
                      className={`py-1 rounded text-[9px] font-mono border text-center transition-all cursor-pointer ${selectedLUT === 'none' ? 'bg-white text-black border-white' : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500'}`}
                    >
                      BYPASS
                    </button>
                    <button 
                      onClick={() => setSelectedLUT('teal_orange')}
                      className={`py-1 rounded text-[9px] font-mono border text-center transition-all cursor-pointer ${selectedLUT === 'teal_orange' ? 'bg-[#00ff00]/20 text-[#00ff00] border-[#00ff00]' : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500'}`}
                    >
                      TEAL_OR
                    </button>
                    <button 
                      onClick={() => setSelectedLUT('cyber')}
                      className={`py-1 rounded text-[9px] font-mono border text-center transition-all cursor-pointer ${selectedLUT === 'cyber' ? 'bg-fuchsia-950 text-fuchsia-400 border-fuchsia-500' : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500'}`}
                    >
                      CYBER
                    </button>
                    <button 
                      onClick={() => setSelectedLUT('noir')}
                      className={`py-1 rounded text-[9px] font-mono border text-center transition-all cursor-pointer ${selectedLUT === 'noir' ? 'bg-zinc-800 text-white border-zinc-600' : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500'}`}
                    >
                      NOIR
                    </button>
                    <button 
                      onClick={() => setSelectedLUT('vintage')}
                      className={`py-1 rounded text-[9px] font-mono border text-center transition-all cursor-pointer ${selectedLUT === 'vintage' ? 'bg-amber-950 text-amber-500 border-amber-600' : 'bg-black text-zinc-400 border-zinc-800 hover:border-zinc-500'}`}
                    >
                      VINT
                    </button>
                  </div>
                </div>

                {/* SPECTROGRAM VISUALIZER */}
                <div className="flex flex-col gap-1.5">
                  <div className="text-[10px] text-zinc-500 font-mono tracking-wider flex justify-between items-center">
                    <span>AUDIO COHERENCE MONITOR</span>
                    <span className="text-[#00ff00] text-[9.5px]">LIVE LEVELING</span>
                  </div>
                  
                  <div className="bg-black border border-[#161616] h-[45px] rounded flex flex-col justify-end p-1 relative overflow-hidden">
                    <canvas ref={canvasRef} width={280} height={35} className="w-full h-full block z-10" />
                    {!isPlaying && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-zinc-500 font-mono text-[9px] tracking-widest z-20">
                        MONITOR PAUSED
                      </div>
                    )}
                  </div>
                </div>

                {/* TIMELINE CONTROL DECK */}
                <div className="flex flex-col gap-3 pt-3 border-t border-[#1a1a1a]">
                  
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono">SPEED:</span>
                    <div className="flex items-center gap-1">
                      {[1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-1.5 py-0.5 text-[9px] font-mono rounded cursor-pointer ${playbackSpeed === speed ? 'bg-[#00ff00] text-black font-extrabold' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex-1 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black font-extrabold text-xs font-mono rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={12} fill="black" /> PAUSE
                        </>
                      ) : (
                        <>
                          <Play size={12} fill="black" /> PLAY
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`px-3 py-2 rounded text-xs font-mono border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isMuted 
                          ? 'bg-red-950/40 border-red-900/40 text-red-500 hover:bg-red-950/60' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Volume2 size={12} /> {isMuted ? 'MUTED' : 'LIVE'}
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}


      {/* --- ADD WORKSTATION/UPLOAD MODAL --- */}
      {isUploadOpen && (
        <div 
          id="upload-dialog-overlay" 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={() => setIsUploadOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#0a0a0a] border border-[#222] rounded-md overflow-hidden shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()} 
          >
            
            <div className="bg-[#111] px-5 py-4 border-b border-[#222] flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                <Video size={16} className="text-[#00ff00]" />
                <span className="font-extrabold tracking-tight text-xs sm:text-sm font-mono uppercase">
                  STUDIO DESIGN ADAPTER (UPLOAD PORTAL)
                </span>
              </div>
              <button 
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkItem} className="p-5 flex flex-col gap-4">
              
              <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.2em] leading-normal">
                | Dynamically append horizontal or vertical mock items instantly.
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KINETIC COMMERCIAL SHOWCASE"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] transition-colors uppercase font-mono tracking-wider"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    Card Grid Layout *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'vertical' | 'landscape' | 'normal')}
                    className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono cursor-pointer"
                  >
                    <option value="normal">Normal (Classic square box)</option>
                    <option value="vertical">Vertical (Double-row span / Reels / Shorts 9:16)</option>
                    <option value="landscape">Landscape (Double-column span / Showreel 16:9)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    Service Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono cursor-pointer"
                  >
                    <option value="Social Motion Design">Social Motion Design (9:16)</option>
                    <option value="Commercial Production">Commercial Production (16:9)</option>
                    <option value="Studio Motion">Studio Motion</option>
                    <option value="Professional Color Grading">Professional Color Grading</option>
                    <option value="Advanced Visual Effects">Advanced Visual Effects</option>
                    <option value="Creative Graphic Design">Creative Graphic Design</option>
                  </select>
                </div>

              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Video File Upload or Drop
                </label>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragActive 
                      ? 'border-[#00ff00] bg-emerald-950/20' 
                      : newVideoFile 
                        ? 'border-emerald-700 bg-zinc-900/40' 
                        : 'border-[#1a1a1a] bg-black hover:border-zinc-700'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {newVideoFile ? (
                    <div className="animate-fade-in">
                      <div className="w-6 h-6 rounded-full bg-[#00ff00]/20 text-[#00ff00] flex items-center justify-center mx-auto mb-1.5 text-xs font-bold">✓</div>
                      <div className="text-xs font-mono font-bold text-white max-w-[280px] truncate mx-auto">
                        FILE REGISTERED: {newVideoFile.name}
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono mt-0.5">
                        ({(newVideoFile.size / (1024 * 1024)).toFixed(2)} MB • Tap to replace file)
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-zinc-500 mx-auto mb-1.5 text-lg">📁</div>
                      <div className="text-xs text-zinc-400">
                        Drag &amp; drop video here, or <span className="text-[#00ff00] underline font-medium">browse local files</span>
                      </div>
                      <p className="text-[9px] text-zinc-600 font-mono mt-1">
                        Plays instantly in browser using direct local HTML blob projection.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                  <span className="uppercase tracking-widest">Or Paste Direct Video URL</span>
                  <span className="text-zinc-600">HTTPS / MP4 LOOP</span>
                </div>
                <input
                  type="text"
                  placeholder="https://assets.mixkit.co/videos/preview/...mp4"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  disabled={!!newVideoFile}
                  className="bg-black border border-[#1a1a1a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono placeholder:text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Project Description Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe key editing cuts, filters, and color transitions..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] font-sans placeholder:text-zinc-700"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-[#111]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-transparent text-zinc-400 hover:text-white text-xs font-mono rounded cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black font-extrabold text-xs font-mono rounded transition-transform active:scale-95 cursor-pointer"
                >
                  INJECT PIECE
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* OWNER AUTHENTICATION PASSCODE DIALOG */}
      {isAdminAuthOpen && (
        <div 
          id="admin-auth-dialog-overlay" 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in"
          onClick={() => {
            setIsAdminAuthOpen(false);
            setPasscodeInput('');
            setAuthError('');
          }}
        >
          <div 
            className="w-full max-w-sm bg-[#090909] border border-[#222] rounded overflow-hidden shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="bg-[#111] px-5 py-3.5 border-b border-[#222] flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                <Lock size={13} className="text-[#00ff00]" />
                <span className="font-extrabold tracking-widest text-[10px] font-mono uppercase">
                  OWNER ACCESS VERIFICATION
                </span>
              </div>
              <button 
                onClick={() => {
                  setIsAdminAuthOpen(false);
                  setPasscodeInput('');
                  setAuthError('');
                }}
                className="p-1 rounded text-zinc-500 hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="p-5 flex flex-col gap-4">
              <div className="text-[10px] text-zinc-500 font-mono text-center tracking-wide uppercase leading-normal">
                A security key is required to append dynamic files and modify profile elements.
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] text-[#00ff00] font-mono uppercase tracking-[0.2em]">
                  Security Key Passphrase
                </label>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="••••••••••••"
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  className="bg-black border border-[#222] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00ff00] font-mono text-center tracking-widest bg-zinc-950"
                />
              </div>

              {authError && (
                <div className="text-[10px] text-red-500 font-mono text-center uppercase tracking-wider animate-pulse">
                  {authError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminAuthOpen(false);
                    setPasscodeInput('');
                    setAuthError('');
                  }}
                  className="flex-1 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-[#222] text-zinc-400 font-mono text-[10px] rounded transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#00ff00] hover:bg-[#00dd00] text-black font-extrabold font-mono text-[10px] rounded transition-transform active:scale-98 cursor-pointer"
                >
                  VALIDATE
                </button>
              </div>

              <div className="text-[9px] text-zinc-650 font-mono text-center mt-1 leading-normal">
                Hint: Check URL options <code className="text-[#00ff00] bg-black px-1 py-0.5 rounded">?admin=true</code> to persist owner login.
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
