package com.redhat.ecosystemappeng.morpheus.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.runtime.annotations.RegisterForReflection;

import java.util.List;
import java.util.Map;

@RegisterForReflection
public class UserComments {
    //TODO make sure if the json key needs to be the CveIntel property or the actual text
    @JsonProperty("cve_id")
    private String cveId = "CVE-XXXX-XXXX";

    @JsonProperty("nvd_cve_description")
    private String cveDescription = "<This is a PLACEHOLDER, replace or delete property>";

    @JsonProperty("nvd_cvss_vector")
    private String cvssVector = "CVSS:<This is a PLACEHOLDER, replace or delete property>";

    @JsonProperty("nvd_cwe_name")
    private String cweName = "CWE-XXX: <This is a PLACEHOLDER, replace or delete property>";

    @JsonProperty("ghsa_vulnerabilities")
    private List<Map<String, Object>> ghsaDetails = List.of(
            Map.of(
                    "package", Map.of("ecosystem", "<This is a PLACEHOLDER, replace or delete property>", "name", "<This is a PLACEHOLDER, replace or delete property>"),
                    "vulnerable_version_range", "<This is a PLACEHOLDER, replace or delete property>",
                    "first_patched_version", "<This is a PLACEHOLDER, replace or delete property>",
                    "vulnerable_functions", List.of()
            )
    );

    @JsonProperty("nvd_configurations")
    private List<Map<String, Object>> knownAffectedSoftware = List.of(
            Map.of(
                    "package", "<This is a PLACEHOLDER, replace or delete property>",
                    "system", "<This is a PLACEHOLDER, replace or delete property>",
                    "versionStartExcluding", "<This is a PLACEHOLDER, replace or delete property>",
                    "versionEndExcluding", "<This is a PLACEHOLDER, replace or delete property>",
                    "versionStartIncluding", "<This is a PLACEHOLDER, replace or delete property>",
                    "versionEndIncluding", "<This is a PLACEHOLDER, replace or delete property>"
            ),
            Map.of(
                    "package", "<This is a PLACEHOLDER, replace or delete property>",
                    "system", "<This is a PLACEHOLDER, replace or delete property>",
                    "versionStartExcluding", "<This is a PLACEHOLDER, replace or delete property>",
                    "versionEndExcluding", "<This is a PLACEHOLDER, replace or delete property>",
                    "versionStartIncluding", "<This is a PLACEHOLDER, replace or delete property>",
                    "versionEndIncluding", "<This is a PLACEHOLDER, replace or delete property>"
            )
    );

    @JsonProperty("nvd_cwe_description")
    private String cweDescription = "<This is a PLACEHOLDER, replace or delete property>";

    @JsonProperty("nvd_cwe_extended_description")
    private String cweExtendedDescription = "<This is a PLACEHOLDER, replace, remove or delete property>";

    @JsonProperty("nvd_vendor_names")
    private List<String> notableVulnerableVendors = List.of("<This is a PLACEHOLDER, replace, remove or delete property>");

    @JsonProperty("rhsa_bugzilla_description")
    private String rhsaDescription = "<This is a PLACEHOLDER, replace, remove or delete property>";

    @JsonProperty("rhsa_details")
    private List<String> rhsaDetails = List.of(
            "<This is a PLACEHOLDER, replace, remove or delete property>",
            "<This is a PLACEHOLDER, replace, remove or delete property>"
    );

    @JsonProperty("rhsa_package_state")
    private List<Map<String, String>> rhsaAffectedPackages = List.of(
            Map.of(
                    "product_name", "<This is a PLACEHOLDER, replace, remove or delete property>",
                    "fix_state", "<This is a PLACEHOLDER, replace, remove or delete property>",
                    "package_name", "<This is a PLACEHOLDER, replace, remove or delete property>",
                    "cpe", "<This is a PLACEHOLDER, replace, remove or delete property>"
            )
    );

    @JsonProperty("rhsa_statement")
    private String rhsaStatement = "<This is a PLACEHOLDER, replace, remove or delete property>";

    @JsonProperty("ubuntu_ubuntu_description")
    private String ubuntuDescription = "<This is a PLACEHOLDER, replace, remove or delete property>";

    @JsonProperty("vulnerable_dependencies")
    private String vulnerableDependencies = "<This is a PLACEHOLDER, replace, remove or delete property>";

    public String getCveId() {
        return cveId;
    }

    public void setCveId(String cveId) {
        this.cveId = cveId;
    }

    public String getCveDescription() {
        return cveDescription;
    }

    public void setCveDescription(String cveDescription) {
        this.cveDescription = cveDescription;
    }

    public String getCvssVector() {
        return cvssVector;
    }

    public void setCvssVector(String cvssVector) {
        this.cvssVector = cvssVector;
    }

    public String getCweName() {
        return cweName;
    }

    public void setCweName(String cweName) {
        this.cweName = cweName;
    }

    public String getCweDescription() {
        return cweDescription;
    }

    public void setCweDescription(String cweDescription)
    {
        this.cweDescription = cweDescription;
    }

    public String getCweExtendedDescription() {
        return cweExtendedDescription;
    }

    public void setCweExtendedDescription(String cweExtendedDescription) {
        this.cweExtendedDescription = cweExtendedDescription;
    }

    public List<String> getNotableVulnerableVendors() {
        return notableVulnerableVendors;
    }

    public void setNotableVulnerableVendors(List<String> vendors) {
        this.notableVulnerableVendors = vendors;
    }

    public String getRhsaDescription() {
        return rhsaDescription;
    }

    public void setRhsaDescription(String rhsaDescription) {
        this.rhsaDescription = rhsaDescription;
    }

    public List<String> getRhsaDetails() {
        return rhsaDetails;
    }

    public void setRhsaDetails(List<String> rhsaDetails) {
        this.rhsaDetails = rhsaDetails;
    }

    public List<Map<String, Object>> getGhsaDetails() {
        return ghsaDetails;
    }

    public void setGhsaDetails(List<Map<String, Object>> ghsaDetails) {
        this.ghsaDetails = ghsaDetails;
    }

    public List<Map<String, Object>> getKnownAffectedSoftware() {
        return knownAffectedSoftware;
    }

    public void setKnownAffectedSoftware(List<Map<String, Object>> knownAffectedSoftware) {
        this.knownAffectedSoftware = knownAffectedSoftware;
    }

    public List<Map<String, String>> getRhsaAffectedPackages() {
        return rhsaAffectedPackages;
    }

    public void setRhsaAffectedPackages(List<Map<String, String>> rhsaAffectedPackages) {
        this.rhsaAffectedPackages = rhsaAffectedPackages;
    }

    public String getRhsaStatement() {
        return rhsaStatement;
    }

    public void setRhsaStatement(String rhsaStatement) {
        this.rhsaStatement = rhsaStatement;
    }

    public String getUbuntuDescription() {
        return ubuntuDescription;
    }

    public void setUbuntuDescription(String ubuntuDescription) {
        this.ubuntuDescription = ubuntuDescription;
    }

    public String getVulnerableDependencies() {
        return vulnerableDependencies;
    }

    public void setVulnerableDependencies(String vulnerableDependencies) {
        this.vulnerableDependencies = vulnerableDependencies;
    }
}
