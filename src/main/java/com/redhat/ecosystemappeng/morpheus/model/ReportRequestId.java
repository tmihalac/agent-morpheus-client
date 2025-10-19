package com.redhat.ecosystemappeng.morpheus.model;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import io.quarkus.runtime.annotations.RegisterForReflection;

@Schema(name = "ReportRequestId", description = "Report identification")

@RegisterForReflection
public record ReportRequestId(
    @Schema(required = true, description = "ID assigned for database identification")
    String id, 
    @Schema(required = true, description = "ID assigned on scan request submission")
    String reportId) {
  
}
