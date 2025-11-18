package com.redhat.ecosystemappeng.morpheus.model.morpheus;

import com.fasterxml.jackson.annotation.JsonValue;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(name = "SbomInfoType", description = "SBOM information type")
public enum SbomInfoType {
  MANUAL ("manual"),
  CYCLONEDX_JSON ("cyclonedx+json");

  @JsonValue
  final String name;

  SbomInfoType(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return name;
  }
}
