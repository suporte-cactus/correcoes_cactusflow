import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { ProductState, ProcessItem, MaterialItem, FinishItem } from '../types/product';

// Actions
type Action =
  | { type: 'UPDATE_FIELD'; field: keyof ProductState; value: any }
  | { type: 'ADD_PROCESS'; process: ProcessItem }
  | { type: 'REMOVE_PROCESS'; id: string }
  | { type: 'REORDER_PROCESSES'; from: number; to: number }
  | { type: 'ADD_MATERIAL'; material: MaterialItem }
  | { type: 'REMOVE_MATERIAL'; id: string }
  | { type: 'REORDER_MATERIALS'; from: number; to: number }
  | { type: 'ADD_FINISH'; finish: FinishItem }
  | { type: 'REMOVE_FINISH'; id: string }
  | { type: 'UPDATE_PRICING'; pricing: ProductState['pricing'] };

const initialState: ProductState = {
  id: null,
  name: '',
  unit: 'm2',
  fixedDimensions: { width: 0, height: 0 },
  pricing: { strategy: 'margin', marginPercent: 30, markupPercent: 0, fixedPrice: 0 },
  processes: [],
  materials: [],
  finishes: [],
  internalNotes: '',
};

function reducer(state: ProductState, action: Action): ProductState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_PROCESS':
      return { ...state, processes: [...state.processes, action.process] };
    case 'REMOVE_PROCESS':
      return { ...state, processes: state.processes.filter(p => p.id !== action.id) };
    case 'REORDER_PROCESSES': {
      const arr = [...state.processes];
      const [removed] = arr.splice(action.from, 1);
      arr.splice(action.to, 0, removed);
      return { ...state, processes: arr };
    }
    case 'ADD_MATERIAL':
      return { ...state, materials: [...state.materials, action.material] };
    case 'REMOVE_MATERIAL':
      return { ...state, materials: state.materials.filter(m => m.id !== action.id) };
    case 'REORDER_MATERIALS': {
      const arr = [...state.materials];
      const [removed] = arr.splice(action.from, 1);
      arr.splice(action.to, 0, removed);
      return { ...state, materials: arr };
    }
    case 'ADD_FINISH':
      return { ...state, finishes: [...state.finishes, action.finish] };
    case 'REMOVE_FINISH':
      return { ...state, finishes: state.finishes.filter(f => f.id !== action.id) };
    case 'UPDATE_PRICING':
      return { ...state, pricing: action.pricing };
    default:
      return state;
  }
}

interface ProductContextProps {
  state: ProductState;
  dispatch: Dispatch<Action>;
}

export const ProductContext = createContext<ProductContextProps>({
  state: initialState,
  dispatch: () => {},
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
