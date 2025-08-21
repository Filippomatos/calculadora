# Calculadora de Juros - Aplicação Financeira

Uma aplicação React moderna para cálculos financeiros com múltiplas calculadoras e navegação intuitiva.

## 🚀 Funcionalidades

### Página Inicial
- **Interface moderna** com design responsivo
- **Seleção de calculadoras** através de cards interativos
- **Navegação fluida** usando React Router

### Calculadora de Juros (Implementada)
- **Juros Simples**: Calcula juros sobre o capital inicial
- **Juros Compostos**: Calcula juros sobre juros
- **Formatação automática** de valores monetários e percentuais
- **Interface intuitiva** com validação de entrada

### Calculadoras Futuras
- **Calculadora de Empréstimo**: Para cálculo de parcelas
- **Calculadora de Investimento**: Para análise de retornos

## 🛠️ Tecnologias Utilizadas

- **React 19** com TypeScript
- **React Router DOM** para navegação
- **CSS3** com animações e gradientes
- **Vite** como bundler

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── CalculadoraJuros.tsx      # Calculadora principal
│   ├── CalculadoraJuros.css
│   ├── CalculadoraEmprestimo.tsx # Placeholder
│   ├── CalculadoraEmprestimo.css
│   ├── CalculadoraInvestimento.tsx # Placeholder
│   └── CalculadoraInvestimento.css
├── pages/
│   ├── Home.tsx                  # Página inicial
│   └── Home.css
├── App.tsx                       # Configuração de rotas
└── App.css                       # Estilos globais
```

## 🎨 Design

- **Tema cósmico** com gradientes e animações
- **Responsivo** para mobile e desktop
- **Efeitos visuais** modernos e interativos
- **UX otimizada** com feedback visual

## 🚀 Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:5173
   ```

## 📱 Navegação

- **Página Inicial**: Escolha entre as calculadoras disponíveis
- **Calculadora de Juros**: Funcionalidade completa implementada
- **Outras Calculadoras**: Placeholders para desenvolvimento futuro

## 🔧 Desenvolvimento

### Adicionando Novas Calculadoras

1. Crie o componente em `src/components/`
2. Adicione a rota em `src/App.tsx`
3. Atualize a lista de calculadoras em `src/pages/Home.tsx`

### Estrutura de uma Calculadora

```typescript
import { useNavigate } from 'react-router-dom';

const MinhaCalculadora: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <button onClick={() => navigate('/')}>← Voltar</button>
        <h1>Título da Calculadora</h1>
      </div>
      {/* Conteúdo da calculadora */}
    </div>
  );
};
```

## 🎯 Próximos Passos

- [ ] Implementar Calculadora de Empréstimo
- [ ] Implementar Calculadora de Investimento
- [ ] Adicionar mais tipos de cálculos financeiros
- [ ] Implementar histórico de cálculos
- [ ] Adicionar exportação de resultados

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
