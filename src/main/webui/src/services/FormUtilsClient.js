const buildMetadata = (metadata) => {
  if(metadata === undefined) {
    return {};
  }
  return Object.fromEntries(metadata.map((e) => [e.name, e.value]));
};

export const buildRequestJson = (data) => {
  return {
    id: data.id,
    analysisType: data.analysisType,
    vulnerabilities: data.cves.map(e => e.name),
    metadata: buildMetadata(data.metadata),
    sbom_info_type: data.sbomType,
    image: data.image,
    sbom: data.sbom,
    sourceRepo: data.sourceRepo,
    commitId: data.commitId
  };
}

export const newMorpheusRequest = async (data, sendToMorpheus = true) => {
  return await fetch(`/reports/new?submit=${sendToMorpheus}`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(buildRequestJson(data))
  });
}
