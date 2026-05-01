export type Role = 'master_admin' | 'user';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
  tenant_id: string | null;
  pode_ver_financeiro: boolean;
  ativo: boolean;
  created_at: string;
}

export interface Tenant {
  id: string;
  nome: string;
  plano_id: string;
  ativo: boolean;
  created_at: string;
}

export interface Plano {
  id: string;
  nome: string;
  limite_usuarios: number;
  valor_mensal: number;
  created_at: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  responsavel_id: string;
  tenant_id: string;
  data_execucao: string;
  recorrente: boolean;
  dias_repeticao: number[];
  status: 'pendente' | 'concluido';
  created_at: string;
}

export interface Financeiro {
  id: string;
  tenant_id: string;
  tipo: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  created_at: string;
}

export interface ListaCompra {
  id: string;
  tenant_id: string;
  nome: string;
  valor_total: number;
  created_at: string;
}

export interface ItemLista {
  id: string;
  lista_id: string;
  nome: string;
  categoria: string;
  concluido: boolean;
}
