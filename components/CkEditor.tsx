'use client';

import React, { Dispatch, SetStateAction, useEffect, useMemo, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center py-8'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main'></div>
    </div>
  )
});

import 'react-quill/dist/quill.snow.css';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

// Import Quill modules - will be loaded dynamically

interface CkEditorProps {
  editorData: string;
  setEditorData: Dispatch<SetStateAction<string>>;
}

const CkEditor = ({ editorData, setEditorData }: CkEditorProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const quillRef = useRef<any>(null);

  // Predefined colors
  const predefinedColors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#00CCFF', '#0066FF',
    '#6600FF', '#FF00CC', '#FF3366', '#FF9933', '#FFFF00', '#66FF00',
    '#00FFFF', '#3366FF', '#9933FF', '#FF33CC', '#8B4513', '#228B22',
    '#4169E1', '#DC143C', '#FFD700', '#32CD32', '#1E90FF', '#FF69B4'
  ];

  // Detect dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Check initially
    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Quill modules dynamically on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && isMounted) {
      const loadModules = async () => {
        try {
          // Import Quill - no external modules needed
          const QuillModule = await import('quill');
          const Quill = QuillModule.default || QuillModule;

          console.log('Successfully loaded Quill');
          setAvailableModules([]);
          setModulesLoaded(true);
        } catch (error) {
          console.error('Failed to load Quill:', error);
          // Still allow the editor to work
          setModulesLoaded(true);
        }
      };

      loadModules();
    }
  }, [isMounted]);

  // Add title attributes to toolbar buttons for better tooltips
  useEffect(() => {
    if (isMounted && modulesLoaded) {
      const addTooltips = () => {
        const toolbar = document.querySelector('.ql-toolbar');
        if (toolbar) {
          const buttons = toolbar.querySelectorAll('button');
          buttons.forEach(button => {
            const classList = button.classList;

            // Add title attributes based on button classes
            if (classList.contains('ql-bold')) {
              button.setAttribute('title', 'Bold (Ctrl+B)');
            } else if (classList.contains('ql-italic')) {
              button.setAttribute('title', 'Italic (Ctrl+I)');
            } else if (classList.contains('ql-underline')) {
              button.setAttribute('title', 'Underline (Ctrl+U)');
            } else if (classList.contains('ql-strike')) {
              button.setAttribute('title', 'Strikethrough');
            } else if (classList.contains('ql-link')) {
              button.setAttribute('title', 'Insert Link');
            } else if (classList.contains('ql-image')) {
              button.setAttribute('title', 'Insert Image');
            } else if (classList.contains('ql-video')) {
              button.setAttribute('title', 'Insert Video');
            } else if (classList.contains('ql-blockquote')) {
              button.setAttribute('title', 'Quote');
            } else if (classList.contains('ql-code-block')) {
              button.setAttribute('title', 'Code Block');
            } else if (classList.contains('ql-clean')) {
              button.setAttribute('title', 'Clear Formatting');
            } else if (classList.contains('ql-formula')) {
              button.setAttribute('title', 'Insert Formula');
            } else if (classList.contains('ql-emoji')) {
              button.setAttribute('title', 'Insert Emoji');
            } else if (classList.contains('ql-direction')) {
              button.setAttribute('title', 'Text Direction');
            } else if (classList.contains('ql-list')) {
              if (button.getAttribute('data-value') === 'ordered') {
                button.setAttribute('title', 'Numbered List');
              } else if (button.getAttribute('data-value') === 'bullet') {
                button.setAttribute('title', 'Bullet List');
              }
            } else if (classList.contains('ql-align')) {
              const value = button.getAttribute('data-value');
              if (value === '') {
                button.setAttribute('title', 'Align Left');
              } else if (value === 'center') {
                button.setAttribute('title', 'Align Center');
              } else if (value === 'right') {
                button.setAttribute('title', 'Align Right');
              } else if (value === 'justify') {
                button.setAttribute('title', 'Justify Text');
              }
            } else if (classList.contains('ql-size')) {
              const value = button.getAttribute('data-value');
              if (value === 'small') {
                button.setAttribute('title', 'Small Text');
              } else if (value === 'large') {
                button.setAttribute('title', 'Large Text');
              } else if (value === 'huge') {
                button.setAttribute('title', 'Huge Text');
              }
            } else if (classList.contains('ql-script')) {
              const value = button.getAttribute('data-value');
              if (value === 'sub') {
                button.setAttribute('title', 'Subscript');
              } else if (value === 'super') {
                button.setAttribute('title', 'Superscript');
              }
            } else if (classList.contains('ql-indent')) {
              const value = button.getAttribute('data-value');
              if (value === '-1') {
                button.setAttribute('title', 'Decrease Indent');
              } else if (value === '+1') {
                button.setAttribute('title', 'Increase Indent');
              }
            } else if (button.getAttribute('data-value')) {
              const value = button.getAttribute('data-value');
              if (value && ['1', '2', '3', '4', '5', '6'].includes(value)) {
                button.setAttribute('title', `Heading ${value}`);
              }
            }
          });
        }
      };

      // Add tooltips after a short delay to ensure toolbar is rendered
      setTimeout(addTooltips, 100);
    }
  }, [isMounted, modulesLoaded]);

  // Custom color picker functions
  const applyColor = (color: string, isBackground: boolean = false) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        if (isBackground) {
          quill.format('background', color);
        } else {
          quill.format('color', color);
        }
      }
    }
    setShowColorPicker(false);
    setShowBackgroundPicker(false);
  };

  const handleCustomColor = (isBackground: boolean = false) => {
    const input = document.createElement('input');
    input.type = 'color';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      applyColor(target.value, isBackground);
    };
    input.click();
  };

  // Advanced toolbar configuration with table and image resize functionality
  const modules = useMemo(() => {
    const baseModules = {
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'align': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          ['clean'],
          ['formula'],
        ],
        handlers: {
          // Custom image handler
          image: function (this: any) {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = () => {
              const file = input.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  const quill = this.quill;
                  const range = quill.getSelection();
                  const index = range?.index || 0;

                  // Insert image
                  quill.insertEmbed(index, 'image', reader.result);
                };
                reader.readAsDataURL(file);
              }
            };
          }
        }
      },
      clipboard: {
        matchVisual: false,
      },
      keyboard: {
        bindings: {
          // Custom keyboard shortcuts
          tab: {
            key: 9,
            handler: function () {
              return true;
            }
          },
          // Ctrl/Cmd + S for save
          save: {
            key: 'S',
            shortKey: true,
            handler: function () {
              console.log('Save triggered');
              return true;
            }
          }
        }
      },
      history: {
        delay: 2000,
        maxStack: 500,
        userOnly: true
      },
      syntax: {
        highlight: (text: string) => {
          if (typeof window !== 'undefined') {
            try {
              const hljs = require('highlight.js');
              return hljs.highlightAuto(text).value;
            } catch (error) {
              console.warn('Highlight.js not available:', error);
              return text;
            }
          }
          return text;
        }
      }
    };

    // Return base modules - table functionality is built into Quill
    return baseModules;
  }, [modulesLoaded, availableModules]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'blockquote', 'code-block',
    'link', 'image', 'video',
    'formula', 'emoji',
  ];


  //  background: ${isDarkMode
  //     ? 'linear-gradient(135deg, rgba(55, 65, 81, 0.8) 0%, rgba(31, 41, 55, 0.9) 100%)'
  //     : 'linear-gradient(135deg, rgba(249, 250, 251, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)'
  //   } !important;

  // Custom styles for dark/light mode with enhanced design
  const editorStyles = `
    /* Glassmorphism toolbar */
    .ql-toolbar {
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)'} !important;
      border-bottom: none !important;
      border-radius: 16px 16px 0 0 !important;
      padding: 16px !important;
      box-shadow: ${isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
    } !important;
      position: relative !important;
      overflow: visible !important;
    }
    
    /* Animated gradient border effect */
    // .ql-toolbar::before {
    //   content: '' !important;
    //   position: absolute !important;
    //   top: 0 !important;
    //   left: 0 !important;
    //   right: 0 !important;
    //   height: 2px !important;
    //   background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981) !important;
    //   background-size: 200% 100% !important;
    //   animation: gradientShift 3s ease-in-out infinite !important;
    // }
    
    // @keyframes gradientShift {
    //   0%, 100% { background-position: 0% 50%; }
    //   50% { background-position: 100% 50%; }
    // }
    
    /* Glassmorphism container */
    .ql-container {

      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      border: 1px solid ${isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(209, 213, 219, 0.3)'} !important;
      border-top: none !important;
      border-radius: 0 0 16px 16px !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
      min-height: 300px !important;
      box-shadow: ${isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
    } !important;
      position: relative !important;
      overflow: hidden !important;
    }
    
    /* Floating particles effect */
    // .ql-container::before {
    //   content: '' !important;
    //   position: absolute !important;
    //   top: 0 !important;
    //   left: 0 !important;
    //   right: 0 !important;
    //   bottom: 0 !important;
    //   background-image: 
    //     radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    //     radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    //     radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%) !important;
    //   pointer-events: none !important;
    //   z-index: 0 !important;
    // }
    
    .ql-editor {
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
      font-family: inherit !important;
      line-height: 1.6 !important;
      padding: 24px !important;
      position: relative !important;
      z-index: 1 !important;
      background: transparent !important;
    }
    
    .ql-editor.ql-blank::before {
      color: ${isDarkMode ? '#6b7280' : '#9ca3af'} !important;
      font-style: italic !important;
    }
    
    .ql-toolbar .ql-stroke {
      stroke: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
    }
    
    .ql-toolbar .ql-fill {
      fill: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
    }
    
    /* Enhanced toolbar buttons */
    .ql-toolbar button {
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      border-radius: 8px !important;
      margin: 3px !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      position: relative !important;
      overflow: hidden !important;
      background: transparent !important;
      border: 1px solid transparent !important;
    }
    
    /* Add hover tooltips for toolbar buttons */
    .ql-toolbar button[data-value="1"]:hover::after {
      content: "Heading 1" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button[data-value="2"]:hover::after {
      content: "Heading 2" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button[data-value="3"]:hover::after {
      content: "Heading 3" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button[data-value="4"]:hover::after {
      content: "Heading 4" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button[data-value="5"]:hover::after {
      content: "Heading 5" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button[data-value="6"]:hover::after {
      content: "Heading 6" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-bold:hover::after {
      content: "Bold (Ctrl+B)" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-italic:hover::after {
      content: "Italic (Ctrl+I)" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-underline:hover::after {
      content: "Underline (Ctrl+U)" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-strike:hover::after {
      content: "Strikethrough" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-list[data-value="ordered"]:hover::after {
      content: "Numbered List" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-list[data-value="bullet"]:hover::after {
      content: "Bullet List" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }

    .ql-snow .ql-tooltip{
        left: 0 !important;
        margin-left: 5px !important;
    }

    .ql-toolbar .ql-picker-item{
        padding: 0px 0px !important;
    }

    .ql-picker-options .ql-picker-item svg {
      display: none !important;
    }

        
    .ql-snow .ql-icon-picker .ql-picker-item {
      width: auto !important;
    }
    
    .ql-toolbar button.ql-link:hover::after {
      content: "Insert Link" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-image:hover::after {
      content: "Insert Image" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-video:hover::after {
      content: "Insert Video" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-blockquote:hover::after {
      content: "Quote" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-code-block:hover::after {
      content: "Code Block" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-clean:hover::after {
      content: "Clear Formatting" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-formula:hover::after {
      content: "Insert Formula" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-emoji:hover::after {
      content: "Insert Emoji" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    /* Font size tooltips */
    .ql-toolbar button.ql-size[data-value="small"]:hover::after {
      content: "Small Text" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-size[data-value="large"]:hover::after {
      content: "Large Text" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-size[data-value="huge"]:hover::after {
      content: "Huge Text" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    /* Script tooltips */
    .ql-toolbar button.ql-script[data-value="sub"]:hover::after {
      content: "Subscript" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-script[data-value="super"]:hover::after {
      content: "Superscript" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    /* Indent tooltips */
    .ql-toolbar button.ql-indent[data-value="-1"]:hover::after {
      content: "Decrease Indent" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-indent[data-value="+1"]:hover::after {
      content: "Increase Indent" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    /* Direction tooltip */
    .ql-toolbar button.ql-direction:hover::after {
      content: "Text Direction" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    /* Picker tooltips */
    .ql-toolbar .ql-picker.ql-header:hover::after {
      content: "Heading Style" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar .ql-picker.ql-font:hover::after {
      content: "Font Family" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar .ql-picker.ql-size:hover::after {
      content: "Font Size" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar .ql-picker.ql-color:hover::after {
      content: "Text Color" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar .ql-picker.ql-background:hover::after {
      content: "Background Color" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar .ql-picker.ql-align:hover::after {
      content: "Text Alignment" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    /* Fix alignment icons - use proper alignment symbols */
    .ql-toolbar .ql-align .ql-picker-item[data-value=""]:before {
      content: "Left" !important;
      font-size: 12px !important;
      font-family: monospace !important;
    }
    
    .ql-toolbar .ql-align .ql-picker-item[data-value="center"]:before {
      content: "Center" !important;
      font-size: 12px !important;
      font-family: monospace !important;
    }
    
    .ql-toolbar .ql-align .ql-picker-item[data-value="right"]:before {
      content: "Right" !important;
      font-size: 12px !important;
      font-family: monospace !important;
    }
    
    .ql-toolbar .ql-align .ql-picker-item[data-value="justify"]:before {
      content: "Justify" !important;
      font-size: 12px !important;
      font-family: monospace !important;
    }
    
    /* Ensure alignment icons are visible and same size */
    .ql-toolbar .ql-align .ql-picker-item:before {
      display: inline-block !important;
      width: 50px !important;
      height: 16px !important;
      line-height: 16px !important;
      text-align: left !important;
      margin-right: 8px !important;
      vertical-align: middle !important;
    }
    
    /* Fix alignment button icons */
    .ql-toolbar button.ql-align[data-value=""]:before {
      content: "Left" !important;
      font-size: 12px !important;
      font-family: monospace !important;
    }
    
    .ql-toolbar button.ql-align[data-value="center"]:before {
      content: "Center" !important;
      font-size: 12px !important;
      font-family: monospace !important;
    }
    
    .ql-toolbar button.ql-align[data-value="right"]:before {
      content: "Right" !important;
      font-size: 12px !important;
      font-family: monospace !important;
    }
    
    .ql-toolbar button.ql-align[data-value="justify"]:before {
      content: "Justify" !important;
      font-size: 12px !important;
      font-family: monospace !important;
    }
    
    /* Use title attributes for tooltips - fallback for any button with title */
    .ql-toolbar button[title]:hover::after {
      content: attr(title) !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    /* Override Quill's default alignment icons */
    .ql-toolbar .ql-align .ql-picker-item[data-value=""] .ql-stroke,
    .ql-toolbar .ql-align .ql-picker-item[data-value="center"] .ql-stroke,
    .ql-toolbar .ql-align .ql-picker-item[data-value="right"] .ql-stroke,
    .ql-toolbar .ql-align .ql-picker-item[data-value="justify"] .ql-stroke {
      display: none !important;
    }
    
    .ql-toolbar button.ql-align[data-value=""] .ql-stroke,
    .ql-toolbar button.ql-align[data-value="center"] .ql-stroke,
    .ql-toolbar button.ql-align[data-value="right"] .ql-stroke,
    .ql-toolbar button.ql-align[data-value="justify"] .ql-stroke {
      display: none !important;
    }
    
    .ql-toolbar .ql-picker.ql-list:hover::after {
      content: "List Style" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar .ql-picker.ql-indent:hover::after {
      content: "Indentation" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar .ql-picker.ql-script:hover::after {
      content: "Script Style" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    /* Alignment button tooltips */
    .ql-toolbar button.ql-align[data-value=""]:hover::after {
      content: "Align Left" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-align[data-value="center"]:hover::after {
      content: "Align Center" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-align[data-value="right"]:hover::after {
      content: "Align Right" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    .ql-toolbar button.ql-align[data-value="justify"]:hover::after {
      content: "Justify Text" !important;
      position: absolute !important;
      bottom: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: ${isDarkMode ? '#1f2937' : '#374151'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#ffffff'} !important;
      padding: 4px 8px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      white-space: nowrap !important;
      z-index: 10003 !important;
      pointer-events: none !important;
    }
    
    
    .ql-toolbar button::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: -100% !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
      transition: left 0.5s ease !important;
    }
    
    .ql-toolbar button:hover {
      background: ${isDarkMode
      ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.8) 0%, rgba(55, 65, 81, 0.9) 100%)'
      : 'linear-gradient(135deg, rgba(229, 231, 235, 0.8) 0%, rgba(243, 244, 246, 0.9) 100%)'
    } !important;
      border-color: ${isDarkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'} !important;
      transform: translateY(-1px) !important;
      box-shadow: ${isDarkMode
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)'
    } !important;
    }
    
    .ql-toolbar button:hover::before {
      left: 100% !important;
    }
    
    .ql-toolbar button.ql-active {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
      color: #ffffff !important;
      border-color: #1d4ed8 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
    }
    
    .ql-toolbar button:active {
      transform: translateY(0) !important;
      transition: transform 0.1s ease !important;
    }
    
    .ql-toolbar .ql-picker {
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      position: relative !important;
      z-index: 1001 !important;
    }
    
    .ql-toolbar .ql-picker-options {
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border: 1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      border-radius: 6px !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      z-index: 9999 !important;
      position: absolute !important;
    }
    
    /* Specific z-index for different picker types */
    .ql-toolbar .ql-picker.ql-header .ql-picker-options,
    .ql-toolbar .ql-picker.ql-font .ql-picker-options,
    .ql-toolbar .ql-picker.ql-size .ql-picker-options,
    .ql-toolbar .ql-picker.ql-color .ql-picker-options,
    .ql-toolbar .ql-picker.ql-background .ql-picker-options,
    .ql-toolbar .ql-picker.ql-align .ql-picker-options,
    .ql-toolbar .ql-picker.ql-list .ql-picker-options,
    .ql-toolbar .ql-picker.ql-indent .ql-picker-options,
    .ql-toolbar .ql-picker.ql-direction .ql-picker-options {
      z-index: 10000 !important;
      position: absolute !important;
    }
    
    .ql-toolbar .ql-picker-item {
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      font-size: 13px !important;
      padding: 6px 12px !important;
      line-height: 1.4 !important;
    }
    
    .ql-toolbar .ql-picker-item:hover {
      background-color: ${isDarkMode ? '#4b5563' : '#f3f4f6'} !important;
    }
    
    .ql-snow .ql-picker.ql-expanded .ql-picker-options {
      border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      z-index: 10000 !important;
      position: absolute !important;
    }
    
    .ql-snow .ql-tooltip {
      background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border: 1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      border-radius: 6px !important;
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
      z-index: 9998 !important;
      position: absolute !important;
    }
    
    .ql-snow .ql-tooltip input {
      background-color: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
      border: 1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      border-radius: 4px !important;
    }
    
    .ql-snow .ql-tooltip input:focus {
      border-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      box-shadow: 0 0 0 2px ${isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'} !important;
    }
    
    .ql-snow .ql-tooltip a {
      background-color: ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      color: #ffffff !important;
      border-radius: 4px !important;
      padding: 4px 8px !important;
      text-decoration: none !important;
      transition: all 0.2s ease !important;
    }
    
    .ql-snow .ql-tooltip a:hover {
      background-color: ${isDarkMode ? '#2563eb' : '#2563eb'} !important;
    }
    
    .ql-snow .ql-tooltip a.ql-preview {
      background-color: ${isDarkMode ? '#6b7280' : '#6b7280'} !important;
    }
    
    .ql-snow .ql-tooltip a.ql-preview:hover {
      background-color: ${isDarkMode ? '#4b5563' : '#4b5563'} !important;
    }
    
    /* Custom scrollbar */
    .ql-container::-webkit-scrollbar {
      width: 8px;
    }
    
    .ql-container::-webkit-scrollbar-track {
      background: ${isDarkMode ? '#374151' : '#f1f5f9'};
      border-radius: 4px;
    }
    
    .ql-container::-webkit-scrollbar-thumb {
      background: ${isDarkMode ? '#6b7280' : '#cbd5e1'};
      border-radius: 4px;
    }
    
    .ql-container::-webkit-scrollbar-thumb:hover {
      background: ${isDarkMode ? '#9ca3af' : '#94a3b8'};
    }
    
    /* Enhanced content styling */
    .ql-editor h1 {
      font-size: 2.25rem !important;
      font-weight: 700 !important;
      line-height: 1.2 !important;
      margin: 1rem 0 !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
    }
    
    .ql-editor h2 {
      font-size: 1.875rem !important;
      font-weight: 600 !important;
      line-height: 1.3 !important;
      margin: 0.875rem 0 !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
    }
    
    .ql-editor h3 {
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      line-height: 1.4 !important;
      margin: 0.75rem 0 !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
    }
    
    .ql-editor h4 {
      font-size: 1.25rem !important;
      font-weight: 600 !important;
      line-height: 1.4 !important;
      margin: 0.625rem 0 !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
    }
    
    .ql-editor h5 {
      font-size: 1.125rem !important;
      font-weight: 600 !important;
      line-height: 1.4 !important;
      margin: 0.5rem 0 !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
    }
    
    .ql-editor h6 {
      font-size: 1rem !important;
      font-weight: 600 !important;
      line-height: 1.4 !important;
      margin: 0.5rem 0 !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
    }
    
    .ql-editor blockquote {
      border-left: 4px solid ${isDarkMode ? '#3b82f6' : '#3b82f6'} !important;
      padding-left: 1rem !important;
      margin: 1rem 0 !important;
      color: ${isDarkMode ? '#d1d5db' : '#6b7280'} !important;
      font-style: italic !important;
      background-color: ${isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'} !important;
      border-radius: 0 4px 4px 0 !important;
    }
    
    .ql-editor code {
      background-color: ${isDarkMode ? '#374151' : '#f3f4f6'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
      padding: 0.125rem 0.25rem !important;
      border-radius: 3px !important;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
      font-size: 0.875rem !important;
    }
    
    .ql-editor pre {
      background-color: ${isDarkMode ? '#1f2937' : '#f8fafc'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
      padding: 1rem !important;
      border-radius: 6px !important;
      border: 1px solid ${isDarkMode ? '#374151' : '#e2e8f0'} !important;
      margin: 1rem 0 !important;
      overflow-x: auto !important;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
    }
    
    .ql-editor pre code {
      background: none !important;
      padding: 0 !important;
      border-radius: 0 !important;
    }
    
    /* Syntax highlighting styles */
    .ql-editor pre.ql-syntax {
      background-color: ${isDarkMode ? '#1f2937' : '#f8fafc'} !important;
      color: ${isDarkMode ? '#f9fafb' : '#111827'} !important;
      border: 1px solid ${isDarkMode ? '#374151' : '#e2e8f0'} !important;
    }
    
    /* Highlight.js theme overrides for dark mode */
    ${isDarkMode ? `
      .ql-editor pre.ql-syntax .hljs {
        background: #1f2937 !important;
        color: #f9fafb !important;
      }
      
      .ql-editor pre.ql-syntax .hljs-comment,
      .ql-editor pre.ql-syntax .hljs-quote {
        color: #6b7280 !important;
      }
      
      .ql-editor pre.ql-syntax .hljs-keyword,
      .ql-editor pre.ql-syntax .hljs-selector-tag,
      .ql-editor pre.ql-syntax .hljs-subst {
        color: #f472b6 !important;
      }
      
      .ql-editor pre.ql-syntax .hljs-number,
      .ql-editor pre.ql-syntax .hljs-literal,
      .ql-editor pre.ql-syntax .hljs-variable,
      .ql-editor pre.ql-syntax .hljs-template-variable,
      .ql-editor pre.ql-syntax .hljs-tag .hljs-attr {
        color: #60a5fa !important;
      }
      
      .ql-editor pre.ql-syntax .hljs-string,
      .ql-editor pre.ql-syntax .hljs-doctag {
        color: #34d399 !important;
      }
      
      .ql-editor pre.ql-syntax .hljs-title,
      .ql-editor pre.ql-syntax .hljs-section,
      .ql-editor pre.ql-syntax .hljs-selector-id {
        color: #fbbf24 !important;
      }
      
      .ql-editor pre.ql-syntax .hljs-type,
      .ql-editor pre.ql-syntax .hljs-class .hljs-title {
        color: #a78bfa !important;
      }
    ` : `
      .ql-editor pre.ql-syntax .hljs {
        background: #f8fafc !important;
        color: #111827 !important;
      }
    `}
    
    .ql-editor ul, .ql-editor ol {
      padding-left: 1.5rem !important;
      margin: 0.5rem 0 !important;
    }
    
    .ql-editor li {
      margin: 0.25rem 0 !important;
    }
    
    .ql-editor a {
      color: ${isDarkMode ? '#60a5fa' : '#3b82f6'} !important;
      text-decoration: underline !important;
      transition: color 0.2s ease !important;
    }
    
    .ql-editor a:hover {
      color: ${isDarkMode ? '#93c5fd' : '#2563eb'} !important;
    }
    
    /* Enhanced image styling with resize support */
    .ql-editor img {
      max-width: 100% !important;
      height: auto !important;
      border-radius: 12px !important;
      margin: 1rem 0 !important;
      box-shadow: ${isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      : '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
    } !important;
      transition: all 0.3s ease !important;
      cursor: pointer !important;
      position: relative !important;
    }
    
    .ql-editor img:hover {
      transform: scale(1.02) !important;
      box-shadow: ${isDarkMode
      ? '0 12px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.3)'
      : '0 12px 48px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.2)'
    } !important;
    }
    
    /* Image resize module styles */
    .ql-image-resize {
      position: relative !important;
      display: inline-block !important;
    }
    
    .ql-image-resize .ql-image-resize-handle {
      position: absolute !important;
      width: 8px !important;
      height: 8px !important;
      background-color: #3b82f6 !important;
      border: 2px solid #ffffff !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      z-index: 1000 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
    }
    
    .ql-image-resize .ql-image-resize-handle:hover {
      background-color: #2563eb !important;
      transform: scale(1.2) !important;
    }
    
    .ql-image-resize .ql-image-resize-handle.ql-image-resize-handle-tl {
      top: -4px !important;
      left: -4px !important;
      cursor: nw-resize !important;
    }
    
    .ql-image-resize .ql-image-resize-handle.ql-image-resize-handle-tr {
      top: -4px !important;
      right: -4px !important;
      cursor: ne-resize !important;
    }
    
    .ql-image-resize .ql-image-resize-handle.ql-image-resize-handle-bl {
      bottom: -4px !important;
      left: -4px !important;
      cursor: sw-resize !important;
    }
    
    .ql-image-resize .ql-image-resize-handle.ql-image-resize-handle-br {
      bottom: -4px !important;
      right: -4px !important;
      cursor: se-resize !important;
    }
    
    .ql-image-resize .ql-image-resize-handle.ql-image-resize-handle-t {
      top: -4px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      cursor: n-resize !important;
    }
    
    .ql-image-resize .ql-image-resize-handle.ql-image-resize-handle-b {
      bottom: -4px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      cursor: s-resize !important;
    }
    
    .ql-image-resize .ql-image-resize-handle.ql-image-resize-handle-l {
      left: -4px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      cursor: w-resize !important;
    }
    
    .ql-image-resize .ql-image-resize-handle.ql-image-resize-handle-r {
      right: -4px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      cursor: e-resize !important;
    }
    
    .ql-image-resize-toolbar {
      position: absolute !important;
      background: ${isDarkMode ? '#374151' : '#ffffff'} !important;
      border: 1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
      border-radius: 6px !important;
      padding: 4px 8px !important;
      box-shadow: ${isDarkMode
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)'
    } !important;
      z-index: 1001 !important;
      font-size: 12px !important;
      color: ${isDarkMode ? '#f9fafb' : '#374151'} !important;
    }
    
    
    .ql-editor video {
      max-width: 100% !important;
      height: auto !important;
      border-radius: 12px !important;
      margin: 1rem 0 !important;
      box-shadow: ${isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)'
    } !important;
    }
    
    
    /* Enhanced focus state */
    .ql-container.ql-snow.ql-focused {
      border-color: #3b82f6 !important;
      box-shadow: 
        0 0 0 3px ${isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'},
        0 8px 32px ${isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)'} !important;
      transform: translateY(-1px) !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    /* Image styling for better visual appeal */
    .ql-editor img {
      cursor: pointer !important;
      transition: all 0.3s ease !important;
    }
    
    .ql-editor img:hover {
      transform: scale(1.02) !important;
    }
    
    /* Global z-index rules for all Quill dropdowns and overlays */
    .ql-snow .ql-picker-options,
    .ql-snow .ql-tooltip,
    .ql-snow .ql-picker.ql-expanded .ql-picker-options {
      z-index: 10000 !important;
    }
    
    /* Ensure all picker dropdowns are above everything */
    .ql-toolbar .ql-picker.ql-expanded {
      z-index: 10001 !important;
    }
    
    .ql-toolbar .ql-picker.ql-expanded .ql-picker-options {
      z-index: 10002 !important;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .ql-toolbar {
        padding: 8px !important;
      }
      
      .ql-toolbar .ql-formats {
        margin-right: 8px !important;
      }
      
      .ql-editor {
        padding: 12px !important;
        font-size: 12px !important; 
      }
    }
  `;

  if (!isMounted || !modulesLoaded) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main'></div>
      </div>
    );
  }

  return (
    <div className={`relative ${isDarkMode ? 'dark' : ''}`}>
      <style>{editorStyles}</style>
      <div className='w-full relative'>


        <ReactQuill
          theme="snow"
          value={editorData}
          onChange={setEditorData}
          modules={modules}
          formats={formats}
          placeholder="✨ Start writing your amazing content here..."
          style={{
            backgroundColor: 'transparent',
          }}
        />


        {/* <div className={`absolute -bottom-1 left-0 right-0 h-1 rounded-lg ${isDarkMode
          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
          : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
          } opacity-60`}></div> */}

      </div>
    </div>
  );
};

export default CkEditor;