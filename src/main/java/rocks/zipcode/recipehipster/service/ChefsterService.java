package rocks.zipcode.recipehipster.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import rocks.zipcode.recipehipster.domain.Chefster;

/**
 * Service Interface for managing {@link Chefster}.
 */
public interface ChefsterService {
    /**
     * Save a chefster.
     *
     * @param chefster the entity to save.
     * @return the persisted entity.
     */
    Chefster save(Chefster chefster);

    /**
     * Partially updates a chefster.
     *
     * @param chefster the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Chefster> partialUpdate(Chefster chefster);

    /**
     * Get all the chefsters.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Chefster> findAll(Pageable pageable);

    /**
     * Get the "id" chefster.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Chefster> findOne(Long id);

    /**
     * Delete the "id" chefster.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
