package com.sofkianos.producer.application.dto;

import com.sofkianos.producer.domain.model.PagedResult;

import java.util.List;

/**
 * Respuesta envuelta para ítems de Kudo.
 */
public record PagedKudoResponse(
        List<KudoListItemDTO> content,
        long totalElements,
        int totalPages,
        int number,
        int size) {

    /**
     * Crea un {@link PagedKudoResponse} a partir de un {@link PagedResult}.
     *
     * @param pagedResult el resultado paginado del dominio/aplicación
     * @return un DTO de respuesta paginada
     */
    public static PagedKudoResponse from(PagedResult<KudoListItemDTO> pagedResult) {
        return new PagedKudoResponse(
                pagedResult.content(),
                pagedResult.totalElements(),
                pagedResult.totalPages(),
                pagedResult.pageNumber(),
                pagedResult.pageSize());
    }
}
