export default function Clients() {
  return (
    <section className="bg-gradient-to-b from-mydilsa-light to-gray-200 py-16 px-6 min-h-[50vh]">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-mydilsa-dark mb-12">Clientes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { src: 'AcuityBrands.webp', alt: 'Acuity Brands' },
            { src: 'Lear.webp', alt: 'LEAR Corporation' },
            { src: 'GEHealthcare.webp', alt: 'GE Healthcare' },
            { src: 'JohnDeere.webp', alt: 'John Deere' }
          ].map((client, idx) => (
            <div key={idx} className="flex items-center justify-center h-20">
              <img
                src={client.src}
                alt={client.alt}
                className="max-h-full max-w-[250px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
