import Image from 'next/image';
export function BeforeAfterShowcase() {
  const pairs = [['Sofá', '/sofaclean/photos/sofa_antes.webp', '/sofaclean/photos/sofa_depois.webp'], ['Colchão', '/sofaclean/photos/colchao_antes.webp', '/sofaclean/photos/colchao_depois.webp'], ['Tapete', '/sofaclean/photos/tapete_antes.webp', '/sofaclean/photos/tapete_depois.webp'], ['Banco de carro', '/sofaclean/photos/banco_carro_antes.webp', '/sofaclean/photos/banco_carro_depois.webp']];
  return <section className="section shell before-after-showcase" aria-labelledby="before-after-title"><div className="section-head"><div><div className="kicker">RESULTADOS QUE SE VEEM</div><h2 id="before-after-title">Antes <em>&amp;</em> depois</h2></div><p>Resultados reais de higienização realizados pela SofaClean.</p></div><div className="before-after-pairs">{pairs.map(([label, before, after]) => <article key={label}><h3>{label}</h3><div className="before-after-pair"><figure><Image unoptimized src={before} alt={`${label}: antes da higienização`} width={600} height={430}/><figcaption>Antes</figcaption></figure><figure><Image unoptimized src={after} alt={`${label}: depois da higienização`} width={600} height={430}/><figcaption>Depois</figcaption></figure></div></article>)}</div><p className="before-after-note">Resultados dependem do tecido, do estado da peça e do tempo da sujidade.</p></section>;
}





