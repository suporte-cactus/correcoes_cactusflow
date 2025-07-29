import React from 'react';
import { Button } from '../ui/Button';

type ItemListProps<T> = {
  title: string;
  items: T[];
  onAdd: () => void;
  renderItem: (item: T, idx: number) => React.ReactNode;
  emptyIcon: React.ReactNode;
  emptyText: string;
};

export function ItemList<T>({ title, items, onAdd, renderItem, emptyIcon, emptyText }: ItemListProps<T>) {
  return (
    <div style={{ border: '1px solid #bdc3c7', borderRadius: 5, marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: '#f8f9fa', borderBottom: '1px solid #bdc3c7' }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
        <Button onClick={onAdd}><i className="fa-solid fa-plus"></i> Adicionar</Button>
      </div>
      <div style={{ padding: 15 }}>
        {items.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#aaa', padding: '40px 0' }}>
            {emptyIcon}
            <div style={{ marginTop: 10 }}>{emptyText}</div>
            <Button onClick={onAdd} style={{ marginTop: 10 }}><i className="fa-solid fa-plus"></i> Adicionar</Button>
          </div>
        ) : (
          items.map((item, idx) => renderItem(item, idx))
        )}
      </div>
    </div>
  );
}
