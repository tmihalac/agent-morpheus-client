package com.redhat.ecosystemappeng.morpheus.model;

import com.fasterxml.jackson.databind.JsonNode;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import io.quarkus.runtime.annotations.RegisterForReflection;

@Schema(name = "ReportData", description = "A single report request")
@RegisterForReflection
public record ReportData(
    @Schema(implementation = ReportRequestId.class, required = true, description = "Report identification")
    ReportRequestId reportRequestId,
    @Schema(type = SchemaType.OBJECT, implementation = Object.class, required = true, description = "Report payload")
    JsonNode report) {

}
