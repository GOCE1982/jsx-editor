import './CodeEditor.css';
import './syntax.css'
import React, { useRef, useEffect } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import Editor, { Monaco, useMonaco } from '@monaco-editor/react';
import monaco from 'monaco-editor';
import codeShift from 'jscodeshift';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';

interface CodeEditorValue {
  initialValue: string,
  onChange(value: string): void
}

const CodeEditor: React.FC<CodeEditorValue> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any | null>(null);
  const monaco = useMonaco();

  function handleEditorWillMount(monaco: Monaco) {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  }
  
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });
    
    editorRef.current.focus();
    
    editor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter = new MonacoJSXHighlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      editor,
    )

    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
    highlighter.addJSXCommentCommand();
  }

  const onFormatClick = () => {
    const unformatted = editorRef.current.getModel().getValue();
    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      semi: true,
      useTabs: false,
      singleQuote: true
    }).replace(/\n$/g, '')
    editorRef.current.getModel().setValue(formatted);
  }

  const onCleanInput = () => {
    var val = editorRef.current.getModel().getValue();
    var message = '';
    if (val !== '') {
      editorRef.current.setValue(message);
      editorRef.current.focus();
    }
  }

  useEffect(() => {
    if (monaco) {
      editorRef.current?.focus();
    }
  }, [monaco]);

  return (
    <div className="editor-wrapper">
      <button className="button button-format is-success is-small" onClick={onFormatClick}>Format</button>
      <button className="button button-clean is-warning is-small" onClick={onCleanInput}>Reset</button>
    <Editor
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      options={{
        tabSize: 2,
        wordWrap: 'on',
        minimap: { enabled: false },
        showUnused: false,
        folding: false,
        lineNumbersMinChars: 3,
        fontSize: 16,
        scrollBeyondLastLine: false,
        automaticLayout: true
      }}
      value={initialValue}
      line={2}
      height="100%"
      theme="vs-dark"
      language="javascript"
      defaultLanguage="javascript"
     />
     </div>
  )
}

export default CodeEditor
