// O estado completo do formulário do produto
export interface ProductState {
  id: string | null;
  name: string;
  unit: 'm2' | 'ml' | 'un' | 'fixed';
  fixedDimensions: {
    width: number;
    height: number;
  };
  pricing: {
    strategy: 'margin' | 'markup' | 'fixed';
    marginPercent: number;
    markupPercent: number;
    fixedPrice: number;
  };
  processes: ProcessItem[];
  materials: MaterialItem[];
  finishes: FinishItem[];
  internalNotes: string;
}

export interface ProcessItem {
  id: string; // UUID
  processId: string; // ID do processo original
  name: string;
  sequenceOrder: number;
  timeFormula: string;
}

export interface MaterialItem {
  id: string; // UUID
  materialId: string; // ID do material original
  name: string;
  consumptionFormula: string;
  wastePercentage: number;
  conditionFormula?: string;
}

export interface FinishItem {
  id: string; // UUID
  finishId: string; // ID do acabamento original
  name: string;
  additionalMarkup: number;
}
