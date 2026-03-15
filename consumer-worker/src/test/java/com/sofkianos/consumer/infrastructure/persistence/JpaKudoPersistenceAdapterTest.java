package com.sofkianos.consumer.infrastructure.persistence;

import com.sofkianos.consumer.domain.model.KudoCategory;
import com.sofkianos.consumer.entity.Kudo;
import com.sofkianos.consumer.repository.KudoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JpaKudoPersistenceAdapterTest {

    @Mock
    private KudoRepository kudoRepository;

    @InjectMocks
    private JpaKudoPersistenceAdapter adapter;

    @Test
    @DisplayName("save() — Should delegate to kudoRepository.save()")
    void save_delegatesToRepository() {
        Kudo kudo = Kudo.builder()
                .fromUser("Alice")
                .toUser("Bob")
                .category(KudoCategory.TEAMWORK)
                .message("Great job!")
                .build();
        when(kudoRepository.save(any(Kudo.class))).thenReturn(kudo);

        Kudo result = adapter.save(kudo);

        assertThat(result.getFromUser()).isEqualTo("Alice");
        verify(kudoRepository).save(kudo);
    }

    @SuppressWarnings("unchecked")
    @Test
    @DisplayName("findKudos() — Should delegate to kudoRepository.findAll() with specification")
    void findKudos_delegatesToRepositoryWithSpec() {
        Page<Kudo> page = new PageImpl<>(List.of());
        when(kudoRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        Page<Kudo> result = adapter.findKudos(Optional.of("TEAMWORK"), Optional.of("test"), Pageable.unpaged());

        assertThat(result).isNotNull();
        verify(kudoRepository).findAll(any(Specification.class), any(Pageable.class));
    }
}
