package rocks.zipcode.recipehipster.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import rocks.zipcode.recipehipster.web.rest.TestUtil;

class ChefsterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Chefster.class);
        Chefster chefster1 = new Chefster();
        chefster1.setId(1L);
        Chefster chefster2 = new Chefster();
        chefster2.setId(chefster1.getId());
        assertThat(chefster1).isEqualTo(chefster2);
        chefster2.setId(2L);
        assertThat(chefster1).isNotEqualTo(chefster2);
        chefster1.setId(null);
        assertThat(chefster1).isNotEqualTo(chefster2);
    }
}
