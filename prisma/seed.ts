import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

async function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, 10);
}

async function main() {
  console.log(' Iniciando seed do banco de dados...\n');


  console.log('  Limpando dados antigos...');

  await prisma.comentarioAvaliacao.deleteMany();
  await prisma.avaliacaoProduto.deleteMany();
  await prisma.avaliacaoLoja.deleteMany();
  await prisma.imagemProduto.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.loja.deleteMany();
  await prisma.subcategoria.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.user.deleteMany();

  console.log(' Resetando sequences do PostgreSQL...');
  await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Categoria_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Subcategoria_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Loja_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "Produto_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "ImagemProduto_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "AvaliacaoProduto_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "AvaliacaoLoja_id_seq" RESTART WITH 1`;
  await prisma.$executeRaw`ALTER SEQUENCE "ComentarioAvaliacao_id_seq" RESTART WITH 1`;

  console.log('Dados antigos removidos e sequences resetadas.\n');


  console.log('📂 Criando categorias...');

  const [
    catMercado,    // id: 1
    catFarmacia,   // id: 2
    catBeleza,     // id: 3
    catModa,       // id: 4
    catEletronicos,// id: 5
    catJogos,      // id: 6
    catBrinquedos, // id: 7
    catCasa,       // id: 8
  ] = await Promise.all([
    prisma.categoria.create({ data: { nome: 'Mercado' } }),
    prisma.categoria.create({ data: { nome: 'Farmácia' } }),
    prisma.categoria.create({ data: { nome: 'Beleza' } }),
    prisma.categoria.create({ data: { nome: 'Moda' } }),
    prisma.categoria.create({ data: { nome: 'Eletrônicos' } }),
    prisma.categoria.create({ data: { nome: 'Jogos' } }),
    prisma.categoria.create({ data: { nome: 'Brinquedos' } }),
    prisma.categoria.create({ data: { nome: 'Casa' } }),
  ]);

  console.log(' 8 categorias criadas.\n');


  console.log(' Criando subcategorias...');

  const [
    subHortifruti, subAcougue,
    subMedicamentos, subHigiene,
    subMaquiagem, subPele,
    subRoupas, subCalcados,
    subSmartphones, subNotebooks,
    subTabuleiro, subVideogames,
    subBlocos, subPelucias,
    subCamaMesa, subMoveis,
  ] = await Promise.all([
    prisma.subcategoria.create({ data: { nome: 'Hortifruti', categoriaId: catMercado.id } }),
    prisma.subcategoria.create({ data: { nome: 'Açougue e Frios', categoriaId: catMercado.id } }),
    prisma.subcategoria.create({ data: { nome: 'Medicamentos', categoriaId: catFarmacia.id } }),
    prisma.subcategoria.create({ data: { nome: 'Higiene Pessoal', categoriaId: catFarmacia.id } }),
    prisma.subcategoria.create({ data: { nome: 'Maquiagem', categoriaId: catBeleza.id } }),
    prisma.subcategoria.create({ data: { nome: 'Cuidados com a Pele', categoriaId: catBeleza.id } }),
    prisma.subcategoria.create({ data: { nome: 'Roupas Masculinas e Femininas', categoriaId: catModa.id } }),
    prisma.subcategoria.create({ data: { nome: 'Calçados', categoriaId: catModa.id } }),
    prisma.subcategoria.create({ data: { nome: 'Smartphones e Celulares', categoriaId: catEletronicos.id } }),
    prisma.subcategoria.create({ data: { nome: 'Computadores e Notebooks', categoriaId: catEletronicos.id } }),
    prisma.subcategoria.create({ data: { nome: 'Jogos de Tabuleiro', categoriaId: catJogos.id } }),
    prisma.subcategoria.create({ data: { nome: 'Videogames e Consoles', categoriaId: catJogos.id } }),
    prisma.subcategoria.create({ data: { nome: 'Blocos de Montar', categoriaId: catBrinquedos.id } }),
    prisma.subcategoria.create({ data: { nome: 'Bonecos e Pelúcias', categoriaId: catBrinquedos.id } }),
    prisma.subcategoria.create({ data: { nome: 'Cama, Mesa e Banho', categoriaId: catCasa.id } }),
    prisma.subcategoria.create({ data: { nome: 'Móveis e Decoração', categoriaId: catCasa.id } }),
  ]);

  console.log(' 16 subcategorias criadas.\n');


  console.log(' Criando usuários...');

  const [admin, carlos, mariana, rodrigo, fernanda, thiago, anaBia] = await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin', nome: 'Administrador do Sistema',
        email: 'admin@loja.com.br', senhaHash: await hashSenha('Admin@123'),
        fotoPerfilUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
      },
    }),
    prisma.user.create({
      data: {
        username: 'carlos_venturini', nome: 'Carlos Eduardo Venturini',
        email: 'carlos.venturini@email.com', senhaHash: await hashSenha('Carlos@2024'),
        fotoPerfilUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      },
    }),
    prisma.user.create({
      data: {
        username: 'mariana_goes', nome: 'Mariana Goés Ferreira',
        email: 'mariana.goes@email.com', senhaHash: await hashSenha('Mariana@2024'),
        fotoPerfilUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      },
    }),
    prisma.user.create({
      data: {
        username: 'rodrigo_bastos', nome: 'Rodrigo Bastos Nunes',
        email: 'rodrigo.bastos@email.com', senhaHash: await hashSenha('Rodrigo@2024'),
        fotoPerfilUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      },
    }),
    prisma.user.create({
      data: {
        username: 'fernanda_lopes', nome: 'Fernanda Lopes Carvalho',
        email: 'fernanda.lopes@email.com', senhaHash: await hashSenha('Fernanda@2024'),
        fotoPerfilUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      },
    }),
    prisma.user.create({
      data: {
        username: 'thiago_mendes', nome: 'Thiago Mendes Ribeiro',
        email: 'thiago.mendes@email.com', senhaHash: await hashSenha('Thiago@2024'),
        fotoPerfilUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      },
    }),
    prisma.user.create({
      data: {
        username: 'ana_beatriz', nome: 'Ana Beatriz Souza Lima',
        email: 'ana.beatriz@email.com', senhaHash: await hashSenha('AnaBia@2024'),
        fotoPerfilUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
      },
    }),
  ]);

  console.log(' 7 usuários criados.\n');

  console.log(' Criando lojas...');

  const [lojaTechZone, lojaModaExpress, lojaGameVault, lojaCasaDecor, lojaBelezaVip, lojaMercadoBom] = await Promise.all([
    prisma.loja.create({
      data: {
        userId: carlos.id, categoriaId: catEletronicos.id,
        nome: 'TechZone Brasil',
        descricao: 'Especialistas em eletrônicos de última geração. Trabalhamos com as melhores marcas do mercado e oferecemos garantia estendida em todos os produtos.',
        logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop',
        stickerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=80&h=80&fit=crop',
      },
    }),
    prisma.loja.create({
      data: {
        userId: mariana.id, categoriaId: catModa.id,
        nome: 'Moda Express',
        descricao: 'As últimas tendências da moda nacional e internacional com entrega rápida para todo o Brasil. Qualidade e estilo ao melhor preço.',
        logoUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=200&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=300&fit=crop',
        stickerUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&h=80&fit=crop',
      },
    }),
    prisma.loja.create({
      data: {
        userId: rodrigo.id, categoriaId: catJogos.id,
        nome: 'GameVault',
        descricao: 'Seu destino completo para games, consoles e jogos de tabuleiro. Produtos originais, preços competitivos e entrega para todo o Brasil.',
        logoUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=200&h=200&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=300&fit=crop',
        stickerUrl: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=80&h=80&fit=crop',
      },
    }),
    prisma.loja.create({
      data: {
        userId: fernanda.id, categoriaId: catCasa.id,
        nome: 'Casa & Decor',
        descricao: 'Transforme sua casa em um lar aconchegante com nossa coleção exclusiva de cama, mesa, banho e decoração com design moderno.',
        logoUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=300&fit=crop',
        stickerUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop',
      },
    }),
    prisma.loja.create({
      data: {
        userId: anaBia.id, categoriaId: catBeleza.id,
        nome: 'Beleza VIP',
        descricao: 'Cosméticos, maquiagens e cuidados com a pele das melhores marcas nacionais e importadas. Autenticidade garantida em todos os produtos.',
        logoUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=300&fit=crop',
        stickerUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop',
      },
    }),
    prisma.loja.create({
      data: {
        userId: thiago.id, categoriaId: catMercado.id,
        nome: 'Mercado Bom Preço',
        descricao: 'Hortifruti fresco, açougue e frios selecionados entregues na sua porta. Qualidade de mercado de bairro com a conveniência do delivery.',
        logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=300&fit=crop',
        stickerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&h=80&fit=crop',
      },
    }),
  ]);

  console.log(' 6 lojas criadas.\n');


  console.log(' Criando produtos...');

  
  const [prodSamsungS24, prodIphone15Pro, prodDellXPS, prodSonyWH, prodAirPods, prodKindleOasis] = await Promise.all([
    prisma.produto.create({
      data: {
        lojaId: lojaTechZone.id, subcategoriaId: subSmartphones.id,
        nome: 'Samsung Galaxy S24 Ultra 256GB Titânio',
        descricao: 'O mais poderoso smartphone da linha Galaxy. Processador Snapdragon 8 Gen 3, câmera de 200MP com zoom óptico de 10x, tela Dynamic AMOLED 2X de 6,8" com 120Hz e bateria de 5000mAh. S Pen integrada e resistência IP68.',
        preco: 7499.90, estoque: 43,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaTechZone.id, subcategoriaId: subSmartphones.id,
        nome: 'Apple iPhone 15 Pro 128GB Titânio Natural',
        descricao: 'iPhone com chip A17 Pro de 3nm. Câmera Pro de 48MP com gravação ProRes em 4K a 60fps, botão Ação personalizável e USB-C. Design em titânio aeroespacial. Tela Super Retina XDR de 6,1".',
        preco: 8299.00, estoque: 28,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaTechZone.id, subcategoriaId: subNotebooks.id,
        nome: 'Notebook Dell XPS 15 Intel Core i7 32GB RAM 1TB SSD',
        descricao: 'Notebook premium para criadores de conteúdo. Tela OLED 3.5K de 15.6" com 100% DCI-P3, Core i7-13700H, 32GB DDR5, SSD NVMe 1TB e NVIDIA GeForce RTX 4060. Apenas 18mm de espessura.',
        preco: 12899.00, estoque: 15,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaTechZone.id, subcategoriaId: subSmartphones.id,
        nome: 'Sony WH-1000XM5 Fone Over-Ear Cancelamento de Ruído',
        descricao: 'Melhor cancelamento de ruído do mercado com 8 microfones e 2 processadores. Até 30h de autonomia, carregamento rápido (3 min = 3h), qualidade Hi-Res com LDAC. Confortável para uso prolongado.',
        preco: 1899.00, estoque: 62,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaTechZone.id, subcategoriaId: subSmartphones.id,
        nome: 'Apple AirPods Pro 2ª Geração com MagSafe',
        descricao: 'Cancelamento ativo de ruído 2x mais eficaz que a geração anterior. Chip H2, áudio espacial personalizado, modo Transparência adaptativo e resistência IPX4. Até 30h de bateria com o estojo. Perfeito para iPhone.',
        preco: 1799.00, estoque: 55,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaTechZone.id, subcategoriaId: subNotebooks.id,
        nome: 'Amazon Kindle Oasis 32GB Wi-Fi – Grafite',
        descricao: 'O Kindle mais premium da Amazon. Tela de 7" de 300 ppi com luz quente ajustável, à prova d\'água IPX8 e botões de virar páginas físicos. Bateria para semanas de leitura. Design ergonômico de alumínio.',
        preco: 999.00, estoque: 80,
      },
    }),
  ]);


  const [prodNikePegasus, prodAdidas, prodCamisetaOversize, prodCalcaJeans, prodJaquetaBomber, prodVestido] = await Promise.all([
    prisma.produto.create({
      data: {
        lojaId: lojaModaExpress.id, subcategoriaId: subCalcados.id,
        nome: 'Nike Air Pegasus 40 Masculino Cinza/Laranja',
        descricao: 'Tênis de corrida mais popular da Nike, mais leve e responsivo. Amortecimento Air Zoom, malha respirável e solado de borracha para máxima aderência. Ideal para corredores de todos os níveis.',
        preco: 699.90, estoque: 120,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaModaExpress.id, subcategoriaId: subCalcados.id,
        nome: 'Adidas Ultraboost 23 Feminino Branco/Rose',
        descricao: 'Tecnologia Boost que retorna energia, cabedal Primeknit+ que se adapta ao pé e sola Continental™ para aderência superior. Leveza e performance em cada detalhe.',
        preco: 799.00, estoque: 85,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaModaExpress.id, subcategoriaId: subRoupas.id,
        nome: 'Camiseta Oversized Algodão Premium "Minimal Wave" Preta',
        descricao: 'Camiseta oversized em 100% algodão penteado 30/1. Estampa exclusiva serigrafia "Minimal Wave". Gola careca reforçada e costura dupla. Lavagem especial para toque suave. Tamanhos P ao XG.',
        preco: 129.90, estoque: 200,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaModaExpress.id, subcategoriaId: subRoupas.id,
        nome: 'Calça Jeans Skinny Masculina Lavagem Estonada – Azul Médio',
        descricao: 'Calça jeans de algodão com 3% elastano para conforto e mobilidade. Corte skinny moderno, lavagem estonada exclusiva e costura reforçada nos pontos de tensão. Disponível nos tamanhos 38 ao 48.',
        preco: 189.90, estoque: 150,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaModaExpress.id, subcategoriaId: subRoupas.id,
        nome: 'Jaqueta Bomber Unissex Nylon Impermeável – Verde Militar',
        descricao: 'Jaqueta bomber em nylon impermeável com forro em matelassê. Elástico nas punhos e barra, bolsos laterais com zíper e bolso interno. Corte unissex oversized. Perfeita para meia-estação.',
        preco: 279.90, estoque: 90,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaModaExpress.id, subcategoriaId: subRoupas.id,
        nome: 'Vestido Midi Linho Feminino – Off White',
        descricao: 'Vestido midi em 70% linho e 30% viscose, fresco e elegante para o verão. Decote V com amarração, mangas curtas bufantes e saia evasê. Ideal para eventos casuais e diurnos. Tamanhos PP ao GG.',
        preco: 219.90, estoque: 75,
      },
    }),
  ]);

  
  const [prodPS5, prodCatanTabuleiro, prodXboxController, prodDiablo4, prodTicketToRide] = await Promise.all([
    prisma.produto.create({
      data: {
        lojaId: lojaGameVault.id, subcategoriaId: subVideogames.id,
        nome: 'Console PlayStation 5 Slim 1TB Edição Digital',
        descricao: 'Versão slim do PS5 com design compacto e 1TB de SSD ultrarrápido. Carregamento em segundos, áudio 3D Tempest e controle DualSense com feedback tátil e gatilhos adaptáveis. Inclui 1 mês de PS Plus.',
        preco: 3799.90, estoque: 30,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaGameVault.id, subcategoriaId: subTabuleiro.id,
        nome: 'Jogo de Tabuleiro Catan Edição Expansível – Galápagos',
        descricao: 'Clássico jogo de estratégia e negociação para 3–4 jogadores (expansível até 6). Construa estradas, vilas e cidades coletando recursos. Peças plásticas premium e tabuleiro modular. A partir dos 10 anos.',
        preco: 239.90, estoque: 60,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaGameVault.id, subcategoriaId: subVideogames.id,
        nome: 'Controle Xbox Series X/S sem Fio – Carbon Black',
        descricao: 'Controle oficial Microsoft com botão Share, textura antiderrapante nos gatilhos e grip lateral. Compatível com Xbox Series X/S, Xbox One e PC via Bluetooth ou USB-C. Bateria AA com até 40h de uso.',
        preco: 449.90, estoque: 95,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaGameVault.id, subcategoriaId: subVideogames.id,
        nome: 'Diablo IV – Edição Standard PS5/PS4 (Mídia Física)',
        descricao: 'Mergulhe em Santuário neste sombrio action-RPG da Blizzard. Escolha entre 5 classes, explore um mundo aberto repleto de masmorras procedurais e enfrente Lilith em uma campanha épica. Suporte a co-op local e online.',
        preco: 299.90, estoque: 45,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaGameVault.id, subcategoriaId: subTabuleiro.id,
        nome: 'Ticket to Ride Europa – Days of Wonder',
        descricao: 'Conecte cidades europeias construindo rotas ferroviárias neste clássico acessível e viciante. Para 2–5 jogadores, a partir dos 8 anos, partidas de 30–60 minutos. Inclui mapa da Europa com rotas especiais exclusivas.',
        preco: 279.90, estoque: 40,
      },
    }),
  ]);


  const [prodJogoLencol, prodQuadroCanvas, prodPuffRedondo, prodOrganizadorBamboo, prodLampadaHue] = await Promise.all([
    prisma.produto.create({
      data: {
        lojaId: lojaCasaDecor.id, subcategoriaId: subCamaMesa.id,
        nome: 'Jogo de Lençol 400 Fios Algodão Egípcio Queen – Branco',
        descricao: 'Conjunto queen com 4 peças em algodão egípcio 400 fios com acabamento acetinado. Toque macio e fresco, elástico reforçado de 35cm e barra bordada. Qualidade de hotel cinco estrelas.',
        preco: 379.90, estoque: 55,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaCasaDecor.id, subcategoriaId: subMoveis.id,
        nome: 'Quadro Decorativo Canvas "Traços Dourados" 80x60cm',
        descricao: 'Arte abstrata contemporânea em canvas de alta definição com textura de pinceladas reais. Moldura em madeira maciça de Eucalipto. Arte exclusiva do artista Rafael Monteiro. Pronto para pendurar.',
        preco: 349.00, estoque: 40,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaCasaDecor.id, subcategoriaId: subMoveis.id,
        nome: 'Puff Redondo Veludo Costela 60cm – Terracota',
        descricao: 'Puff redondo revestido em veludo cotelê texturizado na cor terracota. Estrutura interna em MDF e espuma D33. Pés metálicos dourados de 10cm. Suporta até 120kg. Ideal para sala de estar e quarto.',
        preco: 459.90, estoque: 35,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaCasaDecor.id, subcategoriaId: subMoveis.id,
        nome: 'Kit Organizador Bambu para Gaveta 9 Divisórias',
        descricao: 'Kit com 9 caixas organizadoras em bambu sustentável para gavetas de cozinha, escritório ou banheiro. Tamanhos variados que se encaixam perfeitamente. Fácil de limpar, ecológico e durável.',
        preco: 129.90, estoque: 100,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaCasaDecor.id, subcategoriaId: subMoveis.id,
        nome: 'Lâmpada Inteligente LED RGB Philips Hue 9W E27',
        descricao: '16 milhões de cores e tonalidades 2000K–6500K. Wi-Fi sem hub, compatível com Alexa, Google Home e Apple HomeKit. 9W equivalente a 60W, 25.000 horas de vida útil. Controle por app, voz ou automações.',
        preco: 159.90, estoque: 200,
      },
    }),
  ]);


  const [prodBatom, prodSerumPele, prodPaletaSombra, prodPerfume, prodProtesolarFace] = await Promise.all([
    prisma.produto.create({
      data: {
        lojaId: lojaBelezaVip.id, subcategoriaId: subMaquiagem.id,
        nome: 'Batom Líquido Matte Ultra Fix Maybelline – Vermelho Clássico',
        descricao: 'Batom líquido matte de longa duração — até 16h sem retoque. Pigmentação intensa, aplicador de ponta fina para precisão. Fórmula com vitamina E. Seca rápido e não mancha.',
        preco: 49.90, estoque: 300,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaBelezaVip.id, subcategoriaId: subPele.id,
        nome: 'Sérum Facial Vitamina C 20% + Ácido Hialurônico Océane 30ml',
        descricao: 'Sérum com 20% de vitamina C estabilizada, ácido hialurônico e niacinamida. Ação antioxidante, clareadora e anti-idade. Textura leve de rápida absorção. Para todos os tipos de pele, dia e noite.',
        preco: 129.90, estoque: 180,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaBelezaVip.id, subcategoriaId: subMaquiagem.id,
        nome: 'Paleta de Sombras "Golden Hour" 18 Cores – Ruby Rose',
        descricao: 'Paleta versátil com 18 tons que vão do nude ao intenso. Acabamentos matte, shimmer e glitter. Alta pigmentação, fácil de esfumar, longa duração. Espelho embutido e embalagem magnética premium.',
        preco: 89.90, estoque: 150,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaBelezaVip.id, subcategoriaId: subPele.id,
        nome: 'Perfume Feminino Bloom Gucci Eau de Toilette 50ml',
        descricao: 'Fragrância floral contemporânea com notas de peônia, ranúnculo e gardênia. Fragrância leve e sofisticada para o uso diário. Frasco de vidro com design floral icônico da Gucci. Produto 100% original importado.',
        preco: 549.90, estoque: 40,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaBelezaVip.id, subcategoriaId: subPele.id,
        nome: 'Protetor Solar Facial FPS 60 Toque Seco La Roche-Posay 40g',
        descricao: 'Protetor solar facial com FPS 60 e PPD 32. Fórmula toque seco que controla a oleosidade por até 8h sem deixar resíduo branco. Indicado para peles mistas e oleosas. Testado dermatologicamente.',
        preco: 89.90, estoque: 220,
      },
    }),
  ]);


  const [prodCestaFrutas, prodPicanha, prodQueijo, prodCestaVerduras] = await Promise.all([
    prisma.produto.create({
      data: {
        lojaId: lojaMercadoBom.id, subcategoriaId: subHortifruti.id,
        nome: 'Cesta de Frutas Frescas da Estação – 5kg Sortida',
        descricao: 'Cesta com 5kg de frutas selecionadas da estação: maçãs fuji, bananas-nanica, uvas itália, mamão formosa e laranjas pera. Higienizadas, no ponto ideal de maturação. Embalagem térmica protetora.',
        preco: 89.90, estoque: 100,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaMercadoBom.id, subcategoriaId: subAcougue.id,
        nome: 'Picanha Bovina Premium Angus Resfriada – Peça ~1,2kg',
        descricao: 'Picanha de primeira qualidade, raça Angus certificada, resfriada e não congelada. Capa de gordura uniforme de 1cm. Embalada a vácuo com data de abate. Acompanha tempero artesanal da casa.',
        preco: 139.90, estoque: 70,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaMercadoBom.id, subcategoriaId: subAcougue.id,
        nome: 'Queijo Minas Padrão Artesanal Canastra – 500g',
        descricao: 'Queijo minas artesanal da Serra da Canastra, maturado por 22 dias. Textura firme, sabor levemente ácido e amanteigado. Produzido por fazendeiro certificado do Cerrado mineiro. Embalado a vácuo.',
        preco: 49.90, estoque: 120,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaMercadoBom.id, subcategoriaId: subHortifruti.id,
        nome: 'Cesta de Verduras Orgânicas – 3kg Selecionadas',
        descricao: 'Cesta com 3kg de verduras orgânicas certificadas: alface crespa, rúcula, espinafre, couve manteiga e tomate cereja. Produzidas sem agrotóxicos em sítio parceiro em Cotia-SP. Entrega na quinta e sábado.',
        preco: 69.90, estoque: 80,
      },
    }),
  ]);


  const lojaFarmaciaSaude = await prisma.loja.create({
    data: {
      userId: admin.id, categoriaId: catFarmacia.id,
      nome: 'Farmácia Saúde & Bem-Estar',
      descricao: 'Medicamentos, vitaminas, suplementos e itens de higiene pessoal com qualidade farmacêutica. Todos os produtos com nota fiscal e rastreabilidade garantida.',
      logoUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=300&fit=crop',
      stickerUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&h=80&fit=crop',
    },
  });

  const [prodVitaminaC, prodDipirona, prodSaborineSabonete, prodFiosDental] = await Promise.all([
    prisma.produto.create({
      data: {
        lojaId: lojaFarmaciaSaude.id, subcategoriaId: subMedicamentos.id,
        nome: 'Vitamina C 1000mg + Zinco Efervescente – 10 Comprimidos',
        descricao: 'Suplemento vitamínico com 1000mg de vitamina C e 10mg de zinco por comprimido. Auxilia na imunidade e no combate ao estresse oxidativo. Sabor laranja efervescente. Embalagem com 10 comprimidos.',
        preco: 29.90, estoque: 500,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaFarmaciaSaude.id, subcategoriaId: subMedicamentos.id,
        nome: 'Dipirona Monoidratada 500mg – Caixa com 20 Comprimidos',
        descricao: 'Analgésico e antitérmico indicado para dores de cabeça, musculares, febre e cólicas. Comprimidos revestidos de fácil deglutição. Genérico intercambiável com referência. Registro Anvisa válido.',
        preco: 14.90, estoque: 800,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaFarmaciaSaude.id, subcategoriaId: subHigiene.id,
        nome: 'Sabonete Líquido Corporal Saborine Erva-Doce – 500ml',
        descricao: 'Sabonete líquido hidratante com extratos de erva-doce e glicerina vegetal. pH balanceado para todos os tipos de pele. Fragrância suave e duradoura. Embalagem com pump dispensador 500ml.',
        preco: 24.90, estoque: 350,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaFarmaciaSaude.id, subcategoriaId: subHigiene.id,
        nome: 'Fio Dental Encerado com Flúor Oral-B Essential – 50m',
        descricao: 'Fio dental encerado com cobertura de flúor para proteção extra contra cáries. Desliza suavemente entre os dentes sem causar microlesões na gengiva. Caixa com 50 metros. Sabor menta.',
        preco: 12.90, estoque: 600,
      },
    }),
  ]);


  const lojaBrinquedosMagicos = await prisma.loja.create({
    data: {
      userId: carlos.id, categoriaId: catBrinquedos.id,
      nome: 'Brinquedos Mágicos',
      descricao: 'Os melhores brinquedos educativos, criativos e divertidos para crianças de todas as idades. Seleção cuidadosa com foco em segurança e desenvolvimento infantil.',
      logoUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&h=200&fit=crop',
      bannerUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=300&fit=crop',
      stickerUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=80&h=80&fit=crop',
    },
  });

  const [prodLego, prodBonecaLol, prodCarrinhoHotWheels, prodMassinha] = await Promise.all([
    prisma.produto.create({
      data: {
        lojaId: lojaBrinquedosMagicos.id, subcategoriaId: subBlocos.id,
        nome: 'LEGO City Delegacia de Polícia 668 Peças – 60316',
        descricao: 'Set LEGO City com delegacia, viatura policial, caminhão de resgate e 5 minifiguras. 668 peças para crianças a partir dos 6 anos. Estimula criatividade, raciocínio espacial e coordenação motora.',
        preco: 499.90, estoque: 50,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaBrinquedosMagicos.id, subcategoriaId: subPelucias.id,
        nome: 'Boneca LOL Surprise! OMG House of Surprises',
        descricao: 'Casa de bonecas interativa com mais de 85 surpresas, 4 andares, piscina, academia, estúdio de música e quarto de bebê. Acompanha 1 boneca OMG fashion exclusiva. Para crianças a partir dos 4 anos.',
        preco: 599.90, estoque: 25,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaBrinquedosMagicos.id, subcategoriaId: subPelucias.id,
        nome: 'Kit Hot Wheels Pista Looping Radical com 5 Carrinhos',
        descricao: 'Pista com looping duplo, rampa de lançamento e área de colisão. Inclui 5 carrinhos colecionáveis sortidos. Encaixe fácil sem ferramentas. Para crianças a partir dos 3 anos. Comprimento montado: 1,2m.',
        preco: 189.90, estoque: 80,
      },
    }),
    prisma.produto.create({
      data: {
        lojaId: lojaBrinquedosMagicos.id, subcategoriaId: subBlocos.id,
        nome: 'Massinha de Modelar Play-Doh Kit 20 Potes Cores Variadas',
        descricao: 'Kit com 20 potes de massinha Play-Doh em cores variadas, 56g cada. Fórmula macia, não tóxica e que não resseca facilmente. Estimula criatividade e coordenação motora. Para crianças a partir dos 2 anos.',
        preco: 99.90, estoque: 200,
      },
    }),
  ]);

  console.log(' 34 produtos criados.\n');


  console.log(' Adicionando imagens...');

  await prisma.imagemProduto.createMany({
    data: [
      // Eletrônicos
      { produtoId: prodSamsungS24.id,    urlImagem: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodSamsungS24.id,    urlImagem: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodIphone15Pro.id,   urlImagem: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodIphone15Pro.id,   urlImagem: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodDellXPS.id,       urlImagem: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodDellXPS.id,       urlImagem: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodSonyWH.id,        urlImagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodSonyWH.id,        urlImagem: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodAirPods.id,       urlImagem: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Apple_airpods_pro.jpg/800px-Apple_airpods_pro.jpg', ordem: 2 },
      { produtoId: prodAirPods.id,       urlImagem: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodKindleOasis.id,   urlImagem: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop', ordem: 1 },
      // Moda
      { produtoId: prodNikePegasus.id,   urlImagem: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodNikePegasus.id,   urlImagem: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodAdidas.id,        urlImagem: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodAdidas.id,        urlImagem: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodCamisetaOversize.id, urlImagem: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodCamisetaOversize.id, urlImagem: 'https://images.unsplash.com/photo-1503341338985-95b9f4cac56c?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodCalcaJeans.id,    urlImagem: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodCalcaJeans.id,    urlImagem: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodJaquetaBomber.id, urlImagem: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodVestido.id,       urlImagem: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodVestido.id,       urlImagem: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=800&fit=crop', ordem: 2 },
      // Jogos
      { produtoId: prodPS5.id,           urlImagem: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodPS5.id,           urlImagem: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodCatanTabuleiro.id,urlImagem: 'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodCatanTabuleiro.id,urlImagem: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodXboxController.id,urlImagem: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodDiablo4.id,       urlImagem: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodTicketToRide.id,  urlImagem: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&h=800&fit=crop', ordem: 1 },
      // Casa
      { produtoId: prodJogoLencol.id,    urlImagem: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodJogoLencol.id,    urlImagem: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodQuadroCanvas.id,  urlImagem: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodPuffRedondo.id,   urlImagem: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodOrganizadorBamboo.id, urlImagem: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodLampadaHue.id,    urlImagem: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodLampadaHue.id,    urlImagem: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=800&fit=crop', ordem: 2 },
      // Beleza
      { produtoId: prodBatom.id,         urlImagem: 'https://kyliejennercosmetics.eu/cdn/shop/products/fu1h6nanvkm1sdu3pvy6_0bcd42a4-6c6e-4737-98cf-b272b5cc08d2.jpg?crop=center&height=1024&v=1673885461&width=1024', ordem: 1 },
      { produtoId: prodSerumPele.id,     urlImagem: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodSerumPele.id,     urlImagem: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodPaletaSombra.id,  urlImagem: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodPerfume.id,       urlImagem: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodPerfume.id,       urlImagem: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodProtesolarFace.id,urlImagem: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop', ordem: 1 },
      // Mercado
      { produtoId: prodCestaFrutas.id,   urlImagem: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodCestaFrutas.id,   urlImagem: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodPicanha.id,       urlImagem: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodQueijo.id,        urlImagem: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodCestaVerduras.id, urlImagem: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&h=800&fit=crop', ordem: 1 },
      // Farmácia
      { produtoId: prodVitaminaC.id,     urlImagem: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodDipirona.id,      urlImagem: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodSaborineSabonete.id, urlImagem: 'https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodFiosDental.id,    urlImagem: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=800&h=800&fit=crop', ordem: 1 },
      // Brinquedos
      { produtoId: prodLego.id,          urlImagem: 'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodLego.id,          urlImagem: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop', ordem: 2 },
      { produtoId: prodBonecaLol.id,     urlImagem: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodCarrinhoHotWheels.id, urlImagem: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&h=800&fit=crop', ordem: 1 },
      { produtoId: prodMassinha.id,      urlImagem: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop', ordem: 1 },
    ],
  });

  console.log(' Imagens adicionadas.\n');


  console.log(' Criando avaliações de produtos...');

  const avaliacoesProduto = await Promise.all([
    // Samsung S24
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodSamsungS24.id,  nota: 5, comentario: 'Câmera de 200MP impressionante para fotos noturnas. S Pen integrada é diferencial enorme. Entrega rápida pela TechZone. Recomendo muito!' } }),
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodSamsungS24.id,  nota: 4, comentario: 'Desempenho top em tudo. Preço salgado mas a qualidade compensa. Tela é um espetáculo.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodSamsungS24.id,  nota: 5, comentario: 'Migrei do iPhone e não me arrependo. Bateria dura o dia todo com uso intenso.' } }),
    // iPhone 15 Pro
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodIphone15Pro.id, nota: 5, comentario: 'A17 Pro é outro nível. USB-C finalmente chegou e o botão Ação é muito útil configurado para a câmera.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodIphone15Pro.id, nota: 4, comentario: 'Titânio é premium demais. 128GB é limitado para quem filma em ProRes, mas o produto em si é impecável.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodIphone15Pro.id, nota: 5, comentario: 'Câmera incrível, sistema fluido, build impecável. Loja enviou super rápido com embalagem lacrada.' } }),
    // Dell XPS
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodDellXPS.id,     nota: 5, comentario: 'Tela OLED 3.5K é de cair o queixo para edição de vídeo. RTX 4060 lida com tudo.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodDellXPS.id,     nota: 3, comentario: 'Hardware impecável mas aquece bastante em cargas pesadas. Recomendo uma base com cooler.' } }),
    // Sony WH-1000XM5
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodSonyWH.id,      nota: 5, comentario: 'Cancelamento de ruído de outro mundo. Uso no metrô e parece uma bolha de silêncio.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodSonyWH.id,      nota: 5, comentario: 'Divisor de águas para home office. Cancela filho, TV, obra. Chamadas cristalinas.' } }),
    // AirPods Pro
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodAirPods.id,     nota: 5, comentario: 'Integração com iPhone é impecável. O áudio espacial personalizado é uma experiência única. Bateria excelente.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodAirPods.id,     nota: 4, comentario: 'Som ótimo e confortáveis. Apenas o case arranha fácil. Cancelamento de ruído levemente abaixo do Sony.' } }),
    // Kindle Oasis
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodKindleOasis.id, nota: 5, comentario: 'Melhor e-reader que já tive. Luz quente para leitura noturna é perfeita. Os botões físicos fazem toda diferença.' } }),
    // Nike Pegasus
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodNikePegasus.id, nota: 5, comentario: 'Amortecimento perfeito, não sinto impacto no joelho. Chegou na numeração exata.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodNikePegasus.id, nota: 5, comentario: 'Segunda unidade — já diz tudo. Durabilidade excelente do 5km à meia maratona.' } }),
    // Adidas Ultraboost
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodAdidas.id,      nota: 5, comentario: 'Presente para minha esposa. Disse que parece correr nas nuvens. Chegou bem embalado.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodAdidas.id,      nota: 5, comentario: 'Tenho 3 pares de Ultraboost. O 23 tem o melhor Primeknit até agora.' } }),
    // Calça Jeans
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodCalcaJeans.id,  nota: 4, comentario: 'Corte skinny moderno e o elastano deixa bastante confortável. A lavagem estonada ficou linda.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodCalcaJeans.id,  nota: 4, comentario: 'Qualidade boa para o preço. Costura reforçada dá segurança. Tamanho exato conforme a tabela.' } }),
    // Jaqueta Bomber
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodJaquetaBomber.id, nota: 5, comentario: 'Impermeabilidade testada na chuva — zero água entrou. Corte oversized fica exatamente como na foto.' } }),
    // Vestido Midi
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodVestido.id,     nota: 5, comentario: 'O linho é levíssimo para o verão. O caimento do evasê é perfeito. Recebi vários elogios.' } }),
    // PS5
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodPS5.id,         nota: 5, comentario: 'Carregamento instantâneo e DualSense que muda tudo. Veio selado, original, com NF.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodPS5.id,         nota: 4, comentario: 'Slim economiza espaço na estante. Console silencioso e rápido. Preço dos jogos em reais é salgado.' } }),
    // Catan
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodCatanTabuleiro.id, nota: 5, comentario: 'Jogamos todo sábado em família. Fácil de aprender e difícil de largar!' } }),
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodCatanTabuleiro.id, nota: 4, comentario: 'Ótimo para reunir a galera. Instruções poderiam ser mais claras para iniciantes.' } }),
    // Xbox Controller
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodXboxController.id, nota: 5, comentario: 'Controle confortável para sessões longas. Bluetooth sem latência perceptível no PC.' } }),
    // Diablo 4
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodDiablo4.id,     nota: 5, comentario: 'Gráficos de dar inveja e jogabilidade viciante. A campanha principal dura bem. Muito satisfeito.' } }),
    // Ticket to Ride
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodTicketToRide.id,nota: 5, comentario: 'Perfeito para introduzir amigos a jogos de tabuleiro. Regras simples, estratégia profunda.' } }),
    // Lençol
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodJogoLencol.id,  nota: 5, comentario: 'Algodão egípcio 400 fios é outra categoria! Toque incrivelmente macio. Elástico segura firme.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodJogoLencol.id,  nota: 4, comentario: 'Branco realmente branco, sem tonalidade amarelada. Fronhas com acabamento impecável.' } }),
    // Quadro Canvas
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodQuadroCanvas.id,nota: 4, comentario: 'Cores fiéis à foto. Moldura sólida. Já está na sala e ficou lindo.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodQuadroCanvas.id,nota: 5, comentario: 'Canvas tem textura de pintura real. Visitantes sempre perguntam onde comprei.' } }),
    // Puff Redondo
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodPuffRedondo.id, nota: 5, comentario: 'Veludo cotelê na cor terracota é lindo pessoalmente. Pés dourados elevam o visual. Muito firme.' } }),
    // Organizador Bamboo
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodOrganizadorBamboo.id, nota: 5, comentario: 'Transformou minhas gavetas de cozinha. Bamboo é durável e fácil de limpar. Encaixe perfeito.' } }),
    // Lâmpada Hue
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodLampadaHue.id,  nota: 5, comentario: 'Comprei 6 para o apartamento. Integração com Alexa perfeita. Vale cada centavo.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodLampadaHue.id,  nota: 5, comentario: 'Funciona sem hub — só Wi-Fi. Configuração em 2 minutos. Cores vívidas.' } }),
    // Batom
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodBatom.id,       nota: 5, comentario: 'Cor intensa e dura o dia todo. O aplicador fino facilita o contorno labial. Ótimo custo-benefício.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodBatom.id,       nota: 4, comentario: 'Pigmentação excelente. Resseca um pouco após 6h — recomendo bálsamo antes de aplicar.' } }),
    // Sérum Vitamina C
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodSerumPele.id,   nota: 5, comentario: 'Uso há 2 meses e a luminosidade da pele melhorou nitidamente. Textura leve de rápida absorção.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodSerumPele.id,   nota: 4, comentario: 'Comprei para minha namorada. Ela diz que é o melhor sérum que já usou. Embalagem elegante.' } }),
    // Paleta de Sombra
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodPaletaSombra.id,nota: 5, comentario: 'Pigmentação absurda para o preço! Os shimmer são incríveis. Dura a noite toda.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodPaletaSombra.id,nota: 4, comentario: 'Boa paleta. Os tons matte desbotam um pouco no cantinho interno — use primer.' } }),
    // Perfume
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodPerfume.id,     nota: 5, comentario: 'Fragrância delicada e sofisticada. Fixação ótima para EDT. Produto original sem dúvida.' } }),
    // Protetor Solar
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodProtesolarFace.id, nota: 5, comentario: 'Toque seco de verdade — uso embaixo da maquiagem sem problema. Controla oleosidade por horas.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodProtesolarFace.id, nota: 5, comentario: 'FPS 60 sem resíduo branco. Finalmente um protetor que não parece máscara no rosto.' } }),
    // Cesta de Frutas
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodCestaFrutas.id, nota: 5, comentario: 'Frutas fresquíssimas! As uvas vieram no ponto certo. Embalagem térmica manteve tudo fresco.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodCestaFrutas.id, nota: 4, comentario: 'Boa qualidade. Bananas vieram um pouco verdes na última entrega, mas amadureceram normalmente.' } }),
    // Picanha
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodPicanha.id,     nota: 5, comentario: 'Qualidade excepcional! Capa de gordura uniforme e suculenta na grelha. Família toda elogiou.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodPicanha.id,     nota: 5, comentario: 'Angus de verdade faz toda diferença na maciez. Tempero da casa é um diferencial!' } }),
    // Queijo Canastra
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodQueijo.id,      nota: 5, comentario: 'Queijo artesanal de verdade! Sabor levemente ácido perfeito. Acompanha bem qualquer vinho.' } }),
    // Cesta Verduras
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodCestaVerduras.id, nota: 5, comentario: 'Verduras orgânicas frescas e sem agrotóxico. A rúcula e o espinafre são impecáveis.' } }),
    // Vitamina C
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodVitaminaC.id,   nota: 5, comentario: 'Efervescente saboroso e prático. Desde que comecei a usar, senti menos gripes no inverno.' } }),
    // Dipirona
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodDipirona.id,    nota: 5, comentario: 'Genérico de qualidade, preço justo. Produto entregue dentro da validade e bem embalado.' } }),
    // Sabonete
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodSaborineSabonete.id, nota: 4, comentario: 'Fragrância de erva-doce delicada e duradoura. Não ressequei com uso diário. Pump funciona bem.' } }),
    // Fio Dental
    prisma.avaliacaoProduto.create({ data: { userId: anaBia.id,   produtoId: prodFiosDental.id,  nota: 5, comentario: 'Desliza muito bem entre os dentes. O sabor menta é refrescante. Rende bastante.' } }),
    // LEGO
    prisma.avaliacaoProduto.create({ data: { userId: mariana.id,  produtoId: prodLego.id,        nota: 5, comentario: 'Meu filho de 7 anos amou! Instruções claras, montou em 3h com pouca ajuda. Qualidade LEGO impecável.' } }),
    prisma.avaliacaoProduto.create({ data: { userId: thiago.id,   produtoId: prodLego.id,        nota: 5, comentario: 'Presente de aniversário certeiro. A viatura e os minifigures são os favoritos do meu filho.' } }),
    // Boneca LOL
    prisma.avaliacaoProduto.create({ data: { userId: fernanda.id, produtoId: prodBonecaLol.id,   nota: 4, comentario: 'Minha filha amou cada detalhe da casinha. As 85 surpresas mantém a criança entretida por horas.' } }),
    // Hot Wheels
    prisma.avaliacaoProduto.create({ data: { userId: carlos.id,   produtoId: prodCarrinhoHotWheels.id, nota: 5, comentario: 'Looping duplo funciona perfeitamente. Meu filho de 4 anos não larga. Encaixe rápido e fácil.' } }),
    // Massinha
    prisma.avaliacaoProduto.create({ data: { userId: rodrigo.id,  produtoId: prodMassinha.id,    nota: 5, comentario: 'As cores são incríveis e a massinha não resseca facilmente. Meu filho de 3 anos usa todo dia.' } }),
  ]);

  console.log(` ${avaliacoesProduto.length} avaliações de produtos criadas.\n`);


  console.log(' Criando avaliações de lojas...');

  const avaliacoesLoja = await Promise.all([
    prisma.avaliacaoLoja.create({ data: { userId: rodrigo.id,  lojaId: lojaTechZone.id,         nota: 5, comentario: 'Produto antes do prazo, bem embalado e 100% original. Chat responde em minutos.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: anaBia.id,   lojaId: lojaTechZone.id,         nota: 4, comentario: 'Produtos originais e prazo cumprido. Embalagem poderia ter mais proteção para frágeis.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: carlos.id,   lojaId: lojaModaExpress.id,      nota: 5, comentario: 'Tamanho certinho, produto original e frete rápido. Curadoria de produtos muito boa.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: thiago.id,   lojaId: lojaModaExpress.id,      nota: 4, comentario: '3 compras realizadas, todas no prazo e conforme descrito. Recomendo.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: fernanda.id, lojaId: lojaGameVault.id,        nota: 5, comentario: 'PS5 veio selado, original, com NF. Entrega expressa em 24h para SP.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: mariana.id,  lojaId: lojaGameVault.id,        nota: 5, comentario: 'Melhor loja de games da plataforma! Preços justos e descrições precisas.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: anaBia.id,   lojaId: lojaCasaDecor.id,        nota: 5, comentario: 'Lençol e quadro chegaram bem embalados. Atendimento personalizado ajudou na escolha.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: rodrigo.id,  lojaId: lojaBelezaVip.id,        nota: 4, comentario: 'Sérum chegou no prazo, embalado direitinho. Atendimento via chat ágil.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: carlos.id,   lojaId: lojaMercadoBom.id,       nota: 5, comentario: 'Nunca pensei que compraria hortifruti online mas a qualidade é incrível. Já é meu mercadinho fixo!' } }),
    prisma.avaliacaoLoja.create({ data: { userId: thiago.id,   lojaId: lojaMercadoBom.id,       nota: 4, comentario: 'Produtos frescos e entrega dentro da janela. Um pedido chegou 20min atrasado mas avisaram antes.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: mariana.id,  lojaId: lojaFarmaciaSaude.id,    nota: 5, comentario: 'Medicamentos com NF e dentro da validade. Entrega rápida e embalagem reforçada. Confiável.' } }),
    prisma.avaliacaoLoja.create({ data: { userId: fernanda.id, lojaId: lojaBrinquedosMagicos.id,nota: 5, comentario: 'LEGO veio lacrado e com todos os sacos de peças intactos. Entrega cuidadosa. Filho adorou!' } }),
  ]);

  console.log(` ${avaliacoesLoja.length} avaliações de lojas criadas.\n`);


  console.log(' Criando comentários...');

  const [
    avSamsungCarlos, avIphoneRodrigo, avDellAnaBia, avSonyMariana,
    avPS5Carlos, avCatanMariana, avLencolFernanda, avQuadroThiago,
    avBatomAnaBia, avSerumMariana, avCestaThiago, avPicanhaFernanda,
    avLegoMariana, avPaletaAnaBia,
  ] = [
    avaliacoesProduto[0],  // Samsung - Carlos
    avaliacoesProduto[3],  // iPhone - Rodrigo
    avaliacoesProduto[7],  // Dell - AnaBia
    avaliacoesProduto[8],  // Sony - Mariana
    avaliacoesProduto[21], // PS5 - Carlos
    avaliacoesProduto[23], // Catan - Mariana
    avaliacoesProduto[28], // Lençol - Fernanda
    avaliacoesProduto[31], // Quadro - Thiago
    avaliacoesProduto[36], // Batom - AnaBia
    avaliacoesProduto[38], // Sérum - Mariana
    avaliacoesProduto[44], // Cesta Frutas - Thiago
    avaliacoesProduto[46], // Picanha - Fernanda
    avaliacoesProduto[54], // LEGO - Mariana
    avaliacoesProduto[40], // Paleta - AnaBia
  ];

  const [avLojaTechRodrigo, , , , avLojaGameFernanda, , , , avLojaMercadoCarlos] = [
    avaliacoesLoja[0], avaliacoesLoja[1], avaliacoesLoja[2], avaliacoesLoja[3],
    avaliacoesLoja[4], avaliacoesLoja[5], avaliacoesLoja[6], avaliacoesLoja[7],
    avaliacoesLoja[8],
  ];

  await prisma.comentarioAvaliacao.createMany({
    data: [
      // Em avaliações de produto
      { userId: thiago.id,   avaliacaoProdutoId: avSamsungCarlos.id,  conteudo: 'Concordo 100%! A S Pen realmente é diferencial enorme para tomar notas em reuniões.' },
      { userId: mariana.id,  avaliacaoProdutoId: avSamsungCarlos.id,  conteudo: 'A câmera noturna é impressionante mesmo. Minha filha ficou viciada tirando fotos à noite!' },
      { userId: carlos.id,   avaliacaoProdutoId: avIphoneRodrigo.id,  conteudo: 'O botão Ação é muito útil! Eu configurei para alternar entre modo silencioso e som.' },
      { userId: fernanda.id, avaliacaoProdutoId: avDellAnaBia.id,     conteudo: 'Boa dica sobre o cooler, Ana! Meu XPS também aquece em renderizações longas.' },
      { userId: mariana.id,  avaliacaoProdutoId: avPS5Carlos.id,      conteudo: 'Meu filho tem o PS5 e confirma — DualSense muda tudo! Fica difícil jogar em outros controles.' },
      { userId: anaBia.id,   avaliacaoProdutoId: avCatanMariana.id,   conteudo: 'Dica: na primeira partida, leiam as regras em voz alta juntos — fica muito mais fácil!' },
      { userId: rodrigo.id,  avaliacaoProdutoId: avLencolFernanda.id, conteudo: 'Depois de lavar algumas vezes fica ainda mais macio! Concordo com tudo.' },
      { userId: carlos.id,   avaliacaoProdutoId: avQuadroThiago.id,   conteudo: 'Também tenho da série Traços Dourados no escritório. Arte do Rafael Monteiro é excelente.' },
      { userId: thiago.id,   avaliacaoProdutoId: avBatomAnaBia.id,    conteudo: 'Minha esposa usa esse batom todo dia. Confirmo — o mais duradouro que ela já teve.' },
      { userId: carlos.id,   avaliacaoProdutoId: avSerumMariana.id,   conteudo: 'Minha namorada também usa. As manchinhas do sol clarearam bastante em pouco tempo.' },
      { userId: fernanda.id, avaliacaoProdutoId: avCestaThiago.id,    conteudo: 'As uvas itália deles são as melhores! Já pedi 5 vezes e nunca decepcionou.' },
      { userId: mariana.id,  avaliacaoProdutoId: avPicanhaFernanda.id,conteudo: 'Dica: temperatura ambiente por 30 min antes de grelhar e finaliza com manteiga. Divina!' },
      { userId: thiago.id,   avaliacaoProdutoId: avLegoMariana.id,    conteudo: 'Presente certeiro mesmo! Meu sobrinho também tem e é o brinquedo favorito dele.' },
      { userId: fernanda.id, avaliacaoProdutoId: avPaletaAnaBia.id,   conteudo: 'Concordo sobre usar primer — faz muita diferença na durabilidade dos mattes.' },
      // Em avaliações de loja
      { userId: anaBia.id,   avaliacaoLojaId: avLojaTechRodrigo.id,   conteudo: 'Concordo! Resolveram meu problema com o pedido em menos de 1 hora. Excelente suporte.' },
      { userId: rodrigo.id,  avaliacaoLojaId: avLojaGameFernanda.id,  conteudo: 'GameVault é minha loja preferida para games. Já comprei 3 consoles sem problema nenhum.' },
      { userId: carlos.id,   avaliacaoLojaId: avLojaMercadoCarlos.id, conteudo: 'Verdade! Fui cético no começo mas a qualidade do hortifruti para delivery é impressionante.' },
    ],
  });

  console.log('17 comentários criados.\n');

  
  console.log('━'.repeat(60));
  console.log(' Seed concluído com sucesso!\n');
  console.log(' Resumo:');
  console.log(`    Usuários:                7  (1 admin + 6 clientes)`);
  console.log(`    Categorias:              8  (IDs 1–8 garantidos)`);
  console.log(`    Subcategorias:           16`);
  console.log(`    Lojas:                   8  (todas as 8 categorias cobertas)`);
  console.log(`    Produtos:                34`);
  console.log(`     Imagens:                 ~55`);
  console.log(`    Avaliações de produtos:  ${avaliacoesProduto.length}`);
  console.log(`    Avaliações de lojas:     ${avaliacoesLoja.length}`);
  console.log(`    Comentários:             17`);
  console.log('━'.repeat(60));
  console.log('\n Credenciais:');
  console.log('   admin@loja.com.br          → Admin@123');
  console.log('   carlos.venturini@email.com → Carlos@2024');
  console.log('   mariana.goes@email.com     → Mariana@2024');
  console.log('   rodrigo.bastos@email.com   → Rodrigo@2024');
  console.log('   fernanda.lopes@email.com   → Fernanda@2024');
  console.log('   thiago.mendes@email.com    → Thiago@2024');
  console.log('   ana.beatriz@email.com      → AnaBia@2024\n');
}

main()
  .catch((e) => {
    console.error(' Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });