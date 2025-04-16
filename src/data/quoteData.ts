// Autogenerated quoteData.ts

export const materialData: Record<string, {
  precioKilo: number;
  densidad: number;
  compatibles: string[];
}> = {
  "Acero Comercial": {
    precioKilo: 2.75,
    densidad: 0.13,
    compatibles: ["Angulo Regular", "PTR Cuadrado", "Redondo", "Placa o Lámina", "Solera", "Tubo", "Hexagonal"]
  },
  "Acero Inoxidable": {
    precioKilo: 5.99,
    densidad: 0.14,
    compatibles: ["PTR Cuadrado"]
  },
  "Aluminio": {
    precioKilo: 12.73,
    densidad: 0.045,
    compatibles: ["Solera", "Placa o Lámina"]
  },
  "Bronce": {
    precioKilo: 12.93,
    densidad: 0.084,
    compatibles: ["Solera"]
  },
  "Cobre": {
    precioKilo: 15.24,
    densidad: 0.08,
    compatibles: ["Solera"]
  },
  "Delrin/Teflon/G10": {
    precioKilo: 32.35,
    densidad: 0.04,
    compatibles: ["Solera"]
  },
  "Nylamid": {
    precioKilo: 17.63,
    densidad: 0.04,
    compatibles: ["Solera"]
  },
  "Solid Pro": {
    precioKilo: 45.88,
    densidad: 0.05,
    compatibles: ["Solera"]
  },
  "Titanio": {
    precioKilo: 67.78,
    densidad: 0.065,
    compatibles: ["Solera"]
  },
  "UHMW/PVC": {
    precioKilo: 23.84,
    densidad: 0.03,
    compatibles: ["Solera"]
  }
};

export const tipos = [
  "Angulo Regular",
  "PTR Cuadrado",
  "Redondo",
  "Placa o Lámina",
  "Solera",
  "Tubo",
  "Hexagonal" // etc.
];

export function getCompatibleMaterials(tipo: string) {
  return Object.keys(materialData).filter(
    (mat) => materialData[mat].compatibles.includes(tipo)
  );
}
