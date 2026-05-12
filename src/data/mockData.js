export const insumos = [
  { id: 1, nome: 'Farinha de Trigo',  categoria: 'Farináceos',  qtdAtual: 8,    qtdMin: 10,  unidade: 'kg',      validade: '20/08/2026', status: 'baixo'   },
  { id: 2, nome: 'Mussarela',         categoria: 'Laticínios',  qtdAtual: 1.2,  qtdMin: 5,   unidade: 'kg',      validade: '18/05/2026', status: 'critico' },
  { id: 3, nome: 'Molho de Tomate',   categoria: 'Molhos',      qtdAtual: 6,    qtdMin: 4,   unidade: 'kg',      validade: '14/05/2026', status: 'ok'      },
  { id: 4, nome: 'Ovos',              categoria: 'Proteínas',   qtdAtual: 30,   qtdMin: 12,  unidade: 'unidade', validade: '19/05/2026', status: 'ok'      },
  { id: 5, nome: 'Carne Moída',       categoria: 'Carnes',      qtdAtual: 4.5,  qtdMin: 3,   unidade: 'kg',      validade: '13/05/2026', status: 'ok'      },
  { id: 6, nome: 'Embalagem 500g',    categoria: 'Embalagens',  qtdAtual: 40,   qtdMin: 50,  unidade: 'unidade', validade: '—',          status: 'baixo'   },
  { id: 7, nome: 'Catupiry',          categoria: 'Laticínios',  qtdAtual: 3,    qtdMin: 2,   unidade: 'kg',      validade: '25/05/2026', status: 'ok'      },
  { id: 8, nome: 'Batata',            categoria: 'Vegetais',    qtdAtual: 10,   qtdMin: 5,   unidade: 'kg',      validade: '17/05/2026', status: 'ok'      },
];

export const produtos = [
  { id: 1, nome: '🍕 Pizza Marguerita 35cm',    tipo: 'Pizza',   qtd: 12, preco: 45.00, custo: 18.20, status: 'ok'      },
  { id: 2, nome: '🍝 Lasanha Bolonhesa 500g',   tipo: 'Lasanha', qtd: 8,  preco: 28.00, custo: 11.50, status: 'ok'      },
  { id: 3, nome: '🍝 Talharim Fresco 400g',     tipo: 'Massa',   qtd: 3,  preco: 18.00, custo: 6.30,  status: 'baixo'   },
  { id: 4, nome: '🫙 Nhoque 400g',              tipo: 'Massa',   qtd: 15, preco: 16.00, custo: 5.80,  status: 'ok'      },
  { id: 5, nome: '🍕 Pizza Frango c/ Catupiry', tipo: 'Pizza',   qtd: 1,  preco: 52.00, custo: 22.00, status: 'critico' },
];

export const receitas = [
  { id: 1, produto: '🍕 Pizza Marguerita 35cm',    insumos: 4, custo: 18.20, icon: '🍕' },
  { id: 2, produto: '🍝 Lasanha Bolonhesa 500g',   insumos: 5, custo: 11.50, icon: '🍝' },
  { id: 3, produto: '🍝 Talharim Fresco 400g',     insumos: 3, custo: 6.30,  icon: '🍝' },
  { id: 4, produto: '🫙 Nhoque 400g',              insumos: 3, custo: 5.80,  icon: '🫙' },
  { id: 5, produto: '🍕 Pizza Frango c/ Catupiry', insumos: 5, custo: 22.00, icon: '🍕' },
];

export const fichaDetalhe = [
  { produto: '🍕 Pizza Marguerita 35cm',  insumo: 'Farinha de Trigo',  qtd: '0,300', unidade: 'kg'      },
  { produto: '🍕 Pizza Marguerita 35cm',  insumo: 'Molho de Tomate',   qtd: '0,150', unidade: 'kg'      },
  { produto: '🍕 Pizza Marguerita 35cm',  insumo: 'Mussarela',         qtd: '0,200', unidade: 'kg'      },
  { produto: '🍕 Pizza Marguerita 35cm',  insumo: 'Embalagem Pizza',   qtd: '1',     unidade: 'unidade' },
  { produto: '🍝 Lasanha Bolonhesa 500g', insumo: 'Massa para Lasanha',qtd: '0,200', unidade: 'kg'      },
  { produto: '🍝 Lasanha Bolonhesa 500g', insumo: 'Carne Moída',       qtd: '0,180', unidade: 'kg'      },
  { produto: '🍝 Lasanha Bolonhesa 500g', insumo: 'Molho de Tomate',   qtd: '0,120', unidade: 'kg'      },
];

export const ordens = [
  { id: 1, data: '12/05/2026 08:30', produto: '🍕 Pizza Marguerita 35cm',    qtd: 20, responsavel: 'Adriana', insumos: 'Farinha 6kg · Molho 3kg · Mussarela 4kg' },
  { id: 2, data: '12/05/2026 10:00', produto: '🍝 Lasanha Bolonhesa 500g',   qtd: 15, responsavel: 'Carlos',  insumos: 'Massa 3kg · Carne 2,7kg · Molho 1,8kg'   },
  { id: 3, data: '11/05/2026 14:00', produto: '🫙 Nhoque 400g',              qtd: 30, responsavel: 'Adriana', insumos: 'Batata 6kg · Farinha 1,5kg · Ovos 15 un'  },
  { id: 4, data: '11/05/2026 09:15', produto: '🍝 Talharim Fresco 400g',     qtd: 10, responsavel: 'Carlos',  insumos: 'Farinha 2kg · Ovos 10 un · Sal 100g'      },
];

export const fornecedores = [
  { id: 1, nome: 'Moinho São João',        cnpj: '12.345.678/0001-99', telefone: '(41) 99999-0001', insumos: 'Farinha de Trigo, Farinha de Semolina' },
  { id: 2, nome: 'Laticínios Bela Vista',  cnpj: '98.765.432/0001-11', telefone: '(41) 99999-0002', insumos: 'Mussarela, Catupiry, Parmesão'         },
  { id: 3, nome: 'Distribuidora Paraná',   cnpj: '55.123.456/0001-22', telefone: '(41) 99999-0003', insumos: 'Molho de Tomate, Embalagens'           },
];

export const alertas = [
  { id: 1, tipo: 'critico', icon: '🔴', titulo: 'Mussarela — estoque crítico',           desc: 'Apenas 1,2 kg restantes. Mínimo: 5 kg. Faça pedido urgente.' },
  { id: 2, tipo: 'atencao', icon: '🟡', titulo: 'Farinha de Trigo — estoque baixo',      desc: '8 kg restantes. Mínimo: 10 kg. Considere repor em breve.'    },
  { id: 3, tipo: 'atencao', icon: '⏰', titulo: 'Molho de Tomate — vencimento em 2 dias',desc: '3,5 kg com validade em 14/05/2026. Utilize com prioridade (FEFO).' },
];

export const insumosNivel = [
  { nome: 'Farinha de Trigo', atual: 8,   max: 10,  pct: 80 },
  { nome: 'Mussarela',        atual: 1.2, max: 5,   pct: 24 },
  { nome: 'Molho de Tomate',  atual: 6,   max: 8,   pct: 75 },
  { nome: 'Ovos',             atual: 30,  max: 30,  pct: 100},
  { nome: 'Embalagens 500g',  atual: 40,  max: 100, pct: 40 },
];

export const relatorios = [
  { id: 1, icon: '📊', titulo: 'Movimentações do Período', desc: 'Entradas e saídas de estoque'    },
  { id: 2, icon: '💰', titulo: 'Custo de Produção',         desc: 'Custo por produto fabricado'     },
  { id: 3, icon: '🏭', titulo: 'Produção por Período',       desc: 'Volume produzido por data'       },
  { id: 4, icon: '⚠️', titulo: 'Perdas e Desperdícios',     desc: 'Insumos vencidos ou descartados' },
  { id: 5, icon: '🚚', titulo: 'Compras por Fornecedor',     desc: 'Histórico de entradas'           },
  { id: 6, icon: '📦', titulo: 'Estoque Atual',              desc: 'Fotografia atual do estoque'     },
];

export const produtoOptions = [
  '🍕 Pizza Marguerita 35cm',
  '🍝 Lasanha Bolonhesa 500g',
  '🍝 Talharim Fresco 400g',
  '🫙 Nhoque 400g',
  '🍕 Pizza Frango c/ Catupiry',
];

export const fornecedorOptions = [
  'Moinho São João',
  'Laticínios Bela Vista',
  'Distribuidora Paraná',
];
