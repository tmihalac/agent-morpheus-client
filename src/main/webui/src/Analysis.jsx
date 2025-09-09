import { Grid, GridItem, PageSection, Content, Tab, Tabs, TabTitleText } from "@patternfly/react-core";
import { ScanForm } from "./components/ScanForm";
import { SourceScanForm } from "./components/SourceScanForm";
import { useOutletContext } from "react-router-dom";

export default function Analysis() {
  const {vulnRequest, handleVulnRequestChange, sourceRequest, handleSourceRequestChange, addAlert} = useOutletContext();
  const [activeTabKey, setActiveTabKey] = React.useState(0);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  return <PageSection hasBodyWrapper={false} >
    <Grid hasGutter>
      <GridItem>
        <Content>
          <Content component="h1">Request Component Analysis</Content>
        </Content>
      </GridItem>
      <GridItem>
        <Tabs 
          activeKey={activeTabKey} 
          onSelect={handleTabClick}
          isBox={false}
          mountOnEnter
          isFilled={true}
        >
          <Tab 
            eventKey={0} 
            title={<TabTitleText>From SBOM</TabTitleText>}
          >
            <div style={{ paddingTop: '1.5rem' }}>
              <ScanForm 
                vulnRequest={vulnRequest} 
                handleVulnRequestChange={handleVulnRequestChange} 
                onNewAlert={addAlert} 
              />
            </div>
          </Tab>
          <Tab 
            eventKey={1} 
            title={<TabTitleText>From Source</TabTitleText>}
          >
            <div style={{ paddingTop: '1.5rem' }}>
              <SourceScanForm 
                sourceRequest={sourceRequest} 
                handleSourceRequestChange={handleSourceRequestChange} 
                onNewAlert={addAlert} 
              />
            </div>
          </Tab>
        </Tabs>
      </GridItem>
    </Grid>
  </PageSection>;
};