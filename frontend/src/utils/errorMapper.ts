/**
 * Interfaz que representa un error de validación estructurado.
 *
 * @interface ValidationError
 * @property {string} field - Nombre del campo con error (traducido al español).
 * @property {string} message - Mensaje de error descriptivo (traducido al español).
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Mapa de nombres de campos del backend (inglés) a español.
 * Usado para traducir los nombres de campos en errores de validación.
 *
 * @constant {Record<string, string>} FIELD_MAP
 */
const FIELD_MAP: Record<string, string> = {
  message: "Mensaje",
  category: "Categoría",
  to: "Destinatario",
  from: "Remitente",
};

/**
 * Diccionario de mensajes de error del backend (inglés) a español.
 * Mapea mensajes completos para mantener consistencia en la traducción.
 *
 * @constant {Record<string, string>} ERROR_DICTIONARY
 */
const ERROR_DICTIONARY: Record<string, string> = {
  "The message must be between 10 and 500 characters":
    "El mensaje debe tener entre 10 y 500 caracteres.",
  "The category is required": "Debes seleccionar una categoría.",
  "Invalid category": "La categoría seleccionada no es válida.",
  "The 'to' email is required": "Debes especificar un destinatario.",
  "The 'from' email is required": "Debes identificar quién envía el Kudo.",
  "Cannot send kudo to yourself": "No puedes enviarte un Kudo a ti mismo.",
};

/**
 * Parsea y traduce errores de validación del backend a una lista estructurada.
 *
 * El backend devuelve errores en formato de cadena: "field: msg; field: msg".
 * Esta función convierte ese formato a un array de objetos tipados con campos
 * y mensajes traducidos al español.
 *
 * Proceso de parseo:
 * 1. Divide la cadena por punto y coma (;) para obtener segmentos individuales
 * 2. Para cada segmento, busca el primer dos puntos (:) como separador
 * 3. La parte antes del separador es el campo (field)
 * 4. La parte después del separador es el mensaje (message)
 * 5. Traduce el campo usando FIELD_MAP
 * 6. Traduce el mensaje usando ERROR_DICTIONARY
 * 7. Si no hay traducción, usa el valor original
 *
 * Casos especiales:
 * - **rawString vacío**: Retorna error genérico "Ocurrió un error inesperado"
 * - **Sin separador (:)**: Trata el segmento completo como mensaje con field "General"
 * - **Sin errores parseados**: Retorna el rawString completo como mensaje de error
 *
 * Formato de entrada esperado:
 * "message: The message must be between 10 and 500 characters; to: The 'to' email is required"
 *
 * Formato de salida:
 * [
 *   { field: "Mensaje", message: "El mensaje debe tener entre 10 y 500 caracteres." },
 *   { field: "Destinatario", message: "Debes especificar un destinatario." }
 * ]
 *
 * @function parseAndTranslateErrors
 * @param {string} rawString - Cadena de errores del backend en formato "field: msg; field: msg".
 * @returns {ValidationError[]} Array de errores estructurados y traducidos.
 *
 * @example
 * const rawErrors = "message: The message must be between 10 and 500 characters";
 * const errors = parseAndTranslateErrors(rawErrors);
 * // errors = [{ field: "Mensaje", message: "El mensaje debe tener entre 10 y 500 caracteres." }]
 *
 * @example
 * const rawErrors = "to: The 'to' email is required; from: The 'from' email is required";
 * const errors = parseAndTranslateErrors(rawErrors);
 * // errors = [
 * //   { field: "Destinatario", message: "Debes especificar un destinatario." },
 * //   { field: "Remitente", message: "Debes identificar quién envía el Kudo." }
 * // ]
 */
export const parseAndTranslateErrors = (
  rawString: string,
): ValidationError[] => {
  if (!rawString)
    return [{ field: "Error", message: "Ocurrió un error inesperado." }];

  // 1. Split by semicolon
  const segments = rawString
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const errors: ValidationError[] = segments.map((segment) => {
    // 2. Split by first colon
    const separatorIndex = segment.indexOf(":");
    if (separatorIndex === -1) {
      return { field: "General", message: segment };
    }

    const rawField = segment.substring(0, separatorIndex).trim();
    const rawMessage = segment.substring(separatorIndex + 1).trim();

    // 3. Translate & Map
    const translatedField = FIELD_MAP[rawField] || rawField;
    const translatedMessage = ERROR_DICTIONARY[rawMessage] || rawMessage;

    return { field: translatedField, message: translatedMessage };
  });

  return errors.length > 0 ? errors : [{ field: "Error", message: rawString }];
};

// Keep for backward compatibility if needed, but we will likely replace usage
export const mapBackendErrorsToSpanish = (detail: string): string => {
  const errors = parseAndTranslateErrors(detail);
  return errors.map((e) => `${e.field}: ${e.message}`).join(", ");
};
