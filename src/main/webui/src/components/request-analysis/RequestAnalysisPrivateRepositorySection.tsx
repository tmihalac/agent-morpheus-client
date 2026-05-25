// SPDX-FileCopyrightText: Copyright (c) 2026, Red Hat Inc. & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from "react";
import {
  Switch,
  Card,
  CardBody,
  FormGroup,
  TextInput,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Label,
  Popover,
  FormGroupLabelHelp,
} from "@patternfly/react-core";
import { KeyIcon, SecurityIcon } from "@patternfly/react-icons";
import { detectCredentialType } from "../../utils/requestAnalysisValidation";
import type { AnalysisRequestFormPrivateRepoHandlers } from "../../hooks/useAnalysisRequestForm";

export interface RequestAnalysisPrivateRepositorySectionProps {
  isAuthenticationSecretChecked: boolean;
  authenticationSecret: string;
  authenticationSecretError: string | null;
  username: string;
  usernameError: string | null;
  isSubmitting: boolean;
  handlers: AnalysisRequestFormPrivateRepoHandlers;
}

const RequestAnalysisPrivateRepositorySection: React.FC<
  RequestAnalysisPrivateRepositorySectionProps
> = ({
  isAuthenticationSecretChecked,
  authenticationSecret,
  authenticationSecretError,
  username,
  usernameError,
  isSubmitting,
  handlers,
}) => {
  const labelHelpRef = useRef<HTMLButtonElement>(null);
  const secretCredentialType = detectCredentialType(authenticationSecret);

  return (
    <>
      <Switch
        id="private-repo-switch"
        label="Private repository"
        isChecked={isAuthenticationSecretChecked}
        onChange={handlers.onPrivateRepoSwitch}
        isDisabled={isSubmitting}
      />
      {isAuthenticationSecretChecked && (
        <Card variant="secondary">
          <CardBody>
            <FormGroup
              label="Authentication secret"
              isRequired
              fieldId="authentication-secret"
              labelHelp={
                <Popover
                  triggerRef={labelHelpRef}
                  bodyContent="Provide an SSH private key or Personal Access Token to authenticate with the private repository."
                >
                  <FormGroupLabelHelp
                    ref={labelHelpRef}
                    aria-label="More info about authentication secret"
                  />
                </Popover>
              }
            >
              <TextInput
                isRequired
                type="password"
                id="authentication-secret"
                name="authentication-secret"
                value={authenticationSecret}
                onChange={(e, v) => handlers.onTextChange("authenticationSecret", e, v)}
                onBlur={() => handlers.onTextBlur("authenticationSecret")}
                onKeyDown={(e) => handlers.onTextKeyDown("authenticationSecret", e)}
                isDisabled={isSubmitting}
                validated={authenticationSecretError ? "error" : "default"}
              />
              <FormHelperText>
                <HelperText>
                  {authenticationSecretError ? (
                    <HelperTextItem variant="error">{authenticationSecretError}</HelperTextItem>
                  ) : (
                    <HelperTextItem>
                      Accepts SSH private keys or Personal Access Tokens. Type will be auto-detected.
                    </HelperTextItem>
                  )}
                </HelperText>
              </FormHelperText>
              {secretCredentialType === "SSH_KEY" && (
                <Label
                  color="purple"
                  icon={<KeyIcon />}
                  style={{ marginTop: "var(--pf-t--global--spacer--sm)" }}
                >
                  SSH key detected
                </Label>
              )}
              {secretCredentialType === "PAT" && (
                <Label
                  color="teal"
                  icon={<SecurityIcon />}
                  style={{ marginTop: "var(--pf-t--global--spacer--sm)" }}
                >
                  Personal access token detected
                </Label>
              )}
            </FormGroup>
            {secretCredentialType === "PAT" && (
              <FormGroup
                label="Username"
                isRequired
                fieldId="username"
                style={{ marginTop: "var(--pf-t--global--spacer--md)" }}
              >
                <TextInput
                  isRequired
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e, v) => handlers.onTextChange("username", e, v)}
                  onBlur={() => handlers.onTextBlur("username")}
                  onKeyDown={(e) => handlers.onTextKeyDown("username", e)}
                  isDisabled={isSubmitting}
                  validated={usernameError ? "error" : "default"}
                />
                {usernameError && (
                  <FormHelperText>
                    <HelperText>
                      <HelperTextItem variant="error">{usernameError}</HelperTextItem>
                    </HelperText>
                  </FormHelperText>
                )}
              </FormGroup>
            )}
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default RequestAnalysisPrivateRepositorySection;
