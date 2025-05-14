import React from 'react'
import {Editor} from '@monaco-editor/react';

const CodeEditor = ({ givenCode, height = "100%"}) => (
  <Editor
    height={height}
    language="python"
    value={givenCode || '// Select a file to view its content'}
    theme="vs-dark"
    options={{
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      wordWrap: 'on',
      padding: {
        top: 20, 
        bottom: 20
      },
      zIndex: 5
    }}
    loading={<div>Loading Code Editor...</div>}
    onMount={() => console.log('Monaco Editor mounted successfully')}
  />
);

export default CodeEditor;