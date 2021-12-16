package rocks.zipcode.recipehipster.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import rocks.zipcode.recipehipster.domain.Chefster;
import rocks.zipcode.recipehipster.repository.ChefsterRepository;
import rocks.zipcode.recipehipster.service.ChefsterService;
import rocks.zipcode.recipehipster.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link rocks.zipcode.recipehipster.domain.Chefster}.
 */
@RestController
@RequestMapping("/api")
public class ChefsterResource {

    private final Logger log = LoggerFactory.getLogger(ChefsterResource.class);

    private static final String ENTITY_NAME = "chefster";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChefsterService chefsterService;

    private final ChefsterRepository chefsterRepository;

    public ChefsterResource(ChefsterService chefsterService, ChefsterRepository chefsterRepository) {
        this.chefsterService = chefsterService;
        this.chefsterRepository = chefsterRepository;
    }

    /**
     * {@code POST  /chefsters} : Create a new chefster.
     *
     * @param chefster the chefster to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chefster, or with status {@code 400 (Bad Request)} if the chefster has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/chefsters")
    public ResponseEntity<Chefster> createChefster(@RequestBody Chefster chefster) throws URISyntaxException {
        log.debug("REST request to save Chefster : {}", chefster);
        if (chefster.getId() != null) {
            throw new BadRequestAlertException("A new chefster cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chefster result = chefsterService.save(chefster);
        return ResponseEntity
            .created(new URI("/api/chefsters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /chefsters/:id} : Updates an existing chefster.
     *
     * @param id the id of the chefster to save.
     * @param chefster the chefster to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chefster,
     * or with status {@code 400 (Bad Request)} if the chefster is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chefster couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/chefsters/{id}")
    public ResponseEntity<Chefster> updateChefster(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Chefster chefster
    ) throws URISyntaxException {
        log.debug("REST request to update Chefster : {}, {}", id, chefster);
        if (chefster.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chefster.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chefsterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Chefster result = chefsterService.save(chefster);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chefster.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /chefsters/:id} : Partial updates given fields of an existing chefster, field will ignore if it is null
     *
     * @param id the id of the chefster to save.
     * @param chefster the chefster to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chefster,
     * or with status {@code 400 (Bad Request)} if the chefster is not valid,
     * or with status {@code 404 (Not Found)} if the chefster is not found,
     * or with status {@code 500 (Internal Server Error)} if the chefster couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/chefsters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Chefster> partialUpdateChefster(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Chefster chefster
    ) throws URISyntaxException {
        log.debug("REST request to partial update Chefster partially : {}, {}", id, chefster);
        if (chefster.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chefster.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chefsterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Chefster> result = chefsterService.partialUpdate(chefster);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chefster.getId().toString())
        );
    }

    /**
     * {@code GET  /chefsters} : get all the chefsters.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of chefsters in body.
     */
    @GetMapping("/chefsters")
    public ResponseEntity<List<Chefster>> getAllChefsters(Pageable pageable) {
        log.debug("REST request to get a page of Chefsters");
        Page<Chefster> page = chefsterService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /chefsters/:id} : get the "id" chefster.
     *
     * @param id the id of the chefster to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chefster, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/chefsters/{id}")
    public ResponseEntity<Chefster> getChefster(@PathVariable Long id) {
        log.debug("REST request to get Chefster : {}", id);
        Optional<Chefster> chefster = chefsterService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chefster);
    }

    /**
     * {@code DELETE  /chefsters/:id} : delete the "id" chefster.
     *
     * @param id the id of the chefster to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/chefsters/{id}")
    public ResponseEntity<Void> deleteChefster(@PathVariable Long id) {
        log.debug("REST request to delete Chefster : {}", id);
        chefsterService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
