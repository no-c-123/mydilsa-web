export function getVolumen(tipo: string, espesor: number, ancho: number, largo: number): number | null {
    switch (tipo) {
      case "Solera":
      case "Placa o Lámina":
        return espesor * ancho * largo;
      case "Redondo":
        return Math.PI * Math.pow(ancho / 2, 2) * largo;
      case "PTR Cuadrado":
        return espesor * (4 * ancho) * largo;
      case "Angulo Regular":
        return 2 * ancho * largo * espesor;
      case "Tubo":
        return ancho * Math.PI * espesor * largo;
      default:
        return null;
    }
}