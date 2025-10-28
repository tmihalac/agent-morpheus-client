package com.redhat.ecosystemappeng.morpheus.model.morpheus;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.annotation.Nullable;

import io.quarkus.runtime.annotations.RegisterForReflection;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;

@Schema(name = "Image", description = "Image data")
@RegisterForReflection
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record Image(
    @Schema(required = true, description = "Analysis form type (image|source)")
    @JsonProperty("analysis_type") String analysisType,
    @Schema(description = "Programming language ecosystem")
    String ecosystem,
    @Schema(description = "Manifest file path")
    @JsonProperty("manifest_path") String manifestPath,
    @Schema(required = true, description = "Image name")
    String name, 
    @Schema(required = true, description = "Image tag")
    String tag, 
    @Schema(required = true, description = "Source code information", type = SchemaType.ARRAY, implementation = SourceInfo.class)
    @JsonProperty("source_info") Collection<SourceInfo> sourceInfo, 
    @Schema(description = "SBOM information", type = SchemaType.OBJECT, implementation = Object.class)
    @JsonProperty("sbom_info") @Nullable JsonNode sbomInfo
) {
}
