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
    if (containerRef.current) {
      containerRef.current.setAttribute('data-theme', theme);
    }
    
    // 动态更新 Waline 实例的主题
    if (walineInstanceRef.current && typeof walineInstanceRef.current.update === 'function') {
      walineInstanceRef.current.update({ dark: theme === 'dark' });
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
        dark: theme === 'dark',
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
    <div className="waline-comments" data-theme={theme}>
      <div ref={containerRef} />
    </div>
  );
}
