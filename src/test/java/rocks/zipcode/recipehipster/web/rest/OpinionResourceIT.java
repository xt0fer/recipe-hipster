package rocks.zipcode.recipehipster.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.recipehipster.IntegrationTest;
import rocks.zipcode.recipehipster.domain.Opinion;
import rocks.zipcode.recipehipster.repository.OpinionRepository;

/**
 * Integration tests for the {@link OpinionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OpinionResourceIT {

    private static final String DEFAULT_CONTENTS = "AAAAAAAAAA";
    private static final String UPDATED_CONTENTS = "BBBBBBBBBB";

    private static final Instant DEFAULT_COMMENT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_COMMENT_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/opinions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OpinionRepository opinionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOpinionMockMvc;

    private Opinion opinion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Opinion createEntity(EntityManager em) {
        Opinion opinion = new Opinion().contents(DEFAULT_CONTENTS).commentDate(DEFAULT_COMMENT_DATE);
        return opinion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Opinion createUpdatedEntity(EntityManager em) {
        Opinion opinion = new Opinion().contents(UPDATED_CONTENTS).commentDate(UPDATED_COMMENT_DATE);
        return opinion;
    }

    @BeforeEach
    public void initTest() {
        opinion = createEntity(em);
    }

    @Test
    @Transactional
    void createOpinion() throws Exception {
        int databaseSizeBeforeCreate = opinionRepository.findAll().size();
        // Create the Opinion
        restOpinionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(opinion)))
            .andExpect(status().isCreated());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeCreate + 1);
        Opinion testOpinion = opinionList.get(opinionList.size() - 1);
        assertThat(testOpinion.getContents()).isEqualTo(DEFAULT_CONTENTS);
        assertThat(testOpinion.getCommentDate()).isEqualTo(DEFAULT_COMMENT_DATE);
    }

    @Test
    @Transactional
    void createOpinionWithExistingId() throws Exception {
        // Create the Opinion with an existing ID
        opinion.setId(1L);

        int databaseSizeBeforeCreate = opinionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOpinionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(opinion)))
            .andExpect(status().isBadRequest());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOpinions() throws Exception {
        // Initialize the database
        opinionRepository.saveAndFlush(opinion);

        // Get all the opinionList
        restOpinionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(opinion.getId().intValue())))
            .andExpect(jsonPath("$.[*].contents").value(hasItem(DEFAULT_CONTENTS)))
            .andExpect(jsonPath("$.[*].commentDate").value(hasItem(DEFAULT_COMMENT_DATE.toString())));
    }

    @Test
    @Transactional
    void getOpinion() throws Exception {
        // Initialize the database
        opinionRepository.saveAndFlush(opinion);

        // Get the opinion
        restOpinionMockMvc
            .perform(get(ENTITY_API_URL_ID, opinion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(opinion.getId().intValue()))
            .andExpect(jsonPath("$.contents").value(DEFAULT_CONTENTS))
            .andExpect(jsonPath("$.commentDate").value(DEFAULT_COMMENT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingOpinion() throws Exception {
        // Get the opinion
        restOpinionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOpinion() throws Exception {
        // Initialize the database
        opinionRepository.saveAndFlush(opinion);

        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();

        // Update the opinion
        Opinion updatedOpinion = opinionRepository.findById(opinion.getId()).get();
        // Disconnect from session so that the updates on updatedOpinion are not directly saved in db
        em.detach(updatedOpinion);
        updatedOpinion.contents(UPDATED_CONTENTS).commentDate(UPDATED_COMMENT_DATE);

        restOpinionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOpinion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOpinion))
            )
            .andExpect(status().isOk());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
        Opinion testOpinion = opinionList.get(opinionList.size() - 1);
        assertThat(testOpinion.getContents()).isEqualTo(UPDATED_CONTENTS);
        assertThat(testOpinion.getCommentDate()).isEqualTo(UPDATED_COMMENT_DATE);
    }

    @Test
    @Transactional
    void putNonExistingOpinion() throws Exception {
        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();
        opinion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOpinionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, opinion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(opinion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOpinion() throws Exception {
        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();
        opinion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOpinionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(opinion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOpinion() throws Exception {
        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();
        opinion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOpinionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(opinion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOpinionWithPatch() throws Exception {
        // Initialize the database
        opinionRepository.saveAndFlush(opinion);

        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();

        // Update the opinion using partial update
        Opinion partialUpdatedOpinion = new Opinion();
        partialUpdatedOpinion.setId(opinion.getId());

        partialUpdatedOpinion.contents(UPDATED_CONTENTS);

        restOpinionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOpinion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOpinion))
            )
            .andExpect(status().isOk());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
        Opinion testOpinion = opinionList.get(opinionList.size() - 1);
        assertThat(testOpinion.getContents()).isEqualTo(UPDATED_CONTENTS);
        assertThat(testOpinion.getCommentDate()).isEqualTo(DEFAULT_COMMENT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateOpinionWithPatch() throws Exception {
        // Initialize the database
        opinionRepository.saveAndFlush(opinion);

        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();

        // Update the opinion using partial update
        Opinion partialUpdatedOpinion = new Opinion();
        partialUpdatedOpinion.setId(opinion.getId());

        partialUpdatedOpinion.contents(UPDATED_CONTENTS).commentDate(UPDATED_COMMENT_DATE);

        restOpinionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOpinion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOpinion))
            )
            .andExpect(status().isOk());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
        Opinion testOpinion = opinionList.get(opinionList.size() - 1);
        assertThat(testOpinion.getContents()).isEqualTo(UPDATED_CONTENTS);
        assertThat(testOpinion.getCommentDate()).isEqualTo(UPDATED_COMMENT_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingOpinion() throws Exception {
        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();
        opinion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOpinionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, opinion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(opinion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOpinion() throws Exception {
        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();
        opinion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOpinionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(opinion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOpinion() throws Exception {
        int databaseSizeBeforeUpdate = opinionRepository.findAll().size();
        opinion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOpinionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(opinion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Opinion in the database
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOpinion() throws Exception {
        // Initialize the database
        opinionRepository.saveAndFlush(opinion);

        int databaseSizeBeforeDelete = opinionRepository.findAll().size();

        // Delete the opinion
        restOpinionMockMvc
            .perform(delete(ENTITY_API_URL_ID, opinion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Opinion> opinionList = opinionRepository.findAll();
        assertThat(opinionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
