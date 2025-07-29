import React from 'react';
import { ProcessItem as ProcessItemType } from '../../types/product';
import { Button } from '../ui/Button';

type Props = {
  process: ProcessItemType;
  onUpdate: (field: keyof ProcessItemType, value: any) => void;
  onRemove: () => void;
};

export const ProcessItem: React.FC<Props> = ({ process, onUpdate, onRemove }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #eee' }}>
    <i className="fa-solid fa-grip-vertical handle" title="Arraste para reordenar" style={{ color: '#bdc3c7', cursor: 'grab' }}></i>
    <span style={{ flexGrow: 1, fontWeight: 500 }}>{process.name}</span>
    <input type="text" value={process.timeFormula} style={{ width: 120 }} title="Fórmula de tempo" onChange={e => onUpdate('timeFormula', e.target.value)} />
    <span style={{ fontSize: 12, color: '#888' }}>Ordem: {process.sequenceOrder}</span>
    <Button onClick={onRemove} style={{ background: 'none', color: '#e74c3c' }}><i className="fa-solid fa-trash-can"></i></Button>
  </div>
);
