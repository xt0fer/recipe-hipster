package rocks.zipcode.recipehipster;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("rocks.zipcode.recipehipster");

        noClasses()
            .that()
            .resideInAnyPackage("rocks.zipcode.recipehipster.service..")
            .or()
            .resideInAnyPackage("rocks.zipcode.recipehipster.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..rocks.zipcode.recipehipster.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
