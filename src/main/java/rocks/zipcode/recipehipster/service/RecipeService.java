package rocks.zipcode.recipehipster.service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import rocks.zipcode.recipehipster.domain.Recipe;

/**
 * Service Interface for managing {@link Recipe}.
 */
public interface RecipeService {
    /**
     * Save a recipe.
     *
     * @param recipe the entity to save.
     * @return the persisted entity.
     */
    Recipe save(Recipe recipe);

    /**
     * Partially updates a recipe.
     *
     * @param recipe the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Recipe> partialUpdate(Recipe recipe);

    /**
     * Get all the recipes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Recipe> findAll(Pageable pageable);
    /**
     * Get all the Recipe where Post is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Recipe> findAllWherePostIsNull();

    /**
     * Get the "id" recipe.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Recipe> findOne(Long id);

    /**
     * Delete the "id" recipe.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
