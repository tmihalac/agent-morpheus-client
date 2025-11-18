package com.redhat.ecosystemappeng.morpheus.model;

import io.quarkus.runtime.annotations.RegisterForReflection;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = "Justification", description = "Analysis justification for a vulnerability")
@RegisterForReflection
public record Justification(
    @Schema(required = true, description = "Justification status (true|false|unknown)")
    String status, 
    @Schema(required = true, description = "Justification label")
    String label) {
  
}
