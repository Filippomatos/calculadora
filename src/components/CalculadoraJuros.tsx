import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculadoraJuros.css';

const CalculadoraJuros: React.FC = () => {
  const navigate = useNavigate();
  const [capital, setCapital] = useState<string>('');
  const [taxa, setTaxa] = useState<string>('');
  const [tempo, setTempo] = useState<string>('');
  const [resultado, setResultado] = useState<string>('');

  // Função para formatar valor monetário
  const formatarMoeda = (valor: string): string => {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, '');
    
    if (numeros === '') return '';
    
    // Converte para número e formata
    const numero = parseFloat(numeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para formatar percentual
  const formatarPercentual = (valor: string): string => {
    // Remove tudo que não é número
    const numeros = valor.replace(/\D/g, '');
    
    if (numeros === '') return '';
    
    // Converte para número e formata
    const numero = parseFloat(numeros) / 100;
    return `${numero.toFixed(2)}%`;
  };

  // Função para extrair número de string formatada
  const extrairNumero = (valor: string): number => {
    const numeros = valor.replace(/\D/g, '');
    return numeros === '' ? 0 : parseFloat(numeros) / 100;
  };

  const calcularJurosSimples = () => {
    const capitalNum = extrairNumero(capital);
    const taxaNum = extrairNumero(taxa);
    const tempoNum = parseFloat(tempo) || 0;
    
    const juros = capitalNum * (taxaNum / 100) * tempoNum;
    setResultado(`Juros Simples: ${juros.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })}`);
  };

  const calcularJurosCompostos = () => {
    const capitalNum = extrairNumero(capital);
    const taxaNum = extrairNumero(taxa);
    const tempoNum = parseFloat(tempo) || 0;
    
    const montante = capitalNum * Math.pow(1 + taxaNum / 100, tempoNum);
    const juros = montante - capitalNum;
    
    setResultado(`Juros Compostos: ${juros.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })} (Montante: ${montante.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })})`);
  };

  const limparCampos = () => {
    setCapital('');
    setTaxa('');
    setTempo('');
    setResultado('');
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Voltar
        </button>
        <h1 className="calculator-title">Calculadora de Juros</h1>
      </div>
      
      <div className="input-group">
        <label htmlFor="capital" className="input-label">Capital (R$)</label>
        <input
          type="text"
          className="input-field"
          id="capital"
          value={capital}
          onChange={(e) => setCapital(formatarMoeda(e.target.value))}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="input-group">
        <label htmlFor="taxa" className="input-label">Taxa de Juros (% ao período)</label>
        <input
          type="text"
          className="input-field"
          id="taxa"
          value={taxa}
          onChange={(e) => setTaxa(formatarPercentual(e.target.value))}
          placeholder="0,00%"
        />
      </div>

      <div className="input-group">
        <label htmlFor="tempo" className="input-label">Tempo (períodos)</label>
        <input
          type="number"
          className="input-field"
          id="tempo"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
          placeholder="Digite o número de períodos"
          min="0"
          step="1"
        />
      </div>

      <div className="button-group">
        <button className="calc-button simple" onClick={calcularJurosSimples}>
          Juros Simples
        </button>
        <button className="calc-button compound" onClick={calcularJurosCompostos}>
          Juros Compostos
        </button>
        <button className="calc-button clear" onClick={limparCampos}>
          Limpar
        </button>
      </div>

      {resultado && (
        <div className="result-container">
          <p className="result-text">{resultado}</p>
        </div>
      )}
    </div>
  );
};

export default CalculadoraJuros;
