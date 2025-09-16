const JAVA = 'java';
const PYTHON = 'python';
const GO = 'go';
const JAVASCRIPT = 'javascript';
const C = 'c';

export const SupportedEcosystems = [
  {
    value: JAVA,
    label: 'Java',
    disabled: false
  },
  {
    value: PYTHON,
    label: 'Python',
    disabled: false
  },
  {
    value: GO,
    label: 'Go',
    disabled: false
  },
  {
    value: JAVASCRIPT,
    label: 'Javascript',
    disabled: false
  },
  {
    value: C,
    label: 'C',
    disabled: false
  }
];

const buildMetadata = (metadata) => {
  if(metadata === undefined) {
    return {};
  }
  return Object.fromEntries(metadata.map((e) => [e.name, e.value]));
};

const buildRequestJson = (data) => {
  return {
    id: data.id,
    analysisType: data.analysisType,
    vulnerabilities: data.cves.map(e => e.name),
    metadata: buildMetadata(data.metadata),
    sbom_info_type: data.sbomType,
    image: data.image,
    sbom: data.sbom,
    sourceRepo: data.sourceRepo,
    commitId: data.commitId,
    ecosystem: data.ecosystem
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
