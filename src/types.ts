export type StoreCode = '02' | '03' | '04' | '06' | '07' | '08' | '09' | '10' | '11' | '12' | '13' | '14';

export type Classification = 'Medicamentos' | 'Perfumaria' | 'Bonificado' | 'Oficinais';

export type Curve = 'A' | 'B' | 'C' | 'D' | 'Sem Curva';

export type ValorModo = 'custo' | 'venda';

export type ListaModo = 'produto' | 'principio-ativo';

export type Severidade = 'sem_estoque' | 'sem_venda' | 'critico' | 'atencao' | 'ok';

export interface Store {
  code: StoreCode;
  name: string;
}

export interface Filters {
  loja: StoreCode | 'all';
  classe: Classification | 'all';
  curva: Curve | 'all';
}

export type JanelaDias = 7 | 15 | 30 | 60 | 90 | 120 | 180;

export interface DashboardParametros {
  janela: number;
  limite_dias: number;
  loja: string | null;
  classe: string | null;
  curva: string | null;
}

export interface DashboardResumo {
  itens_parados: number;
  valor_parado_custo: number;
  valor_parado_venda: number;
  itens_acima_limite: number;
  valor_acima_limite_custo: number;
  valor_acima_limite_venda: number;
  itens_sem_venda: number;
  valor_sem_venda_custo: number;
  valor_sem_venda_venda: number;
}

export interface EstoqueTotal {
  itens: number;
  valor_custo: number;
  valor_venda: number;
}

export interface UltimaAtualizacao {
  em: string | null;
  registros: number;
}

export interface PorClassificacao {
  classe: string;
  itens: number;
  valor_custo: number;
  valor_venda: number;
}

export interface PorLoja {
  loja_codigo: string;
  loja_nome: string;
  itens: number;
  valor_custo: number;
  valor_venda: number;
}

export interface PorCurva {
  curva: string;
  itens: number;
  valor_custo: number;
  valor_venda: number;
}

export interface TempoSemVenda {
  ordem: number;
  faixa: string;
  itens: number;
  valor_custo: number;
}

export interface TabelaItem {
  loja_codigo: string;
  loja_nome: string;
  produtoid: number | string;
  produto_codigo: string;
  produto_descricao: string;
  classe_principal: string;
  curva_qtd: Curve | string;
  est_dias: number | null;
  media_mensal: number;
  vendas_periodo: number;
  ultima_venda: string | null;
  ultima_compra: string | null;
  estoque_atual: number;
  valor_custo: number;
  valor_venda: number;
}

export interface SemVendaItem {
  loja_codigo: string;
  loja_nome: string;
  produtoid: number | string;
  produto_codigo: string;
  produto_descricao: string;
  classe_principal: string;
  curva_qtd: Curve | string;
  ultima_venda: string | null;
  ultima_compra: string | null;
  estoque_atual: number;
  valor_custo: number;
  valor_venda: number;
}

export interface DashboardTotais {
  itens_na_tabela: number;
  itens_sem_vendas: number;
}

export interface SemVendaKpis {
  dias_medio: number;
  itens_mais_180d: number;
  itens_nunca: number;
  valor_nunca: number;
  max_dias: number;
}

export interface TopSemVendaItem {
  loja_codigo: string;
  loja_nome: string;
  produtoid: number | string;
  produto_codigo: string;
  produto_descricao: string;
  classe_principal: string;
  dias_sem_venda: number;
  ultima_venda: string | null;
  estoque_atual: number;
  valor_custo: number;
  valor_venda: number;
}

export interface DashboardEstoqueResponse {
  parametros: DashboardParametros;
  resumo: DashboardResumo;
  estoque_total: EstoqueTotal;
  ultima_atualizacao: UltimaAtualizacao;
  por_classificacao: PorClassificacao[];
  por_loja: PorLoja[];
  por_curva: PorCurva[];
  tempo_sem_venda: TempoSemVenda[];
  tabela: TabelaItem[];
  sem_vendas: SemVendaItem[];
  totais: DashboardTotais;
  sem_venda_kpis: SemVendaKpis;
  top_sem_venda: TopSemVendaItem[];
}

export interface DashboardEstoqueParams {
  janela: number;
  loja: string | null;
  classe: string | null;
  curva: string | null;
}

export interface ItemParadoLoja {
  produtoid: number | string;
  produto_codigo: string;
  produto_descricao: string;
  classe_principal: string;
  curva_qtd: string;
  est_dias: number | null;
  media_mensal: number;
  vendas_periodo: number;
  ultima_venda: string | null;
  ultima_compra: string | null;
  dias_sem_venda: number;
  estoque_atual: number;
  valor_custo: number;
  valor_venda: number;
  ordem_severidade: number;
}

export interface ItensParadosLojaResponse {
  loja_codigo: string;
  loja_nome: string;
  parametros: { janela: number; limite_dias: number; classe: string | null; curva: string | null };
  totais: {
    itens: number;
    valor_custo: number;
    valor_venda: number;
    itens_sem_venda: number;
    itens_acima_limite: number;
  };
  itens: ItemParadoLoja[];
}

export interface BuscarProdutosItem {
  loja_codigo: string;
  loja_nome: string;
  produtoid: number | string;
  produto_codigo: string;
  produto_descricao: string;
  classe_principal: string;
  curva_qtd: string;
  est_dias: number | null;
  media_mensal: number;
  vendas_periodo: number;
  ultima_venda: string | null;
  ultima_compra: string | null;
  dias_sem_venda: number;
  estoque_atual: number;
  valor_custo: number;
  valor_venda: number;
  ordem_severidade: number;
}

export interface BuscarProdutosResponse {
  termo: string;
  parametros: DashboardParametros;
  totais: { encontrados: number; exibidos: number; valor_custo: number };
  itens: BuscarProdutosItem[];
}

export interface ProdutoGeral {
  produtoid: number | string;
  produto_codigo: string;
  produto_descricao: string;
  codigo_barras: string | null;
  fabricante: string | null;
  principio_ativo: string | null;
  fornecedor: string | null;
  classe_principal: string;
  classificacao: string | null;
  curva_qtd: string;
  preco_venda: number;
  custo_medio: number;
  lojas_com_produto: number;
  lojas_com_estoque: number;
  estoque_total: number;
  valor_custo_total: number;
  valor_venda_total: number;
  media_mensal_rede: number;
  ultima_venda_rede: string | null;
  ultima_compra_rede: string | null;
  dias_sem_venda_rede: number | null;
  est_dias_rede: number | null;
}

export interface VendasJanelas {
  d7: number;
  d15: number;
  d30: number;
  d60: number;
  d90: number;
  d120: number;
  d180: number;
}

export interface ProdutoPorLoja {
  loja_codigo: string;
  loja_nome: string;
  curva_qtd: string;
  estoque_atual: number;
  media_mensal: number;
  vendas_periodo: number;
  est_dias: number | null;
  ultima_venda: string | null;
  ultima_compra: string | null;
  dias_sem_venda: number | null;
  valor_custo: number;
  valor_venda: number;
  custo_medio: number;
  preco_venda: number;
  destaque: boolean;
  severidade: Severidade;
}

export interface ProdutoEmbalagem {
  loja_codigo: string;
  loja_nome: string;
  embalagemid: number | string;
  codigo_barras: string | null;
  etiqueta: string | null;
  quantidadeporembalagem: number;
  padraofornecedores: boolean | null;
  estoque_atual: number;
  estoque_em_unidades: number;
  preco_venda: number;
  custo_medio: number;
  vendas_7d: number;
  vendas_30d: number;
  vendas_120d: number;
  vendas_180d: number;
  ultima_venda: string | null;
  valor_venda: number;
}

export interface DetalheProdutoResponse {
  geral: ProdutoGeral;
  vendas_janelas: VendasJanelas;
  por_loja: ProdutoPorLoja[];
  embalagens: ProdutoEmbalagem[];
}

export interface RankingPaItem {
  principio_ativo: string;
  produtos: number;
  lojas: number;
  linhas_com_estoque: number;
  estoque_total: number;
  vendas_periodo: number;
  media_mensal: number;
  ultima_venda: string | null;
  ultima_compra: string | null;
  dias_sem_venda: number | null;
  nunca_vendeu: boolean;
  valor_custo: number;
  valor_venda: number;
  curva_qtd: string;
}

export interface RankingPrincipioAtivoResponse {
  parametros: DashboardParametros;
  totais: {
    grupos: number;
    grupos_nunca: number;
    grupos_mais_180d: number;
    valor_custo_total: number;
  };
  itens: RankingPaItem[];
}

export interface PaGrupo {
  ultima_venda: string | null;
  dias_sem_venda: number | null;
  produtos: number;
  lojas: number;
  estoque_total: number;
  valor_custo: number;
  valor_venda: number;
  media_mensal: number;
}

export interface PaProdutoItem {
  loja_codigo: string;
  loja_nome: string;
  produtoid: number | string;
  produto_codigo: string;
  produto_descricao: string;
  fabricante: string | null;
  classe_principal: string;
  curva_qtd: string;
  estoque_atual: number;
  media_mensal: number;
  vendas_periodo: number;
  est_dias: number | null;
  ultima_venda: string | null;
  ultima_compra: string | null;
  dias_sem_venda: number | null;
  valor_custo: number;
  valor_venda: number;
  puxou_data: boolean;
  severidade: Severidade;
}

export interface ProdutosPrincipioAtivoResponse {
  principio_ativo: string;
  parametros: DashboardParametros;
  grupo: PaGrupo;
  itens: PaProdutoItem[];
}

export type ModalFrame =
  | { kind: 'top5'; snapshot?: TopSemVendaItem[] }
  | { kind: 'store'; loja: string; snapshot?: ItensParadosLojaResponse }
  | {
      kind: 'product';
      produtoid: number | string;
      lojaDestaque: string | null;
      snapshot?: DetalheProdutoResponse;
    }
    | { kind: 'pa'; principioAtivo: string; snapshot?: ProdutosPrincipioAtivoResponse }
  | { kind: 'pa-ranking'; snapshot?: RankingPrincipioAtivoResponse };
