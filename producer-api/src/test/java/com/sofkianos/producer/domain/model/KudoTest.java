package com.sofkianos.producer.domain.model;

import com.sofkianos.producer.domain.valueobject.KudoCategory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;


class KudoTest {

    @Test
    @DisplayName("Given valid params — When create — Then returns Kudo with null id and non-null createdAt")
    void givenValidParams_whenCreate_thenReturnsKudo() {
        Kudo kudo = Kudo.create("alice@sofka.com", "bob@sofka.com",
                KudoCategory.Teamwork, "Great collaboration!");

        assertThat(kudo.id()).isNull();
        assertThat(kudo.fromUser()).isEqualTo("alice@sofka.com");
        assertThat(kudo.toUser()).isEqualTo("bob@sofka.com");
        assertThat(kudo.category()).isEqualTo(KudoCategory.Teamwork);
        assertThat(kudo.message()).isEqualTo("Great collaboration!");
        assertThat(kudo.createdAt()).isNotNull();
    }

    @Test
    @DisplayName("Given null category — When create — Then Kudo has null category")
    void givenNullCategory_whenCreate_thenCategoryIsNull() {
        Kudo kudo = Kudo.create("alice@sofka.com", "bob@sofka.com", null, "msg");
        assertThat(kudo.category()).isNull();
    }

    @Test
    @DisplayName("Given create called twice — When comparing — Then createdAt is generated each time")
    void givenTwoCalls_whenCreate_thenDifferentTimestamps() {
        Kudo k1 = Kudo.create("a@a.com", "b@b.com", KudoCategory.Innovation, "msg");
        Kudo k2 = Kudo.create("a@a.com", "b@b.com", KudoCategory.Innovation, "msg");