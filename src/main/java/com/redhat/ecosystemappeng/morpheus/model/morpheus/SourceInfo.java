package com.redhat.ecosystemappeng.morpheus.model.morpheus;

import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.quarkus.runtime.annotations.RegisterForReflection;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = "SourceInfo", description = "Source code information")
@RegisterForReflection
public record SourceInfo(
    @Schema(required = true, description = "Type of source code (code|doc)")
    String type, 
    @Schema(required = true, description = "Git repository URL")
    @JsonProperty("git_repo") String gitRepo, 
    @Schema(required = true, description = "Git reference (commit hash, tag, or branch)")
    String ref, 
    @Schema(required = true, description = "Patterns to include in the analysis")
    Collection<String> include, 
    @Schema(required = true, description = "Patterns to exclude from the analysis")
    Collection<String> exclude) {
  
}
