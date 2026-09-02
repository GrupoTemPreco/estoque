import type { Store, Classification, Curve, JanelaDias } from './types';

export const STORES: Store[] = [
  { code: '02', name: 'J. Gramacho' },
  { code: '03', name: 'Nova Campinas' },
  { code: '04', name: 'Figueira' },
  { code: '06', name: 'Lote XV (Temp)' },
  { code: '07', name: 'Lote XV (UP)' },
  { code: '08', name: 'Primavera' },
  { code: '09', name: 'Vasco' },
  { code: '10', name: 'Miguel Couto 1' },
  { code: '11', name: 'Miguel Couto 2' },
  { code: '12', name: 'Miguel Couto 3' },
  { code: '13', name: 'Farrula' },
  { code: '14', name: 'Jd. Glaucia' },
];

export const CLASSIFICATIONS: Classification[] = ['Medicamentos', 'Perfumaria', 'Bonificado', 'Oficinais'];

export const CURVES: Curve[] = ['A', 'B', 'C', 'D', 'Sem Curva'];

export const JANELAS: JanelaDias[] = [7, 15, 30, 60, 90, 120, 180];

export const DEFAULT_JANELA: JanelaDias = 120;

export const P_LIMITE_DIAS = 150;

export const P_LINHAS = 100;

export const ESTOQUE_DIAS_WARNING = 90;

export const DONUT_COLORS: Record<string, string> = {
  Medicamentos: '#0c8de7',
  Perfumaria: '#10b981',
  Bonificado: '#f59e0b',
  Oficinais: '#8b5cf6',
};
