package rocks.zipcode.recipehipster.service;

import java.util.List;
import java.util.Optional;
import rocks.zipcode.recipehipster.domain.Opinion;

/**
 * Service Interface for managing {@link Opinion}.
 */
public interface OpinionService {
    /**
     * Save a opinion.
     *
     * @param opinion the entity to save.
     * @return the persisted entity.
     */
    Opinion save(Opinion opinion);

    /**
     * Partially updates a opinion.
     *
     * @param opinion the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Opinion> partialUpdate(Opinion opinion);

    /**
     * Get all the opinions.
     *
     * @return the list of entities.
     */
    List<Opinion> findAll();

    /**
     * Get the "id" opinion.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Opinion> findOne(Long id);

    /**
     * Delete the "id" opinion.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
