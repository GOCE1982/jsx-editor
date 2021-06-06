import './text-editor.css';
import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect, useRef } from 'react';
import { Cell } from '../app';
import { useActions } from '../hooks/use-actions';

interface TextEditorProps {
  cell: Cell
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && event.target && ref.current.contains(event.target as Node)) {
        return;
      }
      setEditing(false);
    }
    document.addEventListener('click', listener, { capture: true });
    return () => (
      document.removeEventListener('click', listener, { capture: true })
    )
  }, []);
  
  return (
    <div className="text-editor card" ref={ref} onClick={() => setEditing(true)}>
      {editing ? <MDEditor value={cell.content} onChange={(v) => updateCell(cell.id, v || '') } /> 
        : <div className="card-content">
            <MDEditor.Markdown source={cell.content || 'Click to edit'} />
          </div>}
    </div>
  )
}

export default TextEditor;
