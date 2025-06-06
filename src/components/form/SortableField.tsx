import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined } from '@ant-design/icons';

interface SortableFieldProps {
  id: string;
  children: React.ReactNode;
}

export const SortableField: React.FC<SortableFieldProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: isDragging ? '#fafafa' : 'transparent',
    borderRadius: '8px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div 
        {...attributes} 
        {...listeners} 
        style={{ cursor: 'grab', touchAction: 'none', padding: '8px', color: '#999' }}
      >
        <HolderOutlined />
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};