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
  Sparkles,
  Github,
  Edit,
  Settings,
  Database
} from 'lucide-react';

import { supabase, hasSupabaseConfig, updateSupabaseCredentials, clearSupabaseCredentials } from './supabase';


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
  fps?: string;
  createdAt?: string;
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

const INITIAL_SOFTWARE_LIST: SoftwareItem[] = [
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

const INITIAL_SKILL_ITEMS: SkillItem[] = [
  { name: 'Studio Motion', percentage: 95, subSkills: 'Storytelling, Multi-cam sync, Audiovisual coherence' },
  { name: 'High-End Motion Graphics', percentage: 92, subSkills: 'Kinetic typography, Custom logo animations, Seamless transitions' },
  { name: 'Professional Color Grading', percentage: 88, subSkills: 'RGB Curves, LUT calibration, Cinematic Teal & Orange balance' },
  { name: 'Immersive Sound Design', percentage: 85, subSkills: 'Foley layering, Sub drops, Ambient leveling & Noise reduction' },
  { name: 'Advanced Visual Effects', percentage: 86, subSkills: 'Chroma Keying, Camera Tracking, Screen Replacement & Rotoscoping' },
  { name: 'Creative Graphic Design', percentage: 90, subSkills: 'High-contrast typography layouts, Digital flyers, Branding assets' }
];

// Categorized structure for Software Deck with corresponding Lucide icons
const INITIAL_SOFTWARE_CATEGORIES = [
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
const INITIAL_SKILL_CATEGORIES = [
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
    case 'sparkles':
      return <Sparkles className="w-3.5 h-3.5 text-[#00ff00]" />;
    default:
      return <Sparkles className="w-3.5 h-3.5 text-[#00ff00]" />;
  }
};

// Helper to extract YouTube video ID
const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper to extract Google Drive file ID
const getGoogleDriveId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]{25,})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

// Fixed profile image — permanently set, not changeable
const PROFILE_IMAGE_PATH = '/profile.png';

const PRESET_CATEGORIES = [
  'Social Motion Design',
  'Commercial Production',
  'Studio Motion',
  'Professional Color Grading',
  'Advanced Visual Effects',
  'Creative Graphic Design'
];

export default function App() {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'landscape' | 'vertical' | 'normal'>('all');
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'works' | 'skill' | 'about'>('dashboard');
  
  // Custom video upload states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Social Motion Design');
  const [newCustomCategory, setNewCustomCategory] = useState('');
  const [newType, setNewType] = useState<'vertical' | 'landscape' | 'normal'>('normal');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [newVideoBase64, setNewVideoBase64] = useState<string>('');
  const [videoSizeWarning, setVideoSizeWarning] = useState<string>('');
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [newThumbnailUrl, setNewThumbnailUrl] = useState<string>('');
  const [newThumbnailBase64, setNewThumbnailBase64] = useState<string>('');
  const [thumbnailSizeWarning, setThumbnailSizeWarning] = useState<string>('');
  const [newDescription, setNewDescription] = useState('');
  const [newFps, setNewFps] = useState('');
  const [newDuration, setNewDuration] = useState('0:30');
  const [newSoftwareUsed, setNewSoftwareUsed] = useState<string[]>(['Premiere Pro', 'After Effects']);
  const [newCustomSoftware, setNewCustomSoftware] = useState('');

  // Edit modal states
  const [editingProject, setEditingProject] = useState<WorkItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCustomCategory, setEditCustomCategory] = useState('');
  const [editType, setEditType] = useState<'vertical' | 'landscape' | 'normal'>('normal');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [editThumbnailUrl, setEditThumbnailUrl] = useState('');
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const [editFps, setEditFps] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editSoftwareUsed, setEditSoftwareUsed] = useState<string[]>([]);
  const [editCustomSoftware, setEditCustomSoftware] = useState('');

  const [isOnline, setIsOnline] = useState<boolean>(() => {
    const local = localStorage.getItem('profile_is_online');
    return local !== null ? local === 'true' : true;
  });
  
  // Fixed profile image (not changeable)
  const profileImage = PROFILE_IMAGE_PATH;

  // Admin lock states for owner-only uploader
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('is_admin_v2') === 'true';
  });
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [githubAuthError, setGithubAuthError] = useState<string>('');
  const [isValidatingDb, setIsValidatingDb] = useState(false);
  const [inputUrl, setInputUrl] = useState(() => localStorage.getItem('VITE_SUPABASE_URL') || '');
  const [inputKey, setInputKey] = useState(() => localStorage.getItem('VITE_SUPABASE_ANON_KEY') || '');
  const [isConfiguredState, setIsConfiguredState] = useState(() => hasSupabaseConfig());

  // ─── Admin-customizable Expert Services & Software Deck state ───
  const [skillItems, setSkillItems] = useState<SkillItem[]>(() => {
    try { const s = localStorage.getItem('custom_skill_items'); return s ? JSON.parse(s) : INITIAL_SKILL_ITEMS; } catch { return INITIAL_SKILL_ITEMS; }
  });
  const [skillCategories, setSkillCategories] = useState<{ name: string; iconName: string; itemNames: string[] }[]>(() => {
    try { const s = localStorage.getItem('custom_skill_categories'); return s ? JSON.parse(s) : INITIAL_SKILL_CATEGORIES; } catch { return INITIAL_SKILL_CATEGORIES; }
  });
  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>(() => {
    try { const s = localStorage.getItem('custom_software_list'); return s ? JSON.parse(s) : INITIAL_SOFTWARE_LIST; } catch { return INITIAL_SOFTWARE_LIST; }
  });
  const [softwareCategories, setSoftwareCategories] = useState<{ name: string; iconName: string; itemNames: string[] }[]>(() => {
    try { const s = localStorage.getItem('custom_software_categories'); return s ? JSON.parse(s) : INITIAL_SOFTWARE_CATEGORIES; } catch { return INITIAL_SOFTWARE_CATEGORIES; }
  });

  // Admin settings modal
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);
  const [adminSettingsTab, setAdminSettingsTab] = useState<'skills' | 'categories' | 'software'>('skills');

  // Persist customizable data to localStorage
  useEffect(() => { localStorage.setItem('custom_skill_items', JSON.stringify(skillItems)); }, [skillItems]);
  useEffect(() => { localStorage.setItem('custom_skill_categories', JSON.stringify(skillCategories)); }, [skillCategories]);
  useEffect(() => { localStorage.setItem('custom_software_list', JSON.stringify(softwareList)); }, [softwareList]);
  useEffect(() => { localStorage.setItem('custom_software_categories', JSON.stringify(softwareCategories)); }, [softwareCategories]);

  // ─── CRUD helpers for admin settings ───
  const handleAddSkill = () => {
    const newSkill: SkillItem = { name: 'New Skill', percentage: 50, subSkills: 'Describe sub-skills here' };
    setSkillItems(prev => [...prev, newSkill]);
  };
  const handleUpdateSkill = (index: number, field: keyof SkillItem, value: string | number) => {
    setSkillItems(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };
  const handleDeleteSkill = (index: number) => {
    const skillName = skillItems[index]?.name;
    setSkillItems(prev => prev.filter((_, i) => i !== index));
    // Also remove from any category that references it
    setSkillCategories(prev => prev.map(c => ({ ...c, itemNames: c.itemNames.filter(n => n !== skillName) })));
  };

  const handleAddSkillCategory = () => {
    setSkillCategories(prev => [...prev, { name: 'NEW CATEGORY', iconName: 'sparkles', itemNames: [] }]);
  };
  const handleUpdateSkillCategory = (index: number, field: string, value: string | string[]) => {
    setSkillCategories(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };
  const handleDeleteSkillCategory = (index: number) => {
    setSkillCategories(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSoftware = () => {
    const id = `sw_${Date.now()}`;
    const newSw: SoftwareItem = { id, name: 'New Software', brandColor: 'text-white bg-[#111]', proficiency: 50, shortcut: 'N/A', description: 'Describe this software.' };
    setSoftwareList(prev => [...prev, newSw]);
  };
  const handleUpdateSoftware = (index: number, field: keyof SoftwareItem, value: string | number) => {
    setSoftwareList(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };
  const handleDeleteSoftware = (index: number) => {
    const swName = softwareList[index]?.name;
    setSoftwareList(prev => prev.filter((_, i) => i !== index));
    setSoftwareCategories(prev => prev.map(c => ({ ...c, itemNames: c.itemNames.filter(n => n !== swName) })));
  };

  const handleAddSoftwareCategory = () => {
    setSoftwareCategories(prev => [...prev, { name: 'NEW CATEGORY', iconName: 'sparkles', itemNames: [] }]);
  };
  const handleUpdateSoftwareCategory = (index: number, field: string, value: string | string[]) => {
    setSoftwareCategories(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };
  const handleDeleteSoftwareCategory = (index: number) => {
    setSoftwareCategories(prev => prev.filter((_, i) => i !== index));
  };

  const ICON_OPTIONS = ['video', 'flame', 'palette', 'layers', 'sliders', 'volume', 'sparkles'];

  const handleConnectSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setGithubAuthError('');
    setIsValidatingDb(true);
    
    const urlClean = inputUrl.trim();
    if (urlClean.includes('supabase.com/dashboard') || urlClean.includes('supabase.com/orgs')) {
      setGithubAuthError('Error: You entered a Supabase Dashboard URL. Please use your Project API URL instead (e.g., https://your-project.supabase.co). Find this in Project Settings > API.');
      setIsValidatingDb(false);
      return;
    }

    const success = updateSupabaseCredentials(inputUrl, inputKey);
    if (success) {
      try {
        // Verify database and works table connection
        const { error } = await supabase.from('works').select('id').limit(1);
        if (error) throw error;
        
        setIsConfiguredState(true);
        fetchWorks();
      } catch (err: any) {
        console.error('Database connection test failed:', err);
        clearSupabaseCredentials();
        setIsConfiguredState(false);
        setGithubAuthError(`Database connection test failed. Connected to server but failed to query "works" table: ${err?.message || String(err)}. Ensure you have run the database setup script.`);
      } finally {
        setIsValidatingDb(false);
      }
    } else {
      clearSupabaseCredentials();
      setIsConfiguredState(false);
      setGithubAuthError('Connection failed: invalid credentials format. Make sure the URL starts with https:// and the Anon key is a valid JWT token.');
      setIsValidatingDb(false);
    }
  };

  const handleDisconnectSupabase = () => {
    clearSupabaseCredentials();
    setIsConfiguredState(false);
    setInputUrl('');
    setInputKey('');
    setGithubAuthError('');
    setIsAdmin(false);
    localStorage.removeItem('is_admin_v2');
  };
  
  // Storage upload overlays
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const fetchStatus = async () => {
    // Status is synchronized dynamically via the 'works' table (system-online-status item)
  };

  const toggleOnlineStatus = async () => {
    if (!isAdmin) return;
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    localStorage.setItem('profile_is_online', String(newStatus));
    try {
      // Delete existing status row to bypass RLS update constraints
      await supabase
        .from('works')
        .delete()
        .eq('id', 'system-online-status');

      // Insert new status row
      const { error } = await supabase
        .from('works')
        .insert([{ 
          id: 'system-online-status', 
          title: 'SYSTEM STATUS', 
          description: newStatus ? 'online' : 'offline',
          category: 'System Configuration',
          type: 'normal'
        }]);
      if (error) throw error;
    } catch (err: any) {
      console.warn('Could not sync online/offline status to database works table, using local storage instead:', err);
    }
  };

  // 2. Real-time Works synchronization listener hook
  const fetchWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*');
      if (error) throw error;

      if (data && data.length > 0) {
        // Find system status row
        const statusRow = data.find((item: any) => item.id === 'system-online-status');
        if (statusRow) {
          const isOnlineVal = statusRow.description === 'online';
          setIsOnline(isOnlineVal);
          localStorage.setItem('profile_is_online', String(isOnlineVal));
        }

        // Filter out status row from display list
        const displayData = data.filter((item: any) => item.id !== 'system-online-status');

        if (displayData.length > 0) {
          const mappedList = displayData.map((item: any) => ({
            id: item.id,
            title: item.title || '',
            category: item.category || '',
            type: item.type || 'normal',
            videoUrl: item.video_url || '',
            thumbnailUrl: item.thumbnail_url || '',
            duration: item.duration || '',
            softwareUsed: Array.isArray(item.software_used)
              ? item.software_used
              : typeof item.software_used === 'string'
                ? item.software_used.replace(/[{}]/g, '').split(',').map((s: string) => s.trim()).filter(Boolean)
                : [],
            description: item.description || '',
            createdAt: item.created_at,
            fps: item.fps || '',
          }));

          mappedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setWorks(mappedList);
        } else {
          setWorks(INITIAL_WORKS);
        }
      } else {
        setWorks(INITIAL_WORKS);
      }
    } catch (err: any) {
      console.error('Error fetching works:', err);
    }
  };

  useEffect(() => {
    fetchWorks();
    fetchStatus();

    const worksChannel = supabase
      .channel('works-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'works' },
        () => {
          fetchWorks();
        }
      )
      .subscribe();

    // Disable right click on images and videos globally to prevent unauthorized downloads
    const preventContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      supabase.removeChannel(worksChannel);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  // Profile image is now fixed and not synced from Firestore

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

  // Profile image upload has been permanently disabled — image is fixed

  // Studio Monitor Lightbox state
  const [activeLightboxProject, setActiveLightboxProject] = useState<WorkItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedLUT, setSelectedLUT] = useState<'none' | 'teal_orange' | 'cyber' | 'noir' | 'vintage'>('none');
  const [useDriveIframeFallback, setUseDriveIframeFallback] = useState(false);
  
  // System states
  const [currentTime, setCurrentTime] = useState<string>('');
  const [shuffleTriggered, setShuffleTriggered] = useState(false);
  const [hoveredSoftware, setHoveredSoftware] = useState<SoftwareItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
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
    const youtubeId = activeLightboxProject ? getYoutubeId(activeLightboxProject.videoUrl || '') : null;
    if (youtubeId && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [playbackSpeed] }),
        '*'
      );
    } else if (lightboxVideoRef.current) {
      lightboxVideoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, activeLightboxProject]);

  // Adjust play/pause state when altered
  useEffect(() => {
    const youtubeId = activeLightboxProject ? getYoutubeId(activeLightboxProject.videoUrl || '') : null;
    if (youtubeId && iframeRef.current?.contentWindow) {
      const command = isPlaying ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
    } else if (lightboxVideoRef.current) {
      if (isPlaying) {
        lightboxVideoRef.current.play().catch(err => {
          console.warn("Failed to play video:", err);
        });
      } else {
        lightboxVideoRef.current.pause();
      }
    }
  }, [isPlaying, activeLightboxProject]);

  // Adjust mute/unmute state when altered
  useEffect(() => {
    const youtubeId = activeLightboxProject ? getYoutubeId(activeLightboxProject.videoUrl || '') : null;
    if (youtubeId && iframeRef.current?.contentWindow) {
      const command = isMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
    }
  }, [isMuted, activeLightboxProject]);

  // Reset play state to true and fallback to false when opening a new lightbox project
  useEffect(() => {
    if (activeLightboxProject) {
      setIsPlaying(true);
      setUseDriveIframeFallback(false);
    }
  }, [activeLightboxProject]);

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
  const handleResetWorks = async () => {
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('works')
        .select('id');
      if (error) throw error;

      if (data && data.length > 0) {
        const idsToDelete = data
          .map((d: any) => d.id)
          .filter((id: string) => id !== 'system-online-status');
        if (idsToDelete.length > 0) {
          const { error: deleteErr } = await supabase
            .from('works')
            .delete()
            .in('id', idsToDelete);
          if (deleteErr) throw deleteErr;
        }
      }
    } catch (err: any) {
      console.error('Error resetting works:', err);
      alert('Error resetting works: ' + (err.message || String(err)));
    }
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

  // Process Video Input File
  const processVideoFile = (file: File) => {
    setNewVideoFile(file);
    setNewTitle(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
    setVideoSizeWarning('');
    setNewVideoBase64('');

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

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setNewVideoBase64(base64);
      if (file.size > 50 * 1024 * 1024) {
        setVideoSizeWarning(`⚠️ This video is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Large files may take longer to upload over slower connections.`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Process Thumbnail Input Image
  const processThumbnailFile = (file: File) => {
    setNewThumbnailFile(file);
    setThumbnailSizeWarning('');
    setNewThumbnailBase64('');

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setNewThumbnailBase64(base64);
      if (file.size > 8 * 1024 * 1024) {
        setThumbnailSizeWarning(`⚠️ Thumbnail file is large (${(file.size / (1024 * 1024)).toFixed(1)}MB). We recommend compressing images under 2MB for faster load performance.`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Drop and read file URLs
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  // Create & Insert New Work Item — GLOBAL ONLY (Supabase Storage + Database)
  const handleCreateWorkItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsUploading(true);
    setUploadProgress('Preparing upload channels...');

    const customId = `custom-work-${Date.now()}`;
    let finalVideoUrl = '';
    let finalThumbnailUrl = 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80'; 

    try {
      // Ensure admin auth before uploading globally
      if (!isAdmin) {
        setIsUploading(false);
        setUploadProgress('');
        setIsAdminAuthOpen(true);
        return;
      }

      const customSofts = newCustomSoftware
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const finalSoftware = [...newSoftwareUsed, ...customSofts];

      // 1. Upload Video file to Supabase Storage or use URL
      if (newVideoFile) {
        setUploadProgress(`Uploading video file "${newVideoFile.name}" to Cloud Storage...`);
        const filePath = `videos/${customId}_${newVideoFile.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('vkportfolio')
          .upload(filePath, newVideoFile);
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from('vkportfolio')
          .getPublicUrl(filePath);
        finalVideoUrl = urlData.publicUrl;
      } else if (newVideoUrl.trim()) {
        finalVideoUrl = newVideoUrl.trim();
      } else {
        finalVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-recording-studio-with-microphone-and-monitors-43048-large.mp4';
      }

      // 2. Upload Thumbnail file to Supabase Storage or use URL
      if (newThumbnailFile) {
        setUploadProgress(`Uploading cover thumbnail file "${newThumbnailFile.name}" to Cloud Storage...`);
        const filePath = `thumbnails/${customId}_${newThumbnailFile.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('vkportfolio')
          .upload(filePath, newThumbnailFile);
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from('vkportfolio')
          .getPublicUrl(filePath);
        finalThumbnailUrl = urlData.publicUrl;
      } else if (newThumbnailUrl.trim()) {
        finalThumbnailUrl = newThumbnailUrl.trim();
      }

      // 3. Save work item to Supabase Database (globally visible to all visitors)
      setUploadProgress('Saving work item to global database...');
      const categoryToSend = newCategory === 'custom' ? newCustomCategory.trim() : newCategory;
      if (newCategory === 'custom' && !newCustomCategory.trim()) {
        alert('Please specify a custom category name.');
        setIsUploading(false);
        setUploadProgress('');
        return;
      }

      const customNewItem: any = {
        id: customId,
        title: newTitle.toUpperCase(),
        category: categoryToSend,
        type: newType,
        video_url: finalVideoUrl,
        thumbnail_url: finalThumbnailUrl,
        duration: newDuration.trim() || '0:30',
        software_used: finalSoftware,
        description: newDescription.trim() || `Custom media uploaded via Vasanthan Portfolio Workspace.`,
        fps: newFps.trim() || '60 FPS'
      };

      const { error: dbErr } = await supabase
        .from('works')
        .insert([customNewItem]);
      if (dbErr) throw dbErr;

      alert('Work item added and synced globally for all visitors!');

      // Clear state and input file references
      setNewTitle('');
      setNewCategory('Social Motion Design');
      setNewCustomCategory('');
      setNewType('normal');
      setNewVideoUrl('');
      setNewVideoFile(null);
      setNewVideoBase64('');
      setNewThumbnailUrl('');
      setNewThumbnailFile(null);
      setNewThumbnailBase64('');
      setVideoSizeWarning('');
      setThumbnailSizeWarning('');
      setNewDescription('');
      setNewFps('');
      setNewDuration('0:30');
      setNewSoftwareUsed(['Premiere Pro', 'After Effects']);
      setNewCustomSoftware('');
      setIsUploadOpen(false);

      if (fileInputRef.current) fileInputRef.current.value = '';
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';

    } catch (err: any) {
      console.error(err);
      let userFriendlyMsg = err?.message || String(err);
      if (userFriendlyMsg.includes('Failed to fetch')) {
        userFriendlyMsg = 'Failed to fetch (Network Error).\n\n' +
          'This is usually caused by one of the following:\n' +
          '1. INVALID API URL: Make sure the URL in settings is your Supabase Project API URL (e.g., ending in .supabase.co), NOT the dashboard URL.\n' +
          '2. MISSING STORAGE BUCKET: Check your Supabase Dashboard > Storage. You must create a bucket named exactly "vkportfolio" (all lowercase).\n' +
          '3. BUCKET NOT PUBLIC: Go to Storage > Bucket Settings on Supabase and make sure the "vkportfolio" bucket is set to "Public" (enabled).\n' +
          '4. RLS UPLOAD POLICY MISSING: You need an RLS policy on the "vkportfolio" storage bucket to allow uploads. Go to Storage > Policies, click New Policy under "vkportfolio" bucket, and select "Get started quickly" > "Allow public uploads" or "Enable read/write access for all users".';
      } else if (userFriendlyMsg.toLowerCase().includes('maximum allowed size') || userFriendlyMsg.toLowerCase().includes('exceeded the size limit') || userFriendlyMsg.toLowerCase().includes('payload too large')) {
        const fileSizeMb = newVideoFile ? (newVideoFile.size / (1024 * 1024)).toFixed(2) : 'N/A';
        userFriendlyMsg = `The selected video file is too large (${fileSizeMb} MB) and exceeds your Supabase bucket's maximum allowed size limit.\n\n` +
          '💡 How to increase the file size limit:\n' +
          '1. Go to your Supabase Dashboard.\n' +
          '2. Navigate to "Storage" in the left sidebar.\n' +
          '3. Click on the settings/edit icon (three dots) next to your "vkportfolio" bucket.\n' +
          '4. Under "Edit Bucket settings", find "Allowed Max File Size" (or "Maximum file size").\n' +
          '5. Set it to a larger limit, e.g., 524288000 bytes (for 500 MB) or clear it entirely.\n' +
          '6. Click "Save" and try uploading your video again.';
      }
      alert('Error uploading or creating work item: ' + userFriendlyMsg);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleOpenEditModal = (item: WorkItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    setEditingProject(item);
    setEditTitle(item.title);
    if (PRESET_CATEGORIES.includes(item.category)) {
      setEditCategory(item.category);
      setEditCustomCategory('');
    } else {
      setEditCategory('custom');
      setEditCustomCategory(item.category || '');
    }
    setEditType(item.type);
    setEditVideoUrl(item.videoUrl || '');
    setEditVideoFile(null);
    setEditThumbnailUrl(item.thumbnailUrl || '');
    setEditThumbnailFile(null);
    setEditFps(item.fps || '');
    setEditDescription(item.description || '');
    setEditDuration(item.duration || '0:30');

    // Map existing softwareUsed to checkboxes and custom input
    const presetNames = ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut', 'Photoshop', 'Canva'];
    const presetSelected = (item.softwareUsed || []).filter(s => presetNames.includes(s));
    const customSelected = (item.softwareUsed || []).filter(s => !presetNames.includes(s));
    setEditSoftwareUsed(presetSelected);
    setEditCustomSoftware(customSelected.join(', '));
  };

  const handleUpdateWorkItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsUploading(true);
    setUploadProgress('Preparing update channels...');

    let finalVideoUrl = editVideoUrl;
    let finalThumbnailUrl = editThumbnailUrl;

    try {
      if (!isAdmin) {
        setIsUploading(false);
        setUploadProgress('');
        setIsAdminAuthOpen(true);
        return;
      }

      // 1. Upload Video file if a new file is selected
      if (editVideoFile) {
        setUploadProgress(`Uploading new video file "${editVideoFile.name}" to Cloud Storage...`);
        const filePath = `videos/${editingProject.id}_${editVideoFile.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('vkportfolio')
          .upload(filePath, editVideoFile, { upsert: true });
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from('vkportfolio')
          .getPublicUrl(filePath);
        finalVideoUrl = urlData.publicUrl;
      }

      // 2. Upload Thumbnail file if a new file is selected
      if (editThumbnailFile) {
        setUploadProgress(`Uploading new cover thumbnail file "${editThumbnailFile.name}" to Cloud Storage...`);
        const filePath = `thumbnails/${editingProject.id}_${editThumbnailFile.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('vkportfolio')
          .upload(filePath, editThumbnailFile, { upsert: true });
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from('vkportfolio')
          .getPublicUrl(filePath);
        finalThumbnailUrl = urlData.publicUrl;
      }

      const customSofts = editCustomSoftware
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const finalSoftware = [...editSoftwareUsed, ...customSofts];

      // 3. Update work item in Supabase Database by deleting then inserting (to bypass RLS update constraints)
      setUploadProgress('Saving updates to database...');
      
      const categoryToSave = editCategory === 'custom' ? editCustomCategory.trim() : editCategory;
      if (editCategory === 'custom' && !editCustomCategory.trim()) {
        alert('Please specify a custom category name.');
        setIsUploading(false);
        setUploadProgress('');
        return;
      }

      // Delete old row
      const { error: deleteErr } = await supabase
        .from('works')
        .delete()
        .eq('id', editingProject.id);
        
      if (deleteErr) throw deleteErr;

      // Insert updated row (preserving original createdAt timestamp to maintain grid sorting)
      const { error: dbErr } = await supabase
        .from('works')
        .insert([{
          id: editingProject.id,
          title: editTitle.toUpperCase(),
          category: categoryToSave,
          type: editType,
          video_url: finalVideoUrl,
          thumbnail_url: finalThumbnailUrl,
          fps: editFps.trim(),
          description: editDescription.trim(),
          duration: editDuration.trim() || '0:30',
          software_used: finalSoftware,
          created_at: editingProject.createdAt || new Date().toISOString()
        }]);

      if (dbErr) throw dbErr;

      alert('Work item updated successfully!');
      setEditingProject(null);
      fetchWorks();
    } catch (err: any) {
      console.error(err);
      let userFriendlyMsg = err?.message || String(err);
      if (userFriendlyMsg.includes('Failed to fetch')) {
        userFriendlyMsg = 'Failed to fetch (Network Error).\n\n' +
          'This is usually caused by database or storage connection issues. Please check your Supabase configuration.';
      }
      alert('Error updating work item: ' + userFriendlyMsg);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleDeleteWorkItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Ensure admin auth before deleting globally
    if (!isAdmin) {
      setIsAdminAuthOpen(true);
      return;
    }

    if (!confirm('Are you sure you want to delete this work item globally from the database? This cannot be undone.')) {
      return;
    }
    try {
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error deleting work item:', err);
      alert('Error deleting work item: ' + (err.message || String(err)));
    }
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
      default: {
        // Dynamic fallback for custom software: generate 2-letter abbreviation
        const abbr = name.split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2) || '??';
        return (
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="#000000" stroke="#00ff00" strokeWidth="1.5"/>
            <text x="6" y="21" fill="#00ff00" fontFamily="'Inter', system-ui, sans-serif" fontWeight="900" fontSize="13" letterSpacing="-0.5">{abbr}</text>
          </svg>
        );
      }
    }
  };

  return (
    <div id="portfolio-app-root" className="relative min-h-screen bg-black text-white font-sans antialiased selection:bg-[#00ff00] selection:text-black flex flex-col justify-between overflow-x-hidden">
      
      {/* GLOBAL CLOUD UPLOAD PROGRESS MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#090909] border border-[#222] p-6 rounded text-center flex flex-col items-center gap-4 shadow-2xl">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#00ff00] animate-ping opacity-60" />
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#00ff00] animate-spin" />
              <div className="text-lg">⚡</div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-[#00ff00] uppercase tracking-widest font-black">
                UPLOADING TO CLOUD STORAGE
              </span>
              <p className="text-xs text-zinc-300 font-medium font-mono">
                {uploadProgress || 'Uploading assets to Vasanthan Portfolio...'}
              </p>
              <span className="text-[9px] text-zinc-500 font-mono">
                Please wait. This will sync globally for all users instantly!
              </span>
            </div>
          </div>
        </div>
      )}
      
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
      <header id="portfolio-header" className="sticky lg:sticky max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:right-0 max-lg:w-full z-40 border-b border-[#1a1a1a] bg-black/85 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => handleNavClick('dashboard', e)} 
            className={`flex items-center gap-2 bg-[#0a0a0a] border px-3.5 py-1.5 rounded-full text-[10px] font-mono outline-none transition-all cursor-pointer ${
              isOnline 
                ? 'border-[#1a1a1a] text-gray-400 hover:text-[#00ff00] hover:border-[#00ff00]/55' 
                : 'border-red-950 text-red-500/80 hover:text-red-400 hover:border-red-500/55'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#00ff00] animate-pulse' : 'bg-red-500'}`} />
            <span>TECH FRAME</span>
            {isOnline && (
              <>
                <span className="text-zinc-800">|</span>
                <span>ACTIVE</span>
              </>
            )}
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
            href="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=vasanthankasvk@gmail.com" 
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
      
      {/* Spacer for fixed mobile/tab header */}
      <div className="h-[73px] lg:hidden" />

      {/* MOBILE NAV PANEL */}
      {isMobileMenuOpen && (
        <div id="mobile-nav" className="fixed top-[73px] left-0 right-0 z-30 border-b border-[#1a1a1a] bg-[#050505] p-6 flex flex-col gap-4 animate-fade-in">
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
              href="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=vasanthankasvk@gmail.com"
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
          <div className="h-px bg-[#111] my-1" />
          {isAdmin && (
            <button 
              onClick={() => {
                handleAdminLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-[#00ff00]/10 border border-[#00ff00]/25 hover:bg-[#00ff00] hover:text-black hover:border-transparent text-[#00ff00] transition-colors rounded text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Unlock size={11} /> LOCK CONSOLE (LOGOUT)
            </button>
          )}
        </div>
      )}

      {/* MAIN DUAL/TRIPLE PANEL DASHBOARD LAYOUT GRID - HIGHLY RESPONSIVE */}
      <div id="portfolio-dashboard-grid" className="flex-1 w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr_275px] xl:grid-cols-[260px_1fr_300px] gap-0 border-b border-[#1a1a1a]">
        
        {/* LEFT SIDEBAR PANEL */}
        <aside id="dashboard-sidebar-left" className="border-r border-[#1a1a1a] p-4 sm:p-6 flex flex-col gap-8 bg-[#030303] lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] overflow-y-auto w-full">
                  {/* USER MINI BIO WITH WORK PROFILE IMAGE & ONLINE SINGLE QUOTE  */}
          <div className="flex flex-col gap-4 border-b border-[#1a1a1a] pb-5">
            <div className="relative w-24 h-24 mx-auto mb-1">
              {/* Luminous aura shadow border */}
              <div className={`absolute inset-x-0 -top-1 -bottom-1 rounded-full blur-md animate-pulse pointer-events-none transition-all duration-300 ${
                isOnline 
                  ? 'bg-gradient-to-tr from-[#00ff00]/30 via-emerald-800/10 to-transparent' 
                  : 'bg-gradient-to-tr from-red-500/30 via-red-800/10 to-transparent'
              }`} />
              
              <div 
                className={`w-24 h-24 rounded-full border-2 overflow-hidden bg-zinc-900 relative z-10 transition-colors duration-300 ${
                  isOnline ? 'border-[#00ff00]' : 'border-red-500'
                }`}
              >
                <img 
                  src={profileImage} 
                  alt="Vasanthan K Profile Portrait" 
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserDrag: 'none', WebkitTouchCallout: 'none' }}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Status indicator pill in right bottom corners */}
              <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full bg-black border-2 flex items-center justify-center z-20 transition-colors duration-300 ${
                isOnline ? 'border-[#00ff00]' : 'border-red-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isOnline ? 'bg-[#00ff00] animate-ping' : 'bg-red-500'
                }`} />
              </div>
            </div>

            {isAdmin && (
              <div className="text-center animate-fade-in">
                <div className="flex flex-col gap-1.5 px-2.5 py-1.5 bg-[#050505] border border-[#141414] rounded text-left">
                  <span className="text-[8px] text-[#00ff00] font-mono uppercase font-black tracking-wider text-center block">
                    🛰️ PORTFOLIO WORKSPACE ACTIVE
                  </span>
                  
                  <div className="bg-[#00ff00]/5 border border-[#00ff00]/20 p-1.5 rounded flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse shrink-0" />
                    <span className="text-[7.5px] text-[#00ff00] font-mono uppercase font-extrabold leading-none">
                      CLOUD SYNC CONNECTED (GLOBAL)
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <h2 className="text-base font-black tracking-widest text-white uppercase font-sans">
                VASANTHAN K
              </h2>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={toggleOnlineStatus}
                  title="Click to toggle Online/Offline status globally"
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 mt-1.5 rounded bg-zinc-900 border border-[#1a1a1a] text-[9.5px] font-mono cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                    isOnline ? 'text-[#00ff00] hover:bg-zinc-800' : 'text-red-500 hover:bg-zinc-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#00ff00] animate-pulse' : 'bg-red-500'}`} />
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </button>
              ) : (
                <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 mt-1.5 rounded bg-zinc-900 border border-[#1a1a1a] text-[9.5px] font-mono ${
                  isOnline ? 'text-[#00ff00]' : 'text-red-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#00ff00] animate-pulse' : 'bg-red-500'}`} />
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </div>
              )}
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
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => { setAdminSettingsTab('software'); setIsAdminSettingsOpen(true); }}
                    className="p-0.5 rounded text-zinc-500 hover:text-[#00ff00] transition-colors cursor-pointer"
                    title="Customize Software Deck"
                  >
                    <Settings size={11} />
                  </button>
                )}
                <span className="text-[9px] text-[#00ff00]/80">BY CATEGORY</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {softwareCategories.map((category) => (
                <div key={category.name} className="flex flex-col gap-1.5">
                  {/* Category Header with Lucide categorized icon */}
                  <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-mono font-bold tracking-wider uppercase bg-[#070707] border border-[#141414] px-2 py-1 rounded">
                    {renderCategoryIcon(category.iconName)}
                    <span>{category.name}</span>
                  </div>

                  {/* Category items list */}
                  <div className="flex flex-col gap-1.5 pl-1.5">
                    {category.itemNames.map((itemName) => {
                      const soft = softwareList.find(s => s.name === itemName);
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
              href="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=vasanthankasvk@gmail.com"
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

            {isAdmin && (
              <button 
                onClick={handleResetWorks}
                className="w-full py-1.5 bg-zinc-950 border border-[#111] text-zinc-500 hover:text-white transition-colors rounded text-[9.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={10} /> RESET STATE
              </button>
            )}

            {isAdmin && (
              <button 
                onClick={handleAdminLogout}
                className="w-full py-1.5 bg-[#00ff00]/10 border border-[#00ff00]/25 hover:bg-[#00ff00] hover:text-black hover:border-transparent text-[#00ff00] transition-colors rounded text-[9.5px] font-mono flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock size={10} /> LOCK CONSOLE
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
              {isAdmin && (
                <button 
                  onClick={handleResetWorks}
                  className="px-4 py-2 bg-zinc-900 border border-[#1a1a1a] text-[#00ff00] text-xs font-mono rounded hover:border-[#333] cursor-pointer"
                >
                  RESET GRID FILTERS
                </button>
              )}
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
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 opacity-40 group-hover:opacity-60 select-none pointer-events-none"
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserDrag: 'none', WebkitTouchCallout: 'none' }}
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
                          <div className="flex gap-1.5 pointer-events-auto">
                            <button
                              onClick={(e) => handleOpenEditModal(item, e)}
                              className="p-1 rounded bg-black/80 border border-[#1a1a1a] text-zinc-500 hover:text-[#00ff00] transition-colors cursor-pointer"
                              title="Edit design item"
                            >
                              <Edit size={10} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteWorkItem(item.id, e)}
                              className="p-1 rounded bg-black/80 border border-[#1a1a1a] text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete design item"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
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
              <span className="flex-1">EXPERT SERVICES</span>
              {isAdmin && (
                <button
                  onClick={() => { setAdminSettingsTab('skills'); setIsAdminSettingsOpen(true); }}
                  className="p-0.5 rounded text-zinc-500 hover:text-[#00ff00] transition-colors cursor-pointer"
                  title="Customize Expert Services"
                >
                  <Settings size={11} />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-5">
              {skillCategories.map((category) => (
                <div key={category.name} className="flex flex-col gap-1.5">
                  {/* Category Header with Dynamic Lucide Icon */}
                  <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-mono font-bold tracking-wider uppercase bg-[#070707] border border-[#141414] px-2 py-1 rounded">
                    {renderCategoryIcon(category.iconName)}
                    <span>{category.name}</span>
                  </div>

                  {/* Skills lists inside category */}
                  <div className="flex flex-col gap-2 pl-1.5">
                    {category.itemNames.map((itemName) => {
                      const skill = skillItems.find(s => s.name === itemName);
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
                <div className="text-sm font-mono font-bold tracking-widest text-[#00ff00] mt-1 flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-ping" />
                  <span>{currentTime || '10:33:02 UTC'}</span>
                </div>
                
                {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAdminAuthOpen(true)}
                  className="w-full mt-2 py-1.5 border font-extrabold font-mono text-[9px] tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase bg-emerald-950/60 border-emerald-800 text-[#00ff00] hover:bg-[#00ff00] hover:text-black"
                >
                  <Database size={10} />
                  ✓ ADMIN ACTIVE — SUPABASE CONNECTED
                </button>
                )}
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

          {/* ═══ BUILD & DEPLOYMENT SESSION (Admin Only) ═══ */}
          {isAdmin && (
          <div className="flex flex-col gap-3">
            <div className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] font-mono border-b border-[#1a1a1a] pb-1.5">
              BUILD & DEPLOYMENT SESSION
            </div>

            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-md flex flex-col gap-3">
              {/* GitHub Repository Link */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github size={14} className="text-[#00ff00]" />
                  <div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">REPOSITORY</div>
                    <div className="text-[11px] font-bold font-mono text-white tracking-tight">prt-VK</div>
                  </div>
                </div>
                <a
                  href="https://github.com/Vasanthank994499/prt-VK"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[8px] text-[#00ff00] hover:underline font-mono flex items-center gap-1"
                >
                  <ExternalLink size={9} />
                  VIEW ON GITHUB
                </a>
              </div>

              <div className="border-t border-[#161616] pt-2.5 flex flex-col gap-2">
                {/* Branch Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">BRANCH</span>
                  <span className="text-[9px] font-mono text-white font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                    main
                  </span>
                </div>

                {/* Build Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">BUILD STATUS</span>
                  <span className="text-[9px] font-mono text-[#00ff00] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00]" />
                    PASSING
                  </span>
                </div>

                {/* Deploy Target */}
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">DEPLOY TARGET</span>
                  <span className="text-[9px] font-mono text-white font-bold">VERCEL + GH-PAGES</span>
                </div>

                {/* Framework */}
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">FRAMEWORK</span>
                  <span className="text-[9px] font-mono text-white font-bold">VITE + REACT 19</span>
                </div>
              </div>

              <div className="border-t border-[#161616] pt-2.5 flex flex-col gap-1.5">
                <a
                  href="https://github.com/Vasanthank994499/prt-VK/actions"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1.5 bg-zinc-950 border border-zinc-800 hover:border-[#00ff00] hover:bg-[#00ff00]/10 text-zinc-400 hover:text-[#00ff00] font-extrabold font-mono text-[8px] tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                >
                  <Github size={10} />
                  VIEW CI/CD ACTIONS
                </a>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1.5 bg-zinc-950 border border-zinc-800 hover:border-[#00ff00] hover:bg-[#00ff00]/10 text-zinc-400 hover:text-[#00ff00] font-extrabold font-mono text-[8px] tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                >
                  <ExternalLink size={10} />
                  VERCEL DASHBOARD
                </a>
              </div>
            </div>

            {/* Supabase Connection Status Card */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-md flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database size={14} className={isConfiguredState ? 'text-[#00ff00]' : 'text-zinc-600'} />
                  <div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">DATABASE</div>
                    <div className="text-[11px] font-bold font-mono text-white tracking-tight">Supabase</div>
                  </div>
                </div>
                <span className={`text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${isConfiguredState ? 'text-[#00ff00]' : 'text-zinc-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isConfiguredState ? 'bg-[#00ff00] animate-pulse' : 'bg-zinc-600'}`} />
                  {isConfiguredState ? 'CONNECTED' : 'NOT CONNECTED'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminAuthOpen(true)}
                className={`w-full py-1.5 border font-extrabold font-mono text-[8px] tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase ${
                  isConfiguredState
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-[#00ff00] hover:bg-[#00ff00] hover:text-black'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-[#00ff00] hover:text-black hover:border-transparent'
                }`}
              >
                <Key size={9} />
                {isConfiguredState ? (isAdmin ? '✓ ADMIN VERIFIED' : 'OPEN ADMIN LOGIN') : 'CONNECT SUPABASE'}
              </button>
            </div>
          </div>
          )}

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
                  href="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=vasanthankasvk@gmail.com"
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

      {/* ═══════════════════════ BUILD & DEPLOYMENT SESSION — FULL WIDTH (Admin Only) ═══════════════════════ */}
      {isAdmin && (
      <section id="build-deployment-section" className="bg-[#020202] border-t border-[#1a1a1a] px-4 sm:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[#1a1a1a] mb-6">
            <div>
              <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.25em] mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                <span>PRODUCTION PIPELINE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-white">
                BUILD & DEPLOYMENT
              </h2>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono text-left md:text-right">
              <div>AUTO-DEPLOY: ON PUSH TO MAIN</div>
              <div className="text-[#00ff00]">CI/CD: GITHUB ACTIONS + VERCEL</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GitHub Repository Card */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#111] border border-[#222] flex items-center justify-center">
                  <Github size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">SOURCE CODE</div>
                  <div className="text-sm font-bold font-mono text-white">GitHub Repository</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-[#161616] pt-3">
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">REPO</span>
                  <span className="text-[9px] text-white font-mono font-bold">prt-VK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">BRANCH</span>
                  <span className="text-[9px] text-[#00ff00] font-mono font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#00ff00]" />
                    main
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">OWNER</span>
                  <span className="text-[9px] text-white font-mono font-bold">Vasanthank994499</span>
                </div>
              </div>
              <a
                href="https://github.com/Vasanthank994499/prt-VK"
                target="_blank"
                rel="noreferrer"
                className="mt-auto w-full py-2 bg-zinc-950 border border-zinc-800 hover:border-[#00ff00] hover:bg-[#00ff00]/10 text-zinc-400 hover:text-[#00ff00] font-bold font-mono text-[9px] tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <ExternalLink size={10} />
                OPEN REPOSITORY
              </a>
            </div>

            {/* Deployment Status Card */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0d1f0d] border border-[#1a3a1a] flex items-center justify-center">
                  <Sparkles size={18} className="text-[#00ff00]" />
                </div>
                <div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">LIVE DEPLOYMENT</div>
                  <div className="text-sm font-bold font-mono text-white">Production Build</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-[#161616] pt-3">
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">STATUS</span>
                  <span className="text-[9px] text-[#00ff00] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                    DEPLOYED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">FRAMEWORK</span>
                  <span className="text-[9px] text-white font-mono font-bold">Vite + React 19</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">NODE</span>
                  <span className="text-[9px] text-white font-mono font-bold">≥ 20.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">BUILD</span>
                  <span className="text-[9px] text-[#00ff00] font-mono font-bold">✓ PASSING</span>
                </div>
              </div>
              <a
                href="https://github.com/Vasanthank994499/prt-VK/actions"
                target="_blank"
                rel="noreferrer"
                className="mt-auto w-full py-2 bg-zinc-950 border border-zinc-800 hover:border-[#00ff00] hover:bg-[#00ff00]/10 text-zinc-400 hover:text-[#00ff00] font-bold font-mono text-[9px] tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
              >
                <ExternalLink size={10} />
                VIEW CI/CD PIPELINE
              </a>
            </div>

            {/* Supabase Connection Card */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-md p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                  isConfiguredState ? 'bg-[#0d1f0d] border-[#1a3a1a]' : 'bg-[#111] border-[#222]'
                }`}>
                  <Database size={18} className={isConfiguredState ? 'text-[#00ff00]' : 'text-zinc-500'} />
                </div>
                <div>
                  <div className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">DATABASE</div>
                  <div className="text-sm font-bold font-mono text-white">Supabase Backend</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 border-t border-[#161616] pt-3">
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">CONNECTION</span>
                  <span className={`text-[9px] font-mono font-bold flex items-center gap-1 ${
                    isConfiguredState ? 'text-[#00ff00]' : 'text-red-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isConfiguredState ? 'bg-[#00ff00] animate-pulse' : 'bg-red-500'
                    }`} />
                    {isConfiguredState ? 'ACTIVE' : 'DISCONNECTED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">ADMIN</span>
                  <span className={`text-[9px] font-mono font-bold ${
                    isAdmin ? 'text-[#00ff00]' : 'text-zinc-500'
                  }`}>
                    {isAdmin ? '✓ AUTHENTICATED' : 'NOT LOGGED IN'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[8px] text-zinc-500 font-mono">REALTIME</span>
                  <span className={`text-[9px] font-mono font-bold ${
                    isConfiguredState ? 'text-[#00ff00]' : 'text-zinc-500'
                  }`}>
                    {isConfiguredState ? 'LISTENING' : 'INACTIVE'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminAuthOpen(true)}
                className={`mt-auto w-full py-2 border font-bold font-mono text-[9px] tracking-wider rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase ${
                  isAdmin
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-[#00ff00] hover:bg-[#00ff00] hover:text-black'
                    : isConfiguredState
                    ? 'bg-amber-950/30 border-amber-900/50 text-amber-500 hover:bg-[#00ff00] hover:text-black hover:border-transparent'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-[#00ff00] hover:text-black hover:border-transparent'
                }`}
              >
                <Key size={10} />
                {isAdmin ? '✓ SUPABASE CONNECTED & ADMIN ACTIVE' : isConfiguredState ? 'LOGIN AS ADMIN' : 'CONNECT SUPABASE & LOGIN'}
              </button>
            </div>
          </div>

          {/* Bottom Deploy Bar */}
          <div className="mt-6 bg-[#0a0a0a] border border-[#1a1a1a] rounded-md px-5 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
                <span className="text-[#00ff00] font-bold">PRODUCTION LIVE</span>
              </span>
              <span>LAST COMMIT: LATEST</span>
              <span>DEPLOY: AUTO ON PUSH</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/Vasanthank994499/prt-VK"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-zinc-950 border border-zinc-800 hover:border-[#00ff00] text-zinc-400 hover:text-[#00ff00] font-bold font-mono text-[8px] rounded transition-all cursor-pointer uppercase flex items-center gap-1"
              >
                <Github size={9} />
                GITHUB
              </a>
              <button
                type="button"
                onClick={() => setIsAdminAuthOpen(true)}
                className="px-3 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00] text-[#00ff00] hover:text-black font-bold font-mono text-[8px] rounded transition-all cursor-pointer uppercase flex items-center gap-1"
              >
                <Database size={9} />
                {isConfiguredState ? (isAdmin ? 'ADMIN PANEL' : 'ADMIN LOGIN') : 'SUPABASE LOGIN'}
              </button>
            </div>
          </div>
        </div>
      </section>
      )}

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
                  <span>FPS: {activeLightboxProject.fps || '60.00'}</span>
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
                
                {(() => {
                  const youtubeId = getYoutubeId(activeLightboxProject.videoUrl || '');
                  const driveId = getGoogleDriveId(activeLightboxProject.videoUrl || '');
                  if (youtubeId) {
                    return (
                      <iframe
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&playlist=${youtubeId}&loop=1&controls=1&enablejsapi=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full min-h-[280px] sm:min-h-[400px] lg:min-h-[450px]"
                        style={{ filter: getFilterStyle() }}
                      />
                    );
                  }
                  if (driveId && !useDriveIframeFallback) {
                    return (
                      <video
                        ref={lightboxVideoRef}
                        src={`https://drive.google.com/uc?export=view&id=${driveId}`}
                        loop
                        muted={isMuted}
                        autoPlay={isPlaying}
                        controlsList="nodownload"
                        disablePictureInPicture
                        draggable={false}
                        onContextMenu={(e) => e.preventDefault()}
                        onError={() => {
                          console.warn("Direct Google Drive video stream failed, falling back to embedded iframe player.");
                          setUseDriveIframeFallback(true);
                        }}
                        className="max-h-[380px] sm:max-h-[460px] w-full object-contain transition-all duration-300 select-none"
                        style={{ 
                          filter: getFilterStyle(),
                          userSelect: 'none',
                          WebkitUserDrag: 'none',
                          WebkitTouchCallout: 'none'
                        }}
                      />
                    );
                  }
                  if (driveId && useDriveIframeFallback) {
                    return (
                      <iframe
                        src={`https://drive.google.com/file/d/${driveId}/preview`}
                        title="Google Drive video player"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="w-full h-full min-h-[280px] sm:min-h-[400px] lg:min-h-[450px]"
                        style={{ filter: getFilterStyle() }}
                      />
                    );
                  }
                  return (
                    <video
                      ref={lightboxVideoRef}
                      src={activeLightboxProject.videoUrl}
                      loop
                      muted={isMuted}
                      autoPlay={isPlaying}
                      controlsList="nodownload"
                      disablePictureInPicture
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      className="max-h-[380px] sm:max-h-[460px] w-full object-contain transition-all duration-300 select-none"
                      style={{ 
                        filter: getFilterStyle(),
                        userSelect: 'none',
                        WebkitUserDrag: 'none',
                        WebkitTouchCallout: 'none'
                      }}
                    />
                  );
                })()}

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
                  
                  <div className="flex items-center gap-1.5 mt-1 bg-zinc-950 border border-[#161616] p-2 rounded text-[10px] text-zinc-400 font-mono">
                    <Info size={12} className="text-[#00ff00]" />
                    <span>
                      Category: <span className="text-white font-semibold">{activeLightboxProject.category}</span>
                    </span>
                  </div>

                  {useDriveIframeFallback && (
                    <div className="flex items-start gap-1.5 mt-2 bg-amber-950/20 border border-amber-900/30 p-2 rounded text-[9px] text-amber-500 font-mono leading-normal">
                      <Info size={12} className="shrink-0 mt-0.5 animate-pulse text-amber-400" />
                      <span>
                        Note: Direct streaming failed. Using Google Drive player fallback. Programmatic Play/Pause controls are disabled; please use player controls inside the video.
                      </span>
                    </div>
                  )}
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
          className="fixed inset-0 z-50 bg-black/90 flex items-start justify-center pt-16 sm:pt-20 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={() => setIsUploadOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#0a0a0a] border border-[#222] rounded-md shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto mb-8"
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
                    className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono cursor-pointer w-full"
                  >
                    <option value="Social Motion Design">Social Motion Design (9:16)</option>
                    <option value="Commercial Production">Commercial Production (16:9)</option>
                    <option value="Studio Motion">Studio Motion</option>
                    <option value="Professional Color Grading">Professional Color Grading</option>
                    <option value="Advanced Visual Effects">Advanced Visual Effects</option>
                    <option value="Creative Graphic Design">Creative Graphic Design</option>
                    <option value="custom">Other / Custom Category...</option>
                  </select>
                  {newCategory === 'custom' && (
                    <input
                      type="text"
                      required
                      placeholder="ENTER CUSTOM SERVICE CATEGORY"
                      value={newCustomCategory}
                      onChange={(e) => setNewCustomCategory(e.target.value)}
                      className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono mt-1.5 uppercase tracking-wider w-full"
                    />
                  )}
                </div>

              </div>

              {/* Real-time Connection State Indicator in Header */}
              <div className="px-3 py-2 bg-zinc-950 border border-zinc-900 rounded flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono uppercase font-black text-zinc-500">DATABASE SYNC TARGET:</span>
                  {isAdmin ? (
                    <span className="text-[8.5px] font-mono bg-emerald-950/60 border border-emerald-800 text-[#00ff00] px-1.5 py-0.5 rounded font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-ping" /> CLOUD DATABASE ACTIVE (GLOBAL)
                    </span>
                  ) : (
                    <span className="text-[8.5px] font-mono bg-amber-950/60 border border-amber-900 text-amber-500 px-1.5 py-0.5 rounded font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> LOCAL CACHE ONLY (PASSCODE PREVIEW)
                    </span>
                  )}
                </div>
                 {!isAdmin && (
                  <div className="flex flex-col gap-1.5 pt-1 border-t border-zinc-900 mt-1">
                    <p className="text-[8px] text-zinc-400 leading-snug">
                      Notice: Your changes will only reside on your computer. To save to the live cloud database so that **everyone globally** sees your uploaded item, you must authenticate with your Admin Password.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUploadOpen(false);
                        setIsAdminAuthOpen(true);
                      }}
                      className="py-1 bg-white hover:bg-zinc-200 text-black font-extrabold text-[8.5px] font-mono rounded transition-colors uppercase leading-none cursor-pointer"
                    >
                      Authenticate Admin Channel
                    </button>
                  </div>
                )}
              </div>

              {/* VIDEO RESOURCE CONFIGURATION */}
              <div className="border border-[#1a1a1a] bg-[#050505] p-3 rounded flex flex-col gap-3">
                <span className="text-[9px] font-mono font-bold text-[#00ff00] uppercase tracking-wider">
                  🎥 VIDEO CHANNEL SOURCE
                </span>
                
                <div className="flex flex-col gap-1.5">
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded p-4 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
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
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {newVideoFile ? (
                      <div className="animate-fade-in">
                        <div className="w-5 h-5 rounded-full bg-[#00ff00]/20 text-[#00ff00] flex items-center justify-center mx-auto mb-1 text-[9px] font-bold">✓</div>
                        <div className="text-[10px] font-mono font-bold text-white max-w-[240px] truncate mx-auto">
                          VIDEO file: {newVideoFile.name}
                        </div>
                        <div className="text-[8px] text-zinc-500 font-mono mt-0.5">
                          ({(newVideoFile.size / (1024 * 1024)).toFixed(2)} MB • Tap to replace)
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-zinc-500 text-sm mb-1">📁</div>
                        <div className="text-[10px] text-zinc-400">
                          Drop Video here, or <span className="text-[#00ff00] underline font-medium">browse local files</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {videoSizeWarning && (
                    <div className="text-[8px] text-amber-500 font-mono leading-normal mt-1 border border-amber-900/20 bg-amber-950/10 p-1.5 rounded">
                      {videoSizeWarning}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                    <span className="uppercase tracking-widest">Or Paste Direct Video URL (Any HTTPS MP4 URL)</span>
                  </div>
                  <input
                    type="text"
                    placeholder="https://assets.mixkit.co/videos/preview/..."
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    disabled={!!newVideoFile}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono placeholder:text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* THUMBNAIL RESOURCE CONFIGURATION */}
              <div className="border border-[#1a1a1a] bg-[#050505] p-3 rounded flex flex-col gap-3">
                <span className="text-[9px] font-mono font-bold text-[#00ff00] uppercase tracking-wider">
                  🖼️ THUMBNAIL STATUS & COVER SOURCE
                </span>

                <div className="flex flex-col gap-1.5">
                  <div 
                    onClick={() => thumbnailInputRef.current?.click()}
                    className={`border-2 border-dashed rounded p-4 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      newThumbnailFile 
                        ? 'border-emerald-700 bg-zinc-900/40' 
                        : 'border-[#1a1a1a] bg-black hover:border-zinc-700'
                    }`}
                  >
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          processThumbnailFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    
                    {newThumbnailFile ? (
                      <div className="animate-fade-in">
                        <div className="w-5 h-5 rounded-full bg-[#00ff00]/20 text-[#00ff00] flex items-center justify-center mx-auto mb-1 text-[9px] font-bold">✓</div>
                        <div className="text-[10px] font-mono font-bold text-white max-w-[240px] truncate mx-auto">
                          THUMBNAIL file: {newThumbnailFile.name}
                        </div>
                        <div className="text-[8px] text-zinc-500 font-mono mt-0.5">
                          ({(newThumbnailFile.size / 1024).toFixed(0)} KB • Tap to replace)
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-zinc-500 text-sm mb-1">🖼️</div>
                        <div className="text-[10px] text-zinc-400">
                          Upload Covers / Custom Thumbnail, or <span className="text-[#00ff00] underline font-medium">browse local images</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {thumbnailSizeWarning && (
                    <div className="text-[8px] text-amber-500 font-mono leading-normal mt-1 border border-amber-900/20 bg-amber-950/10 p-1.5 rounded">
                      {thumbnailSizeWarning}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[9px] font-mono text-zinc-400">
                    <span className="uppercase tracking-widest">Or Paste Direct Thumbnail Image URL</span>
                  </div>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-1492691527719-..."
                    value={newThumbnailUrl}
                    onChange={(e) => setNewThumbnailUrl(e.target.value)}
                    disabled={!!newThumbnailFile}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono placeholder:text-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* DURATION & FPS CONFIGURATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0:30, 1:45"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    Frame Rate (FPS)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 60 FPS, 24 FPS"
                    value={newFps}
                    onChange={(e) => setNewFps(e.target.value)}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* SOFTWARE USED SELECTION */}
              <div className="border border-[#1a1a1a] bg-[#050505] p-3 rounded flex flex-col gap-3">
                <span className="text-[9px] font-mono font-bold text-[#00ff00] uppercase tracking-wider">
                  🛠️ SOFTWARE USED TAGS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut', 'Photoshop', 'Canva'].map((soft) => {
                    const isChecked = newSoftwareUsed.includes(soft);
                    return (
                      <label key={soft} className="flex items-center gap-2 text-xs text-zinc-300 font-mono cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewSoftwareUsed(newSoftwareUsed.filter(s => s !== soft));
                            } else {
                              setNewSoftwareUsed([...newSoftwareUsed, soft]);
                            }
                          }}
                          className="accent-[#00ff00] border-zinc-800 bg-black rounded"
                        />
                        {soft}
                      </label>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-1.5 mt-1 border-t border-zinc-900 pt-2.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Other / Custom Software (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blender, Cinema 4D, Final Cut Pro"
                    value={newCustomSoftware}
                    onChange={(e) => setNewCustomSoftware(e.target.value)}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono"
                  />
                </div>
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

      {/* --- EDIT WORKSTATION MODAL --- */}
      {editingProject && (
        <div 
          id="edit-dialog-overlay" 
          className="fixed inset-0 z-50 bg-black/90 flex items-start justify-center pt-16 sm:pt-20 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={() => setEditingProject(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#0a0a0a] border border-[#222] rounded-md shadow-2xl animate-scale-up max-h-[85vh] overflow-y-auto mb-8"
            onClick={(e) => e.stopPropagation()} 
          >
            
            <div className="bg-[#111] px-5 py-4 border-b border-[#222] flex justify-between items-center">
              <div className="flex items-center gap-2 text-white">
                <Sliders size={16} className="text-[#00ff00]" />
                <span className="font-extrabold tracking-tight text-xs sm:text-sm font-mono uppercase">
                  STUDIO DESIGN ADAPTER (EDIT WORKSTATION)
                </span>
              </div>
              <button 
                onClick={() => setEditingProject(null)}
                className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateWorkItem} className="p-5 flex flex-col gap-4">
              
              <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.2em] leading-normal">
                | Editing ID: {editingProject.id}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KINETIC COMMERCIAL SHOWCASE"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] transition-colors uppercase font-mono tracking-wider"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    Card Grid Layout *
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as 'vertical' | 'landscape' | 'normal')}
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
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono cursor-pointer w-full"
                  >
                    <option value="Social Motion Design">Social Motion Design (9:16)</option>
                    <option value="Commercial Production">Commercial Production (16:9)</option>
                    <option value="Studio Motion">Studio Motion</option>
                    <option value="Professional Color Grading">Professional Color Grading</option>
                    <option value="Advanced Visual Effects">Advanced Visual Effects</option>
                    <option value="Creative Graphic Design">Creative Graphic Design</option>
                    <option value="custom">Other / Custom Category...</option>
                  </select>
                  {editCategory === 'custom' && (
                    <input
                      type="text"
                      required
                      placeholder="ENTER CUSTOM SERVICE CATEGORY"
                      value={editCustomCategory}
                      onChange={(e) => setEditCustomCategory(e.target.value)}
                      className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono mt-1.5 uppercase tracking-wider w-full"
                    />
                  )}
                </div>

              </div>

              {/* VIDEO RESOURCE CONFIGURATION */}
              <div className="border border-[#1a1a1a] bg-[#050505] p-3 rounded flex flex-col gap-3">
                <span className="text-[9px] font-mono font-bold text-[#00ff00] uppercase tracking-wider">
                  🎥 VIDEO CHANNEL SOURCE
                </span>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-500 font-mono">Upload New Video file (Replace):</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setEditVideoFile(e.target.files[0]);
                      }
                    }}
                    className="text-xs text-zinc-400 bg-black border border-[#1a1a1a] rounded p-2 w-full file:bg-zinc-900 file:border-0 file:text-[#00ff00] file:text-[10px] file:font-mono file:rounded file:px-2 file:py-0.5 file:cursor-pointer"
                  />
                  {editVideoFile && (
                    <div className="text-[8px] text-[#00ff00] font-mono">
                      ✓ Selected new file: {editVideoFile.name} ({(editVideoFile.size / (1024*1024)).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Or Edit Direct Video URL</span>
                  <input
                    type="text"
                    placeholder="https://assets.mixkit.co/videos/preview/..."
                    value={editVideoUrl}
                    onChange={(e) => {
                      setEditVideoUrl(e.target.value);
                      if (e.target.value) setEditVideoFile(null);
                    }}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* THUMBNAIL RESOURCE CONFIGURATION */}
              <div className="border border-[#1a1a1a] bg-[#050505] p-3 rounded flex flex-col gap-3">
                <span className="text-[9px] font-mono font-bold text-[#00ff00] uppercase tracking-wider">
                  🖼️ THUMBNAIL STATUS & COVER SOURCE
                </span>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-zinc-500 font-mono">Upload New Cover file (Replace):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setEditThumbnailFile(e.target.files[0]);
                      }
                    }}
                    className="text-xs text-zinc-400 bg-black border border-[#1a1a1a] rounded p-2 w-full file:bg-zinc-900 file:border-0 file:text-[#00ff00] file:text-[10px] file:font-mono file:rounded file:px-2 file:py-0.5 file:cursor-pointer"
                  />
                  {editThumbnailFile && (
                    <div className="text-[8px] text-[#00ff00] font-mono">
                      ✓ Selected new cover: {editThumbnailFile.name} ({(editThumbnailFile.size / 1024).toFixed(0)} KB)
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Or Edit Direct Thumbnail URL</span>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-1492691527719-..."
                    value={editThumbnailUrl}
                    onChange={(e) => {
                      setEditThumbnailUrl(e.target.value);
                      if (e.target.value) setEditThumbnailFile(null);
                    }}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* DURATION & FPS CONFIGURATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0:30, 1:45"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                    Frame Rate (FPS)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 60 FPS, 24 FPS"
                    value={editFps}
                    onChange={(e) => setEditFps(e.target.value)}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono placeholder:text-zinc-700"
                  />
                </div>
              </div>

              {/* SOFTWARE USED SELECTION */}
              <div className="border border-[#1a1a1a] bg-[#050505] p-3 rounded flex flex-col gap-3">
                <span className="text-[9px] font-mono font-bold text-[#00ff00] uppercase tracking-wider">
                  🛠️ SOFTWARE USED TAGS
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut', 'Photoshop', 'Canva'].map((soft) => {
                    const isChecked = editSoftwareUsed.includes(soft);
                    return (
                      <label key={soft} className="flex items-center gap-2 text-xs text-zinc-300 font-mono cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setEditSoftwareUsed(editSoftwareUsed.filter(s => s !== soft));
                            } else {
                              setEditSoftwareUsed([...editSoftwareUsed, soft]);
                            }
                          }}
                          className="accent-[#00ff00] border-zinc-800 bg-black rounded"
                        />
                        {soft}
                      </label>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-1.5 mt-1 border-t border-zinc-900 pt-2.5">
                  <label className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                    Other / Custom Software (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blender, Cinema 4D, Final Cut Pro"
                    value={editCustomSoftware}
                    onChange={(e) => setEditCustomSoftware(e.target.value)}
                    className="bg-black border border-[#1a1a1a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Project Description Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe key editing cuts, filters, and color transitions..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="bg-black border border-[#1a1a1a] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00ff00] font-sans placeholder:text-zinc-700"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-[#111]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-transparent text-zinc-400 hover:text-white text-xs font-mono rounded cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black font-extrabold text-xs font-mono rounded transition-transform active:scale-95 cursor-pointer"
                >
                  SAVE CHANGES
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- ADMIN SETTINGS MODAL: Expert Services & Software Deck Customization --- */}
      {isAdminSettingsOpen && isAdmin && (
        <div
          id="admin-settings-overlay"
          className="fixed inset-0 z-[60] bg-black/95 flex items-start justify-center pt-10 sm:pt-14 p-3 sm:p-4 backdrop-blur-md overflow-y-auto animate-fade-in"
          onClick={() => setIsAdminSettingsOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#0a0a0a] border border-[#222] rounded-md shadow-2xl animate-scale-up max-h-[88vh] overflow-y-auto mb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#111] px-5 py-4 border-b border-[#222] flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-2 text-white">
                <Settings size={14} className="text-[#00ff00]" />
                <span className="font-extrabold tracking-tight text-xs sm:text-sm font-mono uppercase">
                  ADMIN CUSTOMIZATION PANEL
                </span>
              </div>
              <button
                onClick={() => setIsAdminSettingsOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-[#222] bg-[#080808] sticky top-[52px] z-10">
              {([
                { key: 'skills' as const, label: 'SKILLS' },
                { key: 'categories' as const, label: 'CATEGORIES' },
                { key: 'software' as const, label: 'SOFTWARE DECK' }
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setAdminSettingsTab(tab.key)}
                  className={`flex-1 px-3 py-2.5 text-[9px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                    adminSettingsTab === tab.key
                      ? 'text-[#00ff00] border-b-2 border-[#00ff00] bg-[#0a0a0a]'
                      : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5">

              {/* ──── TAB 1: SKILLS ──── */}
              {adminSettingsTab === 'skills' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.2em]">
                    | Manage expert service skills — adjust percentages, names, and descriptions.
                  </div>

                  {skillItems.map((skill, idx) => (
                    <div key={idx} className="bg-[#080808] border border-[#1a1a1a] rounded p-3.5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 flex flex-col gap-2">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => handleUpdateSkill(idx, 'name', e.target.value)}
                            className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono uppercase tracking-wider w-full"
                            placeholder="Skill Name"
                          />
                          <input
                            type="text"
                            value={skill.subSkills}
                            onChange={(e) => handleUpdateSkill(idx, 'subSkills', e.target.value)}
                            className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-[10px] text-zinc-300 focus:outline-none focus:border-[#00ff00] font-mono w-full"
                            placeholder="Sub-skills description"
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteSkill(idx)}
                          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                          title="Remove skill"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Percentage Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider w-20 shrink-0">LEVEL</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={skill.percentage}
                          onChange={(e) => handleUpdateSkill(idx, 'percentage', parseInt(e.target.value))}
                          className="flex-1 h-1.5 bg-[#111] rounded-full appearance-none cursor-pointer accent-[#00ff00]"
                          style={{
                            background: `linear-gradient(to right, #00ff00 0%, #00ff00 ${skill.percentage}%, #111 ${skill.percentage}%, #111 100%)`
                          }}
                        />
                        <span className="text-sm font-mono font-extrabold text-[#00ff00] w-12 text-right">{skill.percentage}%</span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddSkill}
                    className="w-full py-2.5 border border-dashed border-[#333] rounded text-[10px] font-mono text-zinc-400 hover:text-[#00ff00] hover:border-[#00ff00]/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-widest"
                  >
                    <Plus size={12} /> ADD NEW SKILL
                  </button>
                </div>
              )}

              {/* ──── TAB 2: SKILL CATEGORIES ──── */}
              {adminSettingsTab === 'categories' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.2em]">
                    | Organize skills into categories — assign icons and group skills together.
                  </div>

                  {skillCategories.map((cat, idx) => (
                    <div key={idx} className="bg-[#080808] border border-[#1a1a1a] rounded p-3.5 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) => handleUpdateSkillCategory(idx, 'name', e.target.value)}
                            className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono uppercase tracking-wider flex-1"
                            placeholder="Category Name"
                          />
                          <select
                            value={cat.iconName}
                            onChange={(e) => handleUpdateSkillCategory(idx, 'iconName', e.target.value)}
                            className="bg-black border border-[#1a1a1a] rounded px-2 py-1.5 text-[10px] text-zinc-300 focus:outline-none focus:border-[#00ff00] font-mono uppercase cursor-pointer"
                          >
                            {ICON_OPTIONS.map(ic => (
                              <option key={ic} value={ic}>{ic.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleDeleteSkillCategory(idx)}
                          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                          title="Remove category"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Skill assignment checkboxes */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">ASSIGNED SKILLS:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {skillItems.map(skill => {
                            const isAssigned = cat.itemNames.includes(skill.name);
                            return (
                              <label
                                key={skill.name}
                                className={`flex items-center gap-1 px-2 py-1 rounded border text-[9px] font-mono cursor-pointer transition-colors ${
                                  isAssigned
                                    ? 'border-[#00ff00]/40 bg-[#00ff00]/5 text-[#00ff00]'
                                    : 'border-[#1a1a1a] text-zinc-500 hover:border-zinc-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isAssigned}
                                  onChange={() => {
                                    const newItems = isAssigned
                                      ? cat.itemNames.filter(n => n !== skill.name)
                                      : [...cat.itemNames, skill.name];
                                    handleUpdateSkillCategory(idx, 'itemNames', newItems);
                                  }}
                                  className="sr-only"
                                />
                                <span className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center shrink-0 ${
                                  isAssigned ? 'border-[#00ff00] bg-[#00ff00]' : 'border-zinc-600'
                                }`}>
                                  {isAssigned && <span className="text-black text-[7px] font-bold">✓</span>}
                                </span>
                                {skill.name}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddSkillCategory}
                    className="w-full py-2.5 border border-dashed border-[#333] rounded text-[10px] font-mono text-zinc-400 hover:text-[#00ff00] hover:border-[#00ff00]/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-widest"
                  >
                    <Plus size={12} /> ADD NEW CATEGORY
                  </button>
                </div>
              )}

              {/* ──── TAB 3: SOFTWARE DECK ──── */}
              {adminSettingsTab === 'software' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="text-[10px] text-[#00ff00] font-mono uppercase tracking-[0.2em]">
                    | Manage software tools — add, remove, and configure proficiency levels.
                  </div>

                  {/* Software Items */}
                  <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest border-b border-[#1a1a1a] pb-1">SOFTWARE ITEMS</div>
                  {softwareList.map((sw, idx) => (
                    <div key={idx} className="bg-[#080808] border border-[#1a1a1a] rounded p-3.5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={sw.name}
                            onChange={(e) => handleUpdateSoftware(idx, 'name', e.target.value)}
                            className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono"
                            placeholder="Software Name"
                          />
                          <input
                            type="text"
                            value={sw.shortcut}
                            onChange={(e) => handleUpdateSoftware(idx, 'shortcut', e.target.value)}
                            className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-[10px] text-zinc-300 focus:outline-none focus:border-[#00ff00] font-mono"
                            placeholder="Keyboard Shortcut"
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteSoftware(idx)}
                          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                          title="Remove software"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={sw.description}
                        onChange={(e) => handleUpdateSoftware(idx, 'description', e.target.value)}
                        className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-[10px] text-zinc-300 focus:outline-none focus:border-[#00ff00] font-mono w-full"
                        placeholder="Description"
                      />

                      {/* Proficiency Slider */}
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider w-20 shrink-0">PROFICIENCY</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={sw.proficiency}
                          onChange={(e) => handleUpdateSoftware(idx, 'proficiency', parseInt(e.target.value))}
                          className="flex-1 h-1.5 bg-[#111] rounded-full appearance-none cursor-pointer accent-[#00ff00]"
                          style={{
                            background: `linear-gradient(to right, #00ff00 0%, #00ff00 ${sw.proficiency}%, #111 ${sw.proficiency}%, #111 100%)`
                          }}
                        />
                        <span className="text-sm font-mono font-extrabold text-[#00ff00] w-12 text-right">{sw.proficiency}%</span>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddSoftware}
                    className="w-full py-2.5 border border-dashed border-[#333] rounded text-[10px] font-mono text-zinc-400 hover:text-[#00ff00] hover:border-[#00ff00]/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-widest"
                  >
                    <Plus size={12} /> ADD NEW SOFTWARE
                  </button>

                  {/* Software Categories */}
                  <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest border-b border-[#1a1a1a] pb-1 mt-4">SOFTWARE CATEGORIES</div>
                  {softwareCategories.map((cat, idx) => (
                    <div key={idx} className="bg-[#080808] border border-[#1a1a1a] rounded p-3.5 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={cat.name}
                            onChange={(e) => handleUpdateSoftwareCategory(idx, 'name', e.target.value)}
                            className="bg-black border border-[#1a1a1a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono uppercase tracking-wider flex-1"
                            placeholder="Category Name"
                          />
                          <select
                            value={cat.iconName}
                            onChange={(e) => handleUpdateSoftwareCategory(idx, 'iconName', e.target.value)}
                            className="bg-black border border-[#1a1a1a] rounded px-2 py-1.5 text-[10px] text-zinc-300 focus:outline-none focus:border-[#00ff00] font-mono uppercase cursor-pointer"
                          >
                            {ICON_OPTIONS.map(ic => (
                              <option key={ic} value={ic}>{ic.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleDeleteSoftwareCategory(idx)}
                          className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                          title="Remove category"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Software assignment checkboxes */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">ASSIGNED SOFTWARE:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {softwareList.map(sw => {
                            const isAssigned = cat.itemNames.includes(sw.name);
                            return (
                              <label
                                key={sw.name}
                                className={`flex items-center gap-1 px-2 py-1 rounded border text-[9px] font-mono cursor-pointer transition-colors ${
                                  isAssigned
                                    ? 'border-[#00ff00]/40 bg-[#00ff00]/5 text-[#00ff00]'
                                    : 'border-[#1a1a1a] text-zinc-500 hover:border-zinc-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isAssigned}
                                  onChange={() => {
                                    const newItems = isAssigned
                                      ? cat.itemNames.filter(n => n !== sw.name)
                                      : [...cat.itemNames, sw.name];
                                    handleUpdateSoftwareCategory(idx, 'itemNames', newItems);
                                  }}
                                  className="sr-only"
                                />
                                <span className={`w-2.5 h-2.5 rounded-sm border flex items-center justify-center shrink-0 ${
                                  isAssigned ? 'border-[#00ff00] bg-[#00ff00]' : 'border-zinc-600'
                                }`}>
                                  {isAssigned && <span className="text-black text-[7px] font-bold">✓</span>}
                                </span>
                                {sw.name}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddSoftwareCategory}
                    className="w-full py-2.5 border border-dashed border-[#333] rounded text-[10px] font-mono text-zinc-400 hover:text-[#00ff00] hover:border-[#00ff00]/50 transition-colors cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-widest"
                  >
                    <Plus size={12} /> ADD NEW CATEGORY
                  </button>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[#0a0a0a] border-t border-[#222] px-5 py-3 flex justify-end">
              <button
                onClick={() => setIsAdminSettingsOpen(false)}
                className="px-5 py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black font-extrabold text-xs font-mono rounded transition-transform active:scale-95 cursor-pointer uppercase"
              >
                DONE
              </button>
            </div>
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

            {/* Unified Supabase Credentials / Login Forms */}
            <div className="p-5 flex flex-col gap-4">
              {isConfiguredState ? (
                <div className="flex flex-col gap-4">
                  {/* Status Badge: Connected */}
                  <div className="border border-green-500/20 bg-green-950/20 px-3 py-2 rounded-lg flex justify-between items-center animate-fade-in">
                    <div className="flex items-center gap-1.5 text-[#00ff00] font-mono text-[9px] font-extrabold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse"></span>
                      ✓ Connected to Supabase
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnectSupabase}
                      className="text-[7.5px] text-zinc-500 hover:text-red-400 font-mono underline uppercase cursor-pointer"
                    >
                      [Disconnect]
                    </button>
                  </div>

                  {isAdmin ? (
                    <div className="border border-green-500/20 bg-green-950/20 px-3 py-2.5 rounded-lg text-center flex flex-col gap-1 text-[#00ff00] font-mono text-[9.5px] font-extrabold uppercase tracking-widest animate-scale-up">
                      <span>✓ Authenticated successfully</span>
                      <span className="text-[7.5px] text-zinc-400 font-normal mt-0.5">Admin access is active. You can now upload and delete videos.</span>
                      <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="mt-3 w-full py-1 bg-red-950/20 border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors text-red-500 text-[8.5px] font-mono font-bold uppercase rounded cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleAdminLogin} className="flex flex-col gap-3 animate-fade-in">
                      <div className="text-[9.5px] text-zinc-400 font-mono text-center leading-normal mb-1">
                        Authenticate via Admin Password to unlock the administrative video upload panel.
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[7.5px] text-[#00ff00] font-mono uppercase tracking-[0.2em]">
                            Admin Password
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••••••"
                            value={passcodeInput}
                            onChange={(e) => {
                              setPasscodeInput(e.target.value);
                              if (authError) setAuthError('');
                            }}
                            className="bg-black border border-[#222] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono bg-zinc-950"
                          />
                        </div>
                      </div>

                      {authError && (
                        <div className="mt-1 text-red-500 font-mono text-[8px] text-center border border-red-500/10 bg-red-950/20 p-2 rounded leading-normal">
                          ⚠️ {authError}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black font-extrabold font-mono text-[9px] rounded transition-transform active:scale-98 cursor-pointer uppercase mt-1"
                      >
                        Log In to Console
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <form onSubmit={handleConnectSupabase} className="flex flex-col gap-3 animate-fade-in">
                  <div className="text-[9.5px] text-zinc-400 font-mono text-center leading-normal">
                    Enter your Supabase project API credentials below to connect the database and enable the admin password verification form.
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[7.5px] text-zinc-400 font-mono uppercase tracking-[0.2em]">
                          Supabase URL
                        </label>
                        <a
                          href="https://supabase.com/dashboard/org/kaililoekwqkdcixgqfm"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[7.5px] text-[#00ff00] hover:underline font-mono"
                        >
                          Find credentials ↗
                        </a>
                      </div>
                      <input
                        type="url"
                        required
                        placeholder="https://your-project.supabase.co"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="bg-black border border-[#222] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono bg-zinc-950"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[7.5px] text-[#00ff00] font-mono uppercase tracking-[0.2em]">
                        Supabase Anon Key
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        className="bg-black border border-[#222] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00ff00] font-mono bg-zinc-950"
                      />
                    </div>
                  </div>

                  {/* Collapsible Supabase SQL Setup Guide */}
                  <div className="border border-[#222] rounded bg-zinc-950 p-2 text-[8px] font-mono text-zinc-400">
                    <details className="cursor-pointer group">
                      <summary className="text-[8px] text-[#00ff00] font-bold uppercase tracking-wider select-none outline-none flex items-center justify-between">
                        <span>📋 VIEW SQL & STORAGE SETUP GUIDE</span>
                        <span className="text-zinc-650 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="mt-2 text-zinc-400 flex flex-col gap-2 border-t border-[#222] pt-2 max-h-[150px] overflow-y-auto pr-1 leading-normal">
                        <p>
                          To connect your own database, go to the <strong>SQL Editor</strong> in your Supabase Dashboard and run the following script:
                        </p>
                        <pre className="bg-black text-[7.5px] p-2 rounded border border-[#111] overflow-x-auto text-zinc-350 select-all font-mono whitespace-pre leading-normal">
{`CREATE TABLE IF NOT EXISTS public.works (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  type TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  software_used TEXT[],
  description TEXT,
  fps TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

-- Enable Public read access
CREATE POLICY "Allow public read access" ON public.works
  FOR SELECT USING (true);

-- Enable all operations for anonymous clients
CREATE POLICY "Allow all ops for anon" ON public.works
  FOR ALL USING (true) WITH CHECK (true);`}
                        </pre>
                        <div className="border-t border-zinc-900 pt-1.5">
                          <p className="text-amber-500 font-bold uppercase tracking-wider text-[7.5px] mb-0.5">
                            ⚠️ Storage Setup Required
                          </p>
                          <p className="text-zinc-300">
                            Create a public storage bucket named <strong className="text-white">vkportfolio</strong>. Add policies allowing public select access, and insert/update access for anonymous uploads.
                          </p>
                        </div>
                      </div>
                    </details>
                  </div>

                  {githubAuthError && (
                    <div className="mt-1 text-red-500 font-mono text-[8px] text-center border border-red-500/10 bg-red-950/20 p-2 rounded leading-normal">
                      ⚠️ {githubAuthError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isValidatingDb}
                    className={`w-full py-2 bg-[#00ff00] hover:bg-[#00dd00] text-black font-extrabold font-mono text-[9px] rounded transition-transform active:scale-98 cursor-pointer uppercase mt-1 ${isValidatingDb ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    {isValidatingDb ? 'VALIDATING CONNECTION...' : 'Connect & Validate Supabase'}
                  </button>
                </form>
              )}

              <div className="flex gap-2 pt-2 border-t border-[#1a1a1a] mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminAuthOpen(false);
                    setPasscodeInput('');
                    setAuthError('');
                    setGithubAuthError('');
                  }}
                  className="w-full py-1 bg-zinc-950 hover:bg-zinc-900 border border-[#222] text-zinc-450 font-mono text-[9px] rounded transition-colors cursor-pointer uppercase"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
