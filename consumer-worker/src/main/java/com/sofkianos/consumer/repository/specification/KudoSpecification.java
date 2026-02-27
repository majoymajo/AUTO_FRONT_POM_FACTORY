package com.sofkianos.consumer.repository.specification;

import com.sofkianos.consumer.domain.model.KudoCategory;
import com.sofkianos.consumer.entity.Kudo;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class KudoSpecification {

    private KudoSpecification() {
        // Private constructor to hide the implicit public one
    }

    public static Specification<Kudo> buildSearchSpec(String categoryStr, String searchText) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categoryStr != null && !categoryStr.trim().isEmpty()) {
                try {
                    KudoCategory category = KudoCategory.fromString(categoryStr);
                    predicates.add(criteriaBuilder.equal(root.get("category"), category));
                } catch (IllegalArgumentException e) {
                    // Invalid category string means no rows will match
                    predicates.add(criteriaBuilder.disjunction());
                }
            }

            if (searchText != null && !searchText.trim().isEmpty()) {
                String pattern = "%" + searchText.toLowerCase() + "%";
                Predicate messageLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("message")), pattern);
                Predicate fromLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("fromUser")), pattern);
                Predicate toLike = criteriaBuilder.like(criteriaBuilder.lower(root.get("toUser")), pattern);

                // For Enum mapping to String
                Predicate categoryLike = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("category").as(String.class)),
                        pattern);

                predicates.add(criteriaBuilder.or(messageLike, fromLike, toLike, categoryLike));
            }

            // Make sure we only add order by when it's not a count query
            if (Long.class != query.getResultType() && long.class != query.getResultType()) {
                query.orderBy(criteriaBuilder.desc(root.get("createdAt")));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
