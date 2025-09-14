import { ActionGroup, Button, FileUpload, Flex, FlexItem, Form, FormGroup, FormSection, FormSelect, FormSelectOption, TextInput } from "@patternfly/react-core";
import Remove2Icon from '@patternfly/react-icons/dist/esm/icons/remove2-icon';
import AddCircleOIcon from '@patternfly/react-icons/dist/esm/icons/add-circle-o-icon';

import { newMorpheusRequest } from "../services/FormUtilsClient";

export const SourceScanForm = ({ sourceRequest, handlesourceRequestChange, onNewAlert }) => {
  const [cves, setCves] = React.useState(sourceRequest['cves'] || [{}]);
  const [sourceRepo, setSourceRepo] = React.useState(sourceRequest['sourceRepo'] || '');
  const [commitId, setCommitId] = React.useState(sourceRequest['commitId'] || '');
  const [metadata, setMetadata] = React.useState(sourceRequest['metadata'] || [{}]);
  const [canSubmit, setCanSubmit] = React.useState(false);

  const handleMetadataChange = (idx, field, newValue) => {
    const updatedMetadata = [...metadata];
    updatedMetadata[idx][field] = newValue;
    setMetadata(updatedMetadata);
    onFormUpdated({ metadata: updatedMetadata });
  };

  const handleAddMetadata = () => {
    setMetadata((prevMetadata) => {
      const updatedElems = [...prevMetadata, { name: "", value: ""}];
      onFormUpdated({ metadata: updatedElems });
      return updatedElems;
    });
  }

  const handleDeleteMetadata = idx => {
    const updatedMetadata = metadata.filter((_, i) => i !== idx);
    setMetadata(updatedMetadata);
    onFormUpdated({ metadata: updatedMetadata });
  }

  const handleCveChange = (idx, name) => {
    setCves((prevElements) => {
      const updatedElems = prevElements.map((element, index) =>
        index === idx ? { ...element, name: name } : element
      );
      onFormUpdated({ cves: updatedElems });
      return updatedElems;
    });
  };

  const handleAddCve = () => {
    setCves((prevCveList) => {
      const updatedElems = [
        ...prevCveList,
        { name: '' }
      ];
      onFormUpdated({ cves: updatedElems });
      return updatedElems
    });
  }

  const handleDeleteCve = idx => {
    setCves((prevCveList) => {
      const updatedElems = prevCveList.filter((_, index) => index !== idx);
      onFormUpdated({ cves: updatedElems });
      return updatedElems
    });
  }

  const handleSourceRepoChange = (value) => {
    setSourceRepo(value);
    onFormUpdated({ sourceRepo: value });
  }
  
  const handleCommitIdChange = (value) => {
    setCommitId(value);
    onFormUpdated({ commitId: value });
  }

  const onSubmitForm = () => {
    setCanSubmit(false);
    newMorpheusRequest(sourceRequest)
      .then(response => {
        if (response.ok) {
          onNewAlert('success', 'Analysis request sent to Morpheus');
        } else {
          response.json().then(json => onNewAlert('danger', `Unable to send request: ${response.status}:${json.error}`)); 
        }
      }).catch(error => {
        onNewAlert('danger', `Unable to send request: ${error}`)
      }).finally(() => setCanSubmit(true));
  }

  const onFormUpdated = (update) => {
    if(update === undefined) {
      setCanSubmit(false);
    }
    const updated = handlesourceRequestChange(update);
    
    const updatedCves = updated['cves'];    
    if (updatedCves === undefined || updatedCves.length === 0) {
      setCanSubmit(false);
      handlesourceRequestChange(update);
      return;
    }
    for (let value of updatedCves) {
      if (value.name === undefined || value.name.trim() === '') {
        setCanSubmit(false);
        handlesourceRequestChange(update);
        return;
      }
    }

    const metadata = updated['metadata'] || [];
    for (let pair of metadata) {
      if (!pair.name || pair.name.trim() === '' || !pair.value || pair.value.trim() === '') {
        setCanSubmit(false);
        handlesourceRequestChange(update);
        return;
      }
    }

    const sourceRepo = updated['sourceRepo'];
    if (sourceRepo === undefined || sourceRepo.trim() === '') {
      setCanSubmit(false);
      handlesourceRequestChange(update);
      return;
    }

    const commitId = updated['commitId'];
    if (commitId === undefined || commitId.trim() === '') {
      setCanSubmit(false);
      handlesourceRequestChange(update);
      return;
    }

    setCanSubmit(true);
  }

  return <Form isHorizontal>
    <FormSection title="Metadata">
      {metadata.map((m, idx) => {
        return <div key={`metadata_${idx}_pair`}>
          <FormGroup fieldId={`metadata_${idx}_pair`}>
            <Flex>
              <FlexItem>
                <TextInput isRequired type="text" id={`metadata_${idx}_name`} value={m.name || ""} onChange={event => handleMetadataChange(idx, "name", event.target.value)} placeholder="Name"></TextInput>
              </FlexItem>
              <FlexItem>
                <TextInput isRequired type="text" id={`metadata_${idx}_value`} value={m.value || ""} onChange={event => handleMetadataChange(idx, "value", event.target.value)} placeholder="Value"></TextInput>
              </FlexItem>
              <FlexItem>
                <Button icon={<Remove2Icon />} variant="danger" aria-label="Delete Metadata" onClick={_ => handleDeleteMetadata(idx)}>
                  
                </Button>
              </FlexItem>
            </Flex>
          </FormGroup>
        </div>
      })}
      <Flex justifyContent={{ default: 'justifyContentFlexStart' }}>
        <FlexItem>
          <Button icon={<AddCircleOIcon />} variant="primary" aria-label="Add Metadata" onClick={handleAddMetadata}>
             Add Metadata
          </Button>
        </FlexItem>
      </Flex>
    </FormSection>
    <FormSection title="CVEs">
      {cves.map((cve, idx) => {
        return <div key={`cve_${idx}_group`}>
          <FormGroup label="CVE" isRequired fieldId={`cve_${idx}_name`}>
            <Flex>
              <FlexItem>
                <TextInput isRequired type="text" id={`cve_${idx}_name`} value={cve.name || ""} onChange={event => handleCveChange(idx, event.target.value)}></TextInput>
              </FlexItem>
              <FlexItem>
                <Button icon={<Remove2Icon />} variant="danger" aria-label="Delete CVE" onClick={_ => handleDeleteCve(idx)}>
                  
                </Button>
              </FlexItem>
            </Flex>
          </FormGroup>
        </div>
      })}
      <Flex justifyContent={{ default: 'justifyContentFlexStart' }}>
        <FlexItem>
          <Button icon={<AddCircleOIcon />} variant="primary" aria-label="Add CVE" onClick={handleAddCve}>
             Add a CVE
          </Button>
        </FlexItem>
      </Flex>
    </FormSection>
    <FormGroup label="Source Repository" isRequired fieldId="source-repo">
      <TextInput isRequired type="text" id="source-repo" value={sourceRepo} onChange={event => handleSourceRepoChange(event.target.value)} placeholder="https://github.com/example/my-project"></TextInput>
    </FormGroup>
    <FormGroup label="Commit ID" isRequired fieldId="commit-id">
      <TextInput isRequired type="text" id="commit-id" value={commitId} onChange={event => handleCommitIdChange(event.target.value)} placeholder="abc123def456789012345678901234567890abcd"></TextInput>
    </FormGroup>
    <ActionGroup>
      <Button variant="primary" isDisabled={!canSubmit} onClick={onSubmitForm}>Submit</Button>
    </ActionGroup>
  </Form>

}