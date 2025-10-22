package com.redhat.ecosystemappeng.morpheus.model;

import io.quarkus.runtime.annotations.RegisterForReflection;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = "Justification", description = "Justification data")
@RegisterForReflection
public record Justification(
    @Schema(description = "Justification status (true|false|unknown)")
    String status, 
    @Schema(description = "Justification label")
    String label) {
  
}
