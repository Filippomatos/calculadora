import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculadoraConversao.css';

interface Moeda {
  codigo: string;
  nome: string;
  simbolo: string;
  taxa: number;
}

interface CotacaoAPI {
  rates: { [key: string]: number };
  base: string;
  date: string;
}

const CalculadoraConversao: React.FC = () => {
  const navigate = useNavigate();
  const [valorOrigem, setValorOrigem] = useState<string>('');
  const [moedaOrigem, setMoedaOrigem] = useState<string>('BRL');
  const [moedaDestino, setMoedaDestino] = useState<string>('USD');
  const [resultado, setResultado] = useState<number | null>(null);
  const [taxaCambio, setTaxaCambio] = useState<number>(0);
  const [cotacoes, setCotacoes] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>('');

  // Lista de moedas disponíveis
  const moedas: Moeda[] = [
    { codigo: 'BRL', nome: 'Real Brasileiro', simbolo: 'R$', taxa: 1 },
    { codigo: 'USD', nome: 'Dólar Americano', simbolo: '$', taxa: 0 },
    { codigo: 'EUR', nome: 'Euro', simbolo: '€', taxa: 0 },
    { codigo: 'GBP', nome: 'Libra Esterlina', simbolo: '£', taxa: 0 },
    { codigo: 'JPY', nome: 'Iene Japonês', simbolo: '¥', taxa: 0 },
    { codigo: 'CAD', nome: 'Dólar Canadense', simbolo: 'C$', taxa: 0 },
    { codigo: 'AUD', nome: 'Dólar Australiano', simbolo: 'A$', taxa: 0 },
    { codigo: 'CHF', nome: 'Franco Suíço', simbolo: 'CHF', taxa: 0 },
    { codigo: 'CNY', nome: 'Yuan Chinês', simbolo: '¥', taxa: 0 },
    { codigo: 'INR', nome: 'Rúpia Indiana', simbolo: '₹', taxa: 0 }
  ];

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

  // Função para extrair número de string formatada
  const extrairNumero = (valor: string): number => {
    const numeros = valor.replace(/\D/g, '');
    return numeros === '' ? 0 : parseFloat(numeros) / 100;
  };

  // Função para obter moeda por código
  const obterMoeda = (codigo: string): Moeda | undefined => {
    return moedas.find(moeda => moeda.codigo === codigo);
  };

  // Função para buscar cotações da API
  const buscarCotacoes = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL');
      const data: CotacaoAPI = await response.json();
      
      setCotacoes(data.rates);
      setUltimaAtualizacao(new Date().toLocaleString('pt-BR'));
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      setLoading(false);
    }
  };

  // Função para calcular conversão
  const calcularConversao = () => {
    const valor = extrairNumero(valorOrigem);
    if (valor <= 0 || Object.keys(cotacoes).length === 0) {
      setResultado(null);
      return;
    }

    const moedaOrigemObj = obterMoeda(moedaOrigem);
    const moedaDestinoObj = obterMoeda(moedaDestino);

    if (moedaOrigemObj && moedaDestinoObj) {
      let taxa: number;
      
      if (moedaOrigem === 'BRL') {
        // De BRL para outra moeda
        taxa = cotacoes[moedaDestino] || 0;
      } else if (moedaDestino === 'BRL') {
        // De outra moeda para BRL
        taxa = 1 / (cotacoes[moedaOrigem] || 1);
      } else {
        // Entre duas moedas estrangeiras (via BRL)
        const taxaOrigem = cotacoes[moedaOrigem] || 1;
        const taxaDestino = cotacoes[moedaDestino] || 1;
        taxa = taxaDestino / taxaOrigem;
      }
      
      setTaxaCambio(taxa);
      const valorConvertido = valor * taxa;
      setResultado(valorConvertido);
    }
  };

  // Função para inverter moedas
  const inverterMoedas = () => {
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(moedaOrigem);
    setResultado(null);
  };

  // Função para limpar campos
  const limparCampos = () => {
    setValorOrigem('');
    setMoedaOrigem('BRL');
    setMoedaDestino('USD');
    setResultado(null);
    setTaxaCambio(0);
  };

  // Buscar cotações ao carregar o componente
  useEffect(() => {
    buscarCotacoes();
  }, []);

  // Calcular conversão automaticamente quando valores mudam
  useEffect(() => {
    if (valorOrigem && extrairNumero(valorOrigem) > 0 && Object.keys(cotacoes).length > 0) {
      calcularConversao();
    } else {
      setResultado(null);
      setTaxaCambio(0);
    }
  }, [valorOrigem, moedaOrigem, moedaDestino, cotacoes]);

  const moedaOrigemObj = obterMoeda(moedaOrigem);
  const moedaDestinoObj = obterMoeda(moedaDestino);

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Voltar
        </button>
        <h1 className="calculator-title">Conversor de Moedas</h1>
      </div>
      
      <div className="conversion-container">
        <div className="conversion-inputs">
          <div className="input-group">
            <label htmlFor="valorOrigem" className="input-label">Valor</label>
            <div className="currency-input">
              <span className="currency-symbol">{moedaOrigemObj?.simbolo}</span>
              <input
                type="text"
                className="input-field"
                id="valorOrigem"
                value={valorOrigem}
                onChange={(e) => setValorOrigem(formatarMoeda(e.target.value))}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="moedaOrigem" className="input-label">De</label>
            <select
              className="input-field"
              id="moedaOrigem"
              value={moedaOrigem}
              onChange={(e) => setMoedaOrigem(e.target.value)}
            >
              {moedas.map((moeda) => (
                <option key={moeda.codigo} value={moeda.codigo}>
                  {moeda.codigo} - {moeda.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="swap-button-container">
            <button 
              className="swap-button"
              onClick={inverterMoedas}
              title="Inverter moedas"
            >
              ⇄
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="moedaDestino" className="input-label">Para</label>
            <select
              className="input-field"
              id="moedaDestino"
              value={moedaDestino}
              onChange={(e) => setMoedaDestino(e.target.value)}
            >
              {moedas.map((moeda) => (
                <option key={moeda.codigo} value={moeda.codigo}>
                  {moeda.codigo} - {moeda.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-group">
          <button className="calc-button clear" onClick={limparCampos}>
            Limpar
          </button>
          <button className="calc-button calculate" onClick={buscarCotacoes}>
            Atualizar Cotações
          </button>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando cotações...</p>
          </div>
        )}

                 {!loading && cotacoes.USD && (
           <div className="cotacao-dolar">
             <h4>💵 Cotação Atual do Dólar</h4>
             <div className="cotacao-value">
               <span>1 USD = R$ {(1 / cotacoes.USD).toFixed(4)}</span>
             </div>
             <small>Última atualização: {ultimaAtualizacao}</small>
           </div>
         )}

        {resultado !== null && (
          <div className="result-container">
            <div className="result-header">
              <h3>Resultado da Conversão</h3>
            </div>
            
            <div className="result-grid">
              <div className="result-item main">
                <span className="result-label">Valor Convertido</span>
                <span className="result-value">
                  {moedaDestinoObj?.simbolo} {resultado.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Taxa de Câmbio</span>
                <span className="result-value">
                  1 {moedaOrigemObj?.codigo} = {taxaCambio.toFixed(4)} {moedaDestinoObj?.codigo}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Valor Original</span>
                <span className="result-value">
                  {moedaOrigemObj?.simbolo} {extrairNumero(valorOrigem).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            </div>

            <div className="result-details">
              <h4>Detalhes da Conversão</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span>Moeda de Origem:</span>
                  <span>{moedaOrigemObj?.nome} ({moedaOrigemObj?.codigo})</span>
                </div>
                <div className="detail-item">
                  <span>Moeda de Destino:</span>
                  <span>{moedaDestinoObj?.nome} ({moedaDestinoObj?.codigo})</span>
                </div>
                <div className="detail-item">
                  <span>Taxa de Câmbio:</span>
                  <span>1 {moedaOrigemObj?.codigo} = {taxaCambio.toFixed(6)} {moedaDestinoObj?.codigo}</span>
                </div>
                <div className="detail-item">
                  <span>Data da Cotação:</span>
                  <span>{new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculadoraConversao;
