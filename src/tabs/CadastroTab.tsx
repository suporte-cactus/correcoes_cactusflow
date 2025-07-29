import React, { useContext } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import { Tooltip } from '../components/ui/Tooltip';

export const CadastroTab: React.FC = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { name, unit, fixedDimensions, pricing } = state;

  return (
    <div>
      <h3>Identificação do Produto</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div>
          <label>Nome do Produto *</label>
          <input type="text" value={name} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })} />
        </div>
        <div>
          <label>Unidade de Venda</label>
          <select value={unit} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'unit', value: e.target.value })}>
            <option value="m2">Metro Quadrado</option>
            <option value="ml">Metro Linear</option>
            <option value="un">Unidade</option>
            <option value="fixed">Dimensão Fixa</option>
          </select>
        </div>
        {unit === 'fixed' && (
          <>
            <div>
              <label>Largura (cm)</label>
              <input type="number" value={fixedDimensions.width} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'fixedDimensions', value: { ...fixedDimensions, width: Number(e.target.value) } })} />
            </div>
            <div>
              <label>Altura (cm)</label>
              <input type="number" value={fixedDimensions.height} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'fixedDimensions', value: { ...fixedDimensions, height: Number(e.target.value) } })} />
            </div>
          </>
        )}
      </div>
      <h3 style={{ marginTop: 32 }}>Precificação</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        <div>
          <label>Modo de Precificação</label>
          <div>
            <label><input type="radio" name="pricing" checked={pricing.strategy === 'margin'} onChange={() => dispatch({ type: 'UPDATE_PRICING', pricing: { ...pricing, strategy: 'margin' } })} /> Por Margem</label>
            <label style={{ marginLeft: 16 }}><input type="radio" name="pricing" checked={pricing.strategy === 'markup'} onChange={() => dispatch({ type: 'UPDATE_PRICING', pricing: { ...pricing, strategy: 'markup' } })} /> Por Markup</label>
            <label style={{ marginLeft: 16 }}><input type="radio" name="pricing" checked={pricing.strategy === 'fixed'} onChange={() => dispatch({ type: 'UPDATE_PRICING', pricing: { ...pricing, strategy: 'fixed' } })} /> Preço Fixo</label>
          </div>
        </div>
        {pricing.strategy === 'margin' && (
          <div>
            <label>
              Margem (%)
              <Tooltip text="Preço = CustoTotal / (1 - (margem/100))">
                <i className="fa-solid fa-circle-info" style={{ marginLeft: 6 }} />
              </Tooltip>
            </label>
            <input type="number" value={pricing.marginPercent} onChange={e => dispatch({ type: 'UPDATE_PRICING', pricing: { ...pricing, marginPercent: Number(e.target.value) } })} />
          </div>
        )}
        {pricing.strategy === 'markup' && (
          <div>
            <label>
              Markup (%)
              <Tooltip text="Preço = CustoTotal * (1 + (markup/100))">
                <i className="fa-solid fa-circle-info" style={{ marginLeft: 6 }} />
              </Tooltip>
            </label>
            <input type="number" value={pricing.markupPercent} onChange={e => dispatch({ type: 'UPDATE_PRICING', pricing: { ...pricing, markupPercent: Number(e.target.value) } })} />
          </div>
        )}
        {pricing.strategy === 'fixed' && (
          <div>
            <label>Preço Fixo (R$)</label>
            <input type="number" value={pricing.fixedPrice} onChange={e => dispatch({ type: 'UPDATE_PRICING', pricing: { ...pricing, fixedPrice: Number(e.target.value) } })} />
          </div>
        )}
      </div>
    </div>
  );
};
