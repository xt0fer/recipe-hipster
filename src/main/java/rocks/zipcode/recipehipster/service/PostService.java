package rocks.zipcode.recipehipster.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import rocks.zipcode.recipehipster.domain.Post;

/**
 * Service Interface for managing {@link Post}.
 */
public interface PostService {
    /**
     * Save a post.
     *
     * @param post the entity to save.
     * @return the persisted entity.
     */
    Post save(Post post);

    /**
     * Partially updates a post.
     *
     * @param post the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Post> partialUpdate(Post post);

    /**
     * Get all the posts.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Post> findAll(Pageable pageable);

    /**
     * Get the "id" post.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Post> findOne(Long id);

    /**
     * Delete the "id" post.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
