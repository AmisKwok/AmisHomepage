/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useThemeStore } from '../stores/theme-store';
import { useLanguageStore } from '../stores/language-store';
import { useConfigStore } from '../stores/config-store';
import { toast, Toaster } from 'sonner';
import LoadingScreen from '../components/effects/LoadingScreen';

interface ConfigState {
  config: any;
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  saveSuccess: boolean;
  privateKey: string;
}

interface MusicFile {
  id: string;
  name: string;
  path: string;
  order: number;
}

interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  expanded: boolean;
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  colors: { input: string; textSecondary: string };
  defaultColor?: string;
}

const ColorPicker = ({ label, value, onChange, placeholder, colors, defaultColor = '#ffffff' }: ColorPickerProps) => (
  <div>
    <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{label}</label>
    <div className="flex gap-2">
      <input
        type="color"
        value={value?.startsWith('#') ? value : defaultColor}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 rounded-lg border cursor-pointer"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`flex-1 px-3 py-2 rounded-lg border ${colors.input} text-sm`}
        placeholder={placeholder}
      />
    </div>
  </div>
);

interface BilingualInputProps {
  label: string;
  valueZh: string;
  valueEn: string;
  onChangeZh: (value: string) => void;
  onChangeEn: (value: string) => void;
  colors: { input: string; textSecondary: string };
  placeholderZh?: string;
  placeholderEn?: string;
  multiline?: boolean;
  rows?: number;
}

const BilingualInput = ({ label, valueZh, valueEn, onChangeZh, onChangeEn, colors, placeholderZh, placeholderEn, multiline = false, rows = 2 }: BilingualInputProps) => (
  <div className="space-y-3">
    <label className={`block text-sm font-medium mb-3 ${colors.textSecondary}`}>{label}</label>
    <div>
      <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>中文</label>
      {multiline ? (
        <textarea
          value={valueZh || ''}
          onChange={(e) => onChangeZh(e.target.value)}
          rows={rows}
          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
          placeholder={placeholderZh}
        />
      ) : (
        <input
          type="text"
          value={valueZh || ''}
          onChange={(e) => onChangeZh(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
          placeholder={placeholderZh}
        />
      )}
    </div>
    <div>
      <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>English</label>
      {multiline ? (
        <textarea
          value={valueEn || ''}
          onChange={(e) => onChangeEn(e.target.value)}
          rows={rows}
          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
          placeholder={placeholderEn}
        />
      ) : (
        <input
          type="text"
          value={valueEn || ''}
          onChange={(e) => onChangeEn(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
          placeholder={placeholderEn}
        />
      )}
    </div>
  </div>
);

export default function ConfigPage() {
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const { setSiteContent } = useConfigStore();
  const [state, setState] = useState<ConfigState>({
    config: null,
    loading: true,
    error: null,
    isSaving: false,
    saveSuccess: false,
    privateKey: ''
  });
  const [musicList, setMusicList] = useState<MusicFile[]>([]);
  const [activeSection, setActiveSection] = useState('github');
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  const [sections, setSections] = useState<SectionConfig[]>([
    { id: 'github', title: 'githubAuth', icon: 'fab fa-github', gradient: 'from-blue-500 to-purple-600', expanded: true },
    { id: 'components', title: 'siteComponents', icon: 'fas fa-puzzle-piece', gradient: 'from-cyan-500 to-blue-600', expanded: true },
    { id: 'site', title: 'siteInfo', icon: 'fas fa-globe', gradient: 'from-violet-500 to-purple-600', expanded: true },
    { id: 'profile', title: 'profile', icon: 'fas fa-user', gradient: 'from-pink-500 to-rose-600', expanded: true },
    { id: 'links', title: 'links', icon: 'fas fa-link', gradient: 'from-indigo-500 to-blue-600', expanded: true },
    { id: 'projects', title: 'featuredProjects', icon: 'fas fa-star', gradient: 'from-amber-500 to-orange-600', expanded: true },
    { id: 'skills', title: 'skills', icon: 'fas fa-chart-line', gradient: 'from-emerald-500 to-teal-600', expanded: true },
    { id: 'guestbook', title: 'guestbookSettings', icon: 'fas fa-comments', gradient: 'from-pink-500 to-rose-600', expanded: true },
    { id: 'friendLinks', title: 'friendLinksSettings', icon: 'fas fa-user-friends', gradient: 'from-violet-500 to-purple-600', expanded: true },
    { id: 'music', title: 'uploadMusic', icon: 'fas fa-music', gradient: 'from-pink-500 to-purple-600', expanded: true },
  ]);
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchConfig();
    const init = async () => {
      await loadPrivateKey();
    };
    init();
    fetchMusicList();
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    sectionsRef.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, expanded: !s.expanded } : s
    ));
  }, []);

  const expandAll = useCallback(() => {
    setSections(prev => prev.map(s => ({ ...s, expanded: true })));
  }, []);

  const collapseAll = useCallback(() => {
    setSections(prev => prev.map(s => ({ ...s, expanded: false })));
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      
      if (data.config) {
        setState(prev => ({
          ...prev,
          config: data.config,
          loading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: t('loadConfigFailed')
      }));
    }
  };

  const loadPrivateKey = async () => {
    const saved = localStorage.getItem('github_private_key');
    const savedTime = localStorage.getItem('github_private_key_time');
    
    if (saved && savedTime) {
      const savedTimestamp = parseInt(savedTime, 10);
      const now = Date.now();
      const sixHours = 6 * 60 * 60 * 1000;
      
      if (now - savedTimestamp > sixHours) {
        localStorage.removeItem('github_private_key');
        localStorage.removeItem('github_private_key_time');
        return;
      }
      
      try {
        const response = await fetch('/api/decrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ encrypted: saved })
        });
        const data = await response.json();
        if (data.success) {
          setState(prev => ({ ...prev, privateKey: data.decrypted }));
        } else {
          setState(prev => ({ ...prev, privateKey: saved }));
        }
      } catch {
        setState(prev => ({ ...prev, privateKey: saved }));
      }
    }
  };

  const fetchMusicList = async () => {
    try {
      const response = await fetch('/api/music');
      const data = await response.json();
      if (data.success && data.music) {
        setMusicList(data.music);
      }
    } catch (error) {
      console.error('Failed to fetch music list:', error);
    }
  };

  const moveMusic = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= musicList.length) return;
    
    const newList = [...musicList];
    const [movedItem] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, movedItem);
    
    setMusicList(newList);
    
    const order: Record<string, number> = {};
    newList.forEach((music, index) => {
      const filename = music.path.replace('/music/', '');
      order[filename] = index;
    });
    
    try {
      const response = await fetch('/api/music/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order,
          privateKey: state.privateKey
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error('Failed to update music order:', error);
      toast.error(t('configSaveFailed'));
      fetchMusicList();
    }
  };

  const deleteMusic = async (music: MusicFile) => {
    if (!confirm(`确定要删除 "${music.name}" 吗？`)) return;
    
    const filename = music.path.replace('/music/', '');
    
    try {
      const response = await fetch(`/api/music?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: {
          'X-Private-Key': state.privateKey
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '删除失败');
      }
      
      toast.success(t('fileUploadSuccess'));
      fetchMusicList();
    } catch (error) {
      console.error('Failed to delete music:', error);
      toast.error(t('fileUploadFailed'));
    }
  };

  const savePrivateKey = async () => {
    if (!state.privateKey) return;
    try {
      const response = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: state.privateKey })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('github_private_key', data.encrypted);
        localStorage.setItem('github_private_key_time', Date.now().toString());
      }
    } catch {
      localStorage.setItem('github_private_key', state.privateKey);
      localStorage.setItem('github_private_key_time', Date.now().toString());
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!state.privateKey) {
      toast.error(t('uploadPemFirst'));
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('privateKey', state.privateKey);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '上传失败');
      }

      toast.success(t('fileUploadSuccess'));
      return data.path;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('fileUploadFailed'));
      return null;
    }
  };

  const handleSaveConfig = async () => {
    if (!state.config) return;
    if (!state.privateKey) {
      toast.error(t('uploadPemFirst'));
      return;
    }

    setState(prev => ({ ...prev, isSaving: true, saveSuccess: false }));

    try {
      const response = await fetch('/api/config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          config: state.config,
          privateKey: state.privateKey
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details || data.error || '保存失败';
        console.error('API Error:', data);
        throw new Error(errorMsg);
      }

      savePrivateKey();
      setSiteContent({
        showProjects: state.config.showProjects,
        showSkills: state.config.showSkills,
        showLocalTime: state.config.showLocalTime,
        showCustomCursor: state.config.showCustomCursor,
        customCursorPath: state.config.customCursorPath
      });
      setState(prev => ({ ...prev, isSaving: false, saveSuccess: true }));
      toast.success(t('configSaveSuccess'));
      setTimeout(() => {
        setState(prev => ({ ...prev, saveSuccess: false }));
      }, 3000);
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : t('configSaveFailed');
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: errorMessage
      }));
      toast.error(errorMessage);
    }
  };

  const handleInputChange = useCallback((path: string, value: any) => {
    setState(prev => {
      const newConfig = { ...prev.config };
      const keys = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return { ...prev, config: newConfig };
    });
  }, []);

  const handlePemUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setState(prev => ({ ...prev, privateKey: content }));
      };
      reader.readAsText(file);
    }
  };

  const addProject = () => {
    setState(prev => {
      const newConfig = { ...prev.config };
      if (!newConfig.projects) {
        newConfig.projects = { featured: [] };
      }
      if (!newConfig.projects.featured) {
        newConfig.projects.featured = [];
      }
      const newProject = {
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: '新项目',
        description: { zh: '项目描述', en: 'Project description' },
        url: '',
        image: '',
        tags: [],
        icon: 'fas fa-star',
        gradient: 'from-blue-500 to-purple-600'
      };
      newConfig.projects.featured = [...newConfig.projects.featured, newProject];
      return { ...prev, config: newConfig };
    });
  };

  const removeProject = (index: number) => {
    setState(prev => {
      const newConfig = { ...prev.config };
      newConfig.projects.featured = newConfig.projects.featured.filter((_: any, i: number) => i !== index);
      return { ...prev, config: newConfig };
    });
  };

  const addSkill = () => {
    setState(prev => {
      const newConfig = { ...prev.config };
      if (!newConfig.skills) {
        newConfig.skills = [];
      }
      const newSkill = {
        name: '新技能',
        level: 50,
        color: 'from-blue-500 to-purple-600',
        icon: 'fas fa-star'
      };
      newConfig.skills.push(newSkill);
      return { ...prev, config: newConfig };
    });
  };

  const removeSkill = (index: number) => {
    setState(prev => {
      const newConfig = { ...prev.config };
      newConfig.skills.splice(index, 1);
      return { ...prev, config: newConfig };
    });
  };

  const addFriendLink = () => {
    setState(prev => {
      const newConfig = { ...prev.config };
      if (!newConfig.friendLinks) {
        newConfig.friendLinks = { enabled: true, title: { zh: '友链', en: 'Friend Links' }, links: [] };
      }
      if (!newConfig.friendLinks.links) {
        newConfig.friendLinks.links = [];
      }
      const newLink = {
        id: `friend-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: '',
        name: '',
        avatar: '',
        description: { zh: '', en: '' }
      };
      newConfig.friendLinks.links = [...newConfig.friendLinks.links, newLink];
      return { ...prev, config: newConfig };
    });
  };

  const removeFriendLink = (index: number) => {
    setState(prev => {
      const newConfig = { ...prev.config };
      newConfig.friendLinks.links = newConfig.friendLinks.links.filter((_: any, i: number) => i !== index);
      return { ...prev, config: newConfig };
    });
  };

  const fetchSiteInfo = async (url: string, index: number) => {
    if (!url) {
      toast.error(t('friendLinkUrl'));
      return;
    }
    
    const toastId = toast.loading(t('fetchingSiteInfo'));
    
    try {
      const response = await fetch(`/api/site-info?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setState(prev => {
          const newConfig = { ...prev.config };
          if (newConfig.friendLinks?.links?.[index]) {
            newConfig.friendLinks.links[index].name = data.data.name || '';
            newConfig.friendLinks.links[index].avatar = data.data.avatar || data.data.favicon || '';
            if (data.data.description) {
              newConfig.friendLinks.links[index].description = {
                zh: data.data.description,
                en: data.data.description
              };
            }
          }
          return { ...prev, config: newConfig };
        });
        toast.success(t('fetchSiteInfoSuccess'), { id: toastId });
      } else {
        toast.error(t('fetchSiteInfoFailed'), { id: toastId });
      }
    } catch (error) {
      console.error('Failed to fetch site info:', error);
      toast.error(t('fetchSiteInfoFailed'), { id: toastId });
    }
  };

  const colors = useMemo(() => ({
    background: theme === 'dark' ? 'bg-gradient-to-br from-[#0a0a0a] via-[#0f0f23] to-[#1a1a2e]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    card: theme === 'dark' ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white/80 backdrop-blur-md border border-gray-200',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    input: theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400',
    button: theme === 'dark' ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
    buttonDelete: theme === 'dark' ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600',
    checkbox: theme === 'dark' ? 'border-white/20' : 'border-gray-300',
    sidebar: theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200',
    activeNav: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
  }), [theme]);

  if (state.loading) {
    return <LoadingScreen />;
  }

  if (state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{state.error}</p>
          <button
            onClick={() => setState(prev => ({ ...prev, error: null, loading: true }))}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  const renderSectionHeader = (section: SectionConfig) => (
    <div 
      className="flex items-center justify-between cursor-pointer select-none"
      onClick={() => toggleSection(section.id)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${section.gradient} flex items-center justify-center`}>
          <i className={`${section.icon} text-white`}></i>
        </div>
        <h3 className={`text-xl font-semibold ${colors.text}`}>{t(section.title as any)}</h3>
      </div>
      <i className={`fas fa-chevron-down ${colors.textSecondary} transition-transform duration-300 ${section.expanded ? 'rotate-180' : ''}`}></i>
    </div>
  );

  return (
    <div className={`min-h-screen ${colors.background}`}>
      <Toaster position="top-center" richColors />
      
      <aside className={`fixed left-4 top-1/2 -translate-y-1/2 ${sidebarCollapsed ? 'w-14' : 'w-56'} ${colors.sidebar} backdrop-blur-md border rounded-2xl p-4 hidden lg:block z-40 transition-all duration-300`}>
        <div className="flex items-center justify-between mb-4">
          {!sidebarCollapsed && <h4 className={`text-sm font-semibold ${colors.text}`}>{t('quickNav')}</h4>}
          <div className="flex gap-1">
            {!sidebarCollapsed && (
              <>
                <button
                  onClick={expandAll}
                  className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${colors.textSecondary}`}
                  title={t('expandAll')}
                >
                  <i className="fas fa-expand-alt text-xs"></i>
                </button>
                <button
                  onClick={collapseAll}
                  className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${colors.textSecondary}`}
                  title={t('collapseAll')}
                >
                  <i className="fas fa-compress-alt text-xs"></i>
                </button>
              </>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${colors.textSecondary}`}
              title={sidebarCollapsed ? t('sidebarExpand') : t('sidebarCollapse')}
            >
              <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
            </button>
          </div>
        </div>
        {!sidebarCollapsed && (
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
                  activeSection === section.id ? colors.activeNav : `hover:bg-white/5 ${colors.textSecondary}`
                }`}
              >
                <i className={`${section.icon} text-sm w-5`}></i>
                <span className="text-sm">{t(section.title as any)}</span>
              </button>
            ))}
          </nav>
        )}
      </aside>

      <div className={`fixed right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3 z-40`}>
        <button
          onClick={handleSaveConfig}
          disabled={state.isSaving || !state.config}
          className={`w-14 h-14 rounded-2xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 shadow-lg ${colors.button}`}
          title={t('saveToGithub')}
        >
          {state.isSaving ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-save text-lg"></i>
          )}
        </button>
        <span className={`text-xs ${colors.textSecondary} writing-mode-vertical`}>{t('saveToGithub')}</span>
        
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`w-14 h-14 rounded-2xl font-medium transition-all hover:scale-110 shadow-lg ${colors.card} ${colors.text} border border-white/10`}
          title={t('backToTop')}
        >
          <i className="fas fa-arrow-up text-lg"></i>
        </button>
        <span className={`text-xs ${colors.textSecondary} writing-mode-vertical`}>{t('backToTop')}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:px-28 xl:px-36">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl border ${colors.card} ${colors.text} hover:bg-blue-500/10 transition-all flex items-center gap-2`}
            >
              <i className="fas fa-arrow-left"></i>
              {t('backToHome')}
            </Link>
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <i className="fas fa-cog text-white text-xl"></i>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {t('configManagement')}
              </h1>
            </div>
          </div>
          <p className={`${colors.textSecondary} max-w-2xl mx-auto`}>
            {t('configDescription')}
          </p>
        </header>
        
        <div className="space-y-4">
          {state.config ? (
            <>
              <section 
                ref={el => { sectionsRef.current['github'] = el; }}
                id="github"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[0])}
                {sections[0].expanded && (
                  <div className="mt-6 space-y-4">
                    {state.privateKey ? (
                      <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl">
                        <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                          <i className="fas fa-check-circle text-xl"></i>
                          <span className="font-medium">{t('pemKeyLoaded')}</span>
                        </div>
                        <button
                          onClick={() => setState(prev => ({ ...prev, privateKey: '' }))}
                          className={`px-3 py-1.5 rounded-lg border ${colors.card} ${colors.text} hover:bg-red-500/10 hover:border-red-500/30 transition-all text-sm`}
                        >
                          <i className="fas fa-times mr-1"></i>
                          {t('clear')}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>
                            {t('pemKeyFile')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            accept=".pem"
                            onChange={handlePemUpload}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white file:cursor-pointer`}
                          />
                          <p className={`text-xs mt-2 ${colors.textSecondary}`}>
                            {t('pemKeyHint')}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>
              
              <section 
                ref={el => { sectionsRef.current['components'] = el; }}
                id="components"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[1])}
                {sections[1].expanded && (
                  <div className="mt-6 space-y-4">
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <i className="fas fa-clock text-white text-sm"></i>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${colors.text}`}>{t('localTimeComponent')}</label>
                            <p className={`text-xs ${colors.textSecondary}`}>{t('enableLocalTime')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('showLocalTime', !state.config.showLocalTime)}
                          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                            state.config.showLocalTime 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                              : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${state.config.showLocalTime ? 'left-8' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <i className="fas fa-mouse-pointer text-white text-sm"></i>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${colors.text}`}>{t('cursorSettings')}</label>
                            <p className={`text-xs ${colors.textSecondary}`}>{t('cursorFileHint')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('showCustomCursor', !state.config.showCustomCursor)}
                          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                            state.config.showCustomCursor 
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                              : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${state.config.showCustomCursor ? 'left-8' : 'left-1'}`} />
                        </button>
                      </div>
                      
                      {state.config.showCustomCursor && (
                        <div className="space-y-3 pt-3 border-t border-white/10">
                          <div>
                            <label className={`block text-xs font-medium mb-2 ${colors.textSecondary}`}>{t('cursorFile')}</label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <input
                                type="text"
                                value={state.config.customCursorPath || '/cursors/watermelon.cur'}
                                onChange={(e) => handleInputChange('customCursorPath', e.target.value)}
                                className={`flex-1 w-full sm:w-auto px-3 py-2 rounded-lg border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm`}
                              />
                              <input
                                type="file"
                                accept=".cur"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  if (!file.name.toLowerCase().endsWith('.cur')) {
                                    toast.error(t('cursorFileError'));
                                    return;
                                  }
                                  if (!state.privateKey) {
                                    toast.error(t('uploadPemFirst'));
                                    return;
                                  }
                                  try {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('privateKey', state.privateKey);
                                    formData.append('targetDir', 'cursors');
                                    const response = await fetch('/api/upload', { method: 'POST', body: formData });
                                    const data = await response.json();
                                    if (!response.ok) throw new Error(data.error || '上传失败');
                                    handleInputChange('customCursorPath', data.path);
                                    toast.success(t('cursorUploadSuccess'));
                                  } catch (error) {
                                    console.error('Cursor upload error:', error);
                                    toast.error(t('cursorUploadError'));
                                  }
                                }}
                                className={`w-full sm:w-auto px-3 py-2 rounded-lg border ${colors.input} file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-blue-600 file:text-white file:cursor-pointer text-sm`}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div 
                              className={`w-10 h-10 rounded-lg border ${colors.card} flex items-center justify-center`}
                              style={{ cursor: `url('${state.config.customCursorPath || '/cursors/watermelon.cur'}'), auto` }}
                            >
                              <i className={`fas fa-mouse-pointer ${colors.textSecondary}`}></i>
                            </div>
                            <span className={`text-xs ${colors.textSecondary} flex-1`}>{t('cursorPreviewHint')}</span>
                            <button
                              onClick={() => handleInputChange('customCursorPath', '/cursors/watermelon.cur')}
                              className={`px-3 py-1.5 rounded-lg border ${colors.card} ${colors.text} hover:bg-red-500/10 hover:border-red-500/30 transition-all text-xs`}
                            >
                              <i className="fas fa-undo mr-1"></i>
                              {t('resetCursor')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              <section 
                ref={el => { sectionsRef.current['site'] = el; }}
                id="site"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[2])}
                {sections[2].expanded && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('siteName')}</label>
                        <input
                          type="text"
                          value={state.config.site?.name || ''}
                          onChange={(e) => handleInputChange('site.name', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('siteTitleLabel')}</label>
                        <input
                          type="text"
                          value={state.config.site?.title || ''}
                          onChange={(e) => handleInputChange('site.title', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('siteUrl')}</label>
                        <input
                          type="text"
                          value={state.config.site?.url || ''}
                          onChange={(e) => handleInputChange('site.url', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('author')}</label>
                        <input
                          type="text"
                          value={state.config.site?.author || ''}
                          onChange={(e) => handleInputChange('site.author', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('backgroundImage')}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('darkTheme')}</label>
                            <input
                              type="text"
                              value={state.config.site?.backgroundImage?.dark || ''}
                              onChange={(e) => handleInputChange('site.backgroundImage.dark', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                              placeholder="/images/index.jpg"
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('lightTheme')}</label>
                            <input
                              type="text"
                              value={state.config.site?.backgroundImage?.light || ''}
                              onChange={(e) => handleInputChange('site.backgroundImage.light', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                              placeholder="/images/index4.jpg"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('textColor')}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <ColorPicker
                            label={t('darkTheme')}
                            value={state.config.site?.textColor?.dark || '#ffffff'}
                            onChange={(value) => handleInputChange('site.textColor.dark', value)}
                            placeholder="#ffffff"
                            colors={colors}
                            defaultColor="#ffffff"
                          />
                          <ColorPicker
                            label={t('lightTheme')}
                            value={state.config.site?.textColor?.light || '#1f2937'}
                            onChange={(value) => handleInputChange('site.textColor.light', value)}
                            placeholder="#1f2937"
                            colors={colors}
                            defaultColor="#1f2937"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('textSecondaryColor')}</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <ColorPicker
                            label={t('darkTheme')}
                            value={state.config.site?.textSecondaryColor?.dark || ''}
                            onChange={(value) => handleInputChange('site.textSecondaryColor.dark', value)}
                            placeholder="rgba(255, 255, 255, 0.9)"
                            colors={colors}
                            defaultColor="#ffffff"
                          />
                          <ColorPicker
                            label={t('lightTheme')}
                            value={state.config.site?.textSecondaryColor?.light || ''}
                            onChange={(value) => handleInputChange('site.textSecondaryColor.light', value)}
                            placeholder="rgba(31, 41, 55, 0.9)"
                            colors={colors}
                            defaultColor="#1f2937"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <BilingualInput
                        label={t('typeWriterText1Label')}
                        valueZh={state.config.profile?.typeWriterTexts?.zh?.[0] || ''}
                        valueEn={state.config.profile?.typeWriterTexts?.en?.[0] || ''}
                        onChangeZh={(value) => handleInputChange('profile.typeWriterTexts.zh.0', value)}
                        onChangeEn={(value) => handleInputChange('profile.typeWriterTexts.en.0', value)}
                        colors={colors}
                      />
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <BilingualInput
                        label={t('typeWriterText2Label')}
                        valueZh={state.config.profile?.typeWriterTexts?.zh?.[1] || ''}
                        valueEn={state.config.profile?.typeWriterTexts?.en?.[1] || ''}
                        onChangeZh={(value) => handleInputChange('profile.typeWriterTexts.zh.1', value)}
                        onChangeEn={(value) => handleInputChange('profile.typeWriterTexts.en.1', value)}
                        colors={colors}
                      />
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <BilingualInput
                        label={t('siteDescription')}
                        valueZh={state.config.site?.description?.zh || ''}
                        valueEn={state.config.site?.description?.en || ''}
                        onChangeZh={(value) => handleInputChange('site.description.zh', value)}
                        onChangeEn={(value) => handleInputChange('site.description.en', value)}
                        colors={colors}
                        multiline
                        rows={2}
                      />
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('keywords')}</label>
                      <input
                        type="text"
                        value={state.config.site?.keywords?.join(', ') || ''}
                        onChange={(e) => handleInputChange('site.keywords', e.target.value.split(',').map((k: string) => k.trim()).filter(Boolean))}
                        className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        placeholder="Amis, AmisKwok, Java, Spring Boot"
                      />
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <BilingualInput
                        label={t('footerSettings')}
                        valueZh={state.config.site?.footer?.zh || ''}
                        valueEn={state.config.site?.footer?.en || ''}
                        onChangeZh={(value) => handleInputChange('site.footer.zh', value)}
                        onChangeEn={(value) => handleInputChange('site.footer.en', value)}
                        colors={colors}
                      />
                    </div>
                  </div>
                )}
              </section>
              
              <section 
                ref={el => { sectionsRef.current['profile'] = el; }}
                id="profile"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[3])}
                {sections[3].expanded && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('name')}</label>
                        <input
                          type="text"
                          value={state.config.profile?.name || ''}
                          onChange={(e) => handleInputChange('profile.name', e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('avatar')}</label>
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            value={state.config.profile?.avatar || ''}
                            onChange={(e) => handleInputChange('profile.avatar', e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const path = await handleFileUpload(file);
                                if (path) handleInputChange('profile.avatar', path);
                              }
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white file:cursor-pointer`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('location')} ({t('chinese')})</label>
                        <input
                          type="text"
                          value={state.config.profile?.location?.zh || ''}
                          onChange={(e) => handleInputChange('profile.location.zh', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('location')} ({t('english')})</label>
                        <input
                          type="text"
                          value={state.config.profile?.location?.en || ''}
                          onChange={(e) => handleInputChange('profile.location.en', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('focus')} ({t('chinese')})</label>
                        <input
                          type="text"
                          value={state.config.profile?.focus?.zh || ''}
                          onChange={(e) => handleInputChange('profile.focus.zh', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('focus')} ({t('english')})</label>
                        <input
                          type="text"
                          value={state.config.profile?.focus?.en || ''}
                          onChange={(e) => handleInputChange('profile.focus.en', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('hobbies')} ({t('chinese')})</label>
                        <input
                          type="text"
                          value={state.config.profile?.hobbies?.zh || ''}
                          onChange={(e) => handleInputChange('profile.hobbies.zh', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('hobbies')} ({t('english')})</label>
                        <input
                          type="text"
                          value={state.config.profile?.hobbies?.en || ''}
                          onChange={(e) => handleInputChange('profile.hobbies.en', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('motto')} ({t('chinese')})</label>
                        <input
                          type="text"
                          value={state.config.profile?.motto?.zh || ''}
                          onChange={(e) => handleInputChange('profile.motto.zh', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('motto')} ({t('english')})</label>
                        <input
                          type="text"
                          value={state.config.profile?.motto?.en || ''}
                          onChange={(e) => handleInputChange('profile.motto.en', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
              
              <section 
                ref={el => { sectionsRef.current['links'] = el; }}
                id="links"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[4])}
                {sections[4].expanded && (
                  <div className="mt-6 space-y-4">
                    {['blog', 'github', 'gitee', 'email'].map((linkKey) => (
                      <div key={linkKey} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} space-y-3`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${colors.text} capitalize`}>{linkKey}</span>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <span className={`text-xs ${colors.textSecondary}`}>{t('showLink')}</span>
                            <input
                              type="checkbox"
                              checked={state.config.links?.[linkKey]?.show ?? true}
                              onChange={(e) => handleInputChange(`links.${linkKey}.show`, e.target.checked)}
                              className="w-4 h-4 rounded"
                            />
                          </label>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('linkUrl')}</label>
                            <input
                              type="text"
                              value={state.config.links?.[linkKey]?.url || ''}
                              onChange={(e) => handleInputChange(`links.${linkKey}.url`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('linkIcon')}</label>
                            <input
                              type="text"
                              value={state.config.links?.[linkKey]?.icon || ''}
                              onChange={(e) => handleInputChange(`links.${linkKey}.icon`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                              placeholder="fab fa-github"
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('linkTitle')} ({t('chinese')})</label>
                            <input
                              type="text"
                              value={state.config.links?.[linkKey]?.title?.zh || ''}
                              onChange={(e) => handleInputChange(`links.${linkKey}.title.zh`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('linkTitle')} ({t('english')})</label>
                            <input
                              type="text"
                              value={state.config.links?.[linkKey]?.title?.en || ''}
                              onChange={(e) => handleInputChange(`links.${linkKey}.title.en`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('linkDescription')} ({t('chinese')})</label>
                            <input
                              type="text"
                              value={state.config.links?.[linkKey]?.description?.zh || ''}
                              onChange={(e) => handleInputChange(`links.${linkKey}.description.zh`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('linkDescription')} ({t('english')})</label>
                            <input
                              type="text"
                              value={state.config.links?.[linkKey]?.description?.en || ''}
                              onChange={(e) => handleInputChange(`links.${linkKey}.description.en`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              
              <section 
                ref={el => { sectionsRef.current['projects'] = el; }}
                id="projects"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[5])}
                {sections[5].expanded && (
                  <div className="mt-6 space-y-4">
                    <button
                      onClick={addProject}
                      className={`w-full py-3 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-white/20 hover:border-white/40' : 'border-gray-300 hover:border-gray-400'} ${colors.text} transition-all flex items-center justify-center gap-2`}
                    >
                      <i className="fas fa-plus"></i>
                      {t('addProject')}
                    </button>
                    {state.config.projects?.featured?.map((project: any, index: number) => (
                      <div key={project.id || index} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} space-y-3`}>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectName')}</label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => handleInputChange(`projects.featured.${index}.name`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm font-semibold`}
                              placeholder={t('projectName')}
                            />
                          </div>
                          <button
                            onClick={() => removeProject(index)}
                            className={`p-2 rounded-lg ${colors.buttonDelete} mt-5`}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectUrl')}</label>
                            <input
                              type="text"
                              value={project.url || ''}
                              onChange={(e) => handleInputChange(`projects.featured.${index}.url`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectImage')}</label>
                            <input
                              type="text"
                              value={project.image || ''}
                              onChange={(e) => handleInputChange(`projects.featured.${index}.image`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectIcon')}</label>
                            <input
                              type="text"
                              value={project.icon || ''}
                              onChange={(e) => handleInputChange(`projects.featured.${index}.icon`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                              placeholder="fas fa-star"
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectGradient')}</label>
                            <input
                              type="text"
                              value={project.gradient || ''}
                              onChange={(e) => handleInputChange(`projects.featured.${index}.gradient`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                              placeholder="from-blue-500 to-purple-600"
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectDescription')} ({t('chinese')})</label>
                          <textarea
                            value={project.description?.zh || ''}
                            onChange={(e) => handleInputChange(`projects.featured.${index}.description.zh`, e.target.value)}
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectDescription')} ({t('english')})</label>
                          <textarea
                            value={project.description?.en || ''}
                            onChange={(e) => handleInputChange(`projects.featured.${index}.description.en`, e.target.value)}
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectTags')}</label>
                          <input
                            type="text"
                            value={project.tags?.join(', ') || ''}
                            onChange={(e) => handleInputChange(`projects.featured.${index}.tags`, e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean))}
                            className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            placeholder="Spring Boot, Java, MySQL"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              
              <section 
                ref={el => { sectionsRef.current['skills'] = el; }}
                id="skills"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[6])}
                {sections[6].expanded && (
                  <div className="mt-6 space-y-4">
                    <button
                      onClick={addSkill}
                      className={`w-full py-3 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-white/20 hover:border-white/40' : 'border-gray-300 hover:border-gray-400'} ${colors.text} transition-all flex items-center justify-center gap-2`}
                    >
                      <i className="fas fa-plus"></i>
                      {t('addSkill')}
                    </button>
                    {state.config.skills?.map((skill: any, index: number) => (
                      <div key={index} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} space-y-3`}>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('projectName')}</label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => handleInputChange(`skills.${index}.name`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                          <div className="w-24">
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('level')}</label>
                            <input
                              type="number"
                              value={skill.level}
                              onChange={(e) => handleInputChange(`skills.${index}.level`, parseInt(e.target.value))}
                              min="0"
                              max="100"
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                            />
                          </div>
                          <button
                            onClick={() => removeSkill(index)}
                            className={`p-2 rounded-lg ${colors.buttonDelete} mt-5`}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('skillColor')}</label>
                            <input
                              type="text"
                              value={skill.color || ''}
                              onChange={(e) => handleInputChange(`skills.${index}.color`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                              placeholder="from-blue-500 to-purple-600"
                            />
                          </div>
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('skillIcon')}</label>
                            <input
                              type="text"
                              value={skill.icon || ''}
                              onChange={(e) => handleInputChange(`skills.${index}.icon`, e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                              placeholder="fab fa-java"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
              
              <section 
                ref={el => { sectionsRef.current['guestbook'] = el; }}
                id="guestbook"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[7])}
                {sections[7].expanded && (
                  <div className="mt-6 space-y-4">
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                            <i className="fas fa-comments text-white text-sm"></i>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${colors.text}`}>{t('guestbookSettings')}</label>
                            <p className={`text-xs ${colors.textSecondary}`}>{t('enableGuestbook')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('guestbook.enabled', !state.config.guestbook?.enabled)}
                          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                            state.config.guestbook?.enabled 
                              ? 'bg-gradient-to-r from-pink-500 to-rose-600' 
                              : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${state.config.guestbook?.enabled ? 'left-8' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                    
                    {state.config.guestbook?.enabled && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${colors.textSecondary}`}>{t('walineUrl')}</label>
                          <input
                            type="text"
                            value={state.config.guestbook?.walineUrl || ''}
                            onChange={(e) => handleInputChange('guestbook.walineUrl', e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border ${colors.input} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                            placeholder="https://your-waline-server.vercel.app"
                          />
                          <p className={`text-xs mt-2 ${colors.textSecondary}`}>{t('walineUrlHint')}</p>
                        </div>
                        <BilingualInput
                          label={t('linkTitle')}
                          valueZh={state.config.guestbook?.title?.zh || ''}
                          valueEn={state.config.guestbook?.title?.en || ''}
                          onChangeZh={(value) => handleInputChange('guestbook.title.zh', value)}
                          onChangeEn={(value) => handleInputChange('guestbook.title.en', value)}
                          colors={colors}
                          placeholderZh="留言板"
                          placeholderEn="Guestbook"
                        />
                      </div>
                    )}
                  </div>
                )}
              </section>
              
              <section 
                ref={el => { sectionsRef.current['friendLinks'] = el; }}
                id="friendLinks"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[8])}
                {sections[8].expanded && (
                  <div className="mt-6 space-y-4">
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <i className="fas fa-user-friends text-white text-sm"></i>
                          </div>
                          <div>
                            <label className={`block text-sm font-medium ${colors.text}`}>{t('friendLinksSettings')}</label>
                            <p className={`text-xs ${colors.textSecondary}`}>{t('enableFriendLinks')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInputChange('friendLinks.enabled', !state.config.friendLinks?.enabled)}
                          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                            state.config.friendLinks?.enabled 
                              ? 'bg-gradient-to-r from-violet-500 to-purple-600' 
                              : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
                          }`}
                        >
                          <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${state.config.friendLinks?.enabled ? 'left-8' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                    
                    {state.config.friendLinks?.enabled && (
                      <div className="space-y-4">
                        <BilingualInput
                          label={t('linkTitle')}
                          valueZh={state.config.friendLinks?.title?.zh || ''}
                          valueEn={state.config.friendLinks?.title?.en || ''}
                          onChangeZh={(value) => handleInputChange('friendLinks.title.zh', value)}
                          onChangeEn={(value) => handleInputChange('friendLinks.title.en', value)}
                          colors={colors}
                          placeholderZh="友链"
                          placeholderEn="Friend Links"
                        />
                        
                        <button
                          onClick={addFriendLink}
                          className={`w-full py-3 rounded-xl border-2 border-dashed ${theme === 'dark' ? 'border-white/20 hover:border-white/40' : 'border-gray-300 hover:border-gray-400'} ${colors.text} transition-all flex items-center justify-center gap-2`}
                        >
                          <i className="fas fa-plus"></i>
                          {t('addFriendLink')}
                        </button>
                        
                        {state.config.friendLinks?.links?.map((link: any, index: number) => (
                          <div key={link.id || index} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} space-y-3`}>
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold ${colors.text}`}>#{index + 1}</span>
                              <button
                                onClick={() => removeFriendLink(index)}
                                className={`p-2 rounded-lg ${colors.buttonDelete}`}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="md:col-span-2">
                                <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('friendLinkUrl')}</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={link.url || ''}
                                    onChange={(e) => handleInputChange(`friendLinks.links.${index}.url`, e.target.value)}
                                    className={`flex-1 px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                                    placeholder="https://example.com"
                                  />
                                  <button
                                    onClick={() => fetchSiteInfo(link.url, index)}
                                    className={`px-4 py-2 rounded-lg ${colors.button} text-white text-sm whitespace-nowrap`}
                                    title={t('fetchSiteInfo')}
                                  >
                                    <i className="fas fa-download mr-1"></i>
                                    {t('fetchSiteInfo')}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('friendLinkName')}</label>
                                <input
                                  type="text"
                                  value={link.name || ''}
                                  onChange={(e) => handleInputChange(`friendLinks.links.${index}.name`, e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                                />
                              </div>
                              <div>
                                <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('friendLinkAvatar')}</label>
                                <input
                                  type="text"
                                  value={link.avatar || ''}
                                  onChange={(e) => handleInputChange(`friendLinks.links.${index}.avatar`, e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('friendLinkDescription')} ({t('chinese')})</label>
                                <input
                                  type="text"
                                  value={link.description?.zh || ''}
                                  onChange={(e) => handleInputChange(`friendLinks.links.${index}.description.zh`, e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className={`block text-xs font-medium mb-1 ${colors.textSecondary}`}>{t('friendLinkDescription')} ({t('english')})</label>
                                <input
                                  type="text"
                                  value={link.description?.en || ''}
                                  onChange={(e) => handleInputChange(`friendLinks.links.${index}.description.en`, e.target.value)}
                                  className={`w-full px-3 py-2 rounded-lg border ${colors.input} text-sm`}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
              
              <section 
                ref={el => { sectionsRef.current['music'] = el; }}
                id="music"
                className={`rounded-2xl p-6 ${colors.card} backdrop-blur-md scroll-mt-4 overflow-hidden`}
              >
                {renderSectionHeader(sections[9])}
                {sections[9].expanded && (
                  <div className="mt-6 space-y-4">
                    <p className={`text-sm ${colors.textSecondary}`}>{t('musicUploadHint')}</p>
                    <input
                      type="file"
                      accept="audio/*"
                      multiple
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files) return;
                        for (const file of Array.from(files)) {
                          await handleFileUpload(file);
                        }
                        fetchMusicList();
                      }}
                      className={`w-full px-4 py-3 rounded-xl border ${colors.input} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-pink-500 file:to-purple-600 file:text-white file:cursor-pointer`}
                    />
                    {musicList.length === 0 ? (
                      <p className={`text-center py-8 ${colors.textSecondary}`}>{t('noMusic')}</p>
                    ) : (
                      <div className="space-y-2">
                        {musicList.map((music, index) => (
                          <div key={music.id} className={`group flex items-center gap-3 p-3 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => moveMusic(index, index - 1)}
                                disabled={index === 0}
                                className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'} ${colors.textSecondary}`}
                              >
                                <i className="fas fa-chevron-up text-xs"></i>
                              </button>
                              <button
                                onClick={() => moveMusic(index, index + 1)}
                                disabled={index === musicList.length - 1}
                                className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${index === musicList.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10'} ${colors.textSecondary}`}
                              >
                                <i className="fas fa-chevron-down text-xs"></i>
                              </button>
                            </div>
                            <span className={`w-6 text-center text-sm ${colors.textSecondary}`}>{index + 1}</span>
                            <div className="flex-1 flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-music text-pink-500"></i>
                              </div>
                              <span className={`truncate ${colors.text}`}>{music.name}</span>
                            </div>
                            <button
                              onClick={() => deleteMusic(music)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${colors.buttonDelete}`}
                            >
                              <i className="fas fa-trash-alt text-sm"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className={`text-2xl font-semibold mb-4 ${colors.text}`}>{t('loading')}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
