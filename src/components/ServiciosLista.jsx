import ExpandableServiceCard from "./ExpandableServiceCard";
import { services } from "../data/servicios";

export default function ServiciosLista() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {services.map((srv, idx) => (
          <ExpandableServiceCard
            key={idx}
            title={srv.title}
            desc={srv.desc}
            icon={srv.icon}
            fullContent={srv.fullContent}
          />
        ))}
      </div>
    </section>
  );
}
