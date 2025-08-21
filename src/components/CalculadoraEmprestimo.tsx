import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculadoraEmprestimo.css';

type TipoAmortizacao = 'price' | 'sac' | 'nenhuma';
type FrequenciaPagamento = 'mensal' | 'trimestral' | 'semestral' | 'anual';

interface ResultadoEmprestimo {
  valorParcela: number;
  totalPago: number;
  totalJuros: number;
  amortizacao: number;
  parcelas: Array<{
    numero: number;
    valorParcela: number;
    amortizacao: number;
    juros: number;
    saldoDevedor: number;
  }>;
}

const CalculadoraEmprestimo: React.FC = () => {
  const navigate = useNavigate();
  const [valorEmprestimo, setValorEmprestimo] = useState<string>('');
  const [taxaAnual, setTaxaAnual] = useState<string>('');
  const [prazo, setPrazo] = useState<string>('');
  const [tipoAmortizacao, setTipoAmortizacao] = useState<TipoAmortizacao>('price');
  const [frequenciaPagamento, setFrequenciaPagamento] = useState<FrequenciaPagamento>('mensal');
  const [resultado, setResultado] = useState<ResultadoEmprestimo | null>(null);

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

  // Função para converter taxa anual para a frequência de pagamento
  const converterTaxa = (taxaAnual: number, frequencia: FrequenciaPagamento): number => {
    const periodosPorAno = {
      mensal: 12,
      trimestral: 4,
      semestral: 2,
      anual: 1
    };
    
    const periodos = periodosPorAno[frequencia];
    
    // Para juros simples: i_m = i_a / 12
    if (frequencia === 'mensal') {
      return (taxaAnual / 100) / 12;
    }
    
    // Para outros períodos: i_m = (1 + i_a)^(1/periodos) - 1
    return Math.pow(1 + taxaAnual / 100, 1 / periodos) - 1;
  };

  // Função para calcular empréstimo pelo sistema Price
  const calcularPrice = (principal: number, taxaPeriodo: number, periodos: number): ResultadoEmprestimo => {
    // Fórmula Price: P = V * (i * (1 + i)^n) / ((1 + i)^n - 1)
    const valorParcela = principal * (taxaPeriodo * Math.pow(1 + taxaPeriodo, periodos)) / 
                        (Math.pow(1 + taxaPeriodo, periodos) - 1);
    
    const parcelas = [];
    let saldoDevedor = principal;
    let totalJuros = 0;

    for (let i = 1; i <= periodos; i++) {
      // Juros da parcela: J_t = S_{t-1} * i_m
      const juros = saldoDevedor * taxaPeriodo;
      // Amortização: A_t = P - J_t
      const amortizacao = valorParcela - juros;
      // Saldo devedor: S_t = S_{t-1} - A_t
      saldoDevedor -= amortizacao;
      totalJuros += juros;

      parcelas.push({
        numero: i,
        valorParcela,
        amortizacao,
        juros,
        saldoDevedor: Math.max(0, saldoDevedor)
      });
    }

    return {
      valorParcela,
      totalPago: valorParcela * periodos,
      totalJuros,
      amortizacao: principal,
      parcelas
    };
  };

  // Função para calcular empréstimo pelo sistema SAC
  const calcularSAC = (principal: number, taxaPeriodo: number, periodos: number): ResultadoEmprestimo => {
    // Calcular a amortização fixa: A = V / n
    const amortizacaoFixa = principal / periodos;
    const parcelas = [];
    let saldoDevedor = principal;
    let totalJuros = 0;

    for (let i = 1; i <= periodos; i++) {
      // Para cada parcela t: P_t = A + (V - (t-1) * A) * i_m
      const juros = saldoDevedor * taxaPeriodo;
      const valorParcela = amortizacaoFixa + juros;
      // Atualizar o saldo devedor: S_t = V - t * A
      saldoDevedor -= amortizacaoFixa;
      totalJuros += juros;

      parcelas.push({
        numero: i,
        valorParcela,
        amortizacao: amortizacaoFixa,
        juros,
        saldoDevedor: Math.max(0, saldoDevedor)
      });
    }

    return {
      valorParcela: parcelas[0].valorParcela, // Primeira parcela como referência
      totalPago: parcelas.reduce((total, p) => total + p.valorParcela, 0),
      totalJuros,
      amortizacao: principal,
      parcelas
    };
  };

  // Função para calcular empréstimo com parcelas fixas (juros simples)
  const calcularSemAmortizacao = (principal: number, taxaPeriodo: number, periodos: number): ResultadoEmprestimo => {
    // Parcelas fixas com juros simples: A = V/n, J_t = V * i_m, P = A + J_t
    const amortizacaoFixa = principal / periodos;
    const jurosPorPeriodo = principal * taxaPeriodo;
    const valorParcela = amortizacaoFixa + jurosPorPeriodo;
    
    const parcelas = [];
    let saldoDevedor = principal;
    let totalJuros = 0;

    for (let i = 1; i <= periodos; i++) {
      const juros = jurosPorPeriodo; // Juros fixos por período
      const amortizacao = amortizacaoFixa;
      
      totalJuros += juros;
      saldoDevedor -= amortizacao;

      parcelas.push({
        numero: i,
        valorParcela,
        amortizacao,
        juros,
        saldoDevedor: Math.max(0, saldoDevedor)
      });
    }

    return {
      valorParcela,
      totalPago: valorParcela * periodos,
      totalJuros,
      amortizacao: principal,
      parcelas
    };
  };

  const calcularEmprestimo = () => {
    const principal = extrairNumero(valorEmprestimo);
    const taxaAnualNum = extrairNumero(taxaAnual);
    const prazoNum = parseFloat(prazo) || 0;

    if (principal <= 0 || taxaAnualNum <= 0 || prazoNum <= 0) {
      setResultado(null);
      return;
    }

    // Converter taxa anual para a frequência de pagamento
    const taxaPeriodo = converterTaxa(taxaAnualNum, frequenciaPagamento);
    
    // Calcular número de períodos baseado na frequência
    const periodosPorAno = {
      mensal: 12,
      trimestral: 4,
      semestral: 2,
      anual: 1
    };
    
    const periodos = prazoNum * periodosPorAno[frequenciaPagamento];

    let resultadoCalculo: ResultadoEmprestimo;

    if (tipoAmortizacao === 'price') {
      resultadoCalculo = calcularPrice(principal, taxaPeriodo, periodos);
    } else if (tipoAmortizacao === 'sac') {
      resultadoCalculo = calcularSAC(principal, taxaPeriodo, periodos);
    } else {
      resultadoCalculo = calcularSemAmortizacao(principal, taxaPeriodo, periodos);
    }

    setResultado(resultadoCalculo);
  };

  const limparCampos = () => {
    setValorEmprestimo('');
    setTaxaAnual('');
    setPrazo('');
    setTipoAmortizacao('price');
    setFrequenciaPagamento('mensal');
    setResultado(null);
  };

  const formatarFrequencia = (freq: FrequenciaPagamento): string => {
    const formatacoes = {
      mensal: 'Mensal',
      trimestral: 'Trimestral',
      semestral: 'Semestral',
      anual: 'Anual'
    };
    return formatacoes[freq];
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
        <h1 className="calculator-title">Calculadora de Empréstimo</h1>
      </div>
      
      <div className="input-group">
        <label htmlFor="valorEmprestimo" className="input-label">Valor do Empréstimo (R$)</label>
        <input
          type="text"
          className="input-field"
          id="valorEmprestimo"
          value={valorEmprestimo}
          onChange={(e) => setValorEmprestimo(formatarMoeda(e.target.value))}
          placeholder="R$ 0,00"
        />
      </div>

      <div className="input-group">
        <label htmlFor="taxaAnual" className="input-label">Taxa de Juros Anual (%)</label>
        <input
          type="text"
          className="input-field"
          id="taxaAnual"
          value={taxaAnual}
          onChange={(e) => setTaxaAnual(formatarPercentual(e.target.value))}
          placeholder="0,00%"
        />
      </div>

      <div className="input-group">
        <label htmlFor="prazo" className="input-label">Prazo (anos)</label>
        <input
          type="number"
          className="input-field"
          id="prazo"
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          placeholder="Digite o prazo em anos"
          min="1"
          step="1"
        />
      </div>

      <div className="input-group">
        <label htmlFor="tipoAmortizacao" className="input-label">Sistema de Amortização</label>
        <select
          className="input-field"
          id="tipoAmortizacao"
          value={tipoAmortizacao}
          onChange={(e) => setTipoAmortizacao(e.target.value as TipoAmortizacao)}
        >
                     <option value="price">Tabela Price (Parcelas Fixas)</option>
           <option value="sac">SAC (Amortização Constante)</option>
                             <option value="nenhuma">Parcelas Fixas (Juros Simples)</option>
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="frequenciaPagamento" className="input-label">Frequência de Pagamento</label>
        <select
          className="input-field"
          id="frequenciaPagamento"
          value={frequenciaPagamento}
          onChange={(e) => setFrequenciaPagamento(e.target.value as FrequenciaPagamento)}
        >
          <option value="mensal">Mensal</option>
          <option value="trimestral">Trimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
        </select>
      </div>

      <div className="button-group">
        <button className="calc-button calculate" onClick={calcularEmprestimo}>
          Calcular Empréstimo
        </button>
        <button className="calc-button clear" onClick={limparCampos}>
          Limpar
        </button>
      </div>

      {resultado && (
        <div className="result-container">
          <div className="result-header">
            <h3>Resultado do Empréstimo</h3>
          </div>
          
          <div className="result-grid">
                         <div className="result-item main">
                               <span className="result-label">
                  {tipoAmortizacao === 'price' ? 'Valor da Parcela' : 
                   tipoAmortizacao === 'nenhuma' ? 'Valor da Parcela' : 'Primeira Parcela'}
                </span>
              <span className="result-value">
                {resultado.valorParcela.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>

            <div className="result-item">
              <span className="result-label">Total Pago</span>
              <span className="result-value">
                {resultado.totalPago.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>

            <div className="result-item profit">
              <span className="result-label">Total de Juros</span>
              <span className="result-value">
                {resultado.totalJuros.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </span>
            </div>

                         <div className="result-item">
               <span className="result-label">Sistema</span>
                               <span className="result-value">
                  {tipoAmortizacao === 'price' ? 'Price' : 
                   tipoAmortizacao === 'sac' ? 'SAC' : 'Parcelas Fixas'}
                </span>
             </div>
          </div>

          <div className="result-details">
            <h4>Detalhes do Empréstimo</h4>
            <div className="details-grid">
              <div className="detail-item">
                <span>Valor Emprestado:</span>
                <span>{extrairNumero(valorEmprestimo).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}</span>
              </div>
              <div className="detail-item">
                <span>Taxa Anual:</span>
                <span>{extrairNumero(taxaAnual).toFixed(2)}%</span>
              </div>
              <div className="detail-item">
                <span>Prazo:</span>
                <span>{prazo} anos</span>
              </div>
              <div className="detail-item">
                <span>Frequência:</span>
                <span>{formatarFrequencia(frequenciaPagamento)}</span>
              </div>
            </div>
          </div>

          {resultado.parcelas.length > 0 && (
            <div className="parcelas-table">
              <h4>Tabela de Parcelas</h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Parcela</th>
                      <th>Valor</th>
                      <th>Amortização</th>
                      <th>Juros</th>
                      <th>Saldo Devedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.parcelas.slice(0, 12).map((parcela) => (
                      <tr key={parcela.numero}>
                        <td>{parcela.numero}</td>
                        <td>{parcela.valorParcela.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}</td>
                        <td>{parcela.amortizacao.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}</td>
                        <td>{parcela.juros.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}</td>
                        <td>{parcela.saldoDevedor.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}</td>
                      </tr>
                    ))}
                    {resultado.parcelas.length > 12 && (
                      <tr>
                        <td colSpan={5} className="table-note">
                          ... e mais {resultado.parcelas.length - 12} parcelas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculadoraEmprestimo;
