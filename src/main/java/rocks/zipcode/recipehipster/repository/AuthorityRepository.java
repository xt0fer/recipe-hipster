package rocks.zipcode.recipehipster.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rocks.zipcode.recipehipster.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
