import React, { useRef, useEffect, useCallback, useState } from 'react';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder, 
  minHeight = '120px',
  isRTL = false,
  showToolbar = true 
}) => {
  const editorRef = useRef(null);
  const [isComposing, setIsComposing] = useState(false);
  const lastKnownValue = useRef(value || '');

  // Update editor content when value changes from outside
  useEffect(() => {
    if (editorRef.current && !isComposing && value !== lastKnownValue.current) {
      const currentContent = editorRef.current.innerHTML;
      if (currentContent !== value) {
        editorRef.current.innerHTML = value || '';
        lastKnownValue.current = value || '';
      }
    }
  }, [value, isComposing]);

  const execCommand = useCallback((cmd, val) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    // Update value after command
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      lastKnownValue.current = newContent;
      onChange(newContent);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current && !isComposing) {
      const newContent = editorRef.current.innerHTML;
      if (newContent !== lastKnownValue.current) {
        lastKnownValue.current = newContent;
        onChange(newContent);
      }
    }
  }, [onChange, isComposing]);

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => {
    setIsComposing(false);
    handleInput();
  };

  const handleKeyDown = useCallback((e) => {
    // Prevent default behavior for certain keys that might cause issues
    if (e.key === 'Enter' && !e.shiftKey) {
      // Allow default Enter behavior for new paragraphs
      setTimeout(() => {
        handleInput();
      }, 0);
    }
  }, [handleInput]);

  return (
    <div style={{ border: '2px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
      {showToolbar && (
        <div style={{ borderBottom: '1px solid #e5e7eb', padding: '8px', backgroundColor: '#f9fafb', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }} 
            onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button 
            type="button" 
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }} 
            onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button 
            type="button" 
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }} 
            onMouseDown={(e) => { e.preventDefault(); execCommand('underline'); }}
            title="Underline"
          >
            <u>U</u>
          </button>
          <button 
            type="button" 
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }} 
            onMouseDown={(e) => { e.preventDefault(); execCommand('insertUnorderedList'); }}
            title="Bullet List"
          >
            • List
          </button>
          <button 
            type="button" 
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }} 
            onMouseDown={(e) => { e.preventDefault(); execCommand('insertOrderedList'); }}
            title="Numbered List"
          >
            1. List
          </button>
          <button 
            type="button" 
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }} 
            onMouseDown={(e) => { e.preventDefault(); execCommand('justifyLeft'); }}
            title="Align Left"
          >
            Left
          </button>
          <button 
            type="button" 
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }} 
            onMouseDown={(e) => { e.preventDefault(); execCommand('justifyCenter'); }}
            title="Align Center"
          >
            Center
          </button>
          <button 
            type="button" 
            style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer', fontSize: '12px' }} 
            onMouseDown={(e) => { e.preventDefault(); execCommand('justifyRight'); }}
            title="Align Right"
          >
            Right
          </button>
        </div>
      )}
      <div 
        ref={editorRef} 
        contentEditable 
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        style={{ 
          minHeight, 
          padding: '12px', 
          fontSize: '14px', 
          lineHeight: '1.5', 
          fontFamily: 'Helvetica, Arial, sans-serif', 
          outline: 'none', 
          direction: isRTL ? 'rtl' : 'ltr' 
        }} 
        dangerouslySetInnerHTML={{ __html: value || '' }} 
        data-placeholder={placeholder} 
        suppressContentEditableWarning={true} 
      />
      <style jsx>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
        }
        [contenteditable] {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
