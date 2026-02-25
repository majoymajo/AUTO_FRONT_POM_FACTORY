package com.sofkianos.producer.domain.model;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Contenedor simple para resultados paginados en el dominio.
 * Totalmente independiente de frameworks.
 */
public record PagedResult<T>(
        List<T> content,
        long totalElements,
        int totalPages,
        int pageNumber,
        int pageSize) {
    /**
     * Mapea el contenido a otro tipo conservando los metadatos de paginación.
     */
    public <R> PagedResult<R> map(Function<? super T, ? extends R> converter) {
        List<R> mappedContent = this.content.stream()
                .map(converter)
                .collect(Collectors.toList());

        return new PagedResult<R>(
                mappedContent,
                this.totalElements,
                this.totalPages,
                this.pageNumber,
                this.pageSize);
    }
}
