// Internationalization system
let currentLanguage = 'en';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    settings: 'Settings',
    logs: 'Logs',
    
    // Header
    version: 'Version',
    moduleInfoTitle: 'TCP Optimiser',
    github: 'GitHub Repository',
    telegram: 'Telegram',
    
    // Home Page
    status: 'Status',
    moduleStatus: 'Module Status',
    interfaceType: 'Interface Type',
    interfaceName: 'Interface Name',
    tcpCongestionAlgorithm: 'TCP Congestion Algorithm',
    initcwndValue: 'initcwnd value',
    initrwndValue: 'initrwnd value',
    wifiCalling: 'Wi-Fi Calling',
    loadingModuleStatus: 'Loading Module Status...',
    loadingActiveInterfaceType: 'Loading Active interface type...',
    loadingActiveInterface: 'Loading Active interface...',
    loadingActiveAlgorithm: 'Loading Active Algorithm...',
    loadingInitcwndValue: 'Loading initcwnd value...',
    loadingInitrwndValue: 'Loading initrwnd value...',
    loadingWifiCallingStatus: 'Loading Wi-Fi Calling Status...',
    enabled: 'Enabled ✅',
    disabled: 'Disabled ❌',
    active: 'Active ',
    inactive: 'Inactive ',
    cellular: 'Cellular 📶',
    wifi: 'Wi-Fi 🛜',
    unknown: 'Unknown ⁉️',
    
    // Settings Page
    tcpSettings: 'TCP Settings',
    wifiAlgorithm: 'TCP Congestion Algorithm (Wi-Fi)',
    cellularAlgorithm: 'TCP Congestion Algorithm (Cellular)',
    killConnectionsLabel: 'Kill Connections on Change',
    setMaxInitcwndInitrwnd: 'Set Max initcwnd & initrwnd',
    apply: 'Apply',
    forceApply: 'Force Apply',
    loadingOptions: 'Loading Options',
    language: 'Language',
    
    // Logs Page
    logsHeading: 'Logs',
    clear: 'Clear',
    
    // Messages
    errorUpdatingStatus: 'Error updating status.',
    errorFetchingActiveInterface: 'Error fetching active interface.',
    errorFetchingCongestionControl: 'Error fetching congestion control algorithms.',
    noCongestionControlAlgorithms: 'No congestion control algorithms found.',
    errorFetchingModuleInfo: 'Error fetching module info.',
    errorFetchingModuleState: 'Error fetching module state.',
    modulePropCorrupted: 'module.prop might be corrupted!',
    errorSettingUpdateLoop: 'Error setting update loop.',
    errorLoadingPage: 'Error loading page.',
    failedToFetchCongestionControl: 'Failed to fetch congestion control algorithms'
  },
  
  'pt-BR': {
    // Navegação
    home: 'Início',
    settings: 'Configurações',
    logs: 'Registros',
    
    // Cabeçalho
    version: 'Versão',
    moduleInfoTitle: 'Otimizador TCP',
    github: 'Repositório GitHub',
    telegram: 'Telegram',
    
    // Página Inicial
    status: 'Status',
    moduleStatus: 'Status do Módulo',
    interfaceType: 'Tipo de Interface',
    interfaceName: 'Nome da Interface',
    tcpCongestionAlgorithm: 'Algoritmo de Congestionamento TCP',
    initcwndValue: 'valor de initcwnd',
    initrwndValue: 'valor de initrwnd',
    wifiCalling: 'Chamada Wi-Fi',
    loadingModuleStatus: 'Carregando Status do Módulo...⌛',
    loadingActiveInterfaceType: 'Carregando tipo de interface ativa...',
    loadingActiveInterface: 'Carregando interface ativa...',
    loadingActiveAlgorithm: 'Carregando Algoritmo Ativo...',
    loadingInitcwndValue: 'Carregando valor de initcwnd...',
    loadingInitrwndValue: 'Carregando valor de initrwnd...',
    loadingWifiCallingStatus: 'Carregando Status de Chamada Wi-Fi...',
    enabled: 'Ativado ✅',
    disabled: 'Desativado ❌',
    active: 'Ativo ',
    inactive: 'Inativo ',
    cellular: 'Celular 📶',
    wifi: 'Wi-Fi 🛜',
    unknown: 'Desconhecido ⁉️',
    
    // Página de Configurações
    tcpSettings: 'Configurações TCP',
    wifiAlgorithm: 'Algoritmo de Congestionamento TCP (Wi-Fi)',
    cellularAlgorithm: 'Algoritmo de Congestionamento TCP (Celular)',
    killConnectionsLabel: 'Encerrar Conexões ao Mudar',
    setMaxInitcwndInitrwnd: 'Definir Max initcwnd & initrwnd',
    apply: 'Aplicar',
    forceApply: 'Aplicar à Força',
    loadingOptions: 'Carregando Opções',
    language: 'Idioma',
    
    // Página de Registros
    logsHeading: 'Registros',
    clear: 'Limpar',
    
    // Mensagens
    errorUpdatingStatus: 'Erro ao atualizar status.',
    errorFetchingActiveInterface: 'Erro ao buscar interface ativa.',
    errorFetchingCongestionControl: 'Erro ao buscar algoritmos de controle de congestionamento.',
    noCongestionControlAlgorithms: 'Nenhum algoritmo de controle de congestionamento encontrado.',
    errorFetchingModuleInfo: 'Erro ao buscar informações do módulo.',
    errorFetchingModuleState: 'Erro ao buscar estado do módulo.',
    modulePropCorrupted: 'module.prop pode estar corrompido!',
    errorSettingUpdateLoop: 'Erro ao configurar loop de atualização.',
    errorLoadingPage: 'Erro ao carregar página.',
    failedToFetchCongestionControl: 'Falha ao buscar algoritmos de controle de congestionamento'
  }
};

// Load language preference from localStorage
export function loadLanguagePreference() {
  const saved = localStorage.getItem('tcp_optimiser_language');
  if (saved && translations[saved]) {
    currentLanguage = saved;
  }
  return currentLanguage;
}

// Save language preference
export function saveLanguagePreference(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('tcp_optimiser_language', lang);
    return true;
  }
  return false;
}

// Get current language
export function getCurrentLanguage() {
  return currentLanguage;
}

// Get available languages
export function getAvailableLanguages() {
  return Object.keys(translations).map(lang => ({
    code: lang,
    name: lang === 'en' ? 'English' : lang === 'pt-BR' ? 'Português (Brasil)' : lang
  }));
}

// Translate a key
export function t(key) {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  for (const k of keys) {
    if (value[k] !== undefined) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations['en'];
      for (const k2 of keys) {
        value = value[k2];
      }
      break;
    }
  }
  
  return value || key;
}

// Initialize i18n
export function initI18n() {
  loadLanguagePreference();
}
