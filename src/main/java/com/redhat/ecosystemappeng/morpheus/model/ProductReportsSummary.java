package com.redhat.ecosystemappeng.morpheus.model;

import java.util.List;
import java.util.Set;
import java.util.Map;

import io.quarkus.runtime.annotations.RegisterForReflection;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = "ProductReportsSummary", description = "Product reports data")
@RegisterForReflection
public record ProductReportsSummary(
    @Schema(required = true, description = "Product state of analysis")
    String productState,
    @Schema(required = true, description = "List of Component analysis states")
    List<String> componentStates,
    @Schema(required = true, description = "Map of CVE vulnerabilities and their justifications")
    Map<String, Set<Justification>> cves) {

}