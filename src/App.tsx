import React, { useState } from 'react';
import { ProductProvider } from './contexts/ProductContext';
import { CadastroTab } from './tabs/CadastroTab';
// import { ComposicaoTab } from './tabs/ComposicaoTab';
// import { AcabamentosTab } from './tabs/AcabamentosTab';
import { Button } from './components/ui/Button';

const tabs = [
  { key: 'cadastro', label: 'Cadastro' },
  { key: 'composicao', label: 'Composição' },
  { key: 'acabamentos', label: 'Acabamentos' },
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cadastro');

  return (
    <ProductProvider>
      <div style={{ maxWidth: 1200, margin: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 5px 25px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: '#2c3e50', color: 'white', borderBottom: '4px solid #27ae60' }}>
          <h1 style={{ fontSize: '1.5em', margin: 0, display: 'flex', alignItems: 'center' }}><i className="fa-solid fa-cactus" style={{ color: '#27ae60', marginRight: 10 }}></i> CactusFlow - Cadastro de Produto</h1>
          <Button>Salvar</Button>
        </header>
        <nav style={{ display: 'flex', background: '#f8f9fa', borderBottom: '1px solid #bdc3c7', padding: '0 20px' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={activeTab === tab.key ? 'tab-button active' : 'tab-button'}
              style={{
                padding: '15px 20px',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontSize: '1em',
                color: activeTab === tab.key ? '#27ae60' : '#34495e',
                borderBottom: activeTab === tab.key ? '3px solid #27ae60' : '3px solid transparent',
                fontWeight: activeTab === tab.key ? 500 : 400,
                marginBottom: -1,
                transition: 'all 0.3s',
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <main style={{ padding: 32 }}>
          {activeTab === 'cadastro' && <CadastroTab />}
          {/* {activeTab === 'composicao' && <ComposicaoTab />} */}
          {/* {activeTab === 'acabamentos' && <AcabamentosTab />} */}
        </main>
      </div>
    </ProductProvider>
  );
};
