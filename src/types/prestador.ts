export interface Especialidade {
  id: number
  nome: string
  servicos: string[]
  precoBase: number
}

export interface AreaAtendida {
  cidade: string
  estado: string
  bairros: string[]
}

export interface Avaliacao {
  id: number
  nota: number
  texto: string
  autor: string
  avatarUrl: string
  data: string
}

export interface PortfolioItem {
  id: number | string
  imagemUrl: string
  alt: string
  titulo: string
  descricao: string
  data: string
  categorias: string[]
}

export interface Prestador {
  id: number
  nome: string
  roles: string[]
  nota: number
  totalAvaliacoes: number
  instagram: string
  fotoPerfil: string
  bio: string
  area: AreaAtendida
  especialidades: Especialidade[]
  portfolio: PortfolioItem[]
  avaliacoes: Avaliacao[]
}

export interface BarraRating {
  nota: number
  count: number
  percentual: number
}
