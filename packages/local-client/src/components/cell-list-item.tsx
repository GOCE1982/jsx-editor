import { Cell } from '../app';
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import ActionBar from './action-bar';

interface CellListItemProps {
  cell: Cell
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === 'code') {
    child = <>
      <div style={{height: '30px', width: '100%', backgroundColor: '#37414b'}}>
        <ActionBar id={cell.id} />
      </div>
      <CodeCell cell={cell} />
    </>
  } else {
    child = <>
      <TextEditor cell={cell} />
      <ActionBar id={cell.id} />
    </>
  }

  return (
    <div style={{position: 'relative'}}>
      {child}
    </div>
  )
}

export default CellListItem;