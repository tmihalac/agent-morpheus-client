package com.redhat.ecosystemappeng.morpheus.model;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import io.quarkus.runtime.annotations.RegisterForReflection;

@Schema(name = "FailedComponent", description = "Metadata of submitted components failed to be processed for scanning")
@RegisterForReflection
public record FailedComponent(
    @Schema(required = true, description = "Component name")
    String imageName,
    @Schema(required = true, description = "Component version")
    String imageVersion,
    @Schema(required = true, description = "Reason of failure")
    String error) {

}
