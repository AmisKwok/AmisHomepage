'use client';
import { useEffect, useRef } from 'react';
import { init } from '@waline/client';
import { useLanguageStore, useTranslation } from '../../stores/language-store';
import { useThemeStore } from '../../stores/theme-store';
import { guestbookConfig } from '../../site-config';

import '@waline/client/style';

export default function WalineComments({ path = '/guestbook' }) {
  const walineInstanceRef = useRef(null);
  const containerRef = useRef(null);
  const { language } = useLanguageStore();
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = theme === 'dark';
    const container = containerRef.current;

    if (isDark) {
      container.style.setProperty('--waline-color', '#ffffff');
      container.style.setProperty('--waline-bg-color', 'rgba(255, 255, 255, 0.05)');
      container.style.setProperty('--waline-bg-color-light', 'rgba(255, 255, 255, 0.03)');
      container.style.setProperty('--waline-bg-color-hover', 'rgba(255, 255, 255, 0.08)');
      container.style.setProperty('--waline-border-color', 'rgba(255, 255, 255, 0.1)');
      container.style.setProperty('--waline-disable-bg-color', 'rgba(255, 255, 255, 0.05)');
      container.style.setProperty('--waline-disable-color', '#666');
      container.style.setProperty('--waline-code-bg-color', '#1e1e2e');
      container.style.setProperty('--waline-bq-color', 'rgba(255, 255, 255, 0.05)');
      container.style.setProperty('--waline-info-bg-color', 'rgba(59, 130, 246, 0.1)');
      container.style.setProperty('--waline-info-color', '#9ca3af');
    } else {
      container.style.setProperty('--waline-color', '#1f2937');
      container.style.setProperty('--waline-bg-color', 'rgba(0, 0, 0, 0.02)');
      container.style.setProperty('--waline-bg-color-light', 'rgba(0, 0, 0, 0.01)');
      container.style.setProperty('--waline-bg-color-hover', 'rgba(0, 0, 0, 0.04)');
      container.style.setProperty('--waline-border-color', 'rgba(0, 0, 0, 0.1)');
      container.style.setProperty('--waline-disable-bg-color', 'rgba(0, 0, 0, 0.02)');
      container.style.setProperty('--waline-disable-color', '#9ca3af');
      container.style.setProperty('--waline-code-bg-color', '#f3f4f6');
      container.style.setProperty('--waline-bq-color', 'rgba(0, 0, 0, 0.03)');
      container.style.setProperty('--waline-info-bg-color', 'rgba(59, 130, 246, 0.08)');
      container.style.setProperty('--waline-info-color', '#6b7280');
    }
  }, [theme]);

  useEffect(() => {
    
    if (walineInstanceRef.current) {
      walineInstanceRef.current.destroy();
    }

    const serverURL = guestbookConfig?.walineUrl?.replace(/\/$/, '') || '';

    if (!serverURL || !containerRef.current) {
      console.log('Early return: serverURL or containerRef is empty');
      return;
    }


    try {
      walineInstanceRef.current = init({
        el: containerRef.current,
        serverURL: serverURL,
        path: path,
        lang: language === 'zh' ? 'zh-CN' : 'en',
        dark: 'html.dark',
        reaction: false,
        search: false,
        pageview: true,
        login: 'disable',
        locale: {
          nick: t('walineNick'),
          mail: t('walineMail'),
          placeholder: t('walinePlaceholder'),
        },
        comment: true,
        requiredMeta: ['nick', 'mail'],
        avatar: 'monsterid',
        meta: ['nick', 'mail'],
        pageSize: 10,
        noCopyright: true,
      });
      console.log('Waline initialized successfully');
    } catch (error) {
      console.error('Waline init error:', error);
    }

    const setInputPlaceholders = () => {
      if (!containerRef.current) return;
      const nickInputs = containerRef.current.querySelectorAll('input[name="nick"]');
      nickInputs.forEach(input => {
        input.placeholder = t('walineNickPlaceholder');
      });
      
      const mailInputs = containerRef.current.querySelectorAll('input[name="mail"]');
      mailInputs.forEach(input => {
        input.placeholder = t('walineMailPlaceholder');
      });
    };
    
    setTimeout(setInputPlaceholders, 100);
    
    const observer = new MutationObserver(() => {
      setInputPlaceholders();
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        childList: true, 
        subtree: true 
      });
    }

    return () => {
      if (walineInstanceRef.current) {
        walineInstanceRef.current.destroy();
      }
      observer.disconnect();
    };
  }, [path, language, theme, t]);

  return (
    <div className="waline-comments">
      <div ref={containerRef} />
    </div>
  );
}
