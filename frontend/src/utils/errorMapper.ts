
export interface ValidationError {
    field: string;
    message: string;
}

const FIELD_MAP: Record<string, string> = {
    'message': 'Mensaje',
    'category': 'Categoría',
    'to': 'Destinatario',
    'from': 'Remitente',
};

const ERROR_DICTIONARY: Record<string, string> = {
    "The message must be between 10 and 500 characters": "El mensaje debe tener entre 10 y 500 caracteres.",
    "The category is required": "Debes seleccionar una categoría.",
    "Invalid category": "La categoría seleccionada no es válida.",
    "The 'to' email is required": "Debes especificar un destinatario.",
    "The 'from' email is required": "Debes identificar quién envía el Kudo.",
    "Cannot send kudo to yourself": "No puedes enviarte un Kudo a ti mismo.",
};

/**
 * Parses a backend error string like "field: msg; field: msg" into a structured list.
 * Translates fields and messages to Spanish.
 */
export const parseAndTranslateErrors = (rawString: string): ValidationError[] => {
    if (!rawString) return [{ field: 'Error', message: 'Ocurrió un error inesperado.' }];

    // 1. Split by semicolon
    const segments = rawString.split(';').map(s => s.trim()).filter(Boolean);

    const errors: ValidationError[] = segments.map(segment => {
        // 2. Split by first colon
        const separatorIndex = segment.indexOf(':');
        if (separatorIndex === -1) {
            return { field: 'General', message: segment };
        }

        const rawField = segment.substring(0, separatorIndex).trim();
        const rawMessage = segment.substring(separatorIndex + 1).trim();

        // 3. Translate & Map
        const translatedField = FIELD_MAP[rawField] || rawField;
        const translatedMessage = ERROR_DICTIONARY[rawMessage] || rawMessage;

        return { field: translatedField, message: translatedMessage };
    });

    return errors.length > 0 ? errors : [{ field: 'Error', message: rawString }];
};

// Keep for backward compatibility if needed, but we will likely replace usage
export const mapBackendErrorsToSpanish = (detail: string): string => {
    const errors = parseAndTranslateErrors(detail);
    return errors.map(e => `${e.field}: ${e.message}`).join(', ');
};
