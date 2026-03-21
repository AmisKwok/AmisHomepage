'use client';
import { useEffect, useRef } from 'react';
import { init } from '@waline/client';
import { useLanguageStore } from '../../stores/language-store';
import { useThemeStore } from '../../stores/theme-store';
import { guestbookConfig } from '../../site-config';

export default function WalineComments({ path = '/guestbook' }) {
  const walineInstanceRef = useRef(null);
  const containerRef = useRef(null);
  const { language, t } = useLanguageStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    console.log('WalineComments useEffect triggered');
    console.log('guestbookConfig:', guestbookConfig);
    console.log('walineUrl:', guestbookConfig?.walineUrl);
    
    if (walineInstanceRef.current) {
      walineInstanceRef.current.destroy();
    }

    const serverURL = guestbookConfig?.walineUrl?.replace(/\/$/, '') || '';
    console.log('serverURL:', serverURL);
    console.log('containerRef.current:', containerRef.current);

    if (!serverURL || !containerRef.current) {
      console.log('Early return: serverURL or containerRef is empty');
      return;
    }

    console.log('Initializing Waline with config:', {
      serverURL,
      path,
      lang: language === 'zh' ? 'zh-CN' : 'en',
      dark: theme === 'dark',
    });

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
        avatar: 'mp',
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
