import { useState } from 'react';
interface IProps {
  text: string;
  onEdit?: (text: string) => any;
  onDelete?: () => any;
  onCancelEdit?: () => any;
}
export default function Chip({ text, onEdit, onDelete, onCancelEdit }: IProps) {
  const [editText, setEditText] = useState<string | null>(null);

  const handleFinishedEditing = () => {
    onEdit?.(editText || '');
    setEditText(null);
  };

  const handleCancelEditing = () => {
    onCancelEdit?.();
    setEditText(null);
  };

  const handleChipClick = () => setEditText(text);

  return editText !== null || !text ? (
    <input
      value={editText || ''}
      onChange={(e) => setEditText(e.target.value)}
      onBlur={handleFinishedEditing}
      onKeyDown={(e) => {
        switch (e.key) {
          case 'Enter':
            handleFinishedEditing();
            break;
          case 'Escape':
            handleCancelEditing();
            break;
        }
      }}
      autoFocus
    />
  ) : (
    <div className="chip">
      <div
        role="button"
        tabIndex={0}
        onClick={handleChipClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleChipClick();
          }
        }}
      >
        {text}
      </div>
      {onDelete ? (
        <button className="icon-btn x-button" onClick={onDelete}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      ) : null}
    </div>
  );
}
