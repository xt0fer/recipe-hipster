package rocks.zipcode.recipehipster.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.recipehipster.domain.Recipe;
import rocks.zipcode.recipehipster.repository.RecipeRepository;
import rocks.zipcode.recipehipster.service.RecipeService;

/**
 * Service Implementation for managing {@link Recipe}.
 */
@Service
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final Logger log = LoggerFactory.getLogger(RecipeServiceImpl.class);

    private final RecipeRepository recipeRepository;

    public RecipeServiceImpl(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @Override
    public Recipe save(Recipe recipe) {
        log.debug("Request to save Recipe : {}", recipe);
        return recipeRepository.save(recipe);
    }

    @Override
    public Optional<Recipe> partialUpdate(Recipe recipe) {
        log.debug("Request to partially update Recipe : {}", recipe);

        return recipeRepository
            .findById(recipe.getId())
            .map(existingRecipe -> {
                if (recipe.getTitle() != null) {
                    existingRecipe.setTitle(recipe.getTitle());
                }
                if (recipe.getNotes() != null) {
                    existingRecipe.setNotes(recipe.getNotes());
                }
                if (recipe.getIngredients() != null) {
                    existingRecipe.setIngredients(recipe.getIngredients());
                }
                if (recipe.getSteps() != null) {
                    existingRecipe.setSteps(recipe.getSteps());
                }
                if (recipe.getPostDate() != null) {
                    existingRecipe.setPostDate(recipe.getPostDate());
                }

                return existingRecipe;
            })
            .map(recipeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Recipe> findAll(Pageable pageable) {
        log.debug("Request to get all Recipes");
        return recipeRepository.findAll(pageable);
    }

    /**
     *  Get all the recipes where Post is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Recipe> findAllWherePostIsNull() {
        log.debug("Request to get all recipes where Post is null");
        return StreamSupport
            .stream(recipeRepository.findAll().spliterator(), false)
            .filter(recipe -> recipe.getPost() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Recipe> findOne(Long id) {
        log.debug("Request to get Recipe : {}", id);
        return recipeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Recipe : {}", id);
        recipeRepository.deleteById(id);
    }
}
