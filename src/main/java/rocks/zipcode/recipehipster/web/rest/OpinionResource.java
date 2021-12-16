package rocks.zipcode.recipehipster.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rocks.zipcode.recipehipster.domain.Opinion;
import rocks.zipcode.recipehipster.repository.OpinionRepository;
import rocks.zipcode.recipehipster.service.OpinionService;
import rocks.zipcode.recipehipster.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link rocks.zipcode.recipehipster.domain.Opinion}.
 */
@RestController
@RequestMapping("/api")
public class OpinionResource {

    private final Logger log = LoggerFactory.getLogger(OpinionResource.class);

    private static final String ENTITY_NAME = "opinion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OpinionService opinionService;

    private final OpinionRepository opinionRepository;

    public OpinionResource(OpinionService opinionService, OpinionRepository opinionRepository) {
        this.opinionService = opinionService;
        this.opinionRepository = opinionRepository;
    }

    /**
     * {@code POST  /opinions} : Create a new opinion.
     *
     * @param opinion the opinion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new opinion, or with status {@code 400 (Bad Request)} if the opinion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/opinions")
    public ResponseEntity<Opinion> createOpinion(@RequestBody Opinion opinion) throws URISyntaxException {
        log.debug("REST request to save Opinion : {}", opinion);
        if (opinion.getId() != null) {
            throw new BadRequestAlertException("A new opinion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Opinion result = opinionService.save(opinion);
        return ResponseEntity
            .created(new URI("/api/opinions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /opinions/:id} : Updates an existing opinion.
     *
     * @param id the id of the opinion to save.
     * @param opinion the opinion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated opinion,
     * or with status {@code 400 (Bad Request)} if the opinion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the opinion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/opinions/{id}")
    public ResponseEntity<Opinion> updateOpinion(@PathVariable(value = "id", required = false) final Long id, @RequestBody Opinion opinion)
        throws URISyntaxException {
        log.debug("REST request to update Opinion : {}, {}", id, opinion);
        if (opinion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, opinion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!opinionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Opinion result = opinionService.save(opinion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, opinion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /opinions/:id} : Partial updates given fields of an existing opinion, field will ignore if it is null
     *
     * @param id the id of the opinion to save.
     * @param opinion the opinion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated opinion,
     * or with status {@code 400 (Bad Request)} if the opinion is not valid,
     * or with status {@code 404 (Not Found)} if the opinion is not found,
     * or with status {@code 500 (Internal Server Error)} if the opinion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/opinions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Opinion> partialUpdateOpinion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Opinion opinion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Opinion partially : {}, {}", id, opinion);
        if (opinion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, opinion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!opinionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Opinion> result = opinionService.partialUpdate(opinion);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, opinion.getId().toString())
        );
    }

    /**
     * {@code GET  /opinions} : get all the opinions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of opinions in body.
     */
    @GetMapping("/opinions")
    public List<Opinion> getAllOpinions() {
        log.debug("REST request to get all Opinions");
        return opinionService.findAll();
    }

    /**
     * {@code GET  /opinions/:id} : get the "id" opinion.
     *
     * @param id the id of the opinion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the opinion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/opinions/{id}")
    public ResponseEntity<Opinion> getOpinion(@PathVariable Long id) {
        log.debug("REST request to get Opinion : {}", id);
        Optional<Opinion> opinion = opinionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(opinion);
    }

    /**
     * {@code DELETE  /opinions/:id} : delete the "id" opinion.
     *
     * @param id the id of the opinion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/opinions/{id}")
    public ResponseEntity<Void> deleteOpinion(@PathVariable Long id) {
        log.debug("REST request to delete Opinion : {}", id);
        opinionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
