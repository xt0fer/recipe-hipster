package rocks.zipcode.recipehipster.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import rocks.zipcode.recipehipster.domain.Chefster;

/**
 * Spring Data SQL repository for the Chefster entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChefsterRepository extends JpaRepository<Chefster, Long> {}
