import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculadoraInvestimento.css';

const CalculadoraInvestimento: React.FC = () => {
  const navigate = useNavigate();
  const [aporteInicial, setAporteInicial] = useState<string>('');
  const [aporteMensal, setAporteMensal] = useState<string>('');
  const [periodo, setPeriodo] = useState<string>('');
  const [taxaAnual, setTaxaAnual] = useState<string>('');
  const [resultado, setResultado] = useState<any>(null);

  // Função para formatar valor monetário
  const formatarMoeda = (valor: string): string => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros === '') return '';
    
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
    const numeros = valor.replace(/\D/g, '');
    if (numeros === '') return '';
    
    const numero = parseFloat(numeros) / 100;
    return `${numero.toFixed(2)}%`;
  };

  // Função para extrair número de string formatada
  const extrairNumero = (valor: string): number => {
    const numeros = valor.replace(/\D/g, '');
    return numeros === '' ? 0 : parseFloat(numeros) / 100;
  };

  // Função para converter taxa anual para mensal
  const converterTaxaAnualParaMensal = (taxaAnual: number): number => {
    return Math.pow(1 + taxaAnual / 100, 1/12) - 1;
  };

  // Função para calcular investimento com juros compostos e aportes mensais
  const calcularInvestimento = () => {
    const aporteInicialNum = extrairNumero(aporteInicial);
    const aporteMensalNum = extrairNumero(aporteMensal);
    const periodoNum = parseFloat(periodo) || 0;
    const taxaAnualNum = extrairNumero(taxaAnual);

    if (periodoNum <= 0 || taxaAnualNum <= 0) {
      setResultado({
        erro: 'Por favor, preencha o período e a taxa de rendimento corretamente.'
      });
      return;
    }

    // Converter taxa anual para mensal
    const taxaMensal = converterTaxaAnualParaMensal(taxaAnualNum);

    // Calcular montante do aporte inicial
    const montanteAporteInicial = aporteInicialNum * Math.pow(1 + taxaMensal, periodoNum);

    // Calcular montante dos aportes mensais (fórmula de anuidade)
    let montanteAportesMensais = 0;
    if (aporteMensalNum > 0) {
      montanteAportesMensais = aporteMensalNum * 
        ((Math.pow(1 + taxaMensal, periodoNum) - 1) / taxaMensal);
    }

    // Montante total
    const montanteFinal = montanteAporteInicial + montanteAportesMensais;

    // Total investido
    const totalInvestido = aporteInicialNum + (aporteMensalNum * periodoNum);

    // Lucro obtido
    const lucro = montanteFinal - totalInvestido;

    // Taxa mensal formatada
    const taxaMensalFormatada = (taxaMensal * 100).toFixed(4);

    setResultado({
      montanteFinal,
      totalInvestido,
      lucro,
      taxaMensal: taxaMensalFormatada,
      detalhes: {
        aporteInicial: aporteInicialNum,
        aporteMensal: aporteMensalNum,
        periodo: periodoNum,
        taxaAnual: taxaAnualNum
      }
    });
  };

  const limparCampos = () => {
    setAporteInicial('');
    setAporteMensal('');
    setPeriodo('');
    setTaxaAnual('');
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
        <h1 className="calculator-title">Calculadora de Investimento</h1>
      </div>
      
      <div className="input-group">
        <label htmlFor="aporteInicial" className="input-label">
          Aporte Inicial (R$) <span className="optional">(opcional)</span>
        </label>
        <input
          type="text"
          className="input-field"
          id="aporteInicial"
          value={aporteInicial}
          onChange={(e) => setAporteInicial(formatarMoeda(e.target.value))}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="input-group">
        <label htmlFor="aporteMensal" className="input-label">Aporte Mensal (R$)</label>
        <input
          type="text"
          className="input-field"
          id="aporteMensal"
          value={aporteMensal}
          onChange={(e) => setAporteMensal(formatarMoeda(e.target.value))}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="input-group">
        <label htmlFor="periodo" className="input-label">Período de Investimento (meses)</label>
        <input
          type="number"
          className="input-field"
          id="periodo"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          placeholder="Digite o número de meses"
          min="1"
          step="1"
        />
      </div>

      <div className="input-group">
        <label htmlFor="taxaAnual" className="input-label">Taxa de Rendimento Anual (%)</label>
        <input
          type="text"
          className="input-field"
          id="taxaAnual"
          value={taxaAnual}
          onChange={(e) => setTaxaAnual(formatarPercentual(e.target.value))}
          placeholder="0,00%"
        />
      </div>

      <div className="button-group">
        <button className="calc-button calculate" onClick={calcularInvestimento}>
          Calcular Investimento
        </button>
        <button className="calc-button clear" onClick={limparCampos}>
          Limpar
        </button>
      </div>

      {resultado && (
        <div className="result-container">
          {resultado.erro ? (
            <p className="result-error">{resultado.erro}</p>
          ) : (
            <>
              <div className="result-header">
                <h3>Resultado do Investimento</h3>
              </div>
              
              <div className="result-grid">
                <div className="result-item main">
                  <span className="result-label">Montante Final</span>
                  <span className="result-value">
                    {resultado.montanteFinal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>

                <div className="result-item">
                  <span className="result-label">Total Investido</span>
                  <span className="result-value">
                    {resultado.totalInvestido.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>

                <div className="result-item profit">
                  <span className="result-label">Lucro Obtido</span>
                  <span className="result-value">
                    {resultado.lucro.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>

                <div className="result-item">
                  <span className="result-label">Taxa Mensal</span>
                  <span className="result-value">{resultado.taxaMensal}%</span>
                </div>
              </div>

              <div className="result-details">
                <h4>Detalhes do Investimento</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <span>Aporte Inicial:</span>
                    <span>{resultado.detalhes.aporteInicial.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</span>
                  </div>
                  <div className="detail-item">
                    <span>Aporte Mensal:</span>
                    <span>{resultado.detalhes.aporteMensal.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}</span>
                  </div>
                  <div className="detail-item">
                    <span>Período:</span>
                    <span>{resultado.detalhes.periodo} meses</span>
                  </div>
                  <div className="detail-item">
                    <span>Taxa Anual:</span>
                    <span>{resultado.detalhes.taxaAnual.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculadoraInvestimento;
