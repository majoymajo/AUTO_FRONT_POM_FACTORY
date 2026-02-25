package com.sofkianos.producer.infrastructure.exception;

/**
 * Excepción lanzada cuando un recurso solicitado no existe en el sistema
 * (ej.: un Kudo con el ID indicado no fue encontrado en base de datos).
 *
 * <p>
 * Es capturada por el {@link GlobalExceptionHandler} y mapeada a
 * <strong>404 Not Found</strong>.
 * </p>
 *
 * <p>
 * Ejemplo de log esperado al lanzarse:
 * </p>
 * 
 * <pre>
 * [WARN] Resource not found: Kudo with id 99 does not exist
 * </pre>
 *
 * @author Sofkianos
 * @since 1.0
 * @see GlobalExceptionHandler#handleResourceNotFound(ResourceNotFoundException,
 *      jakarta.servlet.http.HttpServletRequest)
 */
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Construye la excepción con el mensaje que describe qué recurso no fue
     * encontrado.
     *
     * @param message descripción del recurso que no existe (ej.: "Kudo with id 5
     *                not found")
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
