package com.redhat.ecosystemappeng.morpheus.model;

import java.util.Collection;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.redhat.ecosystemappeng.morpheus.model.morpheus.SbomInfoType;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public record ReportRequest(
    String id, 
    String analysisType,
    Collection<String> vulnerabilities, 
    JsonNode image,
    JsonNode sbom,
    @JsonProperty("sbom_info_type") SbomInfoType sbomInfoType, 
    Map<String, String> metadata,
    String sourceRepo,
    String commitId,
    String ecosystem,
    String manifestPath) {

}
