package rocks.zipcode.recipehipster.service.impl;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rocks.zipcode.recipehipster.domain.Opinion;
import rocks.zipcode.recipehipster.repository.OpinionRepository;
import rocks.zipcode.recipehipster.service.OpinionService;

/**
 * Service Implementation for managing {@link Opinion}.
 */
@Service
@Transactional
public class OpinionServiceImpl implements OpinionService {

    private final Logger log = LoggerFactory.getLogger(OpinionServiceImpl.class);

    private final OpinionRepository opinionRepository;

    public OpinionServiceImpl(OpinionRepository opinionRepository) {
        this.opinionRepository = opinionRepository;
    }

    @Override
    public Opinion save(Opinion opinion) {
        log.debug("Request to save Opinion : {}", opinion);
        return opinionRepository.save(opinion);
    }

    @Override
    public Optional<Opinion> partialUpdate(Opinion opinion) {
        log.debug("Request to partially update Opinion : {}", opinion);

        return opinionRepository
            .findById(opinion.getId())
            .map(existingOpinion -> {
                if (opinion.getContents() != null) {
                    existingOpinion.setContents(opinion.getContents());
                }
                if (opinion.getCommentDate() != null) {
                    existingOpinion.setCommentDate(opinion.getCommentDate());
                }

                return existingOpinion;
            })
            .map(opinionRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Opinion> findAll() {
        log.debug("Request to get all Opinions");
        return opinionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Opinion> findOne(Long id) {
        log.debug("Request to get Opinion : {}", id);
        return opinionRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Opinion : {}", id);
        opinionRepository.deleteById(id);
    }
}
