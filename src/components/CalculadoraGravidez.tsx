import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculadoraGravidez.css';

interface ResultadoGravidez {
  dataUltimaMenstruacao: Date;
  dataProvavelParto: Date;
  idadeGestacional: number; // em semanas
  trimestre: number;
  semanasRestantes: number;
  diasRestantes: number;
}

const CalculadoraGravidez: React.FC = () => {
  const navigate = useNavigate();
  const [dataUltimaMenstruacao, setDataUltimaMenstruacao] = useState<string>('');
  const [resultado, setResultado] = useState<ResultadoGravidez | null>(null);

  // Função para calcular a data provável do parto (Regra de Naegele)
  const calcularDataProvavelParto = (dataDUM: Date): Date => {
    const dataParto = new Date(dataDUM);
    dataParto.setDate(dataParto.getDate() + 280); // 40 semanas = 280 dias
    return dataParto;
  };

  // Função para calcular idade gestacional em semanas
  const calcularIdadeGestacional = (dataDUM: Date): number => {
    const hoje = new Date();
    const diferenca = hoje.getTime() - dataDUM.getTime();
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    return Math.floor(dias / 7);
  };

  // Função para calcular trimestre
  const calcularTrimestre = (semanas: number): number => {
    if (semanas < 13) return 1;
    if (semanas < 27) return 2;
    return 3;
  };

  // Função para calcular semanas restantes
  const calcularSemanasRestantes = (idadeGestacional: number): number => {
    return Math.max(0, 40 - idadeGestacional);
  };

  // Função para calcular dias restantes
  const calcularDiasRestantes = (dataParto: Date): number => {
    const hoje = new Date();
    const diferenca = dataParto.getTime() - hoje.getTime();
    return Math.max(0, Math.floor(diferenca / (1000 * 60 * 60 * 24)));
  };

  // Função para formatar data
  const formatarData = (data: Date): string => {
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Função para calcular gravidez
  const calcularGravidez = () => {
    if (!dataUltimaMenstruacao) {
      setResultado(null);
      return;
    }

    const dataDUM = new Date(dataUltimaMenstruacao);
    const hoje = new Date();
    
    // Verificar se a data é válida e não é no futuro
    if (isNaN(dataDUM.getTime()) || dataDUM > hoje) {
      setResultado(null);
      return;
    }

    const dataParto = calcularDataProvavelParto(dataDUM);
    const idadeGestacional = calcularIdadeGestacional(dataDUM);
    const trimestre = calcularTrimestre(idadeGestacional);
    const semanasRestantes = calcularSemanasRestantes(idadeGestacional);
    const diasRestantes = calcularDiasRestantes(dataParto);

    setResultado({
      dataUltimaMenstruacao: dataDUM,
      dataProvavelParto: dataParto,
      idadeGestacional,
      trimestre,
      semanasRestantes,
      diasRestantes
    });
  };

  // Função para limpar campos
  const limparCampos = () => {
    setDataUltimaMenstruacao('');
    setResultado(null);
  };

  // Função para obter descrição do trimestre
  const getDescricaoTrimestre = (trimestre: number): string => {
    switch (trimestre) {
      case 1: return 'Primeiro Trimestre (1-12 semanas)';
      case 2: return 'Segundo Trimestre (13-26 semanas)';
      case 3: return 'Terceiro Trimestre (27-40 semanas)';
      default: return 'Período Pós-parto';
    }
  };

  // Função para obter emoji do trimestre
  const getEmojiTrimestre = (trimestre: number): string => {
    switch (trimestre) {
      case 1: return '🌱';
      case 2: return '🌿';
      case 3: return '🌳';
      default: return '👶';
    }
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
        <h1 className="calculator-title">Calculadora de Gravidez</h1>
      </div>
      
      <div className="calculator-content">
        <div className="input-section">
          <div className="input-group">
            <label htmlFor="dataUltimaMenstruacao" className="input-label">
              Data da Última Menstruação (DUM)
            </label>
            <input
              type="date"
              className="input-field"
              id="dataUltimaMenstruacao"
              value={dataUltimaMenstruacao}
              onChange={(e) => setDataUltimaMenstruacao(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <small className="input-help">
              💡 A data provável do parto é calculada adicionando 280 dias (40 semanas) à DUM
            </small>
          </div>

          <div className="button-group">
            <button className="calc-button clear" onClick={limparCampos}>
              Limpar
            </button>
            <button className="calc-button calculate" onClick={calcularGravidez}>
              Calcular Data do Parto
            </button>
          </div>
        </div>

        {resultado && (
          <div className="result-container">
            <div className="result-header">
              <h3>Resultado da Gravidez</h3>
            </div>
            
            <div className="result-grid">
              <div className="result-item main">
                <span className="result-label">👶 Data Provável do Parto</span>
                <span className="result-value">
                  {formatarData(resultado.dataProvavelParto)}
                </span>
              </div>

              <div className="result-item highlight">
                <span className="result-label">
                  {getEmojiTrimestre(resultado.trimestre)} {getDescricaoTrimestre(resultado.trimestre)}
                </span>
                <span className="result-value">
                  {resultado.idadeGestacional} semanas
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">📅 Idade Gestacional</span>
                <span className="result-value">
                  {resultado.idadeGestacional} semanas
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">⏰ Tempo Restante</span>
                <span className="result-value">
                  {resultado.semanasRestantes} semanas ({resultado.diasRestantes} dias)
                </span>
              </div>
            </div>

            <div className="result-details">
              <h4>Detalhes da Gestação</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span>Data da Última Menstruação:</span>
                  <span>{formatarData(resultado.dataUltimaMenstruacao)}</span>
                </div>
                <div className="detail-item">
                  <span>Data Provável do Parto:</span>
                  <span>{formatarData(resultado.dataProvavelParto)}</span>
                </div>
                <div className="detail-item">
                  <span>Idade Gestacional Atual:</span>
                  <span>{resultado.idadeGestacional} semanas</span>
                </div>
                <div className="detail-item">
                  <span>Trimestre Atual:</span>
                  <span>{getDescricaoTrimestre(resultado.trimestre)}</span>
                </div>
                <div className="detail-item">
                  <span>Semanas Restantes:</span>
                  <span>{resultado.semanasRestantes} semanas</span>
                </div>
                <div className="detail-item">
                  <span>Dias Restantes:</span>
                  <span>{resultado.diasRestantes} dias</span>
                </div>
              </div>
            </div>

            <div className="pregnancy-info">
              <div className="pregnancy-card">
                <h4>💡 Informações Importantes</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>📊 Regra de Naegele:</strong>
                    <p>Adiciona 7 dias à DUM, subtrai 3 meses e adiciona 1 ano</p>
                  </div>
                  <div className="info-item">
                    <strong>🎯 Precisão:</strong>
                    <p>Apenas 5% dos bebês nascem na data exata. A maioria nasce entre 37-42 semanas</p>
                  </div>
                  <div className="info-item">
                    <strong>🏥 Ultrassom:</strong>
                    <p>O ultrassom do primeiro trimestre é mais preciso para determinar a idade gestacional</p>
                  </div>
                  <div className="info-item">
                    <strong>⚠️ Aviso:</strong>
                    <p>Esta calculadora é apenas informativa. Sempre consulte seu médico obstetra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculadoraGravidez;
