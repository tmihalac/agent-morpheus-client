import { Label } from "@patternfly/react-core"

export default function CvssBanner ({ cvss }) {
  if (cvss === null) {
    return <></>
  }

  if (cvss.score === "") {
    return <Label color="grey">Failed to generate a CVSS score for this analysis</Label>
  }

  const score = parseFloat(cvss.score)

  if (score === 0.0) {
    return <Label color="green">{cvss.score}</Label>
  }
  if (score > 0.0 && score < 4.0) {
    return <Label color="yellow">{cvss.score} - low</Label>
  }
  if (score >= 4.0 && score < 7.0) {
    return <Label color="orange">{cvss.score} - medium</Label>
  }
  if (score >= 7.0 && score < 9.0) {
    return <Label color="red">{cvss.score} - high</Label>
  }
  if (score >= 9.0 && score <= 10.0) {
    return <Label color="purple">{cvss.score} - critical</Label>
  }

  return <Label color="grey">{cvss.score}</Label>
}
