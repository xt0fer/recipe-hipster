package rocks.zipcode.recipehipster.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import rocks.zipcode.recipehipster.domain.Chefster;
import rocks.zipcode.recipehipster.repository.ChefsterRepository;

/**
 * Integration tests for the {@link ChefsterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChefsterResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chefsters";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChefsterRepository chefsterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChefsterMockMvc;

    private Chefster chefster;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chefster createEntity(EntityManager em) {
        Chefster chefster = new Chefster()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER);
        return chefster;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chefster createUpdatedEntity(EntityManager em) {
        Chefster chefster = new Chefster()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);
        return chefster;
    }

    @BeforeEach
    public void initTest() {
        chefster = createEntity(em);
    }

    @Test
    @Transactional
    void createChefster() throws Exception {
        int databaseSizeBeforeCreate = chefsterRepository.findAll().size();
        // Create the Chefster
        restChefsterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chefster)))
            .andExpect(status().isCreated());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeCreate + 1);
        Chefster testChefster = chefsterList.get(chefsterList.size() - 1);
        assertThat(testChefster.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testChefster.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testChefster.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testChefster.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void createChefsterWithExistingId() throws Exception {
        // Create the Chefster with an existing ID
        chefster.setId(1L);

        int databaseSizeBeforeCreate = chefsterRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChefsterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chefster)))
            .andExpect(status().isBadRequest());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChefsters() throws Exception {
        // Initialize the database
        chefsterRepository.saveAndFlush(chefster);

        // Get all the chefsterList
        restChefsterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chefster.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)));
    }

    @Test
    @Transactional
    void getChefster() throws Exception {
        // Initialize the database
        chefsterRepository.saveAndFlush(chefster);

        // Get the chefster
        restChefsterMockMvc
            .perform(get(ENTITY_API_URL_ID, chefster.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chefster.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingChefster() throws Exception {
        // Get the chefster
        restChefsterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChefster() throws Exception {
        // Initialize the database
        chefsterRepository.saveAndFlush(chefster);

        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();

        // Update the chefster
        Chefster updatedChefster = chefsterRepository.findById(chefster.getId()).get();
        // Disconnect from session so that the updates on updatedChefster are not directly saved in db
        em.detach(updatedChefster);
        updatedChefster.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).email(UPDATED_EMAIL).phoneNumber(UPDATED_PHONE_NUMBER);

        restChefsterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChefster.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChefster))
            )
            .andExpect(status().isOk());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
        Chefster testChefster = chefsterList.get(chefsterList.size() - 1);
        assertThat(testChefster.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testChefster.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testChefster.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testChefster.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingChefster() throws Exception {
        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();
        chefster.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChefsterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chefster.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefster))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChefster() throws Exception {
        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();
        chefster.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefsterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chefster))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChefster() throws Exception {
        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();
        chefster.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefsterMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chefster)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChefsterWithPatch() throws Exception {
        // Initialize the database
        chefsterRepository.saveAndFlush(chefster);

        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();

        // Update the chefster using partial update
        Chefster partialUpdatedChefster = new Chefster();
        partialUpdatedChefster.setId(chefster.getId());

        partialUpdatedChefster.lastName(UPDATED_LAST_NAME).phoneNumber(UPDATED_PHONE_NUMBER);

        restChefsterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChefster.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChefster))
            )
            .andExpect(status().isOk());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
        Chefster testChefster = chefsterList.get(chefsterList.size() - 1);
        assertThat(testChefster.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testChefster.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testChefster.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testChefster.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateChefsterWithPatch() throws Exception {
        // Initialize the database
        chefsterRepository.saveAndFlush(chefster);

        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();

        // Update the chefster using partial update
        Chefster partialUpdatedChefster = new Chefster();
        partialUpdatedChefster.setId(chefster.getId());

        partialUpdatedChefster
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER);

        restChefsterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChefster.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChefster))
            )
            .andExpect(status().isOk());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
        Chefster testChefster = chefsterList.get(chefsterList.size() - 1);
        assertThat(testChefster.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testChefster.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testChefster.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testChefster.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingChefster() throws Exception {
        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();
        chefster.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChefsterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chefster.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chefster))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChefster() throws Exception {
        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();
        chefster.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefsterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chefster))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChefster() throws Exception {
        int databaseSizeBeforeUpdate = chefsterRepository.findAll().size();
        chefster.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChefsterMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chefster)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chefster in the database
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChefster() throws Exception {
        // Initialize the database
        chefsterRepository.saveAndFlush(chefster);

        int databaseSizeBeforeDelete = chefsterRepository.findAll().size();

        // Delete the chefster
        restChefsterMockMvc
            .perform(delete(ENTITY_API_URL_ID, chefster.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Chefster> chefsterList = chefsterRepository.findAll();
        assertThat(chefsterList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
