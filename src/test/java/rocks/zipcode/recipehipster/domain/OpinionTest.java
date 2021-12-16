package rocks.zipcode.recipehipster.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.recipehipster.web.rest.TestUtil;

class OpinionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Opinion.class);
        Opinion opinion1 = new Opinion();
        opinion1.setId(1L);
        Opinion opinion2 = new Opinion();
        opinion2.setId(opinion1.getId());
        assertThat(opinion1).isEqualTo(opinion2);
        opinion2.setId(2L);
        assertThat(opinion1).isNotEqualTo(opinion2);
        opinion1.setId(null);
        assertThat(opinion1).isNotEqualTo(opinion2);
    }
}
