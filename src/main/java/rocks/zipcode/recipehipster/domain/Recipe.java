package rocks.zipcode.recipehipster.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Recipe.
 */
@Entity
@Table(name = "recipe")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Recipe implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "notes")
    private String notes;

    @Column(name = "ingredients")
    private String ingredients;

    @Column(name = "steps")
    private String steps;

    @Column(name = "post_date")
    private Instant postDate;

    @JsonIgnoreProperties(value = { "recipe", "opinions" }, allowSetters = true)
    @OneToOne(mappedBy = "recipe")
    private Post post;

    @ManyToOne
    @JsonIgnoreProperties(value = { "recipes" }, allowSetters = true)
    private Chefster chefster;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Recipe id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Recipe title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNotes() {
        return this.notes;
    }

    public Recipe notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getIngredients() {
        return this.ingredients;
    }

    public Recipe ingredients(String ingredients) {
        this.setIngredients(ingredients);
        return this;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getSteps() {
        return this.steps;
    }

    public Recipe steps(String steps) {
        this.setSteps(steps);
        return this;
    }

    public void setSteps(String steps) {
        this.steps = steps;
    }

    public Instant getPostDate() {
        return this.postDate;
    }

    public Recipe postDate(Instant postDate) {
        this.setPostDate(postDate);
        return this;
    }

    public void setPostDate(Instant postDate) {
        this.postDate = postDate;
    }

    public Post getPost() {
        return this.post;
    }

    public void setPost(Post post) {
        if (this.post != null) {
            this.post.setRecipe(null);
        }
        if (post != null) {
            post.setRecipe(this);
        }
        this.post = post;
    }

    public Recipe post(Post post) {
        this.setPost(post);
        return this;
    }

    public Chefster getChefster() {
        return this.chefster;
    }

    public void setChefster(Chefster chefster) {
        this.chefster = chefster;
    }

    public Recipe chefster(Chefster chefster) {
        this.setChefster(chefster);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Recipe)) {
            return false;
        }
        return id != null && id.equals(((Recipe) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Recipe{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", notes='" + getNotes() + "'" +
            ", ingredients='" + getIngredients() + "'" +
            ", steps='" + getSteps() + "'" +
            ", postDate='" + getPostDate() + "'" +
            "}";
    }
}
