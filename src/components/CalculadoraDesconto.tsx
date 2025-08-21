import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculadoraDesconto.css';

interface ResultadoDesconto {
  valorOriginal: number;
  percentualDesconto: number;
  valorDesconto: number;
  valorFinal: number;
  economia: number;
}

const CalculadoraDesconto: React.FC = () => {
  const navigate = useNavigate();
  const [valorOriginal, setValorOriginal] = useState<string>('');
  const [percentualDesconto, setPercentualDesconto] = useState<string>('');
  const [resultado, setResultado] = useState<ResultadoDesconto | null>(null);

  // Função para formatar valor monetário
  const formatarMoeda = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros === '') return '';
    
    const numero = parseFloat(numeros) / 100;
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para formatar percentual
  const formatarPercentual = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros === '') return '';
    
    const numero = parseFloat(numeros) / 100;
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Função para extrair número de string formatada
  const extrairNumero = (valor: string): number => {
    const numeros = valor.replace(/\D/g, '');
    return numeros === '' ? 0 : parseFloat(numeros) / 100;
  };

  // Função para calcular desconto
  const calcularDesconto = () => {
    const valor = extrairNumero(valorOriginal);
    const desconto = extrairNumero(percentualDesconto);
    
    if (valor <= 0 || desconto <= 0 || desconto >= 100) {
      setResultado(null);
      return;
    }

    const valorDesconto = valor * (desconto / 100);
    const valorFinal = valor - valorDesconto;
    const economia = valorDesconto; // Economia é igual ao valor do desconto

    setResultado({
      valorOriginal: valor,
      percentualDesconto: desconto,
      valorDesconto,
      valorFinal,
      economia
    });
  };

  // Função para limpar campos
  const limparCampos = () => {
    setValorOriginal('');
    setPercentualDesconto('');
    setResultado(null);
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
        <h1 className="calculator-title">Calculadora de Desconto</h1>
      </div>
      
      <div className="calculator-content">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="valorOriginal" className="input-label">Valor Original</label>
            <div className="currency-input">
              <span className="currency-symbol">R$</span>
              <input
                type="text"
                className="input-field"
                id="valorOriginal"
                value={valorOriginal}
                onChange={(e) => setValorOriginal(formatarMoeda(e.target.value))}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="percentualDesconto" className="input-label">Percentual de Desconto (%)</label>
            <div className="percent-input">
              <input
                type="text"
                className="input-field"
                id="percentualDesconto"
                value={percentualDesconto}
                onChange={(e) => setPercentualDesconto(formatarPercentual(e.target.value))}
                placeholder="0,00"
              />
              <span className="percent-symbol">%</span>
            </div>
          </div>

          <div className="button-group">
            <button className="calc-button clear" onClick={limparCampos}>
              Limpar
            </button>
            <button className="calc-button calculate" onClick={calcularDesconto}>
              Calcular Desconto
            </button>
          </div>
        </div>

        {resultado && (
          <div className="result-container">
            <div className="result-header">
              <h3>Resultado do Desconto</h3>
            </div>
            
            <div className="result-grid">
              <div className="result-item main">
                <span className="result-label">Valor Final</span>
                <span className="result-value">
                  R$ {resultado.valorFinal.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>

              <div className="result-item highlight">
                <span className="result-label">💰 Economia</span>
                <span className="result-value">
                  R$ {resultado.economia.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Valor Original</span>
                <span className="result-value">
                  R$ {resultado.valorOriginal.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Desconto Aplicado</span>
                <span className="result-value">
                  {resultado.percentualDesconto.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="result-details">
              <h4>Detalhes do Cálculo</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span>Valor Original:</span>
                  <span>R$ {resultado.valorOriginal.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
                <div className="detail-item">
                  <span>Percentual de Desconto:</span>
                  <span>{resultado.percentualDesconto.toFixed(2)}%</span>
                </div>
                <div className="detail-item">
                  <span>Valor do Desconto:</span>
                  <span>R$ {resultado.valorDesconto.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
                <div className="detail-item">
                  <span>Valor Final:</span>
                  <span>R$ {resultado.valorFinal.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
                <div className="detail-item highlight">
                  <span>💰 Economia Total:</span>
                  <span>R$ {resultado.economia.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
              </div>
            </div>

            <div className="savings-info">
              <div className="savings-card">
                <h4>💡 Dica de Economia</h4>
                <p>
                  Com {resultado.percentualDesconto.toFixed(2)}% de desconto, você economizou{' '}
                  <strong>R$ {resultado.economia.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</strong>!
                </p>
                <p>
                  Isso representa uma economia de{' '}
                  <strong>{((resultado.economia / resultado.valorOriginal) * 100).toFixed(2)}%</strong>{' '}
                  do valor original.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculadoraDesconto;
