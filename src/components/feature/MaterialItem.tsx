import React from 'react';
import { MaterialItem as MaterialItemType } from '../../types/product';
import { Button } from '../ui/Button';

type Props = {
  material: MaterialItemType;
  onUpdate: (field: keyof MaterialItemType, value: any) => void;
  onRemove: () => void;
};

export const MaterialItem: React.FC<Props> = ({ material, onUpdate, onRemove }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #eee' }}>
    <i className="fa-solid fa-grip-vertical handle" title="Arraste para reordenar" style={{ color: '#bdc3c7', cursor: 'grab' }}></i>
    <span style={{ flexGrow: 1, fontWeight: 500 }}>{material.name}</span>
    <input type="text" value={material.consumptionFormula} style={{ width: 120 }} title="Fórmula de consumo" onChange={e => onUpdate('consumptionFormula', e.target.value)} />
    <input type="number" value={material.wastePercentage} style={{ width: 60 }} title="% Desperdício" onChange={e => onUpdate('wastePercentage', Number(e.target.value))} />
    <input type="text" value={material.conditionFormula || ''} style={{ width: 120 }} title="Condição (opcional)" onChange={e => onUpdate('conditionFormula', e.target.value)} />
    <Button onClick={onRemove} style={{ background: 'none', color: '#e74c3c' }}><i className="fa-solid fa-trash-can"></i></Button>
  </div>
);
