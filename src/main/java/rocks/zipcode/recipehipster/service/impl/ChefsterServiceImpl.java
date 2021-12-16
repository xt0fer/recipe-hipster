package rocks.zipcode.recipehipster.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.recipehipster.domain.Chefster;
import rocks.zipcode.recipehipster.repository.ChefsterRepository;
import rocks.zipcode.recipehipster.service.ChefsterService;

/**
 * Service Implementation for managing {@link Chefster}.
 */
@Service
@Transactional
public class ChefsterServiceImpl implements ChefsterService {

    private final Logger log = LoggerFactory.getLogger(ChefsterServiceImpl.class);

    private final ChefsterRepository chefsterRepository;

    public ChefsterServiceImpl(ChefsterRepository chefsterRepository) {
        this.chefsterRepository = chefsterRepository;
    }

    @Override
    public Chefster save(Chefster chefster) {
        log.debug("Request to save Chefster : {}", chefster);
        return chefsterRepository.save(chefster);
    }

    @Override
    public Optional<Chefster> partialUpdate(Chefster chefster) {
        log.debug("Request to partially update Chefster : {}", chefster);

        return chefsterRepository
            .findById(chefster.getId())
            .map(existingChefster -> {
                if (chefster.getFirstName() != null) {
                    existingChefster.setFirstName(chefster.getFirstName());
                }
                if (chefster.getLastName() != null) {
                    existingChefster.setLastName(chefster.getLastName());
                }
                if (chefster.getEmail() != null) {
                    existingChefster.setEmail(chefster.getEmail());
                }
                if (chefster.getPhoneNumber() != null) {
                    existingChefster.setPhoneNumber(chefster.getPhoneNumber());
                }

                return existingChefster;
            })
            .map(chefsterRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Chefster> findAll(Pageable pageable) {
        log.debug("Request to get all Chefsters");
        return chefsterRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Chefster> findOne(Long id) {
        log.debug("Request to get Chefster : {}", id);
        return chefsterRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Chefster : {}", id);
        chefsterRepository.deleteById(id);
    }
}
