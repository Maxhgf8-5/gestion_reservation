export default class FormatHelpers {
  static formatDateFr = (dateInput) => {
    const date = new Date(dateInput);

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

    // mettre chaque premier mot en majuscule
  static capitalizeWords(str) {
    return str
      .toLowerCase() // mettre tout en minuscule d'abord
      .split(/\s+/) // découper par espaces multiples
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "); // reconstruire la phrase
  }
    static formatString(text) {
    return text
      .split(" ") // découpe en mots
      .map((mot) => mot[0]) // prend la première lettre de chaque mot
      .join("") // assemble en une seule chaîne
      .toUpperCase(); // met en majuscules
  }

}
