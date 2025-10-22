package com.redhat.ecosystemappeng.morpheus.model;

import java.util.List;
import java.util.Set;
import java.util.Map;

import io.quarkus.runtime.annotations.RegisterForReflection;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = "ProductReportsSummary", description = "Product reports data")
@RegisterForReflection
public record ProductReportsSummary(
    @Schema(description = "Product state of analysis")
    String productState,
    @Schema(description = "List of Component analysis states")
    List<String> componentStates,
    @Schema(description = "Map of CVEs and their justifications")
    Map<String, Set<Justification>> cves) {

}