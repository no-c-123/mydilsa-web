import ExpandableServiceCard from "./ExpandableServiceCard";
import { services } from"@/data/servicios";


export default function ServiciosLista() {
  

  return (
    <section className="bg-white py-24 px-6 min-h-[80vh]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
      {services.map((srv, idx) => {
          return (
            <div key={idx} className="relative mb-28">
              <div className="invisible p-6 border rounded-xl bg-white" />
              <div className="absolute top-0 left-0 w-full h-full">
                <ExpandableServiceCard 
                  title={srv.title}
                  desc={srv.desc}
                  icon={srv.icon}
                  fullContent={srv.fullContent}
                />
              </div>
            </div>
            
          );
      })}
      </div>
    </section>
  );
}
