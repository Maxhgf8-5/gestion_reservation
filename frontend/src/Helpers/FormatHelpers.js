export default class FormatHelpers {
  static formatDateFr = (dateInput) => {
    const date = new Date(dateInput);

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
}
