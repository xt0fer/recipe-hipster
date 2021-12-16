package rocks.zipcode.recipehipster.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import rocks.zipcode.recipehipster.domain.Opinion;

/**
 * Spring Data SQL repository for the Opinion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OpinionRepository extends JpaRepository<Opinion, Long> {}
