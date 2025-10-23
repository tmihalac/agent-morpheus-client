package com.redhat.ecosystemappeng.morpheus.model;

import io.quarkus.runtime.annotations.RegisterForReflection;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;

@Schema(name = "VulnResult", description = "Vulnerability analysis information")
@RegisterForReflection
public record VulnResult(
    @Schema(required = true, description = "Vulnerability ID (CVE ID)")
    String vulnId,
    @Schema(required = true, description = "Analysis justification for the vulnerability", type = SchemaType.OBJECT, implementation = Justification.class)
    Justification justification) {
  
}
